import React, { useState } from "react";
import { Delete, CornerDownLeft, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface MathKeypadProps {
  onInsert: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEnter?: () => void;
}

export const MathKeypad: React.FC<MathKeypadProps> = ({
  onInsert,
  onClear,
  onBackspace,
  onEnter,
}) => {
  const [activeTab, setActiveTab] = useState<"basic" | "algebra" | "fractions" | "geometry">("basic");
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const basicKeys = [
    { label: "+", val: " + ", category: "op" },
    { label: "-", val: " - ", category: "op" },
    { label: "×", val: " * ", category: "op" },
    { label: "÷", val: " / ", category: "op" },
    { label: "=", val: " = ", category: "op" },
    { label: "(", val: "(", category: "sym" },
    { label: ")", val: ")", category: "sym" },
    { label: "%", val: "%", category: "sym" },
    { label: "x²", val: "^2", category: "power" },
    { label: "xⁿ", val: "^", category: "power" },
    { label: "√x", val: "sqrt(", category: "func" },
    { label: "π", val: "pi", category: "sym" },
    { label: "x", val: "x", category: "var" },
    { label: "y", val: "y", category: "var" },
    { label: "z", val: "z", category: "var" },
    { label: "±", val: "±", category: "sym" },
  ];

  const algebraKeys = [
    { label: "2x", val: "2x", category: "var" },
    { label: "3x", val: "3x", category: "var" },
    { label: "x + y", val: "x + y", category: "var" },
    { label: "x² + 2x", val: "x^2 + 2x", category: "power" },
    { label: "≤", val: " <= ", category: "comp" },
    { label: "≥", val: " >= ", category: "comp" },
    { label: "<", val: " < ", category: "comp" },
    { label: ">", val: " > ", category: "comp" },
    { label: "≠", val: " != ", category: "comp" },
    { label: "|x|", val: "abs(", category: "func" },
    { label: "f(x)", val: "f(x) = ", category: "func" },
    { label: "x³", val: "^3", category: "power" },
  ];

  const fractionKeys = [
    { label: "½", val: "1/2", category: "frac" },
    { label: "⅓", val: "1/3", category: "frac" },
    { label: "⅔", val: "2/3", category: "frac" },
    { label: "¼", val: "1/4", category: "frac" },
    { label: "¾", val: "3/4", category: "frac" },
    { label: "⅕", val: "1/5", category: "frac" },
    { label: "a/b", val: "/", category: "frac" },
    { label: "+ a/b", val: " + 1/2", category: "frac" },
    { label: "Mixed 2 ½", val: "2 1/2", category: "frac" },
    { label: "Common Denom", val: "Find LCD of ", category: "func" },
  ];

  const geometryKeys = [
    { label: "Area Rect", val: "Area of rectangle with length=8, width=5", category: "geom" },
    { label: "Area Triangle", val: "Area of triangle with base=10, height=6", category: "geom" },
    { label: "Area Circle", val: "Area of circle with radius=7", category: "geom" },
    { label: "Perimeter", val: "Perimeter of rectangle width=4, length=9", category: "geom" },
    { label: "Pythagorean", val: "a^2 + b^2 = c^2, a=3, b=4, find c", category: "geom" },
    { label: "Circumference", val: "Circumference of circle radius=5", category: "geom" },
  ];

  const getKeysForTab = () => {
    switch (activeTab) {
      case "algebra":
        return algebraKeys;
      case "fractions":
        return fractionKeys;
      case "geometry":
        return geometryKeys;
      default:
        return basicKeys;
    }
  };

  return (
    <div className="w-full bg-slate-900/95 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur transition-all">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 px-2 py-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Math Keypad
          </span>
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === "basic"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Basic & Ops
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("algebra")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === "algebra"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Algebra
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fractions")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === "fractions"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Fractions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("geometry")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTab === "geometry"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Geometry Formulas
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClear}
            className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title={isExpanded ? "Collapse Keypad" : "Expand Keypad"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Keys Grid */}
      {isExpanded && (
        <div className="p-3">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {getKeysForTab().map((k, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onInsert(k.val)}
                className="py-2 px-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white border border-slate-700/60 active:scale-95 text-sm font-semibold tracking-wide font-mono transition-all text-slate-100 flex items-center justify-center min-h-[40px] shadow-sm hover:shadow-indigo-500/20"
              >
                {k.label}
              </button>
            ))}

            {/* Quick Action controls */}
            <button
              type="button"
              onClick={onBackspace}
              className="py-2 px-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-800/80 border border-amber-800/50 text-amber-300 font-semibold transition flex items-center justify-center min-h-[40px]"
              title="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
            {onEnter && (
              <button
                type="button"
                onClick={onEnter}
                className="py-2 px-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition flex items-center justify-center min-h-[40px] shadow-md shadow-emerald-950"
                title="Solve Now"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
