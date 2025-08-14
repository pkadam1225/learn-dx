import { useState, useEffect } from 'react';
import SkinToneNotes from './SkinToneNotes';
import type { SkinToneNotes as SkinToneNotesType } from './SkinToneNotes';

interface QuizCardProps {
  id: string;
  imageUrl: string;
  vignette: string;
  options: string[];
  correctAnswer: string;
  explanations: Record<string, string>;
  subject: string;
  fitzpatrick?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  skinToneNotes?: SkinToneNotesType;
  onSubmit: (isCorrect: boolean, selectedAnswer: string) => void;
  showNext: () => void;
}

export default function QuizCard(props: QuizCardProps) {
  const {
    id, imageUrl, vignette, options, correctAnswer, explanations,
    subject, fitzpatrick, skinToneNotes, onSubmit, showNext
  } = props;

  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [id, imageUrl, vignette, correctAnswer]);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    onSubmit(selected === correctAnswer, selected);
  };

  // merged explanation (correct first, then all incorrect)
  const renderExplanation = () => {
    if (!submitted) return null;
    const rows: Array<{ label: string; text: string }> = [];
    const correctText = explanations[correctAnswer] ?? 'Explanation coming soon.';
    rows.push({
      label: `${correctAnswer}`,
      text: correctText.startsWith('Correct.') ? correctText : `Correct. ${correctText}`,
    });
    options.forEach((opt) => {
      if (opt === correctAnswer) return;
      const txt = explanations[opt] ?? 'Explanation coming soon.';
      rows.push({
        label: `${opt}`,
        text: txt.startsWith('Incorrect.') ? txt : `Incorrect. ${txt}`,
      });
    });
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="text-sm text-gray-700 font-semibold">Explanation:</p>
        <div className="mt-2 space-y-1 text-sm text-gray-700">
          {rows.map((r) => (
            <p key={r.label}><strong>{r.label}:</strong> {r.text}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-200 rounded-md shadow space-y-6">
      {/* meta */}
      <div className="flex justify-between text-sm text-gray-500 font-medium">
        <span>Subject: {subject}</span>
        {fitzpatrick && <span>Fitzpatrick: {fitzpatrick}</span>}
      </div>

      {/* image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="quiz visual"
          className="w-full h-auto max-h-72 object-contain border rounded"
        />
      )}

      {/* vignette */}
      <p className="text-lg text-gray-800 font-medium">{vignette}</p>

      {/* choices */}
      <div className="space-y-3">
        {options.map((option) => {
          const isCorrect = submitted && option === correctAnswer;
          const isWrong = submitted && selected === option && option !== correctAnswer;
          const isSelected = !submitted && selected === option;

          let classes =
            'w-full text-left px-4 py-2 rounded border shadow-sm text-sm transition focus:outline-none';
          if (!submitted) {
            classes += ' hover:bg-gray-50 border-gray-300';
            if (isSelected) classes += ' ring-2 ring-vdx-blue border-vdx-blue bg-white';
          } else {
            if (isCorrect) classes += ' bg-green-100 border-green-400 text-green-800';
            if (isWrong) classes += ' bg-red-100 border-red-400 text-red-800';
          }

          return (
            <button
              key={option}
              onClick={() => !submitted && setSelected(option)}
              className={classes}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* primary actions */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-4 inline-flex items-center rounded-2xl px-4 py-2 text-sm font-medium text-white bg-vdx-blue hover:brightness-95 disabled:opacity-60"
        >
          Submit Answer
        </button>
      ) : (
        // ANSWER VIEW: two-column layout with sticky right sidebar
        <div className="grid grid-cols-1 lg:[grid-template-columns:minmax(0,1fr)_420px] gap-6">
          <div className="space-y-4">
            {renderExplanation()}
            <button
              onClick={showNext}
              className="inline-flex items-center rounded-2xl px-4 py-2 text-sm font-medium text-white bg-vdx-blue hover:brightness-95"
            >
              Next Question
            </button>
          </div>

          {/* Right sidebar: shows only after submit. Stacks below on mobile. */}
          {skinToneNotes && (
            <aside className="lg:sticky lg:top-24 self-start">
              <SkinToneNotes
                notes={skinToneNotes}
                highlight={fitzpatrick}
                collapsed={false}
                title="Skin tone differences"
              />
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
