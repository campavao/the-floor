"use client";

import { LANGUAGES, languageName } from "@/lib/community/languages";

/**
 * Pick the language a category is written in.
 *
 * Options are listed by their own name ("Polski", "Français"), sorted that
 * way too, so someone looking for their language finds the word they'd use.
 */
const OPTIONS = [...LANGUAGES]
  .map((code) => ({ code, name: languageName(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function LanguageSelect({
  value,
  onChange,
  disabled,
  id,
}: {
  value: string | null;
  onChange: (language: string) => void;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <select
      id={id}
      value={value ?? ""}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="px-3 py-1.5 text-sm rounded bg-gray-800 text-white border border-[#00d4ff]/40 focus:border-[#00d4ff] focus:outline-none disabled:opacity-50"
    >
      {!value && (
        <option value="" disabled>
          Choose…
        </option>
      )}
      {OPTIONS.map((option) => (
        <option key={option.code} value={option.code}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
