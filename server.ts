import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Main Math Solver Endpoint
app.post("/api/solve-math", async (req, res) => {
  try {
    const {
      problem,
      imageBase64,
      mimeType = "image/png",
      gradeLevel = "middle_school",
      explanationStyle = "standard",
    } = req.body;

    if (!problem && !imageBase64) {
      return res.status(400).json({ error: "Please provide a math problem text or an image." });
    }

    const ai = getAiClient();

    const systemInstruction = `You are an expert, encouraging, and world-class Math Tutor AI designed specifically to help students understand, learn, and master mathematics.
Your goal is not just to provide the answer, but to teach the underlying concepts with crystal-clear, step-by-step logic, explaining the "WHY" and "HOW" of each mathematical operation.

Guidelines:
1. Break down the solution into intuitive, digestible numbered steps.
2. For EVERY step, state:
   - Clear title (e.g., "Find the Least Common Denominator", "Isolate the variable x", "Apply PEMDAS - Parentheses first")
   - The exact math expression in clean standard LaTeX (e.g., "\\frac{2}{3} + \\frac{1}{4} = \\frac{8}{12} + \\frac{3}{12}")
   - The specific operation performed (e.g., "Multiply the first fraction by 4/4 and the second by 3/3")
   - A friendly, highly educational explanation of WHY this step was taken and how it works
   - An optional pro tip or common student pitfall to avoid
   - The formal mathematical rule or property applied if relevant (e.g. "Distributive Property", "Inverse Operations")
3. Provide the clean final answer in plain text and LaTeX.
4. Provide a relatable real-world analogy or application (e.g., sharing pizza slices, balancing weights on a playground teeter-totter, calculating shopping discounts).
5. Provide a 2-3 sentence concept summary to reinforce long-term memory.
6. List 2-3 common mistakes students make on this type of problem.
7. Include 3 similar interactive practice problems (with question, options or answer, hint, and step-by-step solution) for the student to practice.
8. If applicable, recommend a visual model representation (e.g., 'balance_scale' for linear equations, 'fraction_bars' for fractions, 'number_line' for integers/inequalities/arithmetic, or 'geometric_shape' for geometry).

Grade level context: ${gradeLevel} (Tailor language simplicity, tone, and depth to this level).
Explanation style: ${explanationStyle}.
Always return valid JSON strictly following the requested schema.`;

    const contents: any[] = [];

    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      });
    }

    const userPromptText = problem
      ? `Solve this math problem step-by-step for a ${gradeLevel} student: "${problem}". Provide full educational explanations for every single operation.`
      : `Look at the math problem in this image. Read the problem carefully, format it cleanly, and solve it step-by-step for a ${gradeLevel} student with full educational explanations for every operation.`;

    contents.push({
      text: userPromptText,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents.length === 1 ? contents[0].text : { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cleanedProblem: {
              type: Type.STRING,
              description: "The cleanly formatted math problem statement or equation.",
            },
            topic: {
              type: Type.STRING,
              description: "Primary math topic (e.g., Linear Equations, Fractions, Percentages, Order of Operations, Basic Geometry, Exponents).",
            },
            subTopic: {
              type: Type.STRING,
              description: "Sub-topic e.g. 'Two-step equations with integers'.",
            },
            difficulty: {
              type: Type.STRING,
              description: "Difficulty: 'Basic', 'Intermediate', or 'Advanced'.",
            },
            finalAnswer: {
              type: Type.STRING,
              description: "Short, clean final answer in plain text e.g. 'x = 5' or '11/12'.",
            },
            finalAnswerLatex: {
              type: Type.STRING,
              description: "LaTeX formatted final answer e.g. 'x = 5' or '\\frac{11}{12}'.",
            },
            keyFormulaOrRule: {
              type: Type.STRING,
              description: "Key rule, theorem or formula (e.g., 'PEMDAS', 'a^2 + b^2 = c^2', 'Cross-Multiplication').",
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  mathExpression: { type: Type.STRING, description: "LaTeX formatted math equation for this step." },
                  operation: { type: Type.STRING, description: "The specific operation performed." },
                  explanation: { type: Type.STRING, description: "Detailed student explanation." },
                  tipOrPitfall: { type: Type.STRING, description: "Helpful hint or trap to avoid." },
                  ruleApplied: { type: Type.STRING, description: "Math property or law applied." },
                  highlightPart: { type: Type.STRING, description: "Key term modified." },
                },
                required: ["stepNumber", "title", "mathExpression", "operation", "explanation"],
              },
            },
            visualModel: {
              type: Type.OBJECT,
              properties: {
                type: {
                  type: Type.STRING,
                  description: "One of: 'balance_scale', 'fraction_bars', 'number_line', 'geometric_shape', 'step_flow', 'none'",
                },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                data: {
                  type: Type.OBJECT,
                  properties: {
                    leftSide: { type: Type.STRING },
                    rightSide: { type: Type.STRING },
                    fractions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          numerator: { type: Type.NUMBER },
                          denominator: { type: Type.NUMBER },
                          label: { type: Type.STRING },
                        },
                      },
                    },
                    min: { type: Type.NUMBER },
                    max: { type: Type.NUMBER },
                    points: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          value: { type: Type.NUMBER },
                          label: { type: Type.STRING },
                        },
                      },
                    },
                    shape: { type: Type.STRING },
                    formula: { type: Type.STRING },
                  },
                },
              },
            },
            realWorldAnalogy: {
              type: Type.STRING,
              description: "A fun and memorable real-world analogy explaining this concept.",
            },
            conceptSummary: {
              type: Type.STRING,
              description: "2-3 key takeaways summarizing the mathematical concept.",
            },
            commonMistakes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Common mistakes students make with this type of problem.",
            },
            similarPracticeProblems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  mathExpression: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  solutionSteps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        mathExpression: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                      },
                    },
                  },
                },
                required: ["id", "question", "correctAnswer", "hint", "explanation"],
              },
            },
          },
          required: [
            "cleanedProblem",
            "topic",
            "difficulty",
            "finalAnswer",
            "finalAnswerLatex",
            "steps",
            "realWorldAnalogy",
            "conceptSummary",
            "commonMistakes",
            "similarPracticeProblems",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated by the AI model.");
    }

    const parsed = JSON.parse(text);
    const solution = {
      id: `sol_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      originalInput: problem || "Image Problem",
      gradeLevel,
      ...parsed,
    };

    res.json(solution);
  } catch (error: any) {
    console.error("Error solving math problem:", error);
    res.status(500).json({
      error: error.message || "Failed to solve math problem. Please check your input and try again.",
    });
  }
});

// Interactive Math Tutor Chat / Step Clarifier
app.post("/api/tutor-chat", async (req, res) => {
  try {
    const { question, stepNumber, currentSolution, history = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const ai = getAiClient();

    const systemInstruction = `You are a supportive, warm, and highly skilled AI Math Tutor sitting side-by-side with a student.
The student is currently looking at this math problem:
Problem: ${currentSolution?.cleanedProblem || "Math Problem"}
Topic: ${currentSolution?.topic || "Mathematics"}
Final Answer: ${currentSolution?.finalAnswer || ""}
All Steps: ${JSON.stringify(currentSolution?.steps || [])}

${stepNumber ? `The student is specifically asking about Step #${stepNumber}: "${currentSolution?.steps?.find((s: any) => s.stepNumber === stepNumber)?.title || ""}" (Operation: ${currentSolution?.steps?.find((s: any) => s.stepNumber === stepNumber)?.operation || ""}).` : ""}

Instructions:
1. Answer the student's question directly with extreme clarity, warmth, and encouragement.
2. If they ask "why" or "how", explain the mathematical reasoning with a simple real-life analogy or visual breakdown.
3. If they propose an alternative way to solve it, validate if it's correct or gently guide them if there's a flaw.
4. Keep the explanation formatted cleanly with bullet points and LaTeX formatting ($...$) for math where helpful.
5. End with a quick mini-check question or encouraging remark to verify understanding.`;

    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Feed prior history if provided
    for (const msg of history) {
      if (msg.sender === "user") {
        await chat.sendMessage({ message: msg.content });
      }
    }

    const response = await chat.sendMessage({ message: question });
    const replyText = response.text || "I'm here to help! Could you please clarify which part of the step you'd like to explore?";

    res.json({
      reply: replyText,
      stepNumber,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Error in tutor chat:", error);
    res.status(500).json({
      error: error.message || "Failed to get tutor explanation.",
    });
  }
});

// Generate Custom Practice Set
app.post("/api/generate-practice", async (req, res) => {
  try {
    const { topic, gradeLevel = "middle_school", count = 3 } = req.body;

    const ai = getAiClient();

    const prompt = `Generate a set of ${count} high-quality, engaging practice math problems on the topic "${topic}" tailored for ${gradeLevel} students.
Each problem should have:
1. An interesting real-world or standard scenario
2. Clear question statement
3. 4 multiple choice options (one correct, three realistic misconceptions)
4. The correct answer
5. A helpful hint that nudges the student without giving away the full answer
6. A step-by-step solution explaining each operation`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            problems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  mathExpression: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  solutionSteps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        mathExpression: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                      },
                    },
                  },
                },
                required: ["id", "question", "options", "correctAnswer", "hint", "explanation"],
              },
            },
          },
          required: ["topic", "title", "description", "problems"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Practice generation failed.");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating practice problems:", error);
    res.status(500).json({
      error: error.message || "Failed to generate practice problems.",
    });
  }
});

// Setup Vite dev middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MathSolver AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
