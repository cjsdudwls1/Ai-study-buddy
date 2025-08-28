import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizFromNote, getFeedbackOnAnswers } from '../services/geminiService';
import type { StudyNote, QuizQuestion, QuizFeedbackItem } from '../types';
import { QuestionType } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { Loader, CheckCircle, XCircle } from './Icons';

interface QuizViewProps {
  note: StudyNote;
  onFinish: () => void;
  isPractice?: boolean;
}

const getDifficultyText = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy': return '하';
    case 'medium': return '중';
    case 'hard': return '상';
    default: return '';
  }
};

const getDifficultyBadgeColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};


const QuizView: React.FC<QuizViewProps> = ({ note, onFinish, isPractice = false }) => {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<QuizFeedbackItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useLocalStorage<StudyNote[]>('study-notes', []);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setError(null);
        setLoading(true);
        const generatedQuiz = await generateQuizFromNote(note.content);
        
        // Sort questions by difficulty
        const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
        generatedQuiz.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

        setQuiz(generatedQuiz);
        setAnswers(new Array(generatedQuiz.length).fill(''));
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [note]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      setError(null);
      setSubmitting(true);
      const feedbackResult = await getFeedbackOnAnswers(note, quiz, answers);
      setFeedback(feedbackResult);
      
      // Update the note's lastReviewed date only if it's not a practice quiz
      if (!isPractice) {
        const updatedNotes = notes.map(n => 
          n.id === note.id ? { ...n, lastReviewed: Date.now() } : n
        );
        setNotes(updatedNotes);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow-md">
        <Loader className="h-12 w-12 mx-auto animate-spin text-sky-500" />
        <p className="mt-4 text-lg font-semibold text-slate-700">
          {isPractice ? '연습 퀴즈를 생성 중입니다...' : '당신만을 위한 퀴즈를 생성 중입니다...'}
        </p>
        <p className="text-slate-500">AI가 노트를 분석하여 완벽한 질문을 만들고 있습니다.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
        <p className="text-lg font-semibold text-red-700">오류</p>
        <p className="text-red-600">{error}</p>
        <button onClick={onFinish} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md">
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  if (feedback) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {isPractice ? '연습 퀴즈 결과' : '퀴즈 결과'}
        </h2>
        <p className="text-slate-600 mb-6">당신의 답변과 AI의 피드백을 확인해 보세요.</p>
        <div className="space-y-6">
          {feedback.map((item, index) => (
            <div key={index} className="p-4 border rounded-md bg-slate-50">
              <p className="font-semibold text-slate-800">{index + 1}. {item.question}</p>
              <div className="mt-2 flex items-start space-x-3">
                {item.isCorrect ? <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />}
                <div>
                  <p className="text-sm text-slate-600"><span className="font-bold">나의 답변:</span> {item.userAnswer}</p>
                  {!item.isCorrect && <p className="text-sm text-slate-600 mt-1"><span className="font-bold">정답:</span> {item.correctAnswer}</p>}
                  <p className="text-sm mt-2 p-2 bg-sky-100 text-sky-800 rounded-md"><span className="font-bold">피드백:</span> {item.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 border-t-2 border-slate-200">
          <h3 className="text-xl font-bold text-slate-700 mb-2">원본 학습 노트</h3>
          <p className="text-slate-600 whitespace-pre-wrap font-mono bg-slate-100 p-4 rounded-md">{note.content}</p>
        </div>
        <button onClick={onFinish} className="mt-8 w-full py-3 bg-sky-500 text-white font-bold rounded-md hover:bg-sky-600 transition-colors">
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-slate-800 mb-2">
        {isPractice ? '📝 연습 퀴즈' : '📝 쪽지시험!'}
      </h2>
      <p className="text-slate-600 mb-6">
        {isPractice ? '부담 없이 실력을 점검해 보세요. 이 퀴즈 결과는 복습 일정에 영향을 주지 않습니다.' : '학습 노트를 바탕으로 당신의 지식을 테스트해 보세요.'}
      </p>
      <div className="space-y-6">
        {quiz?.map((q, index) => (
          <div key={index}>
            <div className="flex items-center space-x-3 mb-2">
              <p className="font-medium text-slate-700">{index + 1}. {q.question}</p>
              <span className={`px-2 py-1 text-xs font-bold leading-none rounded-full ${getDifficultyBadgeColor(q.difficulty)}`}>
                {getDifficultyText(q.difficulty)}
              </span>
            </div>
            {q.type === QuestionType.TRUE_FALSE ? (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAnswerChange(index, 'True')}
                  className={`px-4 py-2 rounded-md transition-colors ${answers[index] === 'True' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}
                >
                  참
                </button>
                <button
                  onClick={() => handleAnswerChange(index, 'False')}
                  className={`px-4 py-2 rounded-md transition-colors ${answers[index] === 'False' ? 'bg-sky-500 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}
                >
                  거짓
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-8 w-full flex justify-center items-center py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition-colors disabled:bg-slate-400"
      >
        {submitting ? <Loader className="h-6 w-6 animate-spin"/> : '정답 확인'}
      </button>
    </div>
  );
};

export default QuizView;