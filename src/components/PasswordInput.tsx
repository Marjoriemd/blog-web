import { useState } from 'react';

interface PasswordInputProps {
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
  hasError?: boolean;
  showStrengthBar?: boolean;
}

export default function PasswordInput({
  id, name, value, onChange,
  placeholder = '••••••••',
  autoComplete, required, minLength,
  className = '',
  hasError = false,
  showStrengthBar = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const baseClass = `w-full pl-4 pr-11 py-2.5 text-sm bg-white border rounded-lg text-pb-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150 ${
    hasError
      ? 'border-red-300 focus:ring-red-400/40'
      : 'border-pb-100 focus:ring-pb-400/40 focus:border-pb-400'
  } ${className}`;

  let strength = 0;
  if (value.length >= 8) strength++;
  if (/[a-z]/.test(value)) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;

  // Four segments, each lights up progressively
  const segmentColors = [
    strength >= 1 ? (strength <= 1 ? '#f87171' : strength <= 2 ? '#fb923c' : '#8aa3f8') : '#e2e8f0',
    strength >= 2 ? (strength <= 2 ? '#fb923c' : '#8aa3f8') : '#e2e8f0',
    strength >= 3 ? (strength <= 3 ? '#8aa3f8' : '#22d3ee') : '#e2e8f0',
    strength >= 4 ? '#22d3ee' : '#e2e8f0',
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <input
          id={id} name={name}
          type={visible ? 'text' : 'password'}
          value={value} onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className={baseClass}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150 p-0.5 rounded"
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          {visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>

      {showStrengthBar && value.length > 0 && (
        <div className="flex gap-1">
          {segmentColors.map((color, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
