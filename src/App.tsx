import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

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

// -------- storage helpers --------
function makeSessionId() {
  // @ts-ignore
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `quiz-${Date.now()}`;
}
const storageKey = (uid?: string) => `learndx:progress:${uid || 'anon'}`;

// shape we persist
type SavedProgress = {
  sessionId: string;
  caseIds: string[];
  currentIndex: number;
  score: number;
  total: number;
  updatedAt: string;
};

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const uid = user?.uid;

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCases, setSelectedCases] = useState<DermCase[]>([]);
  const [sessionId, setSessionId] = useState<string>(makeSessionId());
  const [score, setScore] = useState(0);

  // If the user signs out mid-session, keep saved progress but route to dashboard
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // ---- AUTOSAVE on every meaningful change ----
  useEffect(() => {
    if (!quizStarted || selectedCases.length === 0) return;
    const data: SavedProgress = {
      sessionId,
      caseIds: selectedCases.map((c) => c.id),
      currentIndex,
      score,
      total: selectedCases.length,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(storageKey(uid), JSON.stringify(data));
    } catch {}
  }, [quizStarted, selectedCases, currentIndex, score, uid, sessionId]);

  // Save on tab close/navigation just in case
  useEffect(() => {
    const onBeforeUnload = () => {
      if (!quizStarted || selectedCases.length === 0) return;
      const data: SavedProgress = {
        sessionId,
        caseIds: selectedCases.map((c) => c.id),
        currentIndex,
        score,
        total: selectedCases.length,
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(storageKey(uid), JSON.stringify(data));
      } catch {}
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [quizStarted, selectedCases, currentIndex, score, uid, sessionId]);

  // ---- RESTORE when landing on /quiz and a save exists ----
  useEffect(() => {
    const maybeRestore = () => {
      const raw = localStorage.getItem(storageKey(uid));
      if (!raw) return;
      try {
        const data: SavedProgress = JSON.parse(raw);
        if (!data?.caseIds?.length) return;

        // rebuild cases from IDs (falls back if any missing)
        const rebuilt = data.caseIds
          .map((id) => sampleCases.find((c) => c.id === id))
          .filter(Boolean) as DermCase[];

        if (rebuilt.length === 0) return;

        setSelectedCases(rebuilt);
        setCurrentIndex(Math.min(data.currentIndex ?? 0, rebuilt.length - 1));
        setScore(data.score ?? 0);
        setSessionId(data.sessionId ?? makeSessionId());
        setQuizStarted(true);
      } catch {}
    };

    // Only auto-restore when user goes to /quiz
    if (location.pathname === '/quiz') {
      maybeRestore();
    }
  }, [location.pathname, uid]);

  const clearSavedProgress = () => {
    try {
      localStorage.removeItem(storageKey(uid));
    } catch {}
  };

  // Start / generate quiz, then route to /quiz
  const handleGenerate = ({ count, subjects, fitzpatricks }: TestConfig) => {
    if (!uid) {
      alert('Please sign in with Google to save your quiz history.');
      // (we still allow anonymous runs; they’ll save under anon key)
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

    navigate('/quiz');
  };

  // Called by QuizCard when a question is submitted
  const handleSubmit = (isCorrect: boolean, selectedAnswer: string) => {
    const currentCase = selectedCases[currentIndex];
    if (!currentCase) return;

    if (isCorrect) setScore((s) => s + 1);

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
      // Finished — record result, clear save, go home
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
      clearSavedProgress();
      setQuizStarted(false);
      setSelectedCases([]);
      navigate('/'); // back to dashboard
    }
  };

  const currentCase = selectedCases[currentIndex];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-100 text-gray-900">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<PerformanceDashboard />} />
            <Route path="/create" element={<TestBuilder onGenerate={handleGenerate} />} />
            <Route path="/help" element={<div className="text-center text-lg mt-10">Help Page Coming Soon</div>} />
            <Route path="/review/:sessionId" element={<ReviewPage />} />
            <Route
              path="/quiz"
              element={
                quizStarted && currentCase ? (
                  <QuizCard
                    id={currentCase.id}
                    imageUrl={currentCase.imageUrl}
                    vignette={currentCase.vignette}
                    options={currentCase.options}
                    correctAnswer={currentCase.correctAnswer}
                    explanations={currentCase.explanations}
                    subject={currentCase.subject}
                    fitzpatrick={currentCase.fitzpatrick}
                    skinToneNotes={currentCase.skinToneNotes}
                    onSubmit={handleSubmit}
                    showNext={showNext}
                  />
                ) : (
                  <div className="max-w-3xl mx-auto bg-white p-6 rounded border">
                    <p className="text-lg font-semibold mb-2">No active quiz.</p>
                    <p className="text-sm text-gray-600">
                      Start a new one on the <span className="font-medium">Create Test</span> page.
                      {localStorage.getItem(storageKey(uid)) && (
                        <> You also have a saved session — revisit this page to resume.</>
                      )}
                    </p>
                  </div>
                )
              }
            />
          </Routes>
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