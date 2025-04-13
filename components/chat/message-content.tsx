"use client"

import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { ChatMode } from "@/lib/types"

interface MessageContentProps {
  content: string
  role: "user" | "assistant" | "system"
  mode: ChatMode
}

export function MessageContent({ content, role, mode }: MessageContentProps) {
  // Enhanced code rendering for code mode
  const renderCode = (language: string, codeContent: string) => {
    return (
      <div className="relative group">
        <div className="absolute -top-5 right-0 bg-muted px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          {language}
        </div>
        <SyntaxHighlighter language={language} style={vscDarkPlus} PreTag="div" className="rounded-md !mt-0">
          {codeContent.replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    )
  }

  // Enhanced citation rendering for research mode
  const renderCitation = (text: string) => {
    // Simple regex to detect citation patterns like [1], [2], etc.
    const citationRegex = /\[(\d+)\]/g
    const parts = text.split(citationRegex)

    if (parts.length <= 1) return text

    const result = []
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        result.push(parts[i])
      } else {
        result.push(
          <sup key={`citation-${i}`} className="text-primary cursor-pointer">
            [{parts[i]}]
          </sup>,
        )
      }
    }

    return <>{result}</>
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        role === "assistant" && "prose-headings:mt-4 prose-headings:mb-2",
        mode === "code" && "prose-code:bg-muted prose-code:text-primary",
        mode === "creative" && "prose-img:rounded-md prose-img:my-2",
      )}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")

            if (mode === "code" && !inline && match) {
              return renderCode(match[1], String(children))
            }

            return !inline && match ? (
              <SyntaxHighlighter language={match[1]} style={vscDarkPlus} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          p({ node, children, ...props }) {
            if (mode === "research") {
              return (
                <p className="mb-2 last:mb-0" {...props}>
                  {renderCitation(String(children))}
                </p>
              )
            }
            return (
              <p className="mb-2 last:mb-0" {...props}>
                {children}
              </p>
            )
          },
          a: ({ node, ...props }) => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-primary underline", mode === "research" && "font-medium")}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-2" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-300 my-2" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border border-gray-300 px-4 py-2" {...props} />,
          img: ({ node, ...props }) => <img className="rounded-lg my-2 max-w-full" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
