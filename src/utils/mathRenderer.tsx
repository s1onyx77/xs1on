import React, { useEffect, useRef } from "react";
import katex from "katex";

interface MathRendererProps {
  latex?: string;
  text?: string;
  block?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  latex,
  text,
  block = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (latex) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          output: "htmlAndMathml",
        });
      } catch (err) {
        containerRef.current.innerText = latex;
      }
    } else if (text) {
      // Process text that may contain $math$ or standard expression
      const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);
      containerRef.current.innerHTML = "";

      parts.forEach((part) => {
        if (!part) return;

        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2);
          const span = document.createElement("span");
          try {
            katex.render(math, span, { displayMode: true, throwOnError: false });
          } catch {
            span.innerText = part;
          }
          containerRef.current?.appendChild(span);
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          const span = document.createElement("span");
          try {
            katex.render(math, span, { displayMode: false, throwOnError: false });
          } catch {
            span.innerText = part;
          }
          containerRef.current?.appendChild(span);
        } else {
          const textSpan = document.createElement("span");
          textSpan.innerText = part;
          containerRef.current?.appendChild(textSpan);
        }
      });
    }
  }, [latex, text, block]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${block ? "my-2 w-full text-center" : ""} ${className}`}
    />
  );
};
