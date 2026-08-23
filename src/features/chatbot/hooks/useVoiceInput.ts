import { useCallback, useRef, useState } from "react";
import { chatbotApi } from "../api/chatbotApi";

const SILENCE_THRESHOLD = 0.02;
const SILENCE_MS = 600;
const MAX_SEGMENT_MS = 8000;
const MIN_BLOB_BYTES = 1000;

export function useVoiceInput(onText: (text: string) => void) {
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
          setTranscribing(true);
          try {
            const text = await chatbotApi.transcribe(blob).catch(() => chatbotApi.transcribe(blob));
            if (text.trim()) onText(text.trim());
          } catch {
            // segment failed twice, skip it
          } finally {
            setTranscribing(false);
          }
        }

        if (!stoppedRef.current) {
          startSegment(stream);
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
    [onText],
  );

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
        hasSpeechRef.current = true;
        silenceStartRef.current = null;
      } else if (hasSpeechRef.current) {
        if (silenceStartRef.current === null) {
          silenceStartRef.current = now;
        } else if (now - silenceStartRef.current > SILENCE_MS) {
          const recorder = recorderRef.current;
          if (recorder && recorder.state === "recording") recorder.stop();
        }
      }

      if (now - segmentStartRef.current > MAX_SEGMENT_MS) {
        const recorder = recorderRef.current;
        if (recorder && recorder.state === "recording") recorder.stop();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stoppedRef.current = false;
      setRecording(true);
      startSegment(stream);
      watchSilence(stream);
    } catch {
      setError("Microphone access was denied.");
    }
  }, [startSegment, watchSilence]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
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

  const toggle = useCallback(() => {
    if (recording) stop();
    else void start();
  }, [recording, start, stop]);

  return { recording, transcribing, error, toggle };
}
