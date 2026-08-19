import React from "react";
import { MathSolution } from "../types";
import { MathRenderer } from "../utils/mathRenderer";
import { X, Clock, Trash2, ChevronRight, BookOpen } from "lucide-react";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: MathSolution[];
  onSelectSolution: (solution: MathSolution) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectSolution,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-[380px] bg-white border-r border-slate-200 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm text-slate-100">Saved Problem History</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* History Items List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto stroke-1 text-slate-300" />
            <p className="text-sm font-medium">No solved problems yet</p>
            <p className="text-xs text-slate-400">Solve any equation to save it here for fast review!</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectSolution(item);
                onClose();
              }}
              className="p-3.5 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-2xl cursor-pointer transition shadow-xs space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {item.topic || "Math"}
                </span>
                <span className="text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="font-mono text-xs font-semibold text-slate-900 line-clamp-2">
                <MathRenderer text={item.cleanedProblem} />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-emerald-700 font-bold font-mono">
                  Ans: {item.finalAnswer}
                </span>
                <span className="text-indigo-600 group-hover:translate-x-0.5 transition flex items-center gap-0.5 text-[11px] font-semibold">
                  Review <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {history.length > 0 && (
        <div className="p-3 border-t border-slate-200 bg-white">
          <button
            type="button"
            onClick={onClearHistory}
            className="w-full py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};
