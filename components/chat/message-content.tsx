import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MessageContentProps {
  content: string
  role: "user" | "assistant" | "system"
}

export function MessageContent({ content, role }: MessageContentProps) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        role === "assistant" && "prose-headings:mt-4 prose-headings:mb-2",
      )}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
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
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" className="text-primary underline" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
