// TrafLang language definition for Monaco Editor
import type { languages } from 'monaco-editor';

export const trafLangLanguageConfig: languages.LanguageConfiguration = {
  comments: {
    lineComment: 'DriverNote',
    blockComment: ['Manual', 'Manual']
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*#?region\\b'),
      end: new RegExp('^\\s*//\\s*#?endregion\\b')
    }
  }
};

export const trafLangTokenProvider: languages.IMonarchLanguage = {
  // Set defaultToken to invalid to see what tokens are not matched
  defaultToken: '',
  
  // Core language keywords (control flow and structure)
  coreKeywords: [
    'StartEngine', 'Drive', 'GoTo', 'ParkCar', 'CarryWith', 'Bring'
  ],

  // Variable declaration keywords
  variableKeywords: [
    'Remember', 'NeverForget', 'QuickNote', 'SetTo'
  ],

  // Control flow keywords
  controlKeywords: [
    'CheckMirror', 'TakeAlternate', 'ConsiderRoute', 'KeepDriving', 'WhileDriving',
    'StopCar', 'KeepGoing', 'ChooseRoute', 'IfRoute', 'DefaultRoute', 'Cruise', 
    'ManualDrive', 'TrafficLight', 'Through'
  ],

  // Data structure keywords
  dataKeywords: [
    'Passengers', 'Glove', 'Compartment'
  ],

  // Error handling keywords
  errorKeywords: [
    'TryRoute', 'IfLost', 'Finally', 'ThrowError'
  ],

  // Arithmetic operators
  arithmeticOps: [
    'Add', 'Subtract', 'Times', 'DivideBy', 'SpeedUp', 'SlowDown'
  ],
  
  // Comparison operators
  comparisonOps: [
    'SameAs', 'DifferentFrom', 'ExactlyLike', 'NotExactlyLike',
    'FasterThan', 'SlowerThan', 'AtLeastAs', 'AtMostAs'
  ],
  
  // Logical operators
  logicalOps: [
    'And', 'Or', 'Not'
  ],
  
  // String operations
  stringOps: [
    'Join', 'Contains', 'StartsWith', 'Split', 'Replace', 'ToUpper', 'ToLower'
  ],
  
  // Array operations
  arrayOps: [
    'PickUp', 'DropOff', 'FirstOut', 'FirstIn', 'CountPassengers',
    'FindPassenger', 'FilterPassengers', 'CheckEach', 'Transform', 'Combine'
  ],
  
  // Object operations
  objectOps: [
    'CheckCompartment', 'HasCompartment', 'ListCompartments', 'CheckContents'
  ],

  // Built-in functions
  builtins: [
    'Announce', 'Warn', 'Alert', 'WaitFor', 'Promise', 'DelayFor', 'RepeatEvery',
    'WhatType', 'IsTypeOf', 'Empty', 'Unknown', 'AskPassenger', 'Inspection',
    'RoundUp', 'RoundDown', 'Random'
  ],

  // Constants and literals
  constants: [
    'Yes', 'No', 'true', 'false', 'null', 'undefined'
  ],

  // Define token patterns
  tokenizer: {
    root: [
      // Comments (TrafLang style)
      [/DriverNote.*$/, 'comment.line'],
      [/Manual\b/, 'comment.block', '@blockComment'],
      
      // Strings with better escape handling
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
      [/"/, 'string', '@stringDouble'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
      [/'/, 'string', '@stringSingle'],
      
      // Numbers with better precision
      [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
      [/0[xX][\da-fA-F]+/, 'number.hex'],
      [/\d+[lL]?/, 'number'],
      
      // Identifiers with different token types based on category
      [/[a-zA-Z_$][\w$]*/, {
        cases: {
          '@coreKeywords': 'keyword.core',
          '@variableKeywords': 'keyword.variable',
          '@controlKeywords': 'keyword.control',
          '@dataKeywords': 'keyword.data',
          '@errorKeywords': 'keyword.error',
          '@arithmeticOps': 'operator.arithmetic',
          '@comparisonOps': 'operator.comparison',
          '@logicalOps': 'operator.logical',
          '@stringOps': 'operator.string',
          '@arrayOps': 'operator.array',
          '@objectOps': 'operator.object',
          '@builtins': 'support.function',
          '@constants': 'constant.language',
          '@default': 'identifier'
        }
      }],
      
      // Property access (dot notation)
      [/\./, 'operator.accessor'],
      
      // Brackets and delimiters
      [/[{}]/, 'punctuation.definition.block'],
      [/[()]/, 'punctuation.definition.parameters'],
      [/[\[\]]/, 'punctuation.definition.array'],
      [/[;,]/, 'punctuation.separator'],
      
      // Traditional operators (fallback)
      [/[+\-*\/=<>!&|%]/, 'operator.symbol'],
      
      // Whitespace
      { include: '@whitespace' }
    ],

    blockComment: [
      [/[^]*?Manual/, 'comment.block', '@pop'],
      [/[^]*/, 'comment.block']
    ],

    stringDouble: [
      [/[^\\"]+/, 'string'],
      [/\\["\\/bfnrt]/, 'string.escape'],
      [/\\u[0-9A-Fa-f]{4}/, 'string.escape'],
      [/\\x[0-9A-Fa-f]{2}/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],

    stringSingle: [
      [/[^\\']+/, 'string'],
      [/\\['\\/bfnrt]/, 'string.escape'],
      [/\\u[0-9A-Fa-f]{4}/, 'string.escape'],
      [/\\x[0-9A-Fa-f]{2}/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop']
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white']
    ]
  }
};

// Enhanced theme definition for TrafLang
export const trafLangTheme: languages.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    // Core language keywords (StartEngine, Drive, etc.) - Deep Blue
    { token: 'keyword.core', foreground: '1e40af', fontStyle: 'bold' },
    
    // Variable keywords (Remember, SetTo, etc.) - Green
    { token: 'keyword.variable', foreground: '059669', fontStyle: 'bold' },
    
    // Control flow keywords (CheckMirror, KeepDriving, etc.) - Purple
    { token: 'keyword.control', foreground: '7c2d12', fontStyle: 'bold' },
    
    // Data structure keywords (Passengers, Glove) - Teal
    { token: 'keyword.data', foreground: '0891b2', fontStyle: 'bold' },
    
    // Error handling keywords - Red
    { token: 'keyword.error', foreground: 'dc2626', fontStyle: 'bold' },
    
    // Arithmetic operators - Orange
    { token: 'operator.arithmetic', foreground: 'ea580c', fontStyle: 'bold' },
    
    // Comparison operators - Dark Orange
    { token: 'operator.comparison', foreground: 'c2410c', fontStyle: 'bold' },
    
    // Logical operators - Brown
    { token: 'operator.logical', foreground: '92400e', fontStyle: 'bold' },
    
    // String operators - Light Green
    { token: 'operator.string', foreground: '16a34a' },
    
    // Array operators - Blue-Green
    { token: 'operator.array', foreground: '0d9488' },
    
    // Object operators - Indigo
    { token: 'operator.object', foreground: '4338ca' },
    
    // Property accessor (dot)
    { token: 'operator.accessor', foreground: '374151' },
    
    // Symbol operators
    { token: 'operator.symbol', foreground: '6b7280' },
    
    // Built-in functions - Magenta
    { token: 'support.function', foreground: 'a21caf', fontStyle: 'italic' },
    
    // Constants - Dark Red
    { token: 'constant.language', foreground: 'b91c1c', fontStyle: 'bold' },
    
    // Strings - Forest Green
    { token: 'string', foreground: '166534' },
    { token: 'string.escape', foreground: '059669', fontStyle: 'bold' },
    { token: 'string.escape.invalid', foreground: 'dc2626', background: 'fef2f2' },
    { token: 'string.invalid', foreground: 'dc2626', background: 'fef2f2' },
    
    // Numbers - Dark Blue
    { token: 'number', foreground: '1e3a8a' },
    { token: 'number.float', foreground: '1e40af' },
    { token: 'number.hex', foreground: '4338ca' },
    
    // Comments - Gray with italic
    { token: 'comment.line', foreground: '6b7280', fontStyle: 'italic' },
    { token: 'comment.block', foreground: '6b7280', fontStyle: 'italic' },
    
    // Punctuation
    { token: 'punctuation.definition.block', foreground: '374151', fontStyle: 'bold' },
    { token: 'punctuation.definition.parameters', foreground: '4b5563' },
    { token: 'punctuation.definition.array', foreground: '0891b2', fontStyle: 'bold' },
    { token: 'punctuation.separator', foreground: '6b7280' },
    
    // Identifiers - Default black
    { token: 'identifier', foreground: '111827' },
    
    // Invalid tokens - Red background
    { token: 'invalid', foreground: 'dc2626', background: 'fef2f2' }
  ],
  colors: {
    // Editor background and basic colors
    'editor.background': '#ffffff',
    'editor.foreground': '#111827',
    
    // Line highlighting and selection
    'editor.lineHighlightBackground': '#f8fafc',
    'editor.selectionBackground': '#dbeafe',
    'editor.inactiveSelectionBackground': '#f1f5f9',
    
    // Cursor and line numbers
    'editorCursor.foreground': '#1e40af',
    'editorLineNumber.foreground': '#9ca3af',
    'editorLineNumber.activeForeground': '#4b5563',
    
    // Scrollbar and minimap
    'scrollbarSlider.background': '#e5e7eb88',
    'scrollbarSlider.hoverBackground': '#d1d5db88',
    'scrollbarSlider.activeBackground': '#9ca3af88',
    
    // Brackets and matching
    'editorBracketMatch.background': '#ddd6fe',
    'editorBracketMatch.border': '#8b5cf6',
    
    // Find and highlight
    'editor.findMatchBackground': '#fef3c7',
    'editor.findMatchHighlightBackground': '#fef3c7aa',
    'editor.wordHighlightBackground': '#e0e7ff',
    'editor.wordHighlightStrongBackground': '#dbeafe',
    
    // Gutter and fold
    'editorGutter.background': '#f9fafb',
    'editorGutter.foldingControlForeground': '#6b7280'
  }
};