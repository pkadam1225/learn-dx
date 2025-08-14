import React, { useEffect } from "react";
import SkinToneNotes from "./SkinToneNotes";
import type { SkinToneNotes as SkinToneNotesType } from "./SkinToneNotes";

type Fitz = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

type Props = {
  open: boolean;
  onClose: () => void;
  notes?: SkinToneNotesType;
  highlight?: Fitz;
};

export default function SkinToneDrawer({ open, onClose, notes, highlight }: Props) {
  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!notes) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      {/* Panel */}
      <aside
        aria-label="Skin tone differences"
        className={`fixed right-0 top-0 z-50 h-full w-full sm:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-base font-semibold text-slate-800">Skin tone differences</h2>
            <button
              onClick={onClose}
              className="rounded-xl px-2 py-1 text-sm border border-slate-200 hover:bg-slate-50"
            >
              Close
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-4">
            {/* Always expanded inside the drawer */}
            <SkinToneNotes notes={notes} highlight={highlight} collapsed={false} />
          </div>
        </div>
      </aside>
    </>
  );
}