// Code Generator Demonstration Test
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
  IfStatement,
  WhileStatement,
  ArrayExpression,
  ObjectExpression,
  Property,
  TryStatement,
  CatchClause,
  ThrowStatement,
  SwitchStatement,
  SwitchCase,
  BreakStatement,
  ReturnStatement,
  UpdateExpression,
  MemberExpression,
  AssignmentExpression
} from '../types';

describe('Code Generator Comprehensive Demo', () => {
  let generator: CodeGenerator;

  beforeEach(() => {
    generator = new CodeGenerator();
  });

  it('should generate a comprehensive TrafLang program with all features', () => {
    // Create a comprehensive program that demonstrates all major features
    const helperFunction: FunctionDeclaration = {
      type: 'FunctionDeclaration',
      name: 'calculateDistance',
      parameters: [
        { name: 'speed' },
        { name: 'time' }
      ],
      body: {
        type: 'BlockStatement',
        body: [
          {
            type: 'ReturnStatement',
            argument: {
              type: 'BinaryExpression',
              operator: 'Times',
              left: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
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
          // Variable declarations
          {
            type: 'VariableDeclaration',
            kind: 'Remember',
            declarations: [
              {
                id: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
                init: { type: 'Literal', value: 60, raw: '60', location: { line: 1, column: 1 } }
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
          // Array (Passengers)
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
                    { type: 'Literal', value: 'Bob', raw: '"Bob"', location: { line: 1, column: 1 } },
                    { type: 'Literal', value: 'Charlie', raw: '"Charlie"', location: { line: 1, column: 1 } }
                  ],
                  location: { line: 1, column: 1 }
                }
              }
            ],
            location: { line: 1, column: 1 }
          },
          // Object (Glove)
          {
            type: 'VariableDeclaration',
            kind: 'Remember',
            declarations: [
              {
                id: { type: 'Identifier', name: 'car', location: { line: 1, column: 1 } },
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: { type: 'Identifier', name: 'brand', location: { line: 1, column: 1 } },
                      value: { type: 'Literal', value: 'Toyota', raw: '"Toyota"', location: { line: 1, column: 1 } },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      computed: false,
                      location: { line: 1, column: 1 }
                    },
                    {
                      type: 'Property',
                      key: { type: 'Identifier', name: 'fuel', location: { line: 1, column: 1 } },
                      value: { type: 'Literal', value: 50, raw: '50', location: { line: 1, column: 1 } },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      computed: false,
                      location: { line: 1, column: 1 }
                    }
                  ],
                  location: { line: 1, column: 1 }
                }
              }
            ],
            location: { line: 1, column: 1 }
          },
          // If statement (CheckMirror)
          {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              operator: 'FasterThan',
              left: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
              right: { type: 'Literal', value: 50, raw: '50', location: { line: 1, column: 1 } },
              location: { line: 1, column: 1 }
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: { type: 'Identifier', name: 'Announce', location: { line: 1, column: 1 } },
                    arguments: [
                      { type: 'Literal', value: 'Driving fast!', raw: '"Driving fast!"', location: { line: 1, column: 1 } }
                    ],
                    location: { line: 1, column: 1 }
                  },
                  location: { line: 1, column: 1 }
                }
              ],
              location: { line: 1, column: 1 }
            },
            alternate: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: { type: 'Identifier', name: 'Announce', location: { line: 1, column: 1 } },
                    arguments: [
                      { type: 'Literal', value: 'Driving safely', raw: '"Driving safely"', location: { line: 1, column: 1 } }
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
          // While loop
          {
            type: 'WhileStatement',
            test: {
              type: 'BinaryExpression',
              operator: 'SlowerThan',
              left: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
              right: { type: 'Identifier', name: 'maxSpeed', location: { line: 1, column: 1 } },
              location: { line: 1, column: 1 }
            },
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
                    prefix: false,
                    location: { line: 1, column: 1 }
                  },
                  location: { line: 1, column: 1 }
                },
                {
                  type: 'BreakStatement',
                  label: null,
                  location: { line: 1, column: 1 }
                }
              ],
              location: { line: 1, column: 1 }
            },
            location: { line: 1, column: 1 }
          },
          // Try-catch-finally
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ThrowStatement',
                  argument: { type: 'Literal', value: 'Engine failure!', raw: '"Engine failure!"', location: { line: 1, column: 1 } },
                  location: { line: 1, column: 1 }
                }
              ],
              location: { line: 1, column: 1 }
            },
            handler: {
              type: 'CatchClause',
              param: { type: 'Identifier', name: 'error', location: { line: 1, column: 1 } },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: { type: 'Identifier', name: 'Alert', location: { line: 1, column: 1 } },
                      arguments: [{ type: 'Identifier', name: 'error', location: { line: 1, column: 1 } }],
                      location: { line: 1, column: 1 }
                    },
                    location: { line: 1, column: 1 }
                  }
                ],
                location: { line: 1, column: 1 }
              },
              location: { line: 1, column: 1 }
            },
            finalizer: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: { type: 'Identifier', name: 'Announce', location: { line: 1, column: 1 } },
                    arguments: [
                      { type: 'Literal', value: 'Trip completed', raw: '"Trip completed"', location: { line: 1, column: 1 } }
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
          // Function call
          {
            type: 'VariableDeclaration',
            kind: 'Remember',
            declarations: [
              {
                id: { type: 'Identifier', name: 'distance', location: { line: 1, column: 1 } },
                init: {
                  type: 'CallExpression',
                  callee: { type: 'Identifier', name: 'calculateDistance', location: { line: 1, column: 1 } },
                  arguments: [
                    { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
                    { type: 'Literal', value: 2, raw: '2', location: { line: 1, column: 1 } }
                  ],
                  location: { line: 1, column: 1 }
                }
              }
            ],
            location: { line: 1, column: 1 }
          },
          // Array method call
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: 'passengers', location: { line: 1, column: 1 } },
                property: { type: 'Identifier', name: 'CheckEach', location: { line: 1, column: 1 } },
                computed: false,
                location: { line: 1, column: 1 }
              },
              arguments: [
                {
                  type: 'FunctionExpression',
                  id: null,
                  params: [{ name: 'passenger' }],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'CallExpression',
                          callee: { type: 'Identifier', name: 'Announce', location: { line: 1, column: 1 } },
                          arguments: [{ type: 'Identifier', name: 'passenger', location: { line: 1, column: 1 } }],
                          location: { line: 1, column: 1 }
                        },
                        location: { line: 1, column: 1 }
                      }
                    ],
                    location: { line: 1, column: 1 }
                  },
                  generator: false,
                  async: false,
                  location: { line: 1, column: 1 }
                }
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
      body: [helperFunction],
      startEngine: startEngineFunction,
      location: { line: 1, column: 1 }
    };

    const result = generator.generate(program);

    console.log('Generated JavaScript:');
    console.log('===================');
    console.log(result);
    console.log('===================');

    // Verify all major features are present
    expect(result).toContain('function calculateDistance(speed, time)');
    expect(result).toContain('return speed * time;');
    expect(result).toContain('function main()');
    expect(result).toContain('let speed = 60;');
    expect(result).toContain('const maxSpeed = 120;');
    expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
    expect(result).toContain('brand: "Toyota"');
    expect(result).toContain('fuel: 50');
    expect(result).toContain('if (speed > 50)');
    expect(result).toContain('console.log("Driving fast!");');
    expect(result).toContain('console.log("Driving safely");');
    expect(result).toContain('while (speed < maxSpeed)');
    expect(result).toContain('speed++;');
    expect(result).toContain('break;');
    expect(result).toContain('try {');
    expect(result).toContain('throw "Engine failure!";');
    expect(result).toContain('} catch(error) {');
    expect(result).toContain('console.error(error);');
    expect(result).toContain('} finally {');
    expect(result).toContain('console.log("Trip completed");');
    expect(result).toContain('let distance = calculateDistance(speed, 2);');
    expect(result).toContain('passengers.forEach(function(passenger)');
    expect(result).toContain('console.log(passenger);');
    expect(result).toContain('main();');

    // Verify it's self-contained
    expect(result).not.toContain('import');
    expect(result).not.toContain('export');
    expect(result).not.toContain('require');
  });
});