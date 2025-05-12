"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Code, List, ListOrdered, LinkIcon, ImageIcon } from "lucide-react"

interface PostEditorProps {
  initialValue?: string
  placeholder?: string
  onSubmit?: (content: string) => void
  submitLabel?: string
  minHeight?: string
}

export default function PostEditor({
  initialValue = "",
  placeholder = "Viết nội dung bài viết của bạn...",
  onSubmit,
  submitLabel = "Gửi bài viết",
  minHeight = "200px",
}: PostEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const handleSubmit = () => {
    if (onSubmit && content.trim()) {
      onSubmit(content)
    }
  }

  const insertMarkdown = (markdownSyntax: string, selectionWrapper?: [string, string]) => {
    const textarea = document.getElementById("editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let newText = ""
    if (selectionWrapper && selectedText) {
      // Wrap selected text
      newText =
        textarea.value.substring(0, start) +
        selectionWrapper[0] +
        selectedText +
        selectionWrapper[1] +
        textarea.value.substring(end)
      setContent(newText)
    } else {
      // Insert markdown syntax
      newText = textarea.value.substring(0, start) + markdownSyntax + textarea.value.substring(end)
      setContent(newText)
    }

    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus()
      if (selectionWrapper && selectedText) {
        textarea.selectionStart = start + selectionWrapper[0].length
        textarea.selectionEnd = end + selectionWrapper[0].length
      } else {
        const cursorPosition = start + markdownSyntax.indexOf("_cursor_")
        if (markdownSyntax.includes("_cursor_")) {
          const finalText = newText.replace("_cursor_", "")
          setContent(finalText)
          textarea.selectionStart = cursorPosition
          textarea.selectionEnd = cursorPosition
        } else {
          textarea.selectionStart = start + markdownSyntax.length
          textarea.selectionEnd = start + markdownSyntax.length
        }
      }
    }, 0)
  }

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    const html = markdown
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      // Code
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      // Lists
      .replace(/^\* (.*$)/gim, "<ul><li>$1</li></ul>")
      .replace(/^\d\. (.*$)/gim, "<ol><li>$1</li></ol>")
      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n/gim, "<br />")

    return html
  }

  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-1 p-2 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertMarkdown("**_cursor_**", ["**", "**"])}
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertMarkdown("*_cursor_*", ["*", "*"])}
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertMarkdown("`_cursor_`", ["`", "`"])}
        >
          <Code className="h-4 w-4" />
          <span className="sr-only">Code</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertMarkdown("\n* _cursor_")}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Bulleted List</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertMarkdown("\n1. _cursor_")}
        >
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertMarkdown("[_cursor_](url)", ["[", "](url)"])}
        >
          <LinkIcon className="h-4 w-4" />
          <span className="sr-only">Link</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertMarkdown("![alt text](_cursor_)", ["![alt text](", ")"])}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Image</span>
        </Button>
      </div>

      <Tabs defaultValue="write" onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
        <div className="px-2 border-b">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger
              value="write"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Viết
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Xem trước
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="p-0 mt-0">
          <Textarea
            id="editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className={`min-h-[${minHeight}] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-y rounded-none`}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4 mt-0 min-h-[200px] prose dark:prose-invert max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }} />
          ) : (
            <p className="text-muted-foreground">Không có nội dung để xem trước.</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center p-2 border-t">
        <div className="text-xs text-muted-foreground">
          Hỗ trợ định dạng <strong>Markdown</strong>
        </div>
        <Button onClick={handleSubmit} disabled={!content.trim()}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
