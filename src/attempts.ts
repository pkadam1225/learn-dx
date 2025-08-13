export type UserAttempt = {
  sessionId: string;          // <- new: link attempts to a quiz session
  caseId: string;
  selectedAnswer: string;     // <- new: what the user picked
  wasCorrect: boolean;
  subject: string;
  tags: string[];
  timestamp: string;          // ISO
};

export type QuizResult = {
  sessionId: string;          // <- link quiz summary to its attempts
  date: string;               // YYYY-MM-DD
  score: number;
  total: number;
};

// ---------- Storage keys ----------
const QA_KEY   = 'learndx:questionAttempts';
const QUIZ_KEY = 'learndx:quizHistory';

// ---------- Back-compat migration from old "attempts" key ----------
(function migrateOldAttemptsKey() {
  try {
    const old = localStorage.getItem('attempts');
    if (old && !localStorage.getItem(QA_KEY)) {
      localStorage.setItem(QA_KEY, old);
      localStorage.removeItem('attempts');
    }
  } catch {}
})();

// ---------- Per-question attempts ----------
export function getQuestionAttempts(): UserAttempt[] {
  try {
    const raw = localStorage.getItem(QA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logAttempt(a: UserAttempt) {
  try {
    const arr = getQuestionAttempts();
    arr.push(a);
    localStorage.setItem(QA_KEY, JSON.stringify(arr));
  } catch {}
}

export function resetQuestionAttempts() {
  try { localStorage.removeItem(QA_KEY); } catch {}
}

// ---------- Completed quiz history ----------
export function getQuizHistory(): QuizResult[] {
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logQuizResult(r: QuizResult) {
  try {
    const arr = getQuizHistory();
    arr.unshift(r); // newest first
    localStorage.setItem(QUIZ_KEY, JSON.stringify(arr));
  } catch {}
}

export function resetQuizHistory() {
  try { localStorage.removeItem(QUIZ_KEY); } catch {}
}