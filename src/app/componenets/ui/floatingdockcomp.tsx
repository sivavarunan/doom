import React, { useState, useRef, useEffect } from "react";
import { FloatingDock } from "./floating-doc";
import {
  IconBrandGithub,
  IconFile,
  IconMoodHappy,
  IconLanguage,
  IconNewSection,
  IconMicrophone,
} from "@tabler/icons-react";
import Image from "next/image";
import { FileUpload } from "@/app/componenets/ui/file-upload";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function FloatingDockComp({
  className = "",
  onSendFileToChat,
  onEmojiSelect,
  message,
  setMessage,
  onSendAudioMessage,
}: {
  className?: string;
  onSendFileToChat?: (fileURLs: string[]) => void;
  onEmojiSelect?: (emoji: string) => void;
  message: string;
  setMessage: (newMessage: string) => void;
  onSendAudioMessage?: (audioURL: string) => void;
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
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (e) => {
        setAudioBlob(e.data);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        stopRecording();
      };

      setRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.stop();
      setRecording(false);

      if (audioBlob) {
        const audioURL = await uploadToFirebaseStorage(audioBlob);
        onSendAudioMessage?.(audioURL);
      }
    } catch (error) {
      console.error('Error during recording or uploading.', error);
      setRecordingError('Error during recording or uploading.');
    } finally {
      cleanup();
    }
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
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const links = [
    { title: "Emoji", icon: <IconMoodHappy className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleEmojiClick },
    { title: "File", icon: <IconFile className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleFileClick },
    { title: "Translate", icon: <IconLanguage className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleLanguageClick },
    {
      title: isRecording ? "Stop" : "Voice Message",
      icon: <IconMicrophone className={`h-full w-full ${isRecording ? "text-red-500" : "text-neutral-500"} dark:text-neutral-300`} />,
      onClick: handleVoiceMessageClick,
    },
    { title: "Components", icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
    { title: "DOOM", icon: <Image src="/doom1.png" width={500} height={200} alt="Aceternity Logo" />, href: "#" },
    { title: "GitHub", icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
  ];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FloatingDock items={links} />

      {/* Popup FileUpload component */}
      {isFileUploadVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setFileUploadVisible(false)}
        >
          <div
            className="bg-neutral-950 bg-opacity-35 p-2 rounded-3xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <FileUpload
              onChange={(files) => {
                onSendFileToChat?.(files);
                setFileUploadVisible(false);
              }}
            />
            <button
              className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-950 rounded-3xl"
              onClick={() => setFileUploadVisible(false)}
            >
              Close
            </button>
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
          className="fixed bottom-16 right-48 z-50 bg-neutral-950 bg-opacity-35 p-1 rounded-3xl shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            value={selectedLanguage}
            onChange={handleLanguageSelect}
            className="p-2 bg-emerald-700 rounded-xl"
          >
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      )}

      {/* Translate Button */}
      <button
        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-950 rounded-3xl ml-4"
        onClick={handleTranslateClick}
        disabled={isLoading}
      >
        {isLoading ? "Translating..." : "Translate"}
      </button>

      {/* Voice Recording Progress Bar */}
      {isRecording && (
        <div className="fixed bottom-24 right-26 z-50 p-3 bg-emerald-900 rounded-3xl shadow-lg">
          <p>Recording... {formatTime(recordingTime)}</p>
          <div className="relative w-full h-2 bg-gray-300 rounded-full mt-2">
            <div
              className="absolute top-0 left-0 h-2 bg-emerald-700 rounded-full"
              style={{ width: `${(recordingTime % 60) * 100 / 60}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Recording Error Message */}
      {recordingError && (
        <div className="fixed bottom-24 right-26 z-50 p-3 bg-red-500 text-white rounded-3xl shadow-lg">
          <p>{recordingError}</p>
        </div>
      )}
    </div>
  );
}

const translateMessage = async (text: string, targetLang: string): Promise<string> => {
  try {
    const apiKey = '9d3759bfdcmsh6769e8af5a6241fp15b794jsn1a89edae0017'; // Replace with your actual API key
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
