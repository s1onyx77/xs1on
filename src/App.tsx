import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// Read key from Vite environment variable (GitHub Pages secret) or process.env (Local dev)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export default function App() {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSolve = async () => {
    if (!problem.trim()) return;

    if (!apiKey) {
      setError('API Key is missing. Please ensure VITE_GEMINI_API_KEY is configured in your deployment settings.');
      return;
    }

    setLoading(true);
    setError('');
    setSolution('');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Solve this math problem step-by-step: ${problem}`,
      });

      setSolution(response.text || 'No response generated.');
    } catch (err: any) {
      console.error(err);
      setError('Failed to solve problem. Please try again or check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>MathSolver AI</h1>
      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Type an equation (e.g., 3x + 7 = 22)..."
        rows={4}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <br />
      <button
        onClick={handleSolve}
        disabled={loading}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        {loading ? 'Solving...' : 'Solve Step-by-Step'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {solution && (
        <div style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
          <h3>Solution:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{solution}</p>
        </div>
      )}
    </div>
  );
}
