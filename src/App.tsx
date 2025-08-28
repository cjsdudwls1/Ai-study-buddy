import React, { useState, useCallback } from 'react';
import { GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import type { GoogleUser, StudyNote } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddNote from './components/AddNote';
import QuizView from './components/QuizView';

// IMPORTANT: Replace with your actual Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "548733093587-jok3daiau9vidfhlncjnte24dte32qgv.apps.googleusercontent.com";


type View = 'dashboard' | 'add_note' | 'quiz';

const App: React.FC = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [activeNote, setActiveNote] = useState<StudyNote | null>(null);
  const [isPracticeQuiz, setIsPracticeQuiz] = useState<boolean>(false);

  const handleLoginSuccess = useCallback((credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: { name: string; email: string; picture: string } = jwtDecode(credentialResponse.credential);
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
      setView('dashboard');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setActiveNote(null);
    // Note: In a real app, you might want to call googleLogout() here
  }, []);

  const handleStartQuiz = useCallback((note: StudyNote, isPractice: boolean = false) => {
    setActiveNote(note);
    setIsPracticeQuiz(isPractice);
    setView('quiz');
  }, []);

  const handleQuizFinish = useCallback(() => {
    setActiveNote(null);
    setView('dashboard');
  }, []);

  const renderView = () => {
    switch (view) {
      case 'add_note':
        return <AddNote onNoteAdded={() => setView('dashboard')} />;
      case 'quiz':
        return activeNote ? <QuizView note={activeNote} onFinish={handleQuizFinish} isPractice={isPracticeQuiz} /> : <Dashboard onStartQuiz={handleStartQuiz} onAddNote={() => setView('add_note')} />;
      case 'dashboard':
      default:
        return <Dashboard onStartQuiz={handleStartQuiz} onAddNote={() => setView('add_note')} />;
    }
  };

  if (!user) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Login onSuccess={handleLoginSuccess} />
      </GoogleOAuthProvider>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-800">AI 스터디 버디</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600 hidden sm:block">환영합니다, {user.name.split(' ')[0]}님</span>
              <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full border-2 border-sky-400" />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-md transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
