import React, { useState } from "react";
import { Sparkles, Calculator, Percent, Divide, Variable, Triangle, Clock, BookOpen } from "lucide-react";
import { MathRenderer } from "../utils/mathRenderer";

interface SampleProblemsProps {
  onSelectProblem: (problemText: string) => void;
}

export const SampleProblems: React.FC<SampleProblemsProps> = ({ onSelectProblem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("equations");

  const categories = [
    { id: "equations", name: "Linear Equations", icon: Variable },
    { id: "fractions", name: "Fractions & Decimals", icon: Divide },
    { id: "pemdas", name: "Order of Operations (PEMDAS)", icon: Calculator },
    { id: "percentages", name: "Percentages & Ratios", icon: Percent },
    { id: "geometry", name: "Basic Geometry", icon: Triangle },
    { id: "word_problems", name: "Word Problems", icon: Clock },
  ];

  const problemLibrary: Record<string, Array<{ text: string; label: string; badge: string }>> = {
    equations: [
      { text: "3x + 7 = 22", label: "Two-step linear equation", badge: "Grade 6-7" },
      { text: "5x - 8 = 2x + 13", label: "Variables on both sides", badge: "Grade 7-8" },
      { text: "4(2x - 3) = 28", label: "Distributive property equation", badge: "Grade 7-8" },
      { text: "x/4 + 6 = 11", label: "Equation with fractions", badge: "Grade 6-7" },
      { text: "2x + 5 < 17", label: "One-variable linear inequality", badge: "Grade 7-8" },
    ],
    fractions: [
      { text: "3/4 + 2/5", label: "Adding fractions with unlike denominators", badge: "Grade 5-6" },
      { text: "5/6 - 1/4", label: "Subtracting fractions with LCD", badge: "Grade 5-6" },
      { text: "2 1/3 * 3/7", label: "Multiplying mixed numbers", badge: "Grade 6" },
      { text: "4/5 / (2/3)", label: "Dividing fractions (Keep-Change-Flip)", badge: "Grade 6" },
      { text: "0.75 + 3/8", label: "Converting decimals & fractions", badge: "Grade 6-7" },
    ],
    pemdas: [
      { text: "12 + 4 * (8 - 3)^2 / 5", label: "Full PEMDAS order of operations", badge: "Grade 6-7" },
      { text: "50 - 3 * (4 + 6) + 2^3", label: "Parentheses & exponents first", badge: "Grade 6-7" },
      { text: "(15 - 3) / 4 + 7 * 2", label: "Grouping symbols & operations", badge: "Grade 5-6" },
      { text: "100 / 5 * 2 + (18 - 6)", label: "Left-to-right multiplication/division rule", badge: "Grade 6" },
    ],
    percentages: [
      { text: "What is 35% of 180?", label: "Finding percentage of a quantity", badge: "Grade 6-7" },
      { text: "A $80 jacket is on 25% discount. What is the final sale price with 8% tax?", label: "Discounts and sales tax", badge: "Grade 7-8" },
      { text: "If 15 out of 60 students wear glasses, what percentage is that?", label: "Part-to-whole percentage", badge: "Grade 6-7" },
      { text: "Simplify the ratio 24 : 36 and find x if 24/36 = x/12", label: "Proportions & ratios", badge: "Grade 6-7" },
    ],
    geometry: [
      { text: "Find the area and perimeter of a rectangle with length = 14 cm and width = 9 cm", label: "Rectangle Area & Perimeter", badge: "Grade 5-7" },
      { text: "Find the area of a triangle with base = 12 meters and height = 7 meters", label: "Triangle Area (1/2 * b * h)", badge: "Grade 6-7" },
      { text: "Find the circumference and area of a circle with radius = 5 cm (use pi = 3.14)", label: "Circle Area & Circumference", badge: "Grade 7" },
      { text: "In a right triangle with legs a = 6 and b = 8, find the hypotenuse c", label: "Pythagorean Theorem", badge: "Grade 8" },
    ],
    word_problems: [
      { text: "Maya has 45 stickers. She gives 1/3 of them to Leo and 40% of the remainder to Sam. How many stickers does Maya have left?", label: "Multi-step fractions & percentages", badge: "Grade 6-7" },
      { text: "A car travels 180 miles in 3 hours at constant speed. How far will it travel in 5.5 hours?", label: "Speed, distance & time rate", badge: "Grade 6-7" },
      { text: "Liam is 4 years older than twice his sister's age. If the sum of their ages is 28, how old is Liam?", label: "Algebraic word problem (Ages)", badge: "Grade 7-8" },
      { text: "A pizza is cut into 12 equal slices. If Alex eats 3 slices and Emma eats 4 slices, what fraction of the pizza is remaining in simplest form?", label: "Real-world fraction division", badge: "Grade 5-6" },
    ],
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Try Example Student Problems
            </h3>
            <p className="text-xs text-slate-500">Pick any classic curriculum topic to see a step-by-step breakdown</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Problems in Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {problemLibrary[selectedCategory]?.map((prob, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectProblem(prob.text)}
            className="group p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:shadow-md text-left transition-all space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {prob.badge}
                </span>
                <Sparkles className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
              <div className="font-mono text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2">
                <MathRenderer text={prob.text} />
              </div>
            </div>

            <span className="text-[11px] text-slate-500 group-hover:text-slate-700">
              {prob.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
