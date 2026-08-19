import React, { useState } from "react";
import { BookOpen, Sparkles, Variable, Divide, Calculator, Percent, Triangle, ShieldCheck } from "lucide-react";
import { MathRenderer } from "../utils/mathRenderer";

interface FormulaReferenceProps {
  onSelectExample: (problem: string) => void;
}

export const FormulaReference: React.FC<FormulaReferenceProps> = ({ onSelectExample }) => {
  const [activeCategory, setActiveCategory] = useState<
    "pemdas" | "fractions" | "equations" | "integers" | "geometry" | "percentages"
  >("pemdas");

  const categories = [
    { id: "pemdas", label: "Order of Operations", icon: Calculator },
    { id: "fractions", label: "Fraction Rules", icon: Divide },
    { id: "equations", label: "Equation Golden Rules", icon: Variable },
    { id: "integers", label: "Negative Sign Rules", icon: ShieldCheck },
    { id: "geometry", label: "Geometry Formulas", icon: Triangle },
    { id: "percentages", label: "Percentage Shortcuts", icon: Percent },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Student Math Rules & Formula Guide
            </h3>
            <p className="text-xs text-slate-500">Quick visual reference for core concepts, rules & shortcuts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="pt-1">
        {activeCategory === "pemdas" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5 text-center">
                <span className="text-xl font-extrabold text-indigo-600 block">P</span>
                <span className="font-bold text-xs text-slate-800 block mt-0.5">Parentheses & Brackets</span>
                <span className="text-[11px] text-slate-500 block mt-1">$(...)$, $[...]$, $|...|$ first</span>
              </div>

              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3.5 text-center">
                <span className="text-xl font-extrabold text-purple-600 block">E</span>
                <span className="font-bold text-xs text-slate-800 block mt-0.5">Exponents & Roots</span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  <MathRenderer text="$x^2$, $x^3$, $\sqrt{x}$ second" />
                </span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-center">
                <span className="text-xl font-extrabold text-amber-600 block">MD</span>
                <span className="font-bold text-xs text-slate-800 block mt-0.5">Multiply & Divide</span>
                <span className="text-[11px] text-slate-500 block mt-1">Left to right as they appear</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-center">
                <span className="text-xl font-extrabold text-emerald-600 block">AS</span>
                <span className="font-bold text-xs text-slate-800 block mt-0.5">Add & Subtract</span>
                <span className="text-[11px] text-slate-500 block mt-1">Left to right at the very end</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Important Rule:</span> Multiplication does <em>not</em> always come before division! Always solve them <strong>from left to right</strong>.
              </div>
              <button
                type="button"
                onClick={() => onSelectExample("12 + 4 * (8 - 3)^2 / 5")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Solve PEMDAS Example
              </button>
            </div>
          </div>
        )}

        {activeCategory === "fractions" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase tracking-wider">Adding / Subtracting</h4>
                <p className="text-xs text-slate-600">Must have a common denominator (LCD)!</p>
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-xs font-mono text-center">
                  <MathRenderer latex="\frac{a}{c} + \frac{b}{c} = \frac{a+b}{c}" block />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase tracking-wider">Multiplying</h4>
                <p className="text-xs text-slate-600">Multiply straight across numerator & denominator!</p>
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-xs font-mono text-center">
                  <MathRenderer latex="\frac{a}{b} \times \frac{c}{d} = \frac{a \cdot c}{b \cdot d}" block />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase tracking-wider">Dividing (Keep-Change-Flip)</h4>
                <p className="text-xs text-slate-600">Keep 1st fraction, change ÷ to ×, flip 2nd fraction!</p>
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-xs font-mono text-center">
                  <MathRenderer latex="\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c}" block />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Pro Tip:</span> Always simplify fractions by dividing both numbers by their Greatest Common Factor (GCF).
              </span>
              <button
                type="button"
                onClick={() => onSelectExample("3/4 + 2/5")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Solve Fraction Example
              </button>
            </div>
          </div>
        )}

        {activeCategory === "equations" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase tracking-wider">The Golden Balance Rule</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Whatever operation you do to the left side of the equals sign ($=$), you <strong>MUST</strong> perform the exact same operation to the right side!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase tracking-wider">Inverse Operations</h4>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>• Addition is undone by <strong>Subtraction</strong></li>
                  <li>• Subtraction is undone by <strong>Addition</strong></li>
                  <li>• Multiplication is undone by <strong>Division</strong></li>
                  <li>• Squaring is undone by <strong>Square Root</strong> (<MathRenderer text="$\sqrt{x}$" />)</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Two-Step Strategy:</span> First undo addition/subtraction, then undo multiplication/division to isolate $x$.
              </span>
              <button
                type="button"
                onClick={() => onSelectExample("3x + 7 = 22")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Solve Equation Example
              </button>
            </div>
          </div>
        )}

        {activeCategory === "integers" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-center">
                <div className="text-xs font-bold text-indigo-700 uppercase">Same Signs (Multiply / Divide)</div>
                <div className="text-sm font-mono font-bold text-emerald-700 py-1">$(+) \times (+) = (+)$</div>
                <div className="text-sm font-mono font-bold text-emerald-700">$(–) \times (–) = (+)$</div>
                <p className="text-[11px] text-slate-500 mt-1">Two negatives make a positive!</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-center">
                <div className="text-xs font-bold text-indigo-700 uppercase">Different Signs (Multiply / Divide)</div>
                <div className="text-sm font-mono font-bold text-rose-700 py-1">$(+) \times (–) = (–)$</div>
                <div className="text-sm font-mono font-bold text-rose-700">$(–) \times (+) = (–)$</div>
                <p className="text-[11px] text-slate-500 mt-1">Mixed signs always yield negative!</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-center">
                <div className="text-xs font-bold text-indigo-700 uppercase">Subtracting a Negative</div>
                <div className="text-sm font-mono font-bold text-indigo-700 py-1">$a - (-b) = a + b$</div>
                <p className="text-[11px] text-slate-500 mt-1">Subtracting a negative is adding!</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Thermometer Analogy:</span> Adding a negative makes it colder (moves left on number line). Subtracting negative removes cold (makes it warmer, moves right).
              </span>
              <button
                type="button"
                onClick={() => onSelectExample("-15 - (-8) * (-3)")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Solve Integers Example
              </button>
            </div>
          </div>
        )}

        {activeCategory === "geometry" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase">Triangle</h4>
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-xs font-mono text-center">
                  <MathRenderer latex="\text{Area} = \frac{1}{2} \cdot b \cdot h" block />
                </div>
                <p className="text-[11px] text-slate-500">Perimeter = $a + b + c$</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase">Rectangle</h4>
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-xs font-mono text-center">
                  <MathRenderer latex="\text{Area} = l \times w" block />
                </div>
                <p className="text-[11px] text-slate-500">Perimeter = $2(l + w)$</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-indigo-700 uppercase">Circle</h4>
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-xs font-mono text-center">
                  <MathRenderer latex="\text{Area} = \pi r^2" block />
                </div>
                <p className="text-[11px] text-slate-500">Circumference = $2\pi r = \pi d$</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Right Triangles (Pythagorean Theorem):</span> $a^2 + b^2 = c^2$, where $c$ is the hypotenuse opposite the 90° angle.
              </span>
              <button
                type="button"
                onClick={() => onSelectExample("Find the area of a triangle with base = 12 meters and height = 7 meters")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Solve Geometry Example
              </button>
            </div>
          </div>
        )}

        {activeCategory === "percentages" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <div className="text-base font-bold text-indigo-600">10%</div>
                <div className="text-xs text-slate-500 mt-0.5">Move decimal 1 place left ($÷10$)</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <div className="text-base font-bold text-indigo-600">25%</div>
                <div className="text-xs text-slate-500 mt-0.5">Quarter ($÷4$ or $\times 0.25$)</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <div className="text-base font-bold text-indigo-600">50%</div>
                <div className="text-xs text-slate-500 mt-0.5">Half ($÷2$ or $\times 0.50$)</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <div className="text-base font-bold text-indigo-600">75%</div>
                <div className="text-xs text-slate-500 mt-0.5">Three quarters ($3/4 \times$)</div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Discount Formula:</span>{" "}
                <MathRenderer text="$\text{Discount Amount} = \text{Original Price} \times \text{Discount Rate}$. $\text{Sale Price} = \text{Original Price} - \text{Discount Amount}$." />
              </span>
              <button
                type="button"
                onClick={() => onSelectExample("A $80 jacket is on 25% discount. What is the final sale price with 8% tax?")}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Solve Percentage Example
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
