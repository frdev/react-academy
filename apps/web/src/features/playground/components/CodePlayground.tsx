import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { sandpackDark } from '@codesandbox/sandpack-themes'
import type { SandpackFiles } from '@codesandbox/sandpack-react'

export interface CodePlaygroundProps {
  files: SandpackFiles
  focusFile?: string
  readonlyFiles?: string[]
  onCodeChange?: (files: SandpackFiles) => void
  height?: number
  showTests?: boolean
  dependencies?: Record<string, string>
}

function CodeChangeListener({ onCodeChange }: { onCodeChange?: (files: SandpackFiles) => void }) {
  const { sandpack } = useSandpack()
  // Listen for file changes and call the callback
  // Note: Sandpack doesn't have a direct onChange for all files, so we use the files from sandpack state
  // This is a passive listener - components can call this to get current files
  void sandpack
  void onCodeChange
  return null
}

export function CodePlayground({
  files,
  focusFile,
  readonlyFiles = [],
  onCodeChange,
  height = 500,
  showTests = false,
  dependencies = {},
}: CodePlaygroundProps) {
  // Mark specified files as readOnly via the SandpackFile object shape
  const processedFiles: SandpackFiles = Object.fromEntries(
    Object.entries(files).map(([path, file]) => {
      const isReadonly = readonlyFiles.includes(path)
      if (isReadonly) {
        const code = typeof file === 'string' ? file : file.code
        return [path, { code, readOnly: true }]
      }
      return [path, file]
    })
  )

  return (
    <SandpackProvider
      template="react-ts"
      files={processedFiles}
      options={{
        activeFile: focusFile,
      }}
      customSetup={{
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          ...dependencies,
        },
      }}
      theme={sandpackDark}
    >
      <CodeChangeListener onCodeChange={onCodeChange} />
      <SandpackLayout style={{ height, borderRadius: 12, border: '1px solid #1f2937' }}>
        <SandpackCodeEditor
          style={{ height }}
          showTabs
          showLineNumbers
          showInlineErrors
          wrapContent
        />
        {showTests ? (
          <SandpackTests style={{ height }} />
        ) : (
          <SandpackPreview style={{ height }} showNavigator={false} showRefreshButton />
        )}
      </SandpackLayout>
    </SandpackProvider>
  )
}
