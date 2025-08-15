// Simple Enhanced Driving Terminology Tests
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';

describe('Enhanced Driving Terminology - Simple Tests', () => {
  const transpile = (code: string) => {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    
    if (lexErrors.length > 0) {
      throw new Error(`Lexer errors: ${lexErrors.map(e => e.message).join(', ')}`);
    }
    
    const parser = new Parser(tokens);
    const { program, errors: parseErrors } = parser.parse();
    
    if (parseErrors.length > 0) {
      throw new Error(`Parser errors: ${parseErrors.map(e => e.message).join(', ')}`);
    }
    
    const generator = new CodeGenerator();
    return generator.generate(program);
  };

  test('should transpile simple Inspection call', () => {
    const trafCode = `
      StartEngine {
        Remember data SetTo "test"
        Remember result SetTo Inspection(data)
      }
    `;
    
    const result = transpile(trafCode);
    expect(result).toContain('let data = "test"');
    expect(result).toContain('let result =');
    expect(result).toContain('return data !== null && data !== undefined');
  });

  test('should transpile simple Turbo call', () => {
    const trafCode = `
      StartEngine {
        Remember value SetTo 42
        Remember optimized SetTo Turbo(value)
      }
    `;
    
    const result = transpile(trafCode);
    expect(result).toContain('let value = 42');
    expect(result).toContain('let optimized =');
    expect(result).toContain('/* TURBO: Optimized operation */');
  });

  test('should transpile simple AskPassenger call', () => {
    const trafCode = `
      StartEngine {
        Remember name SetTo AskPassenger("What is your name?")
      }
    `;
    
    const result = transpile(trafCode);
    expect(result).toContain('let name =');
    expect(result).toContain('prompt("What is your name?")');
  });
});