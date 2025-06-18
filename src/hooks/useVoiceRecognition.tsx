
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceRecognition = ({ onTranscript, onError }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async () => {
    try {
      console.log('Starting voice recognition...');
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, processing audio...');
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            const base64Data = base64Audio.split(',')[1]; // Remove data:audio/webm;base64, prefix
            
            try {
              // Send to Supabase edge function for transcription
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { audio: base64Data }
              });

              if (error) {
                throw error;
              }

              if (data?.text && data.text.trim()) {
                console.log('Transcription received:', data.text);
                onTranscript(data.text.trim());
              } else {
                toast({
                  title: "No speech detected",
                  description: "Please try speaking more clearly.",
                  variant: "default",
                });
              }
            } catch (error) {
              console.error('Transcription error:', error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe audio';
              onError?.(errorMessage);
              toast({
                title: "Transcription failed",
                description: errorMessage,
                variant: "destructive",
              });
            } finally {
              setIsProcessing(false);
            }
          };
          
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Audio processing error:', error);
          setIsProcessing(false);
          const errorMessage = error instanceof Error ? error.message : 'Failed to process audio';
          onError?.(errorMessage);
          toast({
            title: "Audio processing failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      
      toast({
        title: "Listening...",
        description: "Speak now. Tap the microphone again to stop.",
        variant: "default",
      });

    } catch (error) {
      console.error('Failed to start recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to access microphone';
      onError?.(errorMessage);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  }, [onTranscript, onError]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      console.log('Stopping voice recognition...');
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }

    // Clean up media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isProcessing,
    startListening,
    stopListening,
    toggleListening,
  };
};
