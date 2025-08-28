import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { BookOpen, Calendar, BrainCircuit } from './Icons';

interface LoginProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-slate-200 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left side: Feature Description */}
          <div className="text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">
              AI 스터디 버디
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-600">
              똑똑하게 공부하고, 더 오래 기억하세요.
            </p>
            <div className="mt-10 space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-200 text-sky-700">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">지능형 노트 정리</h3>
                  <p className="mt-1 text-slate-600">
                    학습 내용을 입력하면 AI가 핵심을 파악합니다. 복잡한 내용도 간결하게 정리하여 효율적인 복습의 기초를 다지세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-200 text-sky-700">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">개인화된 AI 퀴즈</h3>
                  <p className="mt-1 text-slate-600">
                    노트 내용을 기반으로 AI가 맞춤형 퀴즈를 생성합니다. 능동적 회상(Active Recall)을 통해 학습 내용을 뇌에 각인시키세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-200 text-sky-700">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">망각 곡선 기반 복습</h3>
                  <p className="mt-1 text-slate-600">
                    에빙하우스의 망각 곡선 이론에 따라 최적의 복습 시점을 알려줍니다. 더 이상 '언제 복습해야 할지' 고민하지 마세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side: Login Card */}
          <div className="w-full max-w-md mx-auto">
            <div className="p-8 sm:p-10 space-y-6 bg-white rounded-2xl shadow-2xl text-center">
              <h2 className="text-2xl font-bold text-slate-800">학습 시작하기</h2>
              <p className="text-slate-600">
                지금 바로 구글 계정으로 시작하고 학습 효율을 극대화하세요.
              </p>
              <div className="flex justify-center pt-4">
                <GoogleLogin
                  onSuccess={onSuccess}
                  onError={() => {
                    console.log('Login Failed');
                    // Optionally, show an error message to the user
                  }}
                  theme="filled_blue"
                  size="large"
                  shape="pill"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
