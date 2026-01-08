import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "advanced-counter-value";

export default function AdvancedCounter() {
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? Number(saved) : 0;
  });

  const [history, setHistory] = useState<number[]>([count]);
  const [step, setStep] = useState<number>(1);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setHistory((prev) => [...prev, count]);
  }, [count]);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, String(count));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [count]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setCount((c) => c + step);
      }
      if (e.key === "ArrowDown") {
        setCount((c) => c - step);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [step]);

  const increment = () => setCount((c) => c + step);
  const decrement = () => setCount((c) => c - step);

  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  return (
    <div className="counter-container">
      <h2>Advanced Counter</h2>

      <p><strong>Current Count:</strong> {count}</p>

      <div className="button-row">
        <button onClick={decrement}>Decrement</button>
        <button onClick={increment}>Increment</button>
        <button onClick={reset} className="reset-button">Reset</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Step Value: 
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value) || 1)}
            style={{ marginLeft: "0.5rem", width: 60 }}
          />
        </label>
      </div>

      <p style={{ fontSize: "0.9rem", color: "gray" }}>
        Changes saved automatically.
      </p>

      <h4>Count History</h4>
      <ul>
        {history.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>

      <p style={{ fontSize: "0.8rem" }}>
        Use <strong>ArrowUp</strong> to increment and <strong>ArrowDown</strong> to decrement.
      </p>
    </div>
  );
}
