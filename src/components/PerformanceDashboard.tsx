import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

import { getQuizHistory } from '../attempts';
import type { QuizResult } from '../attempts';
import { useAuth } from '../auth/AuthContext';

const PerformanceDashboard = () => {
  const { user } = useAuth();
  const uid = user?.uid;
  const [attempts, setAttempts] = useState<QuizResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) {
      setAttempts([]);
      return;
    }
    setAttempts(getQuizHistory(uid));
  }, [uid]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#1E3A5F]">Performance Dashboard</h2>

      {!uid ? (
        <div className="text-gray-600 text-sm">
          Sign in to view your saved quizzes.
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-gray-600 text-sm">
          No quizzes yet — create one to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div
              key={attempt.sessionId}
              className="bg-white border border-gray-200 rounded-md shadow-sm flex justify-between items-center px-6 py-4 hover:shadow-md transition"
            >
              <div>
                <p className="text-[#1E3A5F] font-medium text-sm">
                  Quiz taken on {attempt.date}
                </p>
                <p className="text-gray-700 text-sm">
                  Score: {attempt.score} / {attempt.total}
                </p>
              </div>
              <button
                onClick={() => navigate(`/review/${attempt.sessionId}`)}
                className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-2xl bg-vdx-blue text-white hover:brightness-95"
              >
                View <FaChevronRight className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;
