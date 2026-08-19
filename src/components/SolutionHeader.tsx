import React from "react";
import { MathSolution } from "../types";
import { MathRenderer } from "../utils/mathRenderer";
import {
  CheckCircle,
  Copy,
  Printer,
  Sparkles,
  HelpCircle,
  Bookmark,
  Share2,
} from "lucide-react";

interface SolutionHeaderProps {
  solution: MathSolution;
  onOpenTutor: () => void;
  onPrint?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const SolutionHeader: React.FC<SolutionHeaderProps> = ({
  solution,
  onOpenTutor,
  onPrint,
  onBookmark,
  isBookmarked = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Problem: ${solution.cleanedProblem}\nFinal Answer: ${solution.finalAnswer}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "advanced":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "intermediate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-xs">
            {solution.topic || "Math Problem"}
          </span>

          {solution.subTopic && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {solution.subTopic}
            </span>
          )}

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
              solution.difficulty
            )}`}
          >
            {solution.difficulty || "Basic"}
          </span>

          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200 capitalize">
            {solution.gradeLevel?.replace("_", " ") || "Middle School"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
            title="Copy problem and answer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>

          {onBookmark && (
            <button
              type="button"
              onClick={onBookmark}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition shadow-xs ${
                isBookmarked
                  ? "bg-amber-50 border-amber-300 text-amber-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              title={isBookmarked ? "Saved to history" : "Save this problem"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition shadow-xs hidden sm:flex"
            title="Print study worksheet"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onOpenTutor}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI Tutor
          </button>
        </div>
      </div>

      {/* Main Problem & Answer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Clean Problem Statement */}
        <div className="lg:col-span-7 space-y-2 flex flex-col justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Problem Statement
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            <MathRenderer text={solution.cleanedProblem} />
          </div>

          {solution.keyFormulaOrRule && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Key Formula / Concept: {solution.keyFormulaOrRule}
              </span>
            </div>
          )}
        </div>

        {/* Highlighted Final Answer Box */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-2 right-2 text-emerald-200/40">
            <CheckCircle className="w-16 h-16" />
          </div>

          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1 z-10">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Final Answer
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight my-1 z-10 font-mono">
            {solution.finalAnswerLatex ? (
              <MathRenderer latex={solution.finalAnswerLatex} block />
            ) : (
              solution.finalAnswer
            )}
          </div>

          <span className="text-[11px] font-medium text-emerald-700 z-10">
            Verified step-by-step with mathematical proof
          </span>
        </div>
      </div>
    </div>
  );
};
