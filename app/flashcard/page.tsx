'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function FlashcardPage() {
  const searchParam = useSearchParams();
  const subjectParam = searchParam.get('subject');

  const [data, setData] = useState<[string, string][]>([]);
  const [qNumber, setQNumber] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);

  const getData = async () => {
    const formData = new FormData();
    formData.append('subject', subjectParam ?? 'none');

    const res = await fetch('/api/flashcard', {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });

    const json = await res.json();
    return json.values;
  };

  useEffect(() => {
    getData().then((result) => {
      if (result.length > 0) {
        setData(result);
        setQNumber(0);
        setDisplayText(result[0][0]);
      }
    });
  }, []);

  const showClicked = () => {
    if (!data[qNumber]) return;

    setIsFlipping(true);

    setTimeout(() => {
      const nextShow = !showResult;
      setShowResult(nextShow);
      setDisplayText(nextShow ? data[qNumber][1] : data[qNumber][0]);
      setIsFlipping(false);
    }, 300);
  };

  const nextOrBack = (next: boolean) => {
    const newIndex = next ? qNumber + 1 : qNumber - 1;
    if (newIndex < 0 || newIndex >= data.length) return;

    setQNumber(newIndex);
    setShowResult(false);
    setDisplayText(data[newIndex][0]);
  };

  if (!data[qNumber]) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-500">
        No flashcards available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-12">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <p className="text-gray-600">Subject: {subjectParam}</p>
      </div>

      <div className="flex justify-center items-center">
        <div
          className={`w-96 h-60 bg-white rounded-xl shadow-lg border-2 border-blue-300 p-6 text-center text-lg font-medium transition-transform duration-300 ${
            isFlipping ? 'scale-105' : ''
          }`}
        >
          {displayText}
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => nextOrBack(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ←
        </button>
        <button
          onClick={showClicked}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showResult ? 'HIDE' : 'SHOW'}
        </button>
        <button
          onClick={() => nextOrBack(true)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          →
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-500">
        CARD {qNumber + 1} / {data.length}
      </div>

      <div className="text-center mt-6">
        <a href="/" className="text-blue-600 hover:underline">
          Back to Main Menu
        </a>
      </div>
    </div>
  );
}
