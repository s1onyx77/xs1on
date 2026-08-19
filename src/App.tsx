import React, { useState, useEffect, useRef } from "react";
import {
  GradeLevel,
  ExplanationStyle,
  MathSolution,
} from "./types";
import { MathKeypad } from "./components/MathKeypad";
import { DrawingPad } from "./components/DrawingPad";
import { VisualModel } from "./components/VisualModel";
import { StepWalkthrough } from "./components/StepWalkthrough";
import { AITutorDrawer } from "./components/AITutorDrawer";
import { PracticeMode } from "./components/PracticeMode";
import { RealWorldCard } from "./components/RealWorldCard";
import { SolutionHeader } from "./components/SolutionHeader";
import { SampleProblems } from "./components/SampleProblems";
import { FormulaReference } from "./components/FormulaReference";
import { HistoryDrawer } from "./components/HistoryDrawer";
import {
  Sparkles,
  Calculator,
  Camera,
  PenTool,
  Clock,
  BookOpen,
  HelpCircle,
  GraduationCap,
  Layers,
  ArrowRight,
  Loader2,
  AlertCircle,
  X,
  Mic,
  MicOff,
  Bookmark,
  ChevronDown,
} from "lucide-react";

export default function App() {
  const [problemInput, setProblemInput] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("middle_school");
  const [explanationStyle, setExplanationStyle] = useState<ExplanationStyle>("standard");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentSolution, setCurrentSolution] = useState<MathSolution | null>(null);

  // UI state toggles
  const [showKeypad, setShowKeypad] = useState<boolean>(false);
  const [showDrawingPad, setShowDrawingPad] = useState<boolean>(false);
  const [showFormulas, setShowFormulas] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorTargetStep, setTutorTargetStep] = useState<number | undefined>(undefined);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // History & Bookmarks
  const [history, setHistory] = useState<MathSolution[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mathsolver_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Save history helper
  const saveToHistory = (sol: MathSolution) => {
    setHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== sol.id);
      const updated = [sol, ...filtered].slice(0, 30);
      try {
        localStorage.setItem("mathsolver_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Web Speech API recognition
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type or draw your problem.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setProblemInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Solve problem action
  const handleSolve = async (textOverride?: string, imageBase64?: string) => {
    const query = textOverride !== undefined ? textOverride : problemInput.trim();
    if (!query && !imageBase64) {
      setErrorMsg("Please enter a math equation, word problem, or upload/draw an image.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/solve-math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: query,
          imageBase64,
          gradeLevel,
          explanationStyle,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to solve problem. Please try again.");
      }

      const solution: MathSolution = await response.json();
      setCurrentSolution(solution);
      saveToHistory(solution);

      // Smooth scroll down to solution
      setTimeout(() => {
        solutionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred while solving.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Photo Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      handleSolve(undefined, base64);
    };
    reader.readAsDataURL(file);
    // Reset file input value
    e.target.value = "";
  };

  // Keypad insertion
  const handleKeypadInsert = (val: string) => {
    setProblemInput((prev) => prev + val);
    inputRef.current?.focus();
  };

  const handleKeypadBackspace = () => {
    setProblemInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setProblemInput("");
  };

  // Open Tutor drawer for specific step
  const handleAskTutorAboutStep = (stepNumber: number) => {
    setTutorTargetStep(stepNumber);
    setIsTutorOpen(true);
  };

  // Generate more practice problems
  const handleGenerateMorePractice = async () => {
    if (!currentSolution) return;
    try {
      const res = await fetch("/api/generate-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: currentSolution.topic,
          gradeLevel: currentSolution.gradeLevel,
          count: 3,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.problems) {
          setCurrentSolution((prev) =>
            prev ? { ...prev, similarPracticeProblems: data.problems } : null
          );
        }
      }
    } catch (e) {
      console.error("Failed to generate more practice", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-2">
                MathSolver AI
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  Student Tutor
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Step-by-step solutions with clear operation explanations & visual aids
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                  {history.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setTutorTargetStep(undefined);
                setIsTutorOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tutor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Input Card */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Problem Input
              </span>
              <span className="text-xs text-slate-500">
                Type an equation, word problem, fraction, or dictate
              </span>
            </div>

            {/* Grade Level Selector */}
            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="grade-select" className="text-slate-500 font-medium flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                Level:
              </label>
              <select
                id="grade-select"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="elementary">Elementary (Grade 3-5)</option>
                <option value="middle_school">Middle School (Grade 6-8)</option>
                <option value="high_school">High School (Grade 9-12)</option>
                <option value="college_basics">Foundations / College</option>
              </select>

              <label htmlFor="style-select" className="text-slate-500 font-medium ml-2 hidden sm:flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Style:
              </label>
              <select
                id="style-select"
                value={explanationStyle}
                onChange={(e) => setExplanationStyle(e.target.value as ExplanationStyle)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hidden sm:block"
              >
                <option value="standard">Standard Step-by-Step</option>
                <option value="simple_kid">Simple & Kid-Friendly</option>
                <option value="deep_conceptual">Deep Conceptual "Why"</option>
                <option value="visual_focus">Visual Focus</option>
              </select>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="relative">
            <textarea
              ref={inputRef}
              rows={3}
              value={problemInput}
              onChange={(e) => setProblemInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSolve();
                }
              }}
              placeholder="e.g. 3x + 7 = 22, or 5/8 + 2/3, or 'A jacket costs $60 with 20% discount, find final price'..."
              className="w-full p-4 pr-20 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none text-base sm:text-lg font-mono text-slate-900 transition placeholder:text-slate-400 placeholder:font-sans"
            />

            <div className="absolute top-3 right-3 flex items-center gap-1">
              {/* Voice input button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-xl transition ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                }`}
                title={isListening ? "Listening... click to stop" : "Dictate math problem by voice"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {problemInput && (
                <button
                  type="button"
                  onClick={() => setProblemInput("")}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Row & Input Mode Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Virtual Keypad Toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowKeypad(!showKeypad);
                  setShowDrawingPad(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                  showKeypad
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                Math Keypad
              </button>

              {/* Handwriting / Drawing Pad Toggle */}
              <button
                type="button"
                onClick={() => {
                  setShowDrawingPad(!showDrawingPad);
                  setShowKeypad(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                  showDrawingPad
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                Handwriting / Scratchpad
              </button>

              {/* Photo Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-600" />
                Upload Photo / Worksheet
              </button>

              {/* Formula Reference Cheat Sheet Toggle */}
              <button
                type="button"
                onClick={() => setShowFormulas(!showFormulas)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                  showFormulas
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                Formulas & Rules
              </button>
            </div>

            {/* Primary Solve Button */}
            <button
              type="button"
              disabled={isLoading || (!problemInput.trim() && !showDrawingPad)}
              onClick={() => handleSolve()}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-98 transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing & Solving Step-by-Step...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Solve Step-by-Step
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Conditional Virtual Math Keypad */}
          {showKeypad && (
            <div className="pt-2 animate-in fade-in duration-200">
              <MathKeypad
                onInsert={handleKeypadInsert}
                onBackspace={handleKeypadBackspace}
                onClear={handleKeypadClear}
                onEnter={() => handleSolve()}
              />
            </div>
          )}

          {/* Conditional Drawing / Handwriting Pad */}
          {showDrawingPad && (
            <div className="pt-2 animate-in fade-in duration-200">
              <DrawingPad
                onSolveDrawing={(base64) => handleSolve(undefined, base64)}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Conditional Formula & Rules Cheat Sheet */}
          {showFormulas && (
            <div className="pt-2 animate-in fade-in duration-200">
              <FormulaReference
                onSelectExample={(prob) => {
                  setProblemInput(prob);
                  setShowFormulas(false);
                  handleSolve(prob);
                }}
              />
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Couldn't Solve Problem</p>
                <p className="mt-0.5 text-rose-700">{errorMsg}</p>
              </div>
            </div>
          )}
        </section>

        {/* Solved Result Section */}
        {currentSolution && (
          <section ref={solutionRef} className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Final Answer Card */}
            <SolutionHeader
              solution={currentSolution}
              onOpenTutor={() => {
                setTutorTargetStep(undefined);
                setIsTutorOpen(true);
              }}
              onBookmark={() => saveToHistory(currentSolution)}
              isBookmarked={history.some((h) => h.id === currentSolution.id)}
            />

            {/* Visual Concept Model (Balance scale, fraction bars, number line, geometry) */}
            {currentSolution.visualModel && currentSolution.visualModel.type !== "none" && (
              <VisualModel
                model={currentSolution.visualModel}
                topic={currentSolution.topic}
              />
            )}

            {/* Step-by-Step Walkthrough with Operation Explanations */}
            <StepWalkthrough
              steps={currentSolution.steps}
              onAskTutorAboutStep={handleAskTutorAboutStep}
            />

            {/* Real World Analogy & Concepts */}
            <RealWorldCard
              realWorldAnalogy={currentSolution.realWorldAnalogy}
              conceptSummary={currentSolution.conceptSummary}
              commonMistakes={currentSolution.commonMistakes}
              keyFormulaOrRule={currentSolution.keyFormulaOrRule}
            />

            {/* Similar Practice Problems */}
            {currentSolution.similarPracticeProblems && (
              <PracticeMode
                problems={currentSolution.similarPracticeProblems}
                topic={currentSolution.topic}
                onGenerateMore={handleGenerateMorePractice}
              />
            )}
          </section>
        )}

        {/* Sample Problems Library */}
        <section className="pt-2">
          <SampleProblems
            onSelectProblem={(probText) => {
              setProblemInput(probText);
              handleSolve(probText);
            }}
          />
        </section>
      </main>

      {/* Side Tutor Drawer */}
      <AITutorDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        solution={currentSolution}
        targetStepNumber={tutorTargetStep}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectSolution={(sol) => {
          setCurrentSolution(sol);
          setTimeout(() => {
            solutionRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 50);
        }}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem("mathsolver_history");
        }}
      />
    </div>
  );
}
