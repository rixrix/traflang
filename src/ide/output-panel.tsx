import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { ResizablePane } from './components/resizable-pane';
import { CompilerError } from '../transpiler/types';
import {
  Code2,
  AlertTriangle,
  HelpCircle,
  Terminal,
  Map,
  CheckCircle,
  XCircle,
  Circle,
  MapPin,
} from 'lucide-react';

interface OutputPanelProps {
  jsCode: string;
  output: string;
  errors: CompilerError[];
  isRunning: boolean;
}

export function OutputPanel({
  jsCode,
  output,
  errors,
  isRunning,
}: OutputPanelProps) {
  const [bottomPane, setBottomPane] = useState<'console' | 'issues'>('console');
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleIssuesClick = () => {
    setBottomPane('issues');
  };

  const handleConsoleClick = () => {
    setBottomPane('console');
  };

  const handleJSEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import('monaco-editor')
  ) => {
    editorRef.current = editor;

    // Configure editor for JavaScript display
    editor.updateOptions({
      readOnly: true,
      fontSize: 13,
      lineHeight: 18,
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
      renderLineHighlight: 'none',
      selectOnLineNumbers: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: 'none',
      renderControlCharacters: false,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0,
      contextmenu: false,
      links: false,
      hover: { enabled: false },
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      tabCompletion: 'off',
      wordBasedSuggestions: 'off',
      parameterHints: { enabled: false },
    });
  };

  return (
    <div className="h-full bg-indigo-50">
      <Tabs defaultValue="javascript" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-indigo-100 rounded-none border-b border-indigo-200">
          <TabsTrigger
            value="javascript"
            className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <Code2 className="w-4 h-4" />
            JavaScript & Output
            {jsCode && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1 rounded">
                Ready
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="help"
            className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="javascript" className="h-full mt-0">
            <ResizablePane
              defaultSplit={50}
              minTopHeight={150}
              minBottomHeight={100}
              topContent={
                <div className="h-full bg-white">
                  {jsCode ? (
                    <div className="h-full">
                      <Editor
                        height="100%"
                        language="javascript"
                        value={jsCode}
                        onMount={handleJSEditorDidMount}
                        options={{
                          padding: { top: 12, bottom: 12 },
                          readOnly: true,
                          contextmenu: false,
                          quickSuggestions: false,
                          suggestOnTriggerCharacters: false,
                          acceptSuggestionOnEnter: 'off',
                          tabCompletion: 'off',
                          wordBasedSuggestions: 'off',
                          parameterHints: { enabled: false },
                          hover: { enabled: false },
                                            }}
                        theme="vs"
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-indigo-400 bg-slate-50">
                      <div className="text-center space-y-3">
                        <Map className="w-16 h-16 mx-auto text-indigo-300" />
                        <div className="text-lg font-medium text-indigo-600">
                          No route mapped yet
                        </div>
                        <div className="text-sm text-indigo-500">
                          Click &quot;CheckRoute&quot; to transpile your TrafLang code
                        </div>
                        <div className="bg-indigo-100 border border-indigo-200 rounded-lg p-3 mt-4 max-w-sm">
                          <div className="text-xs text-indigo-700">
                            <Code2 className="w-4 h-4 inline mr-1" />
                            <strong>JavaScript Preview:</strong> Transpiled code
                            will appear here with syntax highlighting
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              }
              bottomContent={
                <div className="h-full flex flex-col">
                  {/* Bottom Pane Header */}
                  <div className="bg-indigo-100 border-b border-indigo-200 px-4 py-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleConsoleClick}
                        className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                          bottomPane === 'console'
                            ? 'bg-indigo-600 text-white'
                            : 'text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        <Terminal className="w-4 h-4" />
                        Console
                        {output && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                            Output
                          </span>
                        )}
                      </button>
                      <button
                        onClick={handleIssuesClick}
                        className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                          bottomPane === 'issues'
                            ? 'bg-indigo-600 text-white'
                            : 'text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Issues
                        {errors.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-1 rounded">
                            {errors.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Pane Content */}
                  <div className="flex-1 overflow-hidden">
                    {bottomPane === 'console' && (
                      <div className="h-full bg-gray-900 text-gray-100 font-mono text-sm">
                        {output ? (
                          <div className="h-full overflow-auto">
                            {/* Console Header */}
                            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                              <span className="text-gray-400 text-xs ml-2">
                                🚗 TrafLang Console
                              </span>
                              <span className="text-gray-500 text-xs ml-auto">
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>

                            {/* Console Content */}
                            <div className="p-4">
                              <div className="mb-3 text-gray-400 text-xs border-b border-gray-700 pb-2">
                                <Terminal className="w-4 h-4 inline mr-2" />
                                Output from transpiled JavaScript:
                              </div>
                              <div className="space-y-1">
                                {output.split('\n').map((line, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="text-gray-500 text-xs mt-0.5 select-none min-w-[2rem] text-right">
                                      {index + 1}
                                    </span>
                                    <pre className="text-green-400 whitespace-pre-wrap leading-relaxed flex-1">
                                      {line || ' '}
                                    </pre>
                                  </div>
                                ))}
                              </div>
                              {isRunning && (
                                <div className="flex items-center gap-2 mt-4 text-yellow-400 border-t border-gray-700 pt-3">
                                  <Circle className="w-3 h-3 animate-pulse" />
                                  <span className="text-xs">
                                    Code is executing...
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 bg-gray-850">
                            <div className="text-center space-y-3">
                              <Terminal className="w-16 h-16 mx-auto text-gray-600" />
                              <div className="text-lg font-medium text-gray-300">
                                Console Ready
                              </div>
                              <div className="text-sm text-gray-500">
                                Click &quot;HitTheRoad&quot; to execute your code
                              </div>
                              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mt-4 max-w-sm">
                                <div className="text-xs text-gray-400">
                                  <Terminal className="w-4 h-4 inline mr-1" />
                                  <strong>Console Output:</strong> JavaScript
                                  execution results will appear here
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {bottomPane === 'issues' && (
                      <div className="h-full overflow-auto p-4 bg-white">
                        {errors.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-indigo-400">
                            <div className="text-center space-y-3">
                              <CheckCircle className="w-16 h-16 mx-auto text-emerald-400" />
                              <div className="text-lg font-medium text-emerald-700">
                                All clear! No road hazards detected.
                              </div>
                              <div className="text-sm text-indigo-500">
                                Your code is ready for the highway
                              </div>
                              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4">
                                <div className="text-xs text-emerald-700">
                                  <CheckCircle className="w-4 h-4 inline mr-1" />
                                  <strong>Great driving!</strong> Your TrafLang
                                  syntax is perfect.
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-red-800 font-semibold">
                                <AlertTriangle className="w-4 h-4" />
                                Road Hazards Detected
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                  {errors.length} issue
                                  {errors.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="text-sm text-red-600 mt-1">
                                Check the issues below and fix your route to
                                continue driving
                              </div>
                            </div>

                            {errors.map((error, index) => (
                              <Card
                                key={index}
                                className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="p-4 space-y-3">
                                  {/* Error Header */}
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      <XCircle className="w-5 h-5 text-red-600" />
                                      <span className="font-semibold text-red-800">
                                        Line {error.line}, Column {error.column}
                                      </span>
                                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                        {error.type}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      #{index + 1}
                                    </span>
                                  </div>

                                  {/* Error Message */}
                                  <div className="bg-white rounded-md p-3 border border-red-100">
                                    <code className="text-sm text-red-700 font-mono">
                                      {error.message}
                                    </code>
                                  </div>

                                  {/* Driving Tip */}
                                  {error.drivingMessage && (
                                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200 rounded-lg p-3">
                                      <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-1">
                                          <div className="text-xs font-semibold text-amber-800">
                                            Driving Navigation Tip:
                                          </div>
                                          <div className="text-xs text-amber-700">
                                            {error.drivingMessage}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          </TabsContent>

          <TabsContent value="help" className="h-full mt-0">
            <div className="h-full flex flex-col">
              <div
                className="flex-1 overflow-y-scroll bg-gradient-to-b from-blue-50 to-white"
                style={{
                  maxHeight: 'calc(100vh - 300px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#93c5fd #e0e7ff',
                }}
              >
                <div className="p-4 space-y-4 text-sm max-w-2xl pb-8">
                  <Card className="p-4 bg-white border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      🚗 Quick Start Guide
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                      <div className="bg-blue-50 p-3 rounded">
                        <strong className="text-blue-800">StartEngine:</strong>{' '}
                        Main function - every program starts here
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <strong className="text-green-800">Remember:</strong>{' '}
                        Create variables (like &apos;let&apos;)
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <strong className="text-purple-800">
                          NeverForget:
                        </strong>{' '}
                        Create constants (like &apos;const&apos;)
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <strong className="text-orange-800">Announce:</strong>{' '}
                        Print to console
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-green-200">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      🛣️ Control Flow
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                      <div className="bg-green-50 p-3 rounded">
                        <strong className="text-green-800">CheckMirror:</strong>{' '}
                        If statement
                      </div>
                      <div className="bg-yellow-50 p-3 rounded">
                        <strong className="text-yellow-800">
                          TakeAlternate:
                        </strong>{' '}
                        Else statement
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <strong className="text-blue-800">KeepDriving:</strong>{' '}
                        While loop
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <strong className="text-red-800">StopCar:</strong> Break
                        statement
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-orange-200">
                    <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                      🔧 Example Code
                    </h3>
                    <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                      <pre>
                        {`StartEngine {
  Remember speed SetTo 60
  CheckMirror (speed FasterThan 50) {
    Announce "Cruising at highway speed!"
  } TakeAlternate {
    Announce "City driving - slow down!"
  }
  
  Remember numbers SetTo Passengers [1, 2, 3]
  numbers CheckEach Drive CarryWith num {
    Announce "Number: " Join num
  }
}`}
                      </pre>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                    <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                      💡 Pro Driving Tips
                    </h3>
                    <div className="space-y-2 text-slate-700">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✅</span>
                        <span>
                          Start every program with{' '}
                          <code className="bg-white px-1 rounded text-blue-600 font-mono">
                            StartEngine
                          </code>
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✅</span>
                        <span>
                          Use{' '}
                          <code className="bg-white px-1 rounded text-green-600 font-mono">
                            DriverNote
                          </code>{' '}
                          for comments
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✅</span>
                        <span>
                          Click keywords in the sidebar to insert them
                          automatically
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600">💡</span>
                        <span>
                          Use the <strong>CheckRoute</strong> button to
                          transpile manually
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
