"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import useHTTP from "@/hooks/useHTTP";
import api from "@/config/api/apiList";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { cn } from "@/utils/helpers/cn";

// TODO: confirm the field names the backend's POST /contact expects.
const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{0,20}$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(2, "Please add a subject."),
  message: z.string().trim().min(10, "Your message should be at least 10 characters."),
});

type Values = z.infer<typeof schema>;
type Field = keyof Values;

const EMPTY: Values = { name: "", email: "", phone: "", subject: "", message: "" };

const FIELDS: {
  name: Field;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  wide?: boolean;
  textarea?: boolean;
}[] = [
  { name: "name", label: "Full Name", autoComplete: "name", required: true },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
  { name: "subject", label: "Subject", required: true },
  { name: "message", label: "Your Message", required: true, wide: true, textarea: true },
];

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-[14px] border bg-white/[0.06] px-5 font-dmSans text-[15px] text-white placeholder:text-white/55 outline-none transition-colors duration-300 focus:bg-white/[0.1]",
    hasError
      ? "input-error-shake border-primary"
      : "border-white/10 focus:border-accent/60",
  );

const ContactForm = () => {
  const { PostData, isLoading } = useHTTP();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        next[key] ??= issue.message;
      }
      setErrors(next);
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    // useHTTP shows the success / error toast.
    const res = await PostData({ api: api.contact, body: parsed.data });
    if (res.success) setValues(EMPTY);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {FIELDS.map((f) => {
        const id = `contact-${f.name}`;
        const error = errors[f.name];
        const common = {
          id,
          name: f.name,
          value: values[f.name] ?? "",
          required: f.required,
          placeholder: `${f.label}${f.required ? "*" : ""}`,
          "aria-invalid": !!error,
          "aria-describedby": error ? `${id}-error` : undefined,
          className: cn(inputClass(!!error), f.textarea ? "min-h-[150px] resize-y py-4" : "h-[56px]"),
        };
        return (
          <div key={f.name} className={cn(f.wide && "sm:col-span-2")}>
            <label htmlFor={id} className="sr-only">
              {f.label}
            </label>
            {f.textarea ? (
              <textarea {...common} onChange={(e) => update(f.name, e.target.value)} />
            ) : (
              <input
                {...common}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                onChange={(e) => update(f.name, e.target.value)}
              />
            )}
            {error && (
              <p id={`${id}-error`} role="alert" className="mt-2 pl-5 font-dmSans text-sm text-[#ff6b6b]">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="sm:col-span-2">
        <PrimaryButton type="submit" arrow loading={isLoading} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default ContactForm;
