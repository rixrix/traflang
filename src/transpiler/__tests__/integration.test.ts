// Integration test for complete TrafLang to JavaScript transpilation
import { CodeGenerator } from '../code-generator';
import {
  Program,
  FunctionDeclaration,
  VariableDeclaration,
  BlockStatement,
  ExpressionStatement,
  CallExpression,
  Identifier,
  Literal,
  BinaryExpression,
  ArrayExpression,
  AssignmentExpression
} from '../types';

describe('TrafLang Integration Tests', () => {
  let generator: CodeGenerator;

  beforeEach(() => {
    generator = new CodeGenerator();
  });

  it('should generate complete JavaScript from complex TrafLang program', () => {
    // Create a complex program manually with proper AST structure
    const calculateSpeedFunction: FunctionDeclaration = {
      type: 'FunctionDeclaration',
      name: 'calculateSpeed',
      parameters: [
        { name: 'distance' },
        { name: 'time' }
      ],
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ReturnStatement',
            argument: {
              type: 'BinaryExpression',
              operator: 'DivideBy',
              left: { type: 'Identifier', name: 'distance', location: { line: 1, column: 1 } },
              right: { type: 'Identifier', name: 'time', location: { line: 1, column: 1 } },
              location: { line: 1, column: 1 }
            },
            location: { line: 1, column: 1 }
          }
        ],
        location: { line: 1, column: 1 }
      },
      location: { line: 1, column: 1 }
    };

    const startEngineFunction: FunctionDeclaration = {
      type: 'FunctionDeclaration',
      name: 'StartEngine',
      parameters: [],
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'Remember',
            declarations: [
              {
                id: { type: 'Identifier', name: 'passengers', location: { line: 1, column: 1 } },
                init: {
                  type: 'ArrayExpression',
                  elements: [
                    { type: 'Literal', value: 'Alice', raw: '"Alice"', location: { line: 1, column: 1 } },
                    { type: 'Literal', value: 'Bob', raw: '"Bob"', location: { line: 1, column: 1 } }
                  ],
                  location: { line: 1, column: 1 }
                }
              }
            ],
            location: { line: 1, column: 1 }
          },
          {
            type: 'VariableDeclaration',
            kind: 'NeverForget',
            declarations: [
              {
                id: { type: 'Identifier', name: 'maxSpeed', location: { line: 1, column: 1 } },
                init: { type: 'Literal', value: 120, raw: '120', location: { line: 1, column: 1 } }
              }
            ],
            location: { line: 1, column: 1 }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: { type: 'Identifier', name: 'Announce', location: { line: 1, column: 1 } },
              arguments: [
                { type: 'Literal', value: 'Hello World!', raw: '"Hello World!"', location: { line: 1, column: 1 } }
              ],
              location: { line: 1, column: 1 }
            },
            location: { line: 1, column: 1 }
          }
        ],
        location: { line: 1, column: 1 }
      },
      location: { line: 1, column: 1 }
    };

    const program: Program = {
      type: 'Program',
      body: [calculateSpeedFunction],
      startEngine: startEngineFunction,
      location: { line: 1, column: 1 }
    };

    const result = generator.generate(program);

    // Verify the generated JavaScript contains expected elements
    expect(result).toContain('function calculateSpeed(distance, time)');
    expect(result).toContain('return distance / time;');
    expect(result).toContain('function main()');
    expect(result).toContain('let passengers = ["Alice", "Bob"];');
    expect(result).toContain('const maxSpeed = 120;');
    expect(result).toContain('console.log("Hello World!");');
    expect(result).toContain('main();');
  });

  it('should handle all operator mappings correctly', () => {
    const operatorTests = [
      { traf: 'Add', js: '+' },
      { traf: 'Subtract', js: '-' },
      { traf: 'Times', js: '*' },
      { traf: 'DivideBy', js: '/' },
      { traf: 'SameAs', js: '==' },
      { traf: 'ExactlyLike', js: '===' },
      { traf: 'FasterThan', js: '>' },
      { traf: 'SlowerThan', js: '<' },
      { traf: 'AtLeastAs', js: '>=' },
      { traf: 'AtMostAs', js: '<=' }
    ];

    operatorTests.forEach(({ traf, js }) => {
      const program: Program = {
        type: 'Program',
        body: [],
        startEngine: {
          type: 'FunctionDeclaration',
          name: 'StartEngine',
          parameters: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'BinaryExpression',
                  operator: traf,
                  left: { type: 'Identifier', name: 'a', location: { line: 1, column: 1 } },
                  right: { type: 'Identifier', name: 'b', location: { line: 1, column: 1 } },
                  location: { line: 1, column: 1 }
                },
                location: { line: 1, column: 1 }
              }
            ],
            location: { line: 1, column: 1 }
          },
          location: { line: 1, column: 1 }
        },
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain(`a ${js} b;`);
    });
  });

  it('should generate self-contained JavaScript with no imports/exports', () => {
    const program: Program = {
      type: 'Program',
      body: [],
      startEngine: {
        type: 'FunctionDeclaration',
        name: 'StartEngine',
        parameters: [],
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'Announce', location: { line: 1, column: 1 } },
                arguments: [
                  { type: 'Literal', value: 'Hello World', raw: '"Hello World"', location: { line: 1, column: 1 } }
                ],
                location: { line: 1, column: 1 }
              },
              location: { line: 1, column: 1 }
            }
          ],
          location: { line: 1, column: 1 }
        },
        location: { line: 1, column: 1 }
      },
      location: { line: 1, column: 1 }
    };

    const result = generator.generate(program);

    // Verify no import/export statements
    expect(result).not.toContain('import');
    expect(result).not.toContain('export');
    expect(result).not.toContain('require');
    expect(result).not.toContain('module.exports');

    // Verify it's self-contained with main function auto-call
    expect(result).toContain('function main()');
    expect(result).toContain('main();');
    expect(result).toContain('console.log("Hello World");');
  });

  it('should handle all built-in function mappings', () => {
    const builtinTests = [
      { traf: 'Announce', js: 'console.log' },
      { traf: 'Warn', js: 'console.warn' },
      { traf: 'Alert', js: 'console.error' },
      { traf: 'RoundUp', js: 'Math.ceil' },
      { traf: 'RoundDown', js: 'Math.floor' },
      { traf: 'Random', js: 'Math.random' }
    ];

    builtinTests.forEach(({ traf, js }) => {
      const program: Program = {
        type: 'Program',
        body: [],
        startEngine: {
          type: 'FunctionDeclaration',
          name: 'StartEngine',
          parameters: [],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: { type: 'Identifier', name: traf, location: { line: 1, column: 1 } },
                  arguments: [],
                  location: { line: 1, column: 1 }
                },
                location: { line: 1, column: 1 }
              }
            ],
            location: { line: 1, column: 1 }
          },
          location: { line: 1, column: 1 }
        },
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain(`${js}();`);
    });
  });
});