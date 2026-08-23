import { useCallback, useRef, useState } from "react";
import { chatbotApi } from "../api/chatbotApi";

const SEGMENT_MS = 1200;
const MIN_BLOB_BYTES = 1000;

export function useVoiceInput(onText: (text: string) => void) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const stoppedRef = useRef(true);

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
            const text = await chatbotApi.transcribe(blob);
            if (text.trim()) onText(text.trim());
          } catch {
            // one segment failing shouldn't kill the session, just skip it
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
      window.setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, SEGMENT_MS);
    },
    [onText],
  );

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stoppedRef.current = false;
      setRecording(true);
      startSegment(stream);
    } catch {
      setError("Microphone access was denied.");
    }
  }, [startSegment]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    setRecording(false);
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
