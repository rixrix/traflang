'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ActionButtons } from './action-buttons';
import { CodeEditor } from './code-editor';
import { OutputPanel } from './output-panel';
import { TabbedSidebar } from './components/tabbed-sidebar';
import { SaveLoadPanel } from './components/save-load-panel';
import { useJavaScriptRunner } from './hooks/use-javascript-runner';
import { useTranspiler } from './hooks/use-transpiler';
import { useLocalStorage } from './hooks/use-local-storage';
import { useToast } from './hooks/use-toast';
import { ToastContainer } from './components/toast';
import { Car, Gauge, Settings, ParkingCircle } from 'lucide-react';

export function TrafLangIDE() {
  const [trafCode, setTrafCode] = useState('');
  const [showSavePanel, setShowSavePanel] = useState(false);

  // Local storage hook
  const { savedCodes, saveCode, loadCode, deleteCode } = useLocalStorage();

  // Toast notifications
  const { toasts, showToast, removeToast } = useToast();

  // Use simple transpiler - back to basics
  const simpleTranspiler = useTranspiler();

  // Use JavaScript runner for execution
  const jsRunner = useJavaScriptRunner();

  // Use simple transpiler for all operations
  const activeTranspiler = simpleTranspiler;

  // Monitor transpiler state for toast notifications
  const prevIsTranspiling = useRef(false);
  useEffect(() => {
    // When transpilation finishes
    if (prevIsTranspiling.current && !activeTranspiler.isTranspiling) {
      if (activeTranspiler.errors.length === 0 && activeTranspiler.jsCode) {
        showToast(
          '✅ Route checked successfully! JavaScript ready.',
          'success',
          3000
        );
      } else if (activeTranspiler.errors.length > 0) {
        showToast(
          `❌ ${activeTranspiler.errors.length} road hazard${activeTranspiler.errors.length > 1 ? 's' : ''} detected!`,
          'error',
          4000
        );
      }
    }
    prevIsTranspiling.current = activeTranspiler.isTranspiling;
  }, [
    activeTranspiler.isTranspiling,
    activeTranspiler.errors.length,
    activeTranspiler.jsCode,
    showToast,
  ]);

  const updateTrafCode = useCallback((code: string) => {
    setTrafCode(code);
  }, []);

  const handleKeywordClick = useCallback(
    (keyword: string, snippet: string) => {
      // Insert snippet at current cursor position or append to end
      if (trafCode.trim() === '') {
        setTrafCode(snippet);
      } else {
        setTrafCode(prev => prev + '\n\n' + snippet);
      }
    },
    [trafCode]
  );

  const handleExampleClick = useCallback((example: string) => {
    // Replace current code with the example
    setTrafCode(example);
  }, []);

  const handleSaveCode = useCallback(
    (name: string) => {
      saveCode(name, trafCode);
    },
    [saveCode, trafCode]
  );

  const handleLoadCode = useCallback(
    (id: string) => {
      const loadedCode = loadCode(id);
      if (loadedCode) {
        setTrafCode(loadedCode);
      }
    },
    [loadCode]
  );

  const actions = {
    compile: () => {
      // StartEngine - Validate syntax (just transpile without errors)
      showToast('🚗 Starting engine and checking syntax...', 'info', 1000);
      simpleTranspiler.transpile(trafCode);
    },
    transpile: () => {
      // CheckRoute - Explicit transpilation
      const lines = trafCode.split('\n').length;
      const chars = trafCode.length;
      showToast(
        `🗺️ Checking route... (${lines} lines, ${chars} chars)`,
        'info',
        1000
      );
      simpleTranspiler.transpile(trafCode);
    },
    run: async () => {
      // HitTheRoad - Execute JavaScript
      const jsCodeToRun = activeTranspiler.jsCode;
      if (!jsCodeToRun.trim()) {
        simpleTranspiler.transpile(trafCode);
        // Wait a bit for transpilation, then run
        setTimeout(() => {
          jsRunner.run(simpleTranspiler.jsCode);
        }, 100);
      } else {
        await jsRunner.run(jsCodeToRun);
      }
    },
    clear: () => {
      setTrafCode('');
      jsRunner.clearOutput();
    },
    updateTrafCode,
  };

  // Create state object for ActionButtons
  const state = {
    trafCode,
    jsCode: activeTranspiler.jsCode,
    output: jsRunner.output,
    errors: activeTranspiler.errors,
    isRunning: jsRunner.isRunning,
    isCompiling: activeTranspiler.isTranspiling,
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Car className="w-6 h-6" />
              Traf
            </h1>
          </div>
        </div>
        <div className="text-sm text-indigo-200 mt-2">
          Write code with intuitive driving metaphors — StartEngine, Drive, CheckMirror — that compiles to clean JavaScript
        </div>
      </header>

      {/* Action Buttons Bar */}
      <div className="bg-indigo-50 border-b border-indigo-200 p-3">
        <ActionButtons actions={actions} state={state} />
      </div>

      {/* Main IDE Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tabbed with Keywords & Examples */}
        <TabbedSidebar
          onKeywordClick={handleKeywordClick}
          onExampleClick={handleExampleClick}
        />

        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="bg-white px-4 py-3 border-b border-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-indigo-700 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Traf Editor
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-indigo-500">
                  {trafCode.split('\n').length} lines
                </span>
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                  <Settings className="w-3 h-3 inline mr-1" />
                  Manual mode
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavePanel(!showSavePanel)}
                className="text-xs text-indigo-600 hover:bg-indigo-50"
              >
                <ParkingCircle className="w-4 h-4 mr-1" />
                {showSavePanel ? 'Hide Garage' : 'Show Garage'}
              </Button>
              <div className="text-xs text-indigo-500">
                💡 Use tabs on the left to browse keywords and examples
              </div>
            </div>
          </div>

          {/* Split Editor and Output */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="w-1/2 p-4">
              <CodeEditor
                value={trafCode}
                onChange={updateTrafCode}
                language="traflang"
              />
            </div>

            {/* Vertical Separator */}
            <Separator orientation="vertical" className="bg-indigo-300" />

            {/* Output Panel */}
            <div className="w-1/2 flex flex-col">
              {/* Output Header */}
              <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-200">
                <h2 className="font-semibold text-indigo-700 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  JavaScript & Output
                  {state.jsCode && (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                      Ready to run
                    </span>
                  )}
                </h2>
              </div>

              {/* Output Content */}
              <div className="flex-1 flex flex-col">
                <OutputPanel
                  jsCode={state.jsCode}
                  output={state.output}
                  errors={state.errors}
                  isRunning={state.isRunning}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Save/Load Panel */}
        {showSavePanel && (
          <SaveLoadPanel
            savedCodes={savedCodes}
            onSave={handleSaveCode}
            onLoad={handleLoadCode}
            onDelete={deleteCode}
            currentCode={trafCode}
          />
        )}
      </div>

      {/* Simple Elegant Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Car className="w-4 h-4 text-indigo-600" />
            <span className="font-medium">TrafLang</span>
            <span className="text-slate-400">v1.0.0</span>
          </div>

          <div className="text-slate-500 text-xs">
            Traf is a playful programming language that lets you write code
            using driving-themed syntax — like StartEngine, Drive, SpeedUp and
            SlowDown. It transpiles to JavaScript in real time using a built-in
            Monaco Editor, so you can see and run your code instantly.
          </div>

          <div className="text-xs text-slate-400">
            Built with Next.js & Monaco Editor
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
