import React, { useRef, useState, useEffect } from "react";
import { Eraser, PenTool, RotateCcw, Sparkles, Check, Download } from "lucide-react";

interface DrawingPadProps {
  onSolveDrawing: (base64Image: string) => void;
  isLoading?: boolean;
}

export const DrawingPad: React.FC<DrawingPadProps> = ({ onSolveDrawing, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [lineWidth, setLineWidth] = useState(4);
  const [hasContent, setHasContent] = useState(false);

  // Initialize canvas with clean white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = 240 * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, 240);

    // Draw subtle grid lines to help student write straight
    drawGrid(ctx, rect.width, 240);
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    const step = 28;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineWidth = tool === "eraser" ? 20 : lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : "#1e293b";

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasContent(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, 240);
    drawGrid(ctx, rect.width, 240);
    setHasContent(false);
  };

  const handleSolve = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasContent) return;
    const base64 = canvas.toDataURL("image/png");
    onSolveDrawing(base64);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Handwriting / Scratchpad
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Write any equation or math problem by hand
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTool("pen")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              tool === "pen"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Pen
          </button>
          <button
            type="button"
            onClick={() => setTool("eraser")}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              tool === "eraser"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            Eraser
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl overflow-hidden touch-none bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-[200px] cursor-crosshair block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasContent && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 gap-1">
            <PenTool className="w-6 h-6 stroke-1 text-slate-300" />
            <p className="text-xs font-medium text-slate-400">Write equations here (e.g. 2x + 5 = 17 or 3/4 + 1/2)</p>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          disabled={!hasContent || isLoading}
          onClick={handleSolve}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-100 transition"
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? "Recognizing & Solving..." : "Solve Handwritten Problem"}
        </button>
      </div>
    </div>
  );
};
