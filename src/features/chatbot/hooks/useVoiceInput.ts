import { useCallback, useEffect, useRef, useState } from "react";
import { chatbotApi } from "../api/chatbotApi";

const SILENCE_THRESHOLD = 0.045;
const SPEECH_FRAMES = 3;
const SILENCE_MS = 600;
const UTTERANCE_END_MS = 1200;
const MAX_SEGMENT_MS = 8000;
const MIN_BLOB_BYTES = 1000;

export function useVoiceInput(onText: (text: string) => void, onUtteranceEnd?: () => void) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const stoppedRef = useRef(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const segmentStartRef = useRef(0);
  const hasSpeechRef = useRef(false);
  const quietSinceRef = useRef<number | null>(null);
  const loudFramesRef = useRef(0);
  const spokeRef = useRef(false);
  const endArmedRef = useRef(false);
  const pendingRef = useRef(0);
  const producedRef = useRef(false);

  const startSegmentRef = useRef<(stream: MediaStream) => void>(() => {});
  const onUtteranceEndRef = useRef(onUtteranceEnd);
  const stopRef = useRef<() => void>(() => {});

  const flushUtteranceEnd = useCallback(() => {
    if (!endArmedRef.current || pendingRef.current > 0 || !producedRef.current) return;
    endArmedRef.current = false;
    producedRef.current = false;
    spokeRef.current = false;
    stopRef.current();
    onUtteranceEndRef.current?.();
  }, []);

  const startSegment = useCallback(
    (stream: MediaStream) => {
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : undefined;
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: mimeType ?? "audio/webm" });

        if (blob.size > MIN_BLOB_BYTES) {
          pendingRef.current += 1;
          setTranscribing(true);
          try {
            const text = await chatbotApi.transcribe(blob).catch(() => chatbotApi.transcribe(blob));
            if (text.trim()) {
              producedRef.current = true;
              onText(text.trim());
            }
          } catch {
            // segment failed twice, skip it
          } finally {
            pendingRef.current -= 1;
            setTranscribing(pendingRef.current > 0);
            flushUtteranceEnd();
          }
        }

        if (!stoppedRef.current) {
          startSegmentRef.current(stream);
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      recorderRef.current = recorder;
      recorder.start();
      segmentStartRef.current = performance.now();
      silenceStartRef.current = null;
      hasSpeechRef.current = false;
    },
    [onText, flushUtteranceEnd],
  );

  useEffect(() => {
    startSegmentRef.current = startSegment;
  }, [startSegment]);

  useEffect(() => {
    onUtteranceEndRef.current = onUtteranceEnd;
  }, [onUtteranceEnd]);

  const watchSilence = useCallback((stream: MediaStream) => {
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);

    const tick = () => {
      if (stoppedRef.current) return;
      analyser.getByteTimeDomainData(data);

      let sumSquares = 0;
      for (let i = 0; i < data.length; i++) {
        const norm = (data[i] - 128) / 128;
        sumSquares += norm * norm;
      }
      const rms = Math.sqrt(sumSquares / data.length);
      const now = performance.now();

      if (rms > SILENCE_THRESHOLD) {
        loudFramesRef.current += 1;
        if (loudFramesRef.current >= SPEECH_FRAMES) {
          hasSpeechRef.current = true;
          spokeRef.current = true;
          silenceStartRef.current = null;
          quietSinceRef.current = null;
          endArmedRef.current = false;
        }
      } else {
        loudFramesRef.current = 0;
        if (quietSinceRef.current === null) quietSinceRef.current = now;

        if (hasSpeechRef.current) {
          if (silenceStartRef.current === null) {
            silenceStartRef.current = now;
          } else if (now - silenceStartRef.current > SILENCE_MS) {
            const recorder = recorderRef.current;
            if (recorder && recorder.state === "recording") recorder.stop();
          }
        }

        if (spokeRef.current && now - quietSinceRef.current > UTTERANCE_END_MS) {
          endArmedRef.current = true;
          flushUtteranceEnd();
        }
      }

      if (now - segmentStartRef.current > MAX_SEGMENT_MS) {
        const recorder = recorderRef.current;
        if (recorder && recorder.state === "recording") recorder.stop();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [flushUtteranceEnd]);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { noiseSuppression: true, echoCancellation: true, autoGainControl: false },
      });
      streamRef.current = stream;
      stoppedRef.current = false;
      quietSinceRef.current = null;
      loudFramesRef.current = 0;
      spokeRef.current = false;
      endArmedRef.current = false;
      producedRef.current = false;
      setRecording(true);
      startSegment(stream);
      watchSilence(stream);
    } catch {
      setError("Microphone access was denied.");
    }
  }, [startSegment, watchSilence]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    endArmedRef.current = false;
    spokeRef.current = false;
    setRecording(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    } else {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }
  }, []);

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  const toggle = useCallback(() => {
    if (recording) stop();
    else void start();
  }, [recording, start, stop]);

  return { recording, transcribing, error, toggle };
}
