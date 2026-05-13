"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

const RESERVED_WORDS = [
  'admin', 'api', 'healthz', 'metrics', 'docs', 'swagger', 
  'static', 'assets', 'ws', 'graphql'
];

interface SlugSetupModalProps {
  isOpen: boolean;
  onComplete: (slug: string) => void;
}

export default function SlugSetupModal({ isOpen, onComplete }: SlugSetupModalProps) {
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateSlug = (val: string) => {
    if (!val) return "Slug is required";
    if (val.length < 3) return "Must be at least 3 characters";
    const slugRegex = /^[a-z0-9][a-z0-9\-]{1,}[a-z0-9]$/;
    if (!slugRegex.test(val)) {
      return "Must be lowercase, numbers, and hyphens only, and cannot start/end with a hyphen.";
    }
    if (RESERVED_WORDS.includes(val)) {
      return "This slug is reserved and cannot be used.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateSlug(slug);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to update user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      onComplete(slug);
    } catch (err: any) {
      setError(err.message || "Failed to save slug");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <span className="text-xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-50">Welcome to Sopo</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Let's set up your profile space. Choose a unique slug to identify your API endpoints.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
              Workspace Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase());
                setError(null);
              }}
              className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="e.g. my-company"
              autoComplete="off"
              disabled={isLoading}
            />
            {slug && !error && (
              <p className="text-xs text-green-400 mt-2 font-medium">
                Your URLs will start with: <span className="font-mono bg-green-400/10 px-1 py-0.5 rounded">/{slug}/...</span>
              </p>
            )}
            {error && (
              <div className="flex items-start gap-2 mt-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !slug}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Create Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
