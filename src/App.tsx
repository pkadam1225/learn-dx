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

function makeSessionId() {
  // cross-browser friendly
  // @ts-ignore
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `quiz-${Date.now()}`;
}

function AppInner() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCases, setSelectedCases] = useState<DermCase[]>(sampleCases);
  const [sessionId, setSessionId] = useState<string>('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const handleGenerate = ({ count, subjects, fitzpatricks }: TestConfig) => {
    const filtered = sampleCases.filter((c) => {
      const subjectOK = subjects.includes(c.subject);
      const fitzOK =
        c.fitzpatrick === undefined ||
        fitzpatricks.length === 0 ||
        fitzpatricks.includes(c.fitzpatrick);
      return subjectOK && fitzOK;
    });

    const randomized = [...filtered].sort(() => 0.5 - Math.random()).slice(0, count);

    setSelectedCases(randomized);
    setCurrentIndex(0);
    setScore(0);
    setTotal(0);
    const sid = makeSessionId();
    setSessionId(sid);
    navigate('/quiz');
  };

  const handleSubmit = (isCorrect: boolean, selectedAnswer: string) => {
    const cur = selectedCases[currentIndex];

    logAttempt({
      sessionId,
      caseId: cur.id,
      selectedAnswer,
      wasCorrect: isCorrect,
      subject: cur.subject,
      tags: cur.tags,
      timestamp: new Date().toISOString(),
    });

    setScore((s) => s + (isCorrect ? 1 : 0));
    setTotal((t) => t + 1);
  };

  const showNext = () => {
    if (currentIndex < selectedCases.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const isoDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      logQuizResult({ sessionId, date: isoDate, score, total });
      navigate('/'); // back to Dashboard
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100 text-gray-900">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<PerformanceDashboard />} />
            <Route path="/create" element={<TestBuilder onGenerate={handleGenerate} />} />
            <Route
              path="/quiz"
              element={
                <QuizCard
                  key={selectedCases[currentIndex]?.id ?? 'none'} // reset per question
                  {...selectedCases[currentIndex]}
                  onSubmit={handleSubmit}
                  showNext={showNext}
                />
              }
            />
            <Route path="/review/:sessionId" element={<ReviewPage />} />
            <Route
              path="/help"
              element={<div className="text-center text-lg mt-10">Help Page Coming Soon</div>}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}