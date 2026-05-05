import { useState, type FC } from 'react';

// Define types for the 'field' prop. Note: 'select' type is handled separately in the component.
type FieldType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'select';

interface FieldConfig<TKey extends string> {
  id: TKey;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // Only for type 'select'
  min?: number | string; // For number type, can also be string for step
  max?: number; // For number type
  minLength?: number; // For text/password/email/tel types
  maxLength?: number; // For text/password/email/tel types
  autoComplete?: string; // For better UX
}

// Define props for the Input component
interface InputProps<TKey extends string> {
  field: FieldConfig<TKey>;
  value: string | number | readonly string[]; // Input elements can return various value types
  onChange: (id: TKey, value: string) => void;
  error?: string;
}

const fieldClassName = (error?: string) => {
  return [
    "w-full rounded-lg border bg-green-50/70 px-3.5 py-3 text-sm text-slate-950 outline-none transition",
    "placeholder:text-slate-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10",
    error ? "border-red-400 bg-red-50" : "border-transparent",
  ].join(" ");
};

export function Input<TKey extends string>({ field, value, onChange, error }: InputProps<TKey>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = field.type === "password";
  const inputType = isPassword && showPassword ? "text" : field.type;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
        {field.label}
        {field.required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <div className="relative">
        {field.type === "select" ? (
          <select
            className={fieldClassName(error)}
            value={value as string || ""} // Cast to string for select element
            required={field.required}
            onChange={(event) => onChange(field.id, event.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`${fieldClassName(error)} ${isPassword ? "pr-24" : ""}`}
            type={inputType}
            placeholder={field.placeholder || field.label} // Use label as fallback for placeholder
            value={value || ""}
            required={field.required}
            minLength={field.minLength}
            maxLength={field.maxLength}
            min={field.min}
            max={field.max}
            autoComplete={field.autoComplete}
            onChange={(event) => onChange(field.id, event.target.value)}
          />
        )}

        {isPassword && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-700 hover:text-green-950"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
};
