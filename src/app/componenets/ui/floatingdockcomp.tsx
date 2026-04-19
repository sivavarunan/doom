import React, { useState, useRef, useEffect } from "react";
import { FloatingDock } from "./floating-doc";
import {
  IconFile,
  IconMoodHappy,
  IconLanguage,
  IconMicrophone,
  IconTrash,
  IconPlayerStop,
  IconSend,
  IconPingPong,
  IconBrandOpenai,
} from "@tabler/icons-react";
import Image from "next/image";
import { FileUpload } from "@/app/componenets/ui/file-upload";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import PingPongGame from "@/app/componenets/PingPong";
import { fetchChatGPTResponse } from '@/app/pages/ChatGPT/chatgpt';

export function FloatingDockComp({
  className = "",
  onSendFileToChat,
  onEmojiSelect,
  message,
  setMessage,
  onSendAudioMessage,
  currentUserId,
  receiverId,
}: {
  className?: string;
  onSendFileToChat?: (fileURLs: string[]) => void;
  onEmojiSelect?: (emoji: string) => void;
  message: string;
  setMessage: (newMessage: string) => void;
  onSendAudioMessage?: (audioURL: string) => void;
  currentUserId: string;
  receiverId: string;
}) {
  const [isFileUploadVisible, setFileUploadVisible] = useState(false);
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isLanguagePickerVisible, setLanguagePickerVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [isLoading, setLoading] = useState(false);
  const [isRecording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [isPingPongVisible, setPingPongVisible] = useState(false);
  const [isChatGPTLoading, setChatGPTLoading] = useState(false);
  const [chatGPTResponse, setChatGPTResponse] = useState<string | null>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setEmojiPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileClick = () => setFileUploadVisible(true);
  const handleEmojiClick = () => setEmojiPickerVisible(!isEmojiPickerVisible);
  const handleLanguageClick = () => setLanguagePickerVisible(!isLanguagePickerVisible);

  const handleEmojiSelect = (emojiObject: EmojiClickData) => {
    onEmojiSelect?.(emojiObject.emoji);
    // Do not close the picker on emoji select
  };

  const handlePingPongClick = () => {
    console.log("Game ID: gameTest-id");
    console.log("User ID:", currentUserId);
    console.log("Opponent ID:", receiverId);
    setPingPongVisible(true);
  };


  const handleTranslateClick = async () => {
    setLoading(true);
    try {
      const translatedText = await translateMessage(message, selectedLanguage);
      setMessage(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    setLanguagePickerVisible(false);
  };

  const handleVoiceMessageClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        setRecordingError('Error during recording.');
        stopRecording(); // Stop recording in case of error
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setRecordingError('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop()); // Stop the stream
      streamRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const sendRecording = async () => {
    if (!audioBlob) return; // Ensure there is a valid recording

    try {
      setRecordingError(null); // Clear previous errors
      const audioURL = await uploadToFirebaseStorage(audioBlob);

      // Ensure we're not duplicating submissions
      if (audioURL) {
        onSendAudioMessage?.(audioURL);
        // toast.success('Audio message sent.');
      }

    } catch (error) {
      console.error('Error sending recording:', error);
      setRecordingError('Error uploading audio.');
    } finally {
      cleanup();
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null); // Clear the recorded audio
    cleanup(); // Reset the state and cleanup resources
    toast.success('Recording deleted.');
  };

  const uploadToFirebaseStorage = async (audioBlob: Blob): Promise<string> => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `voice-messages/${Date.now()}.webm`);
      await uploadBytes(storageRef, audioBlob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading audio to Firebase:', error);
      throw error;
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setRecordingTime(0);
    setRecording(false);
    setAudioBlob(null); // Clear the audio blob to reset state
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const suggestAIResponse = async () => {
    try {
      const suggestedMessages = [
        "How can I help you today?",
        "Let me assist you with that!",
        "Can you tell me more about your problem?",
      ];

      const randomIndex = Math.floor(Math.random() * suggestedMessages.length);
      const suggestedMessage = suggestedMessages[randomIndex];

      // Set AI suggestion as the current message
      setMessage(suggestedMessage);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
    }
  };

  const handleChatGPTClick = async () => {
    const response = await fetchChatGPTResponse(message);
    if (response) {
      console.log('ChatGPT Response:', response);
      setChatGPTResponse(response);
    } else {
      setChatGPTResponse('Failed to get a response from ChatGPT.');
    }
  };
  

  const links = [
    { title: "Emoji", icon: <IconMoodHappy className="h-full w-full" />, onClick: handleEmojiClick },
    { title: "File", icon: <IconFile className="h-full w-full" />, onClick: handleFileClick },
    { title: "Translate", icon: <IconLanguage className="h-full w-full" />, onClick: handleLanguageClick },
    {
      title: isRecording ? "Stop" : "Voice",
      icon: <IconMicrophone className={`h-full w-full ${isRecording ? "text-rose-400" : ""}`} />,
      onClick: handleVoiceMessageClick,
    },
    {
      title: "ChatGPT",
      icon: <IconBrandOpenai className="h-full w-full" />,
      onClick: handleChatGPTClick,
    },
    { title: "DOOM", icon: <Image src="/doom1.png" width={500} height={200} alt="DOOM" />, href: "#" },
    {
      title: "Ping Pong",
      icon: <IconPingPong className="h-full w-full" />,
      onClick: handlePingPongClick,
    },
  ];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FloatingDock items={links} />

      {/* Popup FileUpload component */}
      {isFileUploadVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-md"
          onClick={() => setFileUploadVisible(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-1/95 p-4 shadow-card backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <FileUpload
              onChange={(files) => {
                onSendFileToChat?.(files);
                setFileUploadVisible(false);
              }}
            />
            <div className="flex justify-end pt-2">
              <button
                className="btn-ghost text-xs"
                onClick={() => setFileUploadVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {isEmojiPickerVisible && (
        <div
          ref={emojiPickerRef}
          className="fixed bottom-16 right-16 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

      {/* Language Picker Popup */}
      {isLanguagePickerVisible && (
        <div
          className="fixed bottom-24 right-6 z-50 overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-1/95 p-2 shadow-card backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            value={selectedLanguage}
            onChange={handleLanguageSelect}
            className="bg-transparent px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            <option value="es" className="bg-surface-2">Spanish</option>
            <option value="fr" className="bg-surface-2">French</option>
            <option value="de" className="bg-surface-2">German</option>
            <option value="hi" className="bg-surface-2">Hindi</option>
            <option value="zh" className="bg-surface-2">Chinese</option>
          </select>
        </div>
      )}

      {/* Translate Button */}
      <button
        className="ml-3 btn-ghost text-xs disabled:opacity-50"
        onClick={handleTranslateClick}
        disabled={isLoading || !message}
      >
        {isLoading ? "Translating…" : "Translate"}
      </button>

      {/* Voice Recording UI */}
      {isRecording && (
        <div className="fixed bottom-24 right-6 z-50 min-w-[260px] overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-1/95 p-4 shadow-card backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">
                recording
              </p>
            </div>
            <span className="font-mono text-xs text-white/80">
              {formatTime(recordingTime)}
            </span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
              style={{ width: `${((recordingTime % 60) * 100) / 60}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between gap-2">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-300 transition-colors hover:bg-rose-500/20"
              onClick={stopRecording}
              aria-label="Stop"
            >
              <IconPlayerStop size={16} />
            </button>
            <button
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-medium text-ink transition-all hover:brightness-110 disabled:opacity-50"
              onClick={sendRecording}
              disabled={!audioBlob}
            >
              <IconSend size={15} /> Send
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/60 transition-colors hover:text-white disabled:opacity-50"
              onClick={deleteRecording}
              disabled={!audioBlob}
              aria-label="Delete"
            >
              <IconTrash size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Recording Error Message */}
      {recordingError && (
        <div className="fixed bottom-24 right-6 z-50 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 backdrop-blur-xl">
          <p>{recordingError}</p>
        </div>
      )}

      {/* Ping Pong Game Modal */}
      {isPingPongVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-1/95 p-6 shadow-card backdrop-blur-xl">
            <PingPongGame
              gameId="Test-game-id"
              userId="current-user-id"
              opponentId="current-user-id"
            />
            <button
              className="absolute right-3 top-3 btn-ghost text-xs"
              onClick={() => setPingPongVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ChatGPT Response Section */}
      {chatGPTResponse && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm rounded-2xl border border-white/[0.08] bg-surface-1/95 p-4 shadow-card backdrop-blur-xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
            ChatGPT
          </p>
          <p className="text-sm text-white/80">{chatGPTResponse}</p>
          <button
            className="mt-3 btn-ghost text-xs"
            onClick={() => setChatGPTResponse(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* ChatGPT Loading Indicator */}
      {isChatGPTLoading && (
        <div className="fixed bottom-24 right-6 z-50 rounded-2xl border border-white/[0.08] bg-surface-1/95 px-4 py-3 backdrop-blur-xl">
          <p className="flex items-center gap-2 text-sm text-white/70">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            Thinking…
          </p>
        </div>
      )}
    </div>
  );
}

const translateMessage = async (text: string, targetLang: string): Promise<string> => {
  try {
    const apiKey = '9d3759bfdcmsh6769e8af5a6241fp15b794jsn1a89edae0017';
    const response = await fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data',
        'accept-encoding': 'application/gzip',
        'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
      body: new URLSearchParams({
        q: text,
        source: 'en', // source language
        target: targetLang, // target language
      })
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('API Error:', errorDetails);
      throw new Error('Translation API error: ' + errorDetails);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
