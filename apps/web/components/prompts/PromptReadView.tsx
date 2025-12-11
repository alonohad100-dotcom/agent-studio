'use client'

import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

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

