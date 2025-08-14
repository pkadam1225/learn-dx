import React, { useState } from "react";

export type Fitzpatrick = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export type SkinToneNotes = {
  general?: string; // one-line overview across tones
  variants?: Partial<Record<Fitzpatrick, string>>; // per-tone specifics
  pearls?: string[];   // teaching points
  pitfalls?: string[]; // common misses/bias traps
};

type Props = {
  notes?: SkinToneNotes;
  highlight?: Fitzpatrick;     // e.g., the current case’s Fitzpatrick to accent
  collapsed?: boolean;          // default collapsed (for question view)
  title?: string;               // default header text
};

export default function SkinToneNotes({
  notes,
  highlight,
  collapsed = true,
  title = "Skin tone differences",
}: Props) {
  const [open, setOpen] = useState(!collapsed);
  if (!notes) return null;

  const { general, variants, pearls, pitfalls } = notes;
  const hasContent =
    !!general ||
    (variants && Object.values(variants).some(Boolean)) ||
    (pearls && pearls.length) ||
    (pitfalls && pitfalls.length);

  if (!hasContent) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-slate-50 text-slate-800 rounded-t-2xl"
        aria-expanded={open}
        >
        <span className="font-semibold text-slate-800">{title}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M5.8 7.4a1 1 0 0 1 1.4 0L10 10.2l2.8-2.8a1 1 0 1 1 1.4 1.4l-3.5 3.5a1 1 0 0 1-1.4 0L5.8 8.8a1 1 0 0 1 0-1.4z" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 text-slate-700">
          {general && <p className="text-sm">{general}</p>}

          {variants &&
            (Object.entries(variants) as Array<[Fitzpatrick, string | undefined]>)
              .filter(([, v]) => !!v)
              .map(([ftz, text]) => (
                <div
                  key={ftz}
                  className={`rounded-xl p-3 border ${
                    highlight === ftz
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
                    Fitzpatrick {ftz}
                  </div>
                  <div className="text-sm">{text}</div>
                </div>
              ))}

          {pearls && pearls.length > 0 && (
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
                Pearls
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {pearls.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {pitfalls && pitfalls.length > 0 && (
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
                Pitfalls
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {pitfalls.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}