// Simple Object Operations Test
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';

describe('Simple Object Operations', () => {
  function transpileCode(code: string): { result: string; errors: unknown[] } {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    
    const parser = new Parser(tokens);
    const { program, errors: parseErrors } = parser.parse();
    
    const generator = new CodeGenerator();
    const result = generator.generate(program);
    
    return { result, errors: [...lexErrors, ...parseErrors] };
  }

  test('should handle basic object declaration', () => {
    const code = `
      StartEngine {
        Remember car SetTo Glove {
          brand: "Toyota",
          speed: 60
        }
        Announce car
      }
    `;
    
    const { result, errors } = transpileCode(code);
    console.log('Errors:', errors);
    console.log('Result:', result);
    
    expect(result).toContain('let car = {');
    expect(result).toContain('brand: "Toyota"');
    expect(result).toContain('speed: 60');
  });

  test('should handle basic property access with Compartment', () => {
    const code = `
      StartEngine {
        Remember car SetTo Glove { brand: "Toyota" }
        Remember brand SetTo car Compartment brand
        Announce brand
      }
    `;
    
    const { result, errors } = transpileCode(code);
    console.log('Errors:', errors);
    console.log('Result:', result);
    
    expect(result).toContain('let brand = car.brand');
  });

  test('should handle CheckCompartment method', () => {
    const code = `
      StartEngine {
        Remember car SetTo Glove { brand: "Toyota" }
        Remember brand SetTo car CheckCompartment brand
        Announce brand
      }
    `;
    
    const { result, errors } = transpileCode(code);
    console.log('Errors:', errors);
    console.log('Result:', result);
    
    expect(result).toContain('let brand = car.brand');
  });

  test('should handle HasCompartment method', () => {
    const code = `
      StartEngine {
        Remember car SetTo Glove { brand: "Toyota" }
        Remember hasBrand SetTo car HasCompartment "brand"
        Announce hasBrand
      }
    `;
    
    const { result, errors } = transpileCode(code);
    console.log('Errors:', errors);
    console.log('Result:', result);
    
    expect(result).toContain('let hasBrand = car.hasOwnProperty("brand")');
  });

  test('should handle ListCompartments function', () => {
    const code = `
      StartEngine {
        Remember car SetTo Glove { brand: "Toyota", speed: 60 }
        Remember keys SetTo ListCompartments car
        Announce keys
      }
    `;
    
    const { result, errors } = transpileCode(code);
    console.log('Errors:', errors);
    console.log('Result:', result);
    
    expect(result).toContain('let keys = Object.keys(car)');
  });

  test('should handle CheckContents function', () => {
    const code = `
      StartEngine {
        Remember car SetTo Glove { brand: "Toyota", speed: 60 }
        Remember values SetTo CheckContents car
        Announce values
      }
    `;
    
    const { result, errors } = transpileCode(code);
    console.log('Errors:', errors);
    console.log('Result:', result);
    
    expect(result).toContain('let values = Object.values(car)');
  });
});