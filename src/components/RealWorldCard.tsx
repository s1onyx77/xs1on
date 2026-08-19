import React from "react";
import { Sparkles, Compass, AlertOctagon, BookmarkCheck } from "lucide-react";
import { MathRenderer } from "../utils/mathRenderer";

interface RealWorldCardProps {
  realWorldAnalogy: string;
  conceptSummary: string;
  commonMistakes?: string[];
  keyFormulaOrRule?: string;
}

export const RealWorldCard: React.FC<RealWorldCardProps> = ({
  realWorldAnalogy,
  conceptSummary,
  commonMistakes = [],
  keyFormulaOrRule,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Real-World Analogy */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-orange-50/30 border border-amber-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Real-World Connection & Analogy
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-amber-100/80">
          <MathRenderer text={realWorldAnalogy} />
        </p>

        {keyFormulaOrRule && (
          <div className="text-xs bg-amber-100/70 text-amber-900 font-semibold px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
            Key Rule: <span className="font-mono">{keyFormulaOrRule}</span>
          </div>
        )}
      </div>

      {/* Concept Takeaways & Pitfalls */}
      <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-50/50 to-purple-50/30 border border-indigo-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Core Takeaway & Common Traps
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-indigo-100/80">
          <MathRenderer text={conceptSummary} />
        </p>

        {commonMistakes && commonMistakes.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" /> Watch out for these common student mistakes:
            </div>
            <ul className="space-y-1 text-xs text-slate-600">
              {commonMistakes.map((m, idx) => (
                <li key={idx} className="flex items-start gap-1.5 bg-rose-50/70 text-rose-950 px-2.5 py-1 rounded-lg border border-rose-100">
                  <span className="text-rose-500 font-bold">•</span>
                  <span><MathRenderer text={m} /></span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
