import React, { useState } from "react";
import { MathStep } from "../types";
import { MathRenderer } from "../utils/mathRenderer";
import confetti from "canvas-confetti";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  Eye,
  CheckCircle2,
  BookOpen,
  BrainCircuit,
  XCircle,
} from "lucide-react";

interface StepWalkthroughProps {
  steps: MathStep[];
  onAskTutorAboutStep: (stepNumber: number) => void;
}

export const StepWalkthrough: React.FC<StepWalkthroughProps> = ({
  steps,
  onAskTutorAboutStep,
}) => {
  const [viewMode, setViewMode] = useState<"interactive" | "all">("interactive");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showNextStepQuiz, setShowNextStepQuiz] = useState<boolean>(false);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  if (!steps || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  // Text to Speech for student accessibility
  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 over $2")
      .replace(/\\cdot/g, "times")
      .replace(/\\times/g, "times")
      .replace(/\\sqrt\{([^}]+)\}/g, "square root of $1")
      .replace(/[\$\\]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Generate plausible distractor options for next-step quiz
  const getQuizOptions = () => {
    if (!nextStep) return [];
    const correct = nextStep.operation;
    const distractors = [
      "Multiply both sides by 2",
      "Combine like terms on left side",
      "Divide by common factor",
      "Add reciprocal to both sides",
      "Square root both sides",
    ].filter((d) => d !== correct);

    const options = [correct, distractors[0], distractors[1]];
    // Deterministic shuffle based on step number
    return options.sort((a, b) => (a.length > b.length ? 1 : -1));
  };

  const handleSelectQuizOption = (option: string) => {
    if (quizSubmitted) return;
    setQuizAnswerSelected(option);
    setQuizSubmitted(true);

    if (nextStep && option === nextStep.operation) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    }
  };

  const handleNextStep = () => {
    setShowNextStepQuiz(false);
    setQuizAnswerSelected(null);
    setQuizSubmitted(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header with View Mode Switcher */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-200">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              Step-by-Step Educational Solution
              <span className="text-xs font-normal text-slate-500">
                ({steps.length} {steps.length === 1 ? "step" : "steps"})
              </span>
            </h2>
            <p className="text-xs text-slate-500">Every single mathematical operation clearly explained</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode("interactive")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === "interactive"
                ? "bg-white text-indigo-700 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Guided Mode
          </button>
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === "all"
                ? "bg-white text-indigo-700 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            View All Steps
          </button>
        </div>
      </div>

      {/* Guided Interactive Mode */}
      {viewMode === "interactive" ? (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Progress stepper */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-indigo-600 font-bold">
                {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setShowNextStepQuiz(false);
                    setQuizAnswerSelected(null);
                    setQuizSubmitted(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`h-full flex-1 rounded-full cursor-pointer transition-all ${
                    idx < currentStepIndex
                      ? "bg-indigo-400"
                      : idx === currentStepIndex
                      ? "bg-indigo-600 shadow-sm"
                      : "bg-slate-200"
                  }`}
                  title={`Go to Step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Card */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5 transition-all">
            {/* Step Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-200">
                  {currentStep.stepNumber}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {currentStep.title}
                  </h3>
                  {currentStep.ruleApplied && (
                    <span className="inline-block mt-0.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      Rule: {currentStep.ruleApplied}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons on step */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeak(
                      `${currentStep.title}. Operation: ${currentStep.operation}. ${currentStep.explanation}`
                    )
                  }
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition shadow-sm"
                  title={isSpeaking ? "Stop listening" : "Listen to step explanation"}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onAskTutorAboutStep(currentStep.stepNumber)}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  title="Ask AI Tutor to clarify this step"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Ask AI Tutor</span>
                </button>
              </div>
            </div>

            {/* Math Expression Display */}
            <div className="bg-white rounded-xl border border-indigo-100 p-4 sm:p-5 shadow-sm text-center">
              <div className="text-xl sm:text-2xl font-mono text-slate-900 tracking-wide overflow-x-auto py-1">
                <MathRenderer latex={currentStep.mathExpression} block />
              </div>

              {/* Specific Operation Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Operation: {currentStep.operation}
              </div>
            </div>

            {/* Explanation Section */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Why & How This Works
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/70">
                <MathRenderer text={currentStep.explanation} />
              </p>
            </div>

            {/* Pro Tip / Common Pitfall Box */}
            {currentStep.tipOrPitfall && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm text-emerald-900 leading-normal">
                  <span className="font-bold mr-1">Pro Tip for Students:</span>
                  <MathRenderer text={currentStep.tipOrPitfall} />
                </div>
              </div>
            )}

            {/* Self-Check Challenge: Predict Next Operation */}
            {nextStep && !showNextStepQuiz && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowNextStepQuiz(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  Active Challenge: What should we do in the next step?
                </button>
              </div>
            )}

            {showNextStepQuiz && nextStep && (
              <div className="p-4 bg-indigo-50/90 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-indigo-600" />
                    Quick Check: What operation should we perform next?
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNextStepQuiz(false)}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Skip
                  </button>
                </div>

                <div className="space-y-2">
                  {getQuizOptions().map((opt, oIdx) => {
                    const isCorrect = opt === nextStep.operation;
                    const isSelected = quizAnswerSelected === opt;

                    let btnClass = "bg-white text-slate-800 border-slate-200 hover:border-indigo-400";
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnClass = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "bg-rose-100 border-rose-400 text-rose-950 line-through";
                      } else {
                        btnClass = "bg-white text-slate-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectQuizOption(opt)}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-900">
                      {quizAnswerSelected === nextStep.operation
                        ? "Spot on! Let's see it in action."
                        : `Next operation is: ${nextStep.operation}`}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                    >
                      Reveal Step {currentStepIndex + 2}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={() => {
                setShowNextStepQuiz(false);
                setQuizAnswerSelected(null);
                setQuizSubmitted(false);
                setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Step
            </button>

            {currentStepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-indigo-100 transition"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs sm:text-sm bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Solution Complete!
              </div>
            )}
          </div>
        </div>
      ) : (
        /* View All Steps Mode */
        <div className="p-5 sm:p-7 space-y-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative pl-7 sm:pl-10 pb-6 border-l-2 border-indigo-200 last:border-l-0 last:pb-0"
            >
              {/* Step indicator circle */}
              <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                {step.stepNumber}
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {step.title}
                    </h3>
                    <div className="inline-block mt-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-0.5 rounded-md font-semibold">
                      Operation: {step.operation}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAskTutorAboutStep(step.stepNumber)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Ask Tutor
                  </button>
                </div>

                {/* Expression */}
                <div className="bg-white rounded-lg border border-slate-200 p-3 text-center overflow-x-auto">
                  <MathRenderer latex={step.mathExpression} block />
                </div>

                {/* Explanation */}
                <p className="text-sm text-slate-700 leading-relaxed">
                  <MathRenderer text={step.explanation} />
                </p>

                {step.tipOrPitfall && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold">Tip: </span>
                      <MathRenderer text={step.tipOrPitfall} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
