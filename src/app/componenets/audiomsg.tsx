import React from 'react';

export function AudioMessage({ audioURL }: { audioURL: string }) {
  return (
    <div className="p-2 bg-emerald-500 rounded-full">
      <audio controls>
        <source src={audioURL} type="audio/webm" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
