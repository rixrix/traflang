// TrafLang Code Generator Tests
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
  AssignmentExpression,
  TryStatement,
  CatchClause,
  ThrowStatement,
  SwitchStatement,
  SwitchCase,
  BreakStatement,
  ReturnStatement
} from '../types';

describe('CodeGenerator', () => {
  let generator: CodeGenerator;

  beforeEach(() => {
    generator = new CodeGenerator();
  });

  describe('Basic Program Generation', () => {
    it('should generate a simple StartEngine function', () => {
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
        },
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      
      expect(result).toContain('function main() {');
      expect(result).toContain('console.log("Hello World!");');
      expect(result).toContain('main();');
    });

    it('should generate variable declarations with correct mappings', () => {
      const program: Program = {
        type: 'Program',
        body: [
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
                id: { type: 'Identifier', name: 'maxSpeed', location: { line: 2, column: 1 } },
                init: { type: 'Literal', value: 120, raw: '120', location: { line: 2, column: 1 } }
              }
            ],
            location: { line: 2, column: 1 }
          }
        ],
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      
      expect(result).toContain('let speed = 60;');
      expect(result).toContain('const maxSpeed = 120;');
    });
  });

  describe('Expression Generation', () => {
    it('should map TrafLang operators to JavaScript operators', () => {
      const binaryExpr: BinaryExpression = {
        type: 'BinaryExpression',
        operator: 'Add',
        left: { type: 'Identifier', name: 'a', location: { line: 1, column: 1 } },
        right: { type: 'Identifier', name: 'b', location: { line: 1, column: 1 } },
        location: { line: 1, column: 1 }
      };

      const program: Program = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: binaryExpr,
            location: { line: 1, column: 1 }
          }
        ],
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain('a + b;');
    });

    it('should handle array expressions (Passengers)', () => {
      const arrayExpr: ArrayExpression = {
        type: 'ArrayExpression',
        elements: [
          { type: 'Literal', value: 'Alice', raw: '"Alice"', location: { line: 1, column: 1 } },
          { type: 'Literal', value: 'Bob', raw: '"Bob"', location: { line: 1, column: 1 } }
        ],
        location: { line: 1, column: 1 }
      };

      const program: Program = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: arrayExpr,
            location: { line: 1, column: 1 }
          }
        ],
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain('["Alice", "Bob"];');
    });

    it('should handle object expressions (Glove)', () => {
      const objectExpr: ObjectExpression = {
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
          }
        ],
        location: { line: 1, column: 1 }
      };

      const program: Program = {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: objectExpr,
            location: { line: 1, column: 1 }
          }
        ],
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain('brand: "Toyota"');
    });
  });

  describe('Control Flow Generation', () => {
    it('should generate if statements (CheckMirror)', () => {
      const ifStmt: IfStatement = {
        type: 'IfStatement',
        test: {
          type: 'BinaryExpression',
          operator: 'FasterThan',
          left: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
          right: { type: 'Literal', value: 60, raw: '60', location: { line: 1, column: 1 } },
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
                  { type: 'Literal', value: 'Too fast!', raw: '"Too fast!"', location: { line: 1, column: 1 } }
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
        body: [ifStmt],
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain('if (speed > 60)');
      expect(result).toContain('console.log("Too fast!");');
    });

    it('should generate while loops (WhileDriving)', () => {
      const whileStmt: WhileStatement = {
        type: 'WhileStatement',
        test: {
          type: 'BinaryExpression',
          operator: 'SlowerThan',
          left: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
          right: { type: 'Literal', value: 60, raw: '60', location: { line: 1, column: 1 } },
          location: { line: 1, column: 1 }
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: 'SetTo',
                left: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
                right: {
                  type: 'BinaryExpression',
                  operator: 'Add',
                  left: { type: 'Identifier', name: 'speed', location: { line: 1, column: 1 } },
                  right: { type: 'Literal', value: 1, raw: '1', location: { line: 1, column: 1 } },
                  location: { line: 1, column: 1 }
                },
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
        body: [whileStmt],
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain('while (speed < 60)');
      expect(result).toContain('speed = speed + 1;');
    });
  });

  describe('Error Handling Generation', () => {
    it('should generate try-catch-finally blocks', () => {
      const tryStmt: TryStatement = {
        type: 'TryStatement',
        block: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ThrowStatement',
              argument: { type: 'Literal', value: 'Error!', raw: '"Error!"', location: { line: 1, column: 1 } },
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
                  callee: { type: 'Identifier', name: 'Announce', location: { line: 1, column: 1 } },
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
                  { type: 'Literal', value: 'Finally!', raw: '"Finally!"', location: { line: 1, column: 1 } }
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
        body: [tryStmt],
        location: { line: 1, column: 1 }
      };

      const result = generator.generate(program);
      expect(result).toContain('try {');
      expect(result).toContain('throw "Error!";');
      expect(result).toContain('} catch(error) {');
      expect(result).toContain('console.log(error);');
      expect(result).toContain('} finally {');
      expect(result).toContain('console.log("Finally!");');
    });
  });

  describe('Built-in Function Mapping', () => {
    it('should map TrafLang built-in functions to JavaScript equivalents', () => {
      const builtinMappings = [
        { traf: 'Announce', js: 'console.log' },
        { traf: 'Warn', js: 'console.warn' },
        { traf: 'Alert', js: 'console.error' },
        { traf: 'RoundUp', js: 'Math.ceil' },
        { traf: 'RoundDown', js: 'Math.floor' },
        { traf: 'Random', js: 'Math.random' }
      ];

      builtinMappings.forEach(({ traf, js }) => {
        const program: Program = {
          type: 'Program',
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
        };

        const result = generator.generate(program);
        expect(result).toContain(`${js}();`);
      });
    });
  });

  describe('Method Name Mapping', () => {
    it('should map TrafLang method names to JavaScript equivalents', () => {
      const methodMappings = [
        { traf: 'PickUp', js: 'push' },
        { traf: 'DropOff', js: 'pop' },
        { traf: 'CheckEach', js: 'forEach' },
        { traf: 'Transform', js: 'map' },
        { traf: 'FilterPassengers', js: 'filter' }
      ];

      methodMappings.forEach(({ traf, js }) => {
        const program: Program = {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'arr', location: { line: 1, column: 1 } },
                  property: { type: 'Identifier', name: traf, location: { line: 1, column: 1 } },
                  computed: false,
                  location: { line: 1, column: 1 }
                },
                arguments: [],
                location: { line: 1, column: 1 }
              },
              location: { line: 1, column: 1 }
            }
          ],
          location: { line: 1, column: 1 }
        };

        const result = generator.generate(program);
        expect(result).toContain(`arr.${js}();`);
      });
    });
  });
});