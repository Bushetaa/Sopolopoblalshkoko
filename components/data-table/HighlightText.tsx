import React from 'react';
import { escapeRegex } from '@/lib/table-utils';

interface HighlightTextProps {
  text: string;
  query?: string;
}

export default function HighlightText({ text, query }: HighlightTextProps) {
  if (!query?.trim()) return <>{text}</>;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-blue-500/30 text-blue-200 rounded px-0.5 no-underline">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
