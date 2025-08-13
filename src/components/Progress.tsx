// Progress.tsx
import React from 'react';
import Button from './Button';

interface ProgressScreenProps {
  correct: number;
  total: number;
  onStartQuiz: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  correct,
  total,
  onStartQuiz,
}) => {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="bg-[#1A1F2E] p-8 rounded-3xl shadow-xl text-center space-y-6 border border-gray-700 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-400">Welcome to the Dermatology Quiz</h1>

      <p className="text-lg text-gray-300">
        Test your knowledge using clinical and histopathology images across all skin types.
      </p>

      <div className="space-y-2">
        <p className="text-lg">
          <span className="font-semibold text-blue-300">Questions Answered:</span> {total}
        </p>
        <p className="text-lg">
          <span className="font-semibold text-blue-300">Correct Answers:</span> {correct}
        </p>
        <p className="text-lg">
          <span className="font-semibold text-blue-300">Accuracy:</span> {percentage}%
        </p>
      </div>

      <Button onClick={onStartQuiz}>Start Quiz</Button>
    </div>
  );
};

