import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// must match App.tsx
const storageKey = (uid?: string) => `learndx:progress:${uid || 'anon'}`;

type SavedProgress = {
  sessionId: string;
  caseIds: string[];
  currentIndex: number;
  score: number;
  total: number;
  updatedAt: string;
};

export default function PerformanceDashboard() {
  const { user } = useAuth();
  const uid = user?.uid;
  const navigate = useNavigate();

  const [saved, setSaved] = useState<SavedProgress | null>(null);

  // load saved progress on mount / when user changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(uid));
      setSaved(raw ? JSON.parse(raw) as SavedProgress : null);
    } catch {
      setSaved(null);
    }
  }, [uid]);

  const handleResume = () => {
    navigate('/quiz'); // App.tsx auto-restores when hitting /quiz
  };

  const handleDiscard = () => {
    try {
      localStorage.removeItem(storageKey(uid));
    } catch {}
    setSaved(null);
  };

  const qNum = saved ? Math.min(saved.currentIndex + 1, saved.total) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">Performance Dashboard</h1>

      {/* Resume banner if a saved session exists */}
      {saved && saved.total > 0 && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Resume in-progress quiz</div>
              <div className="text-sm text-slate-700">
                Question {qNum} of {saved.total} • Score {saved.score} • Last saved{" "}
                {new Date(saved.updatedAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-white"
              >
                Discard
              </button>
              <button
                onClick={handleResume}
                className="rounded-xl bg-vdx-blue px-3 py-2 text-sm font-medium text-white hover:brightness-95"
              >
                Resume quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Your existing dashboard content */}
      {!user && (
        <p className="text-slate-600">Sign in to view your saved quizzes.</p>
      )}
      {/* TODO: render your stats/cards list here */}
    </div>
  );
}