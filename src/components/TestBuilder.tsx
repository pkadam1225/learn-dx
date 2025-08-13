import { useState } from 'react';

export type Subject = 'Clinical' | 'Histopathology';
export type Fitzpatrick = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface TestConfig {
  count: number;
  subjects: Subject[];
  // Multi-select Fitzpatrick. An empty array means "All types".
  fitzpatricks: Fitzpatrick[];
}

const ALL_FITZ: Fitzpatrick[] = ['I', 'II', 'III', 'IV', 'V', 'VI'];

const TestBuilder = ({ onGenerate }: { onGenerate: (config: TestConfig) => void }) => {
  const [count, setCount] = useState(5);
  const [subjects, setSubjects] = useState<Subject[]>(['Clinical', 'Histopathology']);
  // Start as "All" by leaving this empty
  const [fitzpatricks, setFitzpatricks] = useState<Fitzpatrick[]>([]);

  const toggleSubject = (subject: Subject) => {
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const toggleFitz = (fp: Fitzpatrick) => {
    setFitzpatricks((prev) =>
      prev.includes(fp) ? prev.filter((f) => f !== fp) : [...prev, fp]
    );
  };

  const isAllSelected = fitzpatricks.length === 0 || fitzpatricks.length === ALL_FITZ.length;

  const handleSelectAllFitz = (checked: boolean) => {
    setFitzpatricks(checked ? [...ALL_FITZ] : []); // checked = explicitly all; unchecked = "All" via empty
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ count, subjects, fitzpatricks });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-md shadow">
      <h2 className="text-2xl font-semibold text-[#1E3A5F] mb-6">Create a New Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Count */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm w-24"
          />
        </div>

        {/* Subjects */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Subjects</label>
          <div className="flex gap-4">
            {(['Clinical', 'Histopathology'] as Subject[]).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={subjects.includes(s)}
                  onChange={() => toggleSubject(s)}
                  className="accent-vdx-blue"
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Fitzpatrick (multi-select) */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 mb-1">Fitzpatrick Types</label>
            <label className="text-xs flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                className="accent-vdx-blue"
                checked={isAllSelected}
                onChange={(e) => handleSelectAllFitz(e.target.checked)}
              />
              Select all
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            {ALL_FITZ.map((fp) => (
              <label key={fp} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-vdx-blue"
                  checked={isAllSelected ? true : fitzpatricks.includes(fp)}
                  onChange={() => toggleFitz(fp)}
                />
                {fp}
              </label>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Leave all unchecked to include <span className="font-medium">all</span> Fitzpatrick types.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-vdx-blue text-white px-4 py-2 text-sm rounded-2xl hover:brightness-95 transition"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
};

export default TestBuilder;
