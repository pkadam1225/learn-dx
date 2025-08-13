import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionAttempts, getQuizHistory } from '../attempts';
import { sampleCases } from '../sampleCases';

export default function ReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { attempts, summary } = useMemo(() => {
    const all = getQuestionAttempts().filter(a => a.sessionId === sessionId);
    const hist = getQuizHistory().find(q => q.sessionId === sessionId);
    return { attempts: all, summary: hist };
  }, [sessionId]);

  const rows = attempts.map((a) => {
    const kase = sampleCases.find(c => c.id === a.caseId);
    return { attempt: a, kase };
  });

  if (!sessionId) {
    return <div className="text-center">Missing session.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#1E3A5F]">Quiz Review</h2>
        <button onClick={() => navigate('/')} className="px-3 py-2 rounded-2xl bg-vdx-blue text-white hover:brightness-95">
          Back to Dashboard
        </button>
      </div>

      {summary && (
        <div className="bg-white border rounded-md shadow p-4 text-sm text-gray-700">
          <div><span className="font-medium">Date:</span> {summary.date}</div>
          <div><span className="font-medium">Score:</span> {summary.score} / {summary.total}</div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="text-gray-600 text-sm">No attempts found for this quiz.</div>
      ) : (
        <div className="space-y-6">
          {rows.map(({ attempt, kase }, idx) => {
            if (!kase) return null;
            const isCorrect = attempt.wasCorrect;
            const correctAnswer = kase.correctAnswer;
            const explanations = kase.explanations;

            // Build merged explanation block (correct first, then others)
            const lines: Array<{ label: string; text: string }> = [];
            const correctText = explanations[correctAnswer] ?? 'Explanation coming soon.';
            lines.push({
              label: correctAnswer,
              text: correctText.startsWith('Correct.') ? correctText : `Correct. ${correctText}`,
            });
            kase.options.forEach(opt => {
              if (opt === correctAnswer) return;
              const txt = explanations[opt] ?? 'Explanation coming soon.';
              lines.push({
                label: opt,
                text: txt.startsWith('Incorrect.') ? txt : `Incorrect. ${txt}`,
              });
            });

            return (
              <div key={attempt.timestamp} className="bg-white border rounded-md shadow">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">Question {idx + 1}</div>
                    <div>Subject: {kase.subject}{kase.fitzpatrick ? ` • Fitzpatrick: ${kase.fitzpatrick}` : ''}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {kase.imageUrl && (
                    <img src={kase.imageUrl} alt="" className="w-full max-h-72 object-contain border rounded" />
                  )}
                  <p className="text-gray-800">{kase.vignette}</p>

                  <div className="space-y-2">
                    {kase.options.map(opt => {
                      const isUser = attempt.selectedAnswer === opt;
                      const isRight = opt === correctAnswer;
                      let classes = 'w-full text-left px-4 py-2 rounded border text-sm';
                      if (isRight) classes += ' bg-green-50 border-green-300';
                      if (isUser && !isRight) classes += ' bg-red-50 border-red-300';
                      if (!isRight && !isUser) classes += ' bg-white border-gray-200';
                      return (
                        <div key={opt} className={classes}>
                          <span className="font-medium">{opt}</span>
                          {isUser && ' • Your choice'}
                          {isRight && ' • Correct'}
                        </div>
                      );
                    })}
                  </div>

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
      )}
    </div>
  );
}