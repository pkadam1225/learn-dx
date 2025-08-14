import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getQuestionAttempts, getQuizHistory } from '../attempts';
import { sampleCases } from '../sampleCases';

export default function ReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const uid = user?.uid;

  const { attempts, summary } = useMemo(() => {
    if (!uid || !sessionId) return { attempts: [], summary: undefined as any };
    const all = getQuestionAttempts(uid).filter(a => a.sessionId === sessionId);
    const hist = getQuizHistory(uid).find(q => q.sessionId === sessionId);
    return { attempts: all, summary: hist };
  }, [uid, sessionId]);

  if (!uid) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-gray-700 text-sm">
          Please sign in to view quiz reviews.
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 rounded-2xl bg-vdx-blue text-white hover:brightness-95 text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-gray-700 text-sm">No review found for this quiz.</div>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 rounded-2xl bg-vdx-blue text-white hover:brightness-95 text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const rows = attempts.map(a => {
    const kase = sampleCases.find(c => c.id === a.caseId);
    return { a, kase };
  }).filter(r => !!r.kase);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#1E3A5F]">Quiz Review</h2>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-2 rounded-2xl bg-vdx-blue text-white hover:brightness-95 text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white border rounded-md shadow p-4 text-sm text-gray-700">
        <div><span className="font-medium">Date:</span> {summary.date}</div>
        <div><span className="font-medium">Score:</span> {summary.score} / {summary.total}</div>
      </div>

      <div className="space-y-6">
        {rows.map(({ a, kase }, idx) => {
          
          const k = kase as typeof sampleCases[number];
          const correct = k.correctAnswer;
          const isCorrect = a.wasCorrect;

        
          const lines: Array<{ label: string; text: string }> = [];
          const correctText = k.explanations[correct] ?? 'Explanation coming soon.';
          lines.push({
            label: correct,
            text: correctText.startsWith('Correct.') ? correctText : `Correct. ${correctText}`,
          });
          k.options.forEach(opt => {
            if (opt === correct) return;
            const txt = k.explanations[opt] ?? 'Explanation coming soon.';
            lines.push({
              label: opt,
              text: txt.startsWith('Incorrect.') ? txt : `Incorrect. ${txt}`,
            });
          });

          return (
            <div key={a.timestamp} className="bg-white border rounded-md shadow">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">Question {idx + 1}</div>
                  <div>
                    Subject: {k.subject}
                    {k.fitzpatrick ? ` • Fitzpatrick: ${k.fitzpatrick}` : ''}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {k.imageUrl && (
                  <img
                    src={k.imageUrl}
                    alt=""
                    className="w-full max-h-72 object-contain border rounded"
                  />
                )}

                <p className="text-gray-800">{k.vignette}</p>

                {/* Options with indicators */}
                <div className="space-y-2">
                  {k.options.map(opt => {
                    const userPick = a.selectedAnswer === opt;
                    const right = opt === correct;
                    let classes = 'w-full text-left px-4 py-2 rounded border text-sm';
                    if (right) classes += ' bg-green-50 border-green-300';
                    else if (userPick) classes += ' bg-red-50 border-red-300';
                    else classes += ' bg-white border-gray-200';

                    return (
                      <div key={opt} className={classes}>
                        <span className="font-medium">{opt}</span>
                        {userPick && !right && ' • Your choice'}
                        {right && ' • Correct'}
                      </div>
                    );
                  })}
                </div>

                {/* Single combined explanation box */}
                <div className="p-4 border rounded-md bg-gray-50">
                  <p className="text-sm text-gray-700 font-semibold">Explanation:</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    {lines.map(l => (
                      <p key={l.label}><strong>{l.label}:</strong> {l.text}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
