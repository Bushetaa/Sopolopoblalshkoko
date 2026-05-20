"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Code2, Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: string;
  url: string;
}

export default function CodeSnippetsModal({ isOpen, onClose, method, url }: CodeSnippetsModalProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'node' | 'go'>('curl');
  const [copied, setCopied] = useState(false);

  const snippets = {
    curl: `curl -X ${method} \\
  '${url}' \\
  -H 'Accept: application/json'`,
    
    python: `import requests

url = "${url}"
headers = {"Accept": "application/json"}

response = requests.request("${method}", url, headers=headers)

print(response.text)`,
    
    node: `const url = "${url}";
const options = {
  method: "${method}",
  headers: {
    "Accept": "application/json"
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));`,
    
    go: `package main

import (
\t"fmt"
\t"net/http"
\t"io"
)

func main() {
\turl := "${url}"

\treq, _ := http.NewRequest("${method}", url, nil)
\treq.Header.Add("Accept", "application/json")

\tres, _ := http.DefaultClient.Do(req)
\tdefer res.Body.Close()

\tbody, _ := io.ReadAll(res.Body)
\tfmt.Println(string(body))
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0B101B] border border-white/5 text-gray-100 max-w-2xl rounded-[2.5rem] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
        {/* Header - Styled like Wizard */}
        <div className="bg-gradient-to-br from-[#1E224F] via-[#141833] to-[#0B101B] px-8 py-5 border-b border-white/5 relative shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-4 text-left">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative group">
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Code2 className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Integration Code
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest text-blue-400">Snippet Library</span>
                </DialogTitle>
                <DialogDescription className="text-[#94A3B8] font-medium text-xs mt-0.5">
                  Test your gateway route directly from your preferred environment
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 bg-[#0B101B]">
          <div className="flex items-center gap-1 mb-6 bg-[#050810] p-1 rounded-xl border border-white/5">
            {(['curl', 'python', 'node', 'go'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                  activeTab === tab
                    ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/20"
                    : "text-[#64748B] hover:text-white hover:bg-white/5"
                )}
              >
                {tab === 'node' ? 'Node.js' : tab}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute -top-3 left-4 px-2 bg-[#0B101B] text-[8px] font-black text-[#64748B] uppercase tracking-[0.2em] flex items-center gap-1.5 z-10">
              <Terminal className="w-3 h-3 text-blue-500" />
              Runtime: {activeTab}
            </div>
            <div className="rounded-[1.5rem] overflow-hidden border border-[#1E293B] shadow-inner mt-2 bg-[#050810] p-2">
              <SyntaxHighlighter
                language={activeTab === 'curl' ? 'bash' : activeTab === 'node' ? 'javascript' : activeTab}
                style={vscDarkPlus}
                customStyle={{ 
                  margin: 0, 
                  padding: '1.5rem', 
                  background: 'transparent',
                  fontSize: '12px',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
                showLineNumbers={true}
              >
                {snippets[activeTab]}
              </SyntaxHighlighter>
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-6 right-6 p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-blue-900/40 active:scale-90"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 stroke-[3px]" /> : <Copy className="w-4 h-4 stroke-[2.5px]" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
