'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import type { editor } from 'monaco-editor'

// Lazy load Monaco Editor to prevent build hangs
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[400px]">Loading editor...</div>,
})

interface PromptReadViewProps {
  content: string
  language?: string
  readOnly?: boolean
  onChange?: (value: string | undefined) => void
}

export function PromptReadView({
  content,
  language = 'markdown',
  readOnly = true,
  onChange,
}: PromptReadViewProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        height="400px"
        language={language}
        value={content}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontSize: 14,
          lineNumbers: 'on',
          folding: true,
          automaticLayout: true,
        }}
        theme="vs-dark"
      />
    </div>
  )
}

