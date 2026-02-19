import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

export default function Spinner({ text, subtext, steps }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!steps?.length) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="report-spinner">
      <div className="report-spinner-ring" />
      {text && <div className="report-spinner-text">{text}</div>}
      {subtext && <div className="report-spinner-subtext">{subtext}</div>}
      {steps?.length > 0 && (
        <div className="report-spinner-steps">
          {steps.map((step, i) => (
            <div key={i} className={`spinner-step${i < activeStep ? ' done' : i === activeStep ? ' active' : ''}`}>
              <span className="spinner-step-icon">
                {i < activeStep ? <Check size={14} /> : i === activeStep ? <Loader2 size={14} className="spinning" /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gray-300)', display: 'block' }} />}
              </span>
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
