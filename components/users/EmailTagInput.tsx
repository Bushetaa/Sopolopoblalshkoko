"use client";

import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmailTagInputProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
}

export default function EmailTagInput({
  emails,
  onChange,
  placeholder = "Enter email addresses...",
}: EmailTagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const addEmail = (rawValue: string) => {
    const normalized = rawValue.trim().toLowerCase();
    if (!normalized || emails.includes(normalized)) {
      setInputValue("");
      return;
    }

    onChange([...emails, normalized]);
    setInputValue("");
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addEmail(inputValue);
    }

    if (event.key === "Backspace" && !inputValue && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="min-h-[44px] cursor-text rounded-xl border border-gray-800 bg-gray-950 px-3 py-2"
    >
      <div className="flex flex-wrap items-center gap-2">
        {emails.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-xs text-blue-200"
          >
            {email}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                removeEmail(email);
              }}
              className="text-blue-300 transition-colors hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              addEmail(inputValue);
            }
          }}
          placeholder={emails.length === 0 ? placeholder : ""}
          className="h-7 min-w-[220px] flex-1 border-0 bg-transparent px-0 text-sm text-gray-200 shadow-none placeholder:text-gray-600 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
