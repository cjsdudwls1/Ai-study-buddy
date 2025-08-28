import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { StudyNote } from '../types';
import { Save } from './Icons';

interface AddNoteProps {
  onNoteAdded: () => void;
}

const AddNote: React.FC<AddNoteProps> = ({ onNoteAdded }) => {
  const [content, setContent] = useState('');
  const [notes, setNotes] = useLocalStorage<StudyNote[]>('study-notes', []);

  const handleSave = () => {
    if (content.trim() === '') {
      alert('노트 내용은 비워둘 수 없습니다.');
      return;
    }

    const now = new Date();
    const createdAt = now.getTime();

    // Forgetting curve intervals: 1 day, 3 days, 7 days
    const reviewDates = [1, 3, 7].map(days => {
      const date = new Date(createdAt);
      date.setDate(date.getDate() + days);
      return date.getTime();
    });

    const newNote: StudyNote = {
      id: `note-${createdAt}`,
      content: content.trim(),
      createdAt,
      reviewDates,
      lastReviewed: null,
    };

    setNotes([...notes, newNote]);
    onNoteAdded();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">새 학습 노트 추가</h2>
      <p className="text-slate-600 mb-4">오늘 배운 내용을 요약해 보세요. AI가 이 내용을 바탕으로 복습 퀴즈를 만들어 드립니다.</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="예시: '오늘 자료구조 수업에서 해시 테이블에 대해 배웠다. 키를 해시 함수로 인덱스화하고, 충돌 시에는 체이닝이나 개방 주소법으로 해결한다고 했다...'"
        className="w-full h-48 p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
      />
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>저장 및 복습 예약</span>
        </button>
      </div>
    </div>
  );
};

export default AddNote;
