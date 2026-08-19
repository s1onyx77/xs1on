import React, { useState } from "react";
import { PracticeProblem } from "../types";
import { MathRenderer } from "../utils/mathRenderer";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Eye,
  RefreshCw,
  Trophy,
} from "lucide-react";

interface PracticeModeProps {
  problems: PracticeProblem[];
  topic: string;
  onGenerateMore?: () => void;
  isGeneratingMore?: boolean;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  problems,
  topic,
  onGenerateMore,
  isGeneratingMore,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(0);

  if (!problems || problems.length === 0) return null;

  const handleSelectOption = (problemId: string, option: string) => {
    if (submitted[problemId]) return; // already submitted
    setSelectedAnswers((prev) => ({ ...prev, [problemId]: option }));
  };

  const handleCheckAnswer = (problem: PracticeProblem) => {
    const selected = selectedAnswers[problem.id];
    if (!selected) return;

    setSubmitted((prev) => ({ ...prev, [problem.id]: true }));

    // Normalize for comparison
    const isCorrect =
      selected.trim().toLowerCase() === problem.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setScore((prev) => prev + 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }
  };

  const toggleHint = (problemId: string) => {
    setShowHints((prev) => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const toggleSolution = (problemId: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-amber-200">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              Reinforce Learning: Practice Problems
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {topic}
              </span>
            </h2>
            <p className="text-xs text-slate-500">Test your mastery with instant feedback and hints</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {score > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {score} / {problems.length} Correct
            </div>
          )}

          {onGenerateMore && (
            <button
              type="button"
              disabled={isGeneratingMore}
              onClick={onGenerateMore}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingMore ? "animate-spin" : ""}`} />
              Generate More Problems
            </button>
          )}
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-6">
        {problems.map((prob, index) => {
          const userAns = selectedAnswers[prob.id];
          const isDone = submitted[prob.id];
          const isCorrect =
            userAns && userAns.trim().toLowerCase() === prob.correctAnswer.trim().toLowerCase();

          return (
            <div
              key={prob.id || index}
              className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800">
                  Problem #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => toggleHint(prob.id)}
                  className="text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  {showHints[prob.id] ? "Hide Hint" : "Need a Hint?"}
                </button>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                <MathRenderer text={prob.question} />
                {prob.mathExpression && (
                  <div className="mt-2 text-center bg-white p-3 rounded-xl border border-slate-200">
                    <MathRenderer latex={prob.mathExpression} block />
                  </div>
                )}
              </div>

              {/* Hint Callout */}
              {showHints[prob.id] && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">Hint: </span>
                    <MathRenderer text={prob.hint} />
                  </div>
                </div>
              )}

              {/* Options or Answer Input */}
              {prob.options && prob.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {prob.options.map((opt, optIdx) => {
                    const isSelected = userAns === opt;
                    const isOptionCorrect =
                      opt.trim().toLowerCase() === prob.correctAnswer.trim().toLowerCase();

                    let btnStyle = "bg-white text-slate-800 border-slate-200 hover:border-indigo-400";

                    if (isDone) {
                      if (isOptionCorrect) {
                        btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs";
                      } else if (isSelected && !isOptionCorrect) {
                        btnStyle = "bg-rose-50 border-rose-400 text-rose-950 line-through opacity-80";
                      } else {
                        btnStyle = "bg-white text-slate-400 border-slate-100 opacity-60";
                      }
                    } else if (isSelected) {
                      btnStyle = "bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold ring-2 ring-indigo-500/20";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(prob.id, opt)}
                        className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <MathRenderer text={opt} />
                        </span>

                        {isDone && isOptionCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isDone && isSelected && !isOptionCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={isDone}
                    value={userAns || ""}
                    onChange={(e) => setSelectedAnswers((prev) => ({ ...prev, [prob.id]: e.target.value }))}
                    placeholder="Enter your final answer..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm"
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  {!isDone ? (
                    <button
                      type="button"
                      disabled={!userAns}
                      onClick={() => handleCheckAnswer(prob)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold transition shadow-sm"
                    >
                      Check My Answer
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Great Job! Correct!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100/70 border border-rose-200 px-3 py-1.5 rounded-xl">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Not quite, correct answer is: {prob.correctAnswer}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleSolution(prob.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {revealedSolutions[prob.id] ? "Hide Solution" : "View Step-by-Step Solution"}
                </button>
              </div>

              {/* Revealed Solution Breakdown */}
              {revealedSolutions[prob.id] && (
                <div className="bg-white rounded-xl border border-indigo-100 p-4 space-y-3 mt-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Step-by-Step Explanation:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <MathRenderer text={prob.explanation} />
                  </p>

                  {prob.solutionSteps && prob.solutionSteps.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {prob.solutionSteps.map((step, sIdx) => (
                        <div key={sIdx} className="text-xs bg-slate-50 p-2.5 rounded-lg flex items-start gap-2">
                          <span className="font-bold text-indigo-600 shrink-0">Step {sIdx + 1}:</span>
                          <div>
                            <span className="font-mono text-slate-900 font-semibold block">
                              <MathRenderer latex={step.mathExpression} />
                            </span>
                            <span className="text-slate-600">
                              <MathRenderer text={step.explanation} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
