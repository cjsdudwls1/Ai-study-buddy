import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { StudyNote } from '../types';
import { BookOpen, Calendar, PlusCircle, CheckCircle, Play, Repeat } from './Icons';

interface DashboardProps {
  onStartQuiz: (note: StudyNote, isPractice: boolean) => void;
  onAddNote: () => void;
}

const NoteCard: React.FC<{ note: StudyNote, onStartQuiz: (note: StudyNote, isPractice: boolean) => void, isDue?: boolean }> = ({ note, onStartQuiz, isDue = false }) => {
  const formattedDate = new Date(note.createdAt).toLocaleDateString();
  const nextReviewDate = note.reviewDates.find(d => d > (note.lastReviewed || note.createdAt));

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col ${isDue ? 'border-2 border-sky-400' : 'border border-transparent'}`}>
      <div className="flex-grow">
        <p className="text-slate-700 leading-relaxed break-words line-clamp-3">{note.content}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>작성일: {formattedDate}</span>
          </div>
          {note.lastReviewed && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>최근 복습: {new Date(note.lastReviewed).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        {nextReviewDate && !isDue &&
          <p className="text-xs text-slate-400 mt-2">다음 복습: {new Date(nextReviewDate).toLocaleDateString()}</p>
        }
      </div>
      {isDue ? (
        <button
          onClick={() => onStartQuiz(note, false)}
          className="mt-4 w-full flex items-center justify-center space-x-2 bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors"
        >
          <Repeat className="w-4 h-4" />
          <span>복습 퀴즈 시작</span>
        </button>
      ) : (
        <button
          onClick={() => onStartQuiz(note, true)}
          className="mt-4 w-full flex items-center justify-center space-x-2 bg-slate-500 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>연습 퀴즈 풀기</span>
        </button>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, onAddNote }) => {
  const [notes, setNotes] = useLocalStorage<StudyNote[]>('study-notes', []);

  const now = Date.now();
  const dueNotes = notes.filter(note => note.reviewDates.some(date => date <= now && date > (note.lastReviewed || 0)));
  const otherNotes = notes.filter(note => !dueNotes.some(dueNote => dueNote.id === note.id));

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">복습할 시간!</h2>
          <button
            onClick={onAddNote}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>새 노트 추가</span>
          </button>
        </div>
        {dueNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dueNotes.map(note => <NoteCard key={note.id} note={note} onStartQuiz={onStartQuiz} isDue />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-lg font-medium text-slate-900">모두 복습했어요!</h3>
            <p className="mt-1 text-sm text-slate-500">현재 복습할 노트가 없습니다. 잘하고 있어요!</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">모든 학습 노트</h2>
        {notes.length > 0 && otherNotes.length === 0 && dueNotes.length > 0 ? (
           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
             <p className="mt-1 text-sm text-slate-500">모든 노트가 복습 대기 중입니다!</p>
           </div>
        ) : otherNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherNotes.map(note => <NoteCard key={note.id} note={note} onStartQuiz={onStartQuiz} />)}
          </div>
        ) : (
           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="mt-1 text-sm text-slate-500">아직 학습 노트를 추가하지 않았습니다. '새 노트 추가'를 눌러 시작해보세요!</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;