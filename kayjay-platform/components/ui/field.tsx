import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef, useId } from "react";

const INPUT_CLASSES =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:ring-offset-0";

interface FieldWrapperProps {
  label: string;
  error?: string;
  required?: boolean;
}

export const TextField = forwardRef<
  HTMLInputElement,
  FieldWrapperProps & InputHTMLAttributes<HTMLInputElement>
>(function TextField({ label, error, required, ...props }, ref) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        ref={ref}
        id={id}
        className={INPUT_CLASSES}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  FieldWrapperProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextAreaField({ label, error, required, ...props }, ref) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={5}
        className={INPUT_CLASSES}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  FieldWrapperProps & SelectHTMLAttributes<HTMLSelectElement>
>(function SelectField({ label, error, required, children, ...props }, ref) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <select
        ref={ref}
        id={id}
        className={INPUT_CLASSES}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export const ConsentField = forwardRef<
  HTMLInputElement,
  { error?: string } & InputHTMLAttributes<HTMLInputElement>
>(function ConsentField({ error, ...props }, ref) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-line accent-[rgb(var(--gold))]"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <label htmlFor={id} className="text-sm text-muted">
          I agree to be contacted about my inquiry and understand I can unsubscribe at
          any time. See our{" "}
          <a href="/legal/privacy" className="underline hover:text-ink">
            privacy policy
          </a>
          .
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
});
