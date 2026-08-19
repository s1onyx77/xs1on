import React, { useState, useRef, useEffect } from "react";
import { MathSolution, TutorChatMessage } from "../types";
import { MathRenderer } from "../utils/mathRenderer";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  CornerDownRight,
  Loader2,
} from "lucide-react";

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  solution: MathSolution | null;
  targetStepNumber?: number;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  solution,
  targetStepNumber,
}) => {
  const [messages, setMessages] = useState<TutorChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or update welcome message when opened or step changed
  useEffect(() => {
    if (!isOpen || !solution) return;

    const initialText = targetStepNumber
      ? `Hi! I'm your AI Math Tutor. You're exploring Step #${targetStepNumber} ("${
          solution.steps?.find((s) => s.stepNumber === targetStepNumber)?.title || ""
        }"). What would you like me to clarify about this operation?`
      : `Hello! I'm your AI Math Tutor. I'm ready to explain any step, rule, or concept for "${
          solution.cleanedProblem || "this problem"
        }". What would you like to ask?`;

    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: "assistant",
        content: initialText,
        timestamp: Date.now(),
        stepContext: targetStepNumber,
      },
    ]);
  }, [isOpen, solution, targetStepNumber]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickPrompts = [
    targetStepNumber
      ? `Why did we perform this specific operation in Step ${targetStepNumber}?`
      : "Can you explain the main concept in simple everyday terms?",
    "Can you give me a real-life analogy for this?",
    "Is there another way or alternative method to solve this?",
    "What common mistake do students often make here?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading || !solution) return;

    const userMessage: TutorChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      content: query,
      timestamp: Date.now(),
      stepContext: targetStepNumber,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          stepNumber: targetStepNumber,
          currentSolution: solution,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get tutor answer");
      }

      const data = await response.json();

      const tutorMessage: TutorChatMessage = {
        id: `ast_${Date.now()}`,
        sender: "assistant",
        content: data.reply || "Let me know if you need more help with this math concept!",
        timestamp: Date.now(),
        stepContext: targetStepNumber,
      };

      setMessages((prev) => [...prev, tutorMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "assistant",
          content: "Sorry, I ran into an issue answering. Please try asking again!",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              AI Math Tutor
              {targetStepNumber && (
                <span className="text-[10px] bg-indigo-600/80 px-2 py-0.5 rounded-full text-indigo-100">
                  Step #{targetStepNumber}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">Ask any question or request simpler explanations</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
              }`}
            >
              <MathRenderer text={msg.content} />
            </div>

            {msg.sender === "user" && (
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              Tutor is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-200 bg-white">
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-500" /> Quick questions:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about this math problem..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
