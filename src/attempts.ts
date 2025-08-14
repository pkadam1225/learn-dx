export type UserAttempt = {
  sessionId: string;          // link attempts to a quiz session
  caseId: string;
  selectedAnswer: string;     // what the user picked
  wasCorrect: boolean;
  subject: string;
  tags: string[];
  timestamp: string;          // ISO
};

export type QuizResult = {
  sessionId: string;          // link quiz summary to its attempts
  date: string;               // YYYY-MM-DD
  score: number;
  total: number;
};

// ---------- Storage key helpers ----------
const LEGACY_QA_KEY   = 'learndx:questionAttempts'; // no-uid legacy key
const LEGACY_QUIZ_KEY = 'learndx:quizHistory';      // no-uid legacy key

function key(which: 'questionAttempts' | 'quizHistory', uid?: string) {
  // If a uid is provided, namespace by user; otherwise use legacy non-namespaced key
  if (uid) return `learndx:${uid}:${which}`;
  return which === 'questionAttempts' ? LEGACY_QA_KEY : LEGACY_QUIZ_KEY;
}

// ---------- Back-compat migration (optional) ----------
// If you previously used 'attempts' as a key, migrate it to legacy QA key once.
(function migrateVeryOldKey() {
  try {
    const old = localStorage.getItem('attempts');
    if (old && !localStorage.getItem(LEGACY_QA_KEY)) {
      localStorage.setItem(LEGACY_QA_KEY, old);
      localStorage.removeItem('attempts');
    }
  } catch {}
})();

// ---------- Per-question attempts ----------
export function getQuestionAttempts(uid?: string): UserAttempt[] {
  try {
    const raw = localStorage.getItem(key('questionAttempts', uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logAttempt(a: UserAttempt, uid?: string) {
  try {
    const k = key('questionAttempts', uid);
    const arr: UserAttempt[] = (() => {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : [];
    })();
    arr.push(a);
    localStorage.setItem(k, JSON.stringify(arr));
  } catch {}
}

export function resetQuestionAttempts(uid?: string) {
  try { localStorage.removeItem(key('questionAttempts', uid)); } catch {}
}

// ---------- Completed quiz history ----------
export function getQuizHistory(uid?: string): QuizResult[] {
  try {
    const raw = localStorage.getItem(key('quizHistory', uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logQuizResult(r: QuizResult, uid?: string) {
  try {
    const k = key('quizHistory', uid);
    const arr: QuizResult[] = (() => {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : [];
    })();
    arr.unshift(r); // newest first
    localStorage.setItem(k, JSON.stringify(arr));
  } catch {}
}

export function resetQuizHistory(uid?: string) {
  try { localStorage.removeItem(key('quizHistory', uid)); } catch {}
}