import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// must match App.tsx
const progressKey = (uid?: string) => `learndx:progress:${uid || 'anon'}`;
// guessed results key used by attempts.ts (adjust here if yours differs)
const resultsKey  = (uid?: string) => `learndx:results:${uid || 'anon'}`;

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
  const [hasResults, setHasResults] = useState<boolean>(false);

  // load saved progress + whether any results exist
  useEffect(() => {
    try {
      const raw = localStorage.getItem(progressKey(uid));
      setSaved(raw ? (JSON.parse(raw) as SavedProgress) : null);
    } catch {
      setSaved(null);
    }
    try {
      const rawRes = localStorage.getItem(resultsKey(uid));
      let any = false;
      if (rawRes) {
        const data = JSON.parse(rawRes);
        if (Array.isArray(data)) any = data.length > 0;
        else if (Array.isArray(data?.items)) any = data.items.length > 0;
      }
      setHasResults(any);
    } catch {
      setHasResults(false);
    }
  }, [uid]);

  const handleResume = () => navigate('/quiz');
  const handleDiscard = () => {
    try { localStorage.removeItem(progressKey(uid)); } catch {}
    setSaved(null);
  };

  const qNum = saved ? Math.min(saved.currentIndex + 1, saved.total) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Performance Dashboard</h1>

      {/* Resume banner if a saved session exists */}
      {saved && saved.total > 0 && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Resume in-progress quiz</div>
              <div className="text-sm text-slate-700">
                Question {qNum} of {saved.total} • Score {saved.score} • Last saved{' '}
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

      {/* EMPTY STATE — show whenever no results are logged */}
      {!hasResults && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No quizzes yet</h2>
          <p className="text-slate-600 mb-4">
            Click <span className="font-medium">Create Test</span> to get started.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="rounded-xl bg-vdx-blue px-4 py-2 text-sm font-medium text-white hover:brightness-95"
          >
            Create Test
          </button>
        </div>
      )}

      {/* If you later render a results list/cards, put them below. */}
      {!user && (
        <p className="mt-6 text-slate-600">
          Sign in to view your saved quizzes.
        </p>
      )}
    </div>
  );
}
