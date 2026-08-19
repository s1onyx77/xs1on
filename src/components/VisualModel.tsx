import React from "react";
import { VisualModelData } from "../types";
import { Scale, PieChart, GitCommit, Triangle } from "lucide-react";
import { MathRenderer } from "../utils/mathRenderer";

interface VisualModelProps {
  model?: VisualModelData;
  topic?: string;
}

export const VisualModel: React.FC<VisualModelProps> = ({ model, topic = "" }) => {
  if (!model || model.type === "none") return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 rounded-2xl border border-indigo-100 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
            {model.type === "balance_scale" && <Scale className="w-5 h-5" />}
            {model.type === "fraction_bars" && <PieChart className="w-5 h-5" />}
            {model.type === "number_line" && <GitCommit className="w-5 h-5" />}
            {model.type === "geometric_shape" && <Triangle className="w-5 h-5" />}
            {model.type === "step_flow" && <GitCommit className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {model.title || "Visual Concept Model"}
            </h3>
            <p className="text-xs text-slate-500">Interactive visual representation for intuitive understanding</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100/80 text-indigo-700 uppercase tracking-wider">
          Visual Aid
        </span>
      </div>

      {model.description && (
        <p className="text-sm text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-indigo-50">
          {model.description}
        </p>
      )}

      {/* Render model by type */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 min-h-[160px] flex items-center justify-center">
        {model.type === "balance_scale" && (
          <BalanceScaleView
            leftSide={model.data?.leftSide || "Left Expression"}
            rightSide={model.data?.rightSide || "Right Value"}
          />
        )}

        {model.type === "fraction_bars" && (
          <FractionBarsView fractions={model.data?.fractions || []} />
        )}

        {model.type === "number_line" && (
          <NumberLineView
            min={model.data?.min ?? -5}
            max={model.data?.max ?? 10}
            points={model.data?.points || []}
          />
        )}

        {model.type === "geometric_shape" && (
          <GeometricShapeView
            shape={model.data?.shape || "triangle"}
            formula={model.data?.formula}
          />
        )}

        {model.type === "step_flow" && (
          <StepFlowView title={model.title} />
        )}
      </div>
    </div>
  );
};

// 1. Balance Scale Component
const BalanceScaleView: React.FC<{ leftSide: string; rightSide: string }> = ({
  leftSide,
  rightSide,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto py-2 flex flex-col items-center select-none">
      <div className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Equation Balance: Both pans must stay equal at every step!
      </div>

      {/* SVG Balance Scale */}
      <div className="relative w-full h-[140px]">
        <svg viewBox="0 0 400 140" className="w-full h-full">
          {/* Base & Post */}
          <path d="M 180 135 L 220 135 L 205 70 L 195 70 Z" fill="#475569" />
          <circle cx="200" cy="50" r="10" fill="#6366f1" />
          <line x1="200" y1="50" x2="200" y2="135" stroke="#475569" strokeWidth="6" />

          {/* Balance Beam */}
          <line x1="50" y1="50" x2="350" y2="50" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" />

          {/* Left Pan Strings */}
          <line x1="50" y1="50" x2="25" y2="105" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="50" y1="50" x2="75" y2="105" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          {/* Left Pan Base */}
          <path d="M 15 105 Q 50 115 85 105 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />

          {/* Right Pan Strings */}
          <line x1="350" y1="50" x2="325" y2="105" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="350" y1="50" x2="375" y2="105" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          {/* Right Pan Base */}
          <path d="M 315 105 Q 350 115 385 105 Z" fill="#34d399" stroke="#059669" strokeWidth="2" />

          {/* Center Equals Sign */}
          <circle cx="200" cy="50" r="16" fill="#4338ca" />
          <text x="200" y="55" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
            =
          </text>
        </svg>

        {/* Overlay Labels */}
        <div className="absolute left-[3%] bottom-[35px] w-[110px] text-center bg-sky-100 text-sky-950 px-2 py-1 rounded-lg border border-sky-300 shadow-sm text-xs font-bold truncate">
          <MathRenderer text={leftSide} />
        </div>

        <div className="absolute right-[3%] bottom-[35px] w-[110px] text-center bg-emerald-100 text-emerald-950 px-2 py-1 rounded-lg border border-emerald-300 shadow-sm text-xs font-bold truncate">
          <MathRenderer text={rightSide} />
        </div>
      </div>
    </div>
  );
};

// 2. Fraction Bars View
const FractionBarsView: React.FC<{
  fractions: Array<{ numerator: number; denominator: number; label?: string }>;
}> = ({ fractions }) => {
  const sampleFractions =
    fractions.length > 0
      ? fractions
      : [
          { numerator: 1, denominator: 2, label: "1/2" },
          { numerator: 1, denominator: 3, label: "1/3" },
          { numerator: 5, denominator: 6, label: "Sum = 5/6" },
        ];

  return (
    <div className="w-full space-y-4 py-2">
      <div className="text-xs font-semibold text-slate-500 mb-2">
        Visualizing parts of a whole (Fraction Bars):
      </div>

      {sampleFractions.map((frac, idx) => {
        const num = Math.min(Math.max(frac.numerator || 1, 0), frac.denominator || 1);
        const den = Math.max(frac.denominator || 1, 1);
        const percentage = (num / den) * 100;

        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">
                {frac.label || `${num}/${den}`}
              </span>
              <span className="text-slate-400 font-mono">
                {num} of {den} parts ({percentage.toFixed(1)}%)
              </span>
            </div>

            <div className="flex w-full h-8 bg-slate-100 rounded-lg overflow-hidden border border-slate-300">
              {Array.from({ length: den }).map((_, partIdx) => (
                <div
                  key={partIdx}
                  className={`flex-1 border-r last:border-r-0 border-white/60 flex items-center justify-center text-[10px] font-bold transition-all ${
                    partIdx < num
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {partIdx < num ? "1/" + den : ""}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 3. Number Line View
const NumberLineView: React.FC<{
  min: number;
  max: number;
  points: Array<{ value: number; label: string }>;
}> = ({ min = -5, max = 10, points = [] }) => {
  const range = max - min || 15;
  const tickCount = Math.min(range + 1, 16);
  const step = Math.max(1, Math.round(range / (tickCount - 1)));

  return (
    <div className="w-full py-4 space-y-4">
      <div className="text-xs font-semibold text-slate-500">
        Interactive Number Line Representation:
      </div>

      <div className="relative w-full h-20 px-6 flex items-center">
        {/* Main Line */}
        <div className="w-full h-1 bg-slate-400 rounded-full relative">
          {/* Arrows on ends */}
          <div className="absolute -left-2 -top-1.5 text-slate-400 text-xs">◀</div>
          <div className="absolute -right-2 -top-1.5 text-slate-400 text-xs">▶</div>

          {/* Ticks */}
          {Array.from({ length: tickCount }).map((_, i) => {
            const val = min + i * step;
            if (val > max) return null;
            const percent = ((val - min) / range) * 100;

            return (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${percent}%` }}
              >
                <div className={`w-0.5 ${val === 0 ? "h-5 bg-indigo-700" : "h-3 bg-slate-400"}`} />
                <span
                  className={`text-[10px] mt-1 font-mono ${
                    val === 0 ? "font-bold text-indigo-700 text-xs" : "text-slate-500"
                  }`}
                >
                  {val}
                </span>
              </div>
            );
          })}

          {/* Points / markers */}
          {points.map((p, idx) => {
            const percent = Math.min(Math.max(((p.value - min) / range) * 100, 0), 100);
            return (
              <div
                key={idx}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                style={{ left: `${percent}%` }}
              >
                {/* Pin badge */}
                <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md -mt-8 whitespace-nowrap">
                  {p.label || `x = ${p.value}`}
                </div>
                <div className="w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-white shadow animate-bounce" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 4. Geometric Shape View
const GeometricShapeView: React.FC<{ shape: string; formula?: string }> = ({
  shape,
  formula,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-2 space-y-3">
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 160 120" className="w-36 h-28">
          {shape.toLowerCase().includes("circle") ? (
            <g>
              <circle cx="80" cy="60" r="45" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" />
              <line x1="80" y1="60" x2="125" y2="60" stroke="#4338ca" strokeWidth="2" strokeDasharray="3 3" />
              <text x="100" y="55" fontSize="10" fill="#4338ca" fontWeight="bold">r</text>
            </g>
          ) : shape.toLowerCase().includes("triangle") ? (
            <g>
              <polygon points="80,15 140,105 20,105" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" />
              <line x1="80" y1="15" x2="80" y2="105" stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2" />
              <text x="85" y="65" fontSize="10" fill="#ef4444" fontWeight="bold">h</text>
              <text x="80" y="117" fontSize="10" fill="#4338ca" fontWeight="bold" textAnchor="middle">base</text>
            </g>
          ) : (
            <g>
              <rect x="25" y="25" width="110" height="70" rx="4" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" />
              <text x="80" y="112" fontSize="10" fill="#4338ca" fontWeight="bold" textAnchor="middle">length</text>
              <text x="15" y="65" fontSize="10" fill="#4338ca" fontWeight="bold" textAnchor="middle">width</text>
            </g>
          )}
        </svg>

        <div className="space-y-1.5 text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Geometric Properties
          </div>
          <div className="text-sm font-bold text-slate-800 capitalize">
            {shape || "Geometric Figure"}
          </div>
          {formula && (
            <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-mono text-indigo-900">
              <MathRenderer text={formula} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Step Flow View
const StepFlowView: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <div className="text-center py-4">
      <p className="text-xs text-slate-500 font-medium">
        {title || "Logical progression map applied directly to each step below."}
      </p>
    </div>
  );
};
