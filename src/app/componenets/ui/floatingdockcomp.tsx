import React, { useState } from "react";
import { FloatingDock } from "./floating-doc";
import {
  IconBrandGithub,
  IconFile,
  IconMoodHappy,
  IconLanguage,
  IconNewSection,
  IconTerminal2
} from "@tabler/icons-react";
import Image from "next/image";
import { FileUpload } from "@/app/componenets/ui/file-upload";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

export function FloatingDockComp({
  className = "",
  onSendFileToChat,
  onEmojiSelect,
  message,
  setMessage,
}: {
  className?: string;
  onSendFileToChat?: (fileURLs: string[]) => void;
  onEmojiSelect?: (emoji: string) => void;
  message: string;
  setMessage: (newMessage: string) => void;
}) {
  const [isFileUploadVisible, setFileUploadVisible] = useState(false);
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isLanguagePickerVisible, setLanguagePickerVisible] = useState(false); // New state for language picker
  const [selectedLanguage, setSelectedLanguage] = useState("es"); // Default language: Spanish

  const handleFileClick = () => setFileUploadVisible(true);
  const handleEmojiClick = () => setEmojiPickerVisible(!isEmojiPickerVisible);
  const handleLanguageClick = () => setLanguagePickerVisible(!isLanguagePickerVisible); // Toggle language picker visibility

  const handleEmojiSelect = (emojiObject: EmojiClickData) => {
    onEmojiSelect?.(emojiObject.emoji);
    setEmojiPickerVisible(false);
  };

  const handleTranslateClick = async () => {
    const translatedText = await translateMessage(message, selectedLanguage);
    setMessage(translatedText);
  };

  const handleLanguageSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    setLanguagePickerVisible(false); // Close the language picker after selection
  };

  const links = [
    { title: "Emoji", icon: <IconMoodHappy className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleEmojiClick },
    { title: "File", icon: <IconFile className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleFileClick },
    // { title: "Translate", icon: <IconLanguage className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleTranslateClick },
    { title: "Translate", icon: <IconLanguage className="h-full w-full text-neutral-500 dark:text-neutral-300" />, onClick: handleLanguageClick }, // New language picker link
    { title: "Products", icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />, href: "#" },
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
    </div>
  );
}

const translateMessage = async (text: string, targetLang: string): Promise<string> => {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error('Translation API error');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; 
  }
};