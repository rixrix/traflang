'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import {
  trafLangLanguageConfig,
  trafLangTokenProvider,
  trafLangTheme,
} from './monaco/traflang-language';
import {
  FileText,
  Hash,
} from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'traflang',
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import('monaco-editor')
  ) => {
    editorRef.current = editor;

    // Register TrafLang language
    monaco.languages.register({ id: 'traflang' });

    // Set language configuration
    monaco.languages.setLanguageConfiguration(
      'traflang',
      trafLangLanguageConfig
    );

    // Set tokenization provider
    monaco.languages.setMonarchTokensProvider(
      'traflang',
      trafLangTokenProvider
    );

    // Define and set theme
    monaco.editor.defineTheme('traflang-theme', trafLangTheme);
    monaco.editor.setTheme('traflang-theme');

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: 'none',
      renderControlCharacters: false,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0,
      bracketPairColorization: { enabled: true },
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Could trigger save functionality here
      console.log('Save triggered');
    });

    // Focus editor
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const defaultCode = `DriverNote Welcome to TrafLang! 🚗
DriverNote Start your coding journey with driving metaphors

StartEngine {
  Remember message SetTo "Hello, TrafLang World!"
  Announce message
  
  DriverNote Try creating a simple function
  Remember numbers SetTo Passengers [1, 2, 3, 4, 5]
  Remember doubled SetTo numbers Transform Drive CarryWith n {
    ParkCar n Times 2
  }
  Announce doubled
}`;

  return (
    <div className="h-full flex flex-col">
      {/* Main Editor Container */}
      <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          language="traflang"
          value={value || ''}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            contextmenu: true,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            wordBasedSuggestions: 'off',
            parameterHints: { enabled: false },
            hover: { enabled: false },
          }}
          theme="traflang-theme"
        />
      </div>

      {/* Compact Professional Footer */}
      <div className="mt-3 bg-white border border-slate-200 rounded px-3 py-2 flex items-center justify-between text-xs text-slate-600">
        {/* Left - Language indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span className="font-medium text-indigo-700">TrafLang</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {value.split('\n').length} lines
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {value.length} chars
            </span>
          </div>
        </div>

        {/* Right - Editor info */}
        <div className="flex items-center gap-2 text-slate-500">
          <span>Monaco Editor</span>
          <span>•</span>
          <span>Manual Mode</span>
        </div>
      </div>
    </div>
  );
}
