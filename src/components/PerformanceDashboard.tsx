import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const progressKey = (uid?: string) => `learndx:progress:${uid || 'anon'}`;

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

  useEffect(() => {
    // Only look for saved progress if the user is signed in
    if (!uid) {
      setSaved(null);
      return;
    }
    try {
      const raw = localStorage.getItem(progressKey(uid));
      setSaved(raw ? (JSON.parse(raw) as SavedProgress) : null);
    } catch {
      setSaved(null);
    }
  }, [uid]);

  const handleResume = () => navigate('/quiz');
  const handleDiscard = () => {
    if (!uid) return;
    try { localStorage.removeItem(progressKey(uid)); } catch {}
    setSaved(null);
  };

  const qNum = saved ? Math.min(saved.currentIndex + 1, saved.total) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Performance Dashboard</h1>

      {/* Resume banner — signed-in users only */}
      {uid && saved && saved.total > 0 && (
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

      {/* Empty state */}
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

      {!uid && (
        <p className="mt-6 text-slate-600">Sign in to view your saved quizzes.</p>
      )}
    </div>
  );
}
