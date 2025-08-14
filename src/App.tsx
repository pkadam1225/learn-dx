import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TestBuilder from './components/TestBuilder';
import type { TestConfig } from './components/TestBuilder';

import PerformanceDashboard from './components/PerformanceDashboard';
import QuizCard from './components/QuizCard';
import ReviewPage from './components/ReviewPage';

import { sampleCases } from './sampleCases';
import type { DermCase } from './sampleCases';

import { logAttempt, logQuizResult } from './attempts';

import './index.css';

// Auth
import { AuthProvider, useAuth } from './auth/AuthContext';

// Create a stable session id for each quiz run
function makeSessionId() {
  // cross-browser friendly
  // @ts-ignore
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `quiz-${Date.now()}`;
}

function AppInner() {
  const navigate = useNavigate();
  const { user } = useAuth(); // <-- used to namespace saved data
  const uid = user?.uid;

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCases, setSelectedCases] = useState<DermCase[]>(sampleCases);
  const [sessionId, setSessionId] = useState<string>(makeSessionId());
  const [score, setScore] = useState(0);

  const handleGenerate = ({ count, subjects, fitzpatricks }: TestConfig) => {
    // If you require login to save progress, gate here:
    if (!uid) {
      alert('Please sign in with Google to save your quiz history.');
      // You can return here to force sign-in before taking a quiz:
      // return;
    }

    const filtered = sampleCases.filter((c) => {
      const subjectOk = subjects.includes(c.subject);
      const fpOk =
        !fitzpatricks || fitzpatricks.length === 0
          ? true
          : c.fitzpatrick
            ? fitzpatricks.includes(c.fitzpatrick)
            : true; // include histo cases without FST
      return subjectOk && fpOk;
    });

    const randomized = [...filtered].sort(() => 0.5 - Math.random()).slice(0, count);

    setSelectedCases(randomized);
    setCurrentIndex(0);
    setScore(0);
    setSessionId(makeSessionId());
    setQuizStarted(true);
  };

  // NOTE: Your latest QuizCard should call onSubmit(isCorrect, selectedAnswer)
  const handleSubmit = (isCorrect: boolean, selectedAnswer: string) => {
    const currentCase = selectedCases[currentIndex];

    // Update running score
    if (isCorrect) setScore((s) => s + 1);

    // Persist per-question attempt (namespaced by uid if available)
    if (uid) {
      logAttempt(
        {
          sessionId,
          caseId: currentCase.id,
          selectedAnswer,
          wasCorrect: isCorrect,
          subject: currentCase.subject,
          tags: currentCase.tags,
          timestamp: new Date().toISOString(),
        },
        uid
      );
    }
  };

  const showNext = () => {
    if (currentIndex < selectedCases.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz finished — record summary for this session
      if (uid) {
        const iso = new Date().toISOString().slice(0, 10);
        logQuizResult(
          {
            sessionId,
            date: iso,
            score,
            total: selectedCases.length,
          },
          uid
        );
      }
      setQuizStarted(false);
      navigate('/'); // back to dashboard
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100 text-gray-900">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {quizStarted ? (
            <QuizCard
              {...selectedCases[currentIndex]}
              onSubmit={handleSubmit}
              showNext={showNext}
            />
          ) : (
            <Routes>
              <Route path="/" element={<PerformanceDashboard />} />
              <Route path="/create" element={<TestBuilder onGenerate={handleGenerate} />} />
              <Route path="/help" element={<div className="text-center text-lg mt-10">Help Page Coming Soon</div>} />
              <Route path="/review/:sessionId" element={<ReviewPage />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

// Outer wrapper that mounts Router + AuthProvider
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </Router>
  );
}