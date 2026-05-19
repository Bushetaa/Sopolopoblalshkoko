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
      <DialogContent className="bg-gray-950 border border-gray-800 text-gray-100 max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-gray-800/60 bg-gray-900/40 flex items-start justify-between">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-blue-400" />
              </div>
              Integration Code
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm mt-1.5 ml-[52px]">
              Use these code snippets to test your gateway route directly from your app.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 bg-gray-950">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-px">
            {(['curl', 'python', 'node', 'go'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                )}
              >
                {tab === 'node' ? 'Node.js' : tab}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute -top-3 left-4 px-2 bg-gray-950 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 z-10">
              <Terminal className="w-3 h-3" />
              {activeTab}
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-800 shadow-inner mt-2 text-[13px] bg-[#1e1e1e]">
              <SyntaxHighlighter
                language={activeTab === 'curl' ? 'bash' : activeTab === 'node' ? 'javascript' : activeTab}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                showLineNumbers={true}
              >
                {snippets[activeTab]}
              </SyntaxHighlighter>
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-gray-700 hover:border-gray-600"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
