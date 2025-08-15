// Enhanced Driving Terminology Working Features Tests
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';

describe('Enhanced Driving Terminology - Working Features', () => {
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

  describe('Data Validation Constructs', () => {
    test('should transpile Inspection (data validation)', () => {
      const trafCode = `
        StartEngine {
          Remember data SetTo "test"
          Remember isValid SetTo Inspection(data)
          Announce isValid
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let data = "test"');
      expect(result).toContain('let isValid =');
      expect(result).toContain('return data !== null && data !== undefined');
      expect(result).toContain('console.log(isValid)');
    });

    test('should transpile PassInspection (validation success)', () => {
      const trafCode = `
        StartEngine {
          Remember isValid SetTo Yes
          Remember passed SetTo PassInspection(isValid)
          Announce passed
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let isValid = true');
      expect(result).toContain('let passed =');
      expect(result).toContain('(isValid) === true');
      expect(result).toContain('console.log(passed)');
    });
  });

  describe('Performance Constructs', () => {
    test('should transpile Turbo (optimization hints)', () => {
      const trafCode = `
        StartEngine {
          Remember value SetTo 42
          Remember optimized SetTo Turbo(value)
          Announce optimized
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let value = 42');
      expect(result).toContain('let optimized =');
      expect(result).toContain('/* TURBO: Optimized operation */');
      expect(result).toContain('(value)');
      expect(result).toContain('console.log(optimized)');
    });

    test('should transpile EcoMode (memory efficiency)', () => {
      const trafCode = `
        StartEngine {
          Remember data SetTo "efficient"
          Remember ecoResult SetTo EcoMode(data)
          Announce ecoResult
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let data = "efficient"');
      expect(result).toContain('let ecoResult =');
      expect(result).toContain('/* ECO: Memory efficient */');
      expect(result).toContain('(data)');
      expect(result).toContain('console.log(ecoResult)');
    });
  });

  describe('Debugging Constructs', () => {
    test('should transpile Mechanic (debugging mode)', () => {
      const trafCode = `
        StartEngine {
          Remember value SetTo 100
          Remember debugged SetTo Mechanic(value)
          Announce debugged
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let value = 100');
      expect(result).toContain('let debugged =');
      expect(result).toContain('console.debug(\'🔧 MECHANIC:\', value)');
      expect(result).toContain(', value)');
      expect(result).toContain('console.log(debugged)');
    });

    test('should transpile Diagnostic (error analysis)', () => {
      const trafCode = `
        StartEngine {
          Remember data SetTo Glove { name: "test", value: 42 }
          Remember analyzed SetTo Diagnostic(data)
          Announce analyzed
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let data = {');
      expect(result).toContain('name: "test"');
      expect(result).toContain('value: 42');
      expect(result).toContain('let analyzed =');
      expect(result).toContain('console.info(\'🔍 DIAGNOSTIC:\', typeof data, data)');
      expect(result).toContain('return data');
      expect(result).toContain('console.log(analyzed)');
    });
  });

  describe('File Operations', () => {
    test('should transpile LoadCargo (data loading)', () => {
      const trafCode = `
        StartEngine {
          Remember source SetTo "data.json"
          Remember loaded SetTo LoadCargo(source)
          Announce loaded
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let source = "data.json"');
      expect(result).toContain('let loaded =');
      expect(result).toContain('console.log(\'📦 LOADING CARGO from:\', source)');
      expect(result).toContain('return source');
      expect(result).toContain('console.log(loaded)');
    });

    test('should transpile UnloadCargo (data output)', () => {
      const trafCode = `
        StartEngine {
          Remember data SetTo Passengers [1, 2, 3]
          Remember unloaded SetTo UnloadCargo(data)
          Announce unloaded
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let data = [1, 2, 3]');
      expect(result).toContain('let unloaded =');
      expect(result).toContain('console.log(\'📤 UNLOADING CARGO:\', data)');
      expect(result).toContain('return data');
      expect(result).toContain('console.log(unloaded)');
    });
  });

  describe('User Input', () => {
    test('should transpile AskPassenger (input prompts)', () => {
      const trafCode = `
        StartEngine {
          Remember name SetTo AskPassenger("What is your name?")
          Announce name
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let name =');
      expect(result).toContain('prompt("What is your name?")');
      expect(result).toContain('console.log(name)');
    });

    test('should transpile ListenToRadio (event handling)', () => {
      const trafCode = `
        StartEngine {
          ListenToRadio("click", Drive CarryWith event {
            Announce "Button clicked!"
          })
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('addEventListener("click"');
      expect(result).toContain('function(event)');
      expect(result).toContain('console.log("Button clicked!")');
    });
  });

  describe('Calculation Prefixes', () => {
    test('should transpile Calculate (math operations)', () => {
      const trafCode = `
        StartEngine {
          Remember expression SetTo "2 + 3 * 4"
          Remember result SetTo Calculate(expression)
          Announce result
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let expression = "2 + 3 * 4"');
      expect(result).toContain('let result =');
      expect(result).toContain('try {');
      expect(result).toContain('return eval(expr)');
      expect(result).toContain('} catch(e) {');
      expect(result).toContain('console.warn(\'⚠️ CALCULATION ERROR:\', e.message)');
      expect(result).toContain('console.log(result)');
    });

    test('should transpile Measure (comparisons)', () => {
      const trafCode = `
        StartEngine {
          Remember a SetTo 10
          Remember b SetTo 5
          Remember comparison SetTo Measure(a, b)
          Announce comparison
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let a = 10');
      expect(result).toContain('let b = 5');
      expect(result).toContain('let comparison =');
      expect(result).toContain('if (a > b) return 1');
      expect(result).toContain('if (a < b) return -1');
      expect(result).toContain('return 0');
      expect(result).toContain('console.log(comparison)');
    });
  });

  describe('Text Processing', () => {
    test('should transpile ReadSign (parsing)', () => {
      const trafCode = `
        StartEngine {
          Remember jsonString SetTo '{"key": "value"}'
          Remember parsed SetTo ReadSign(jsonString)
          Announce parsed
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let jsonString = ');
      expect(result).toContain('let parsed =');
      expect(result).toContain('try {');
      expect(result).toContain('return JSON.parse(text)');
      expect(result).toContain('} catch(e) {');
      expect(result).toContain('return text.toString()');
      expect(result).toContain('console.log(parsed)');
    });

    test('should transpile WriteSign (formatting)', () => {
      const trafCode = `
        StartEngine {
          Remember data SetTo Glove { name: "test", value: 42 }
          Remember formatted SetTo WriteSign(data)
          Announce formatted
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let data = {');
      expect(result).toContain('name: "test"');
      expect(result).toContain('value: 42');
      expect(result).toContain('let formatted =');
      expect(result).toContain('if (typeof data === \'object\')');
      expect(result).toContain('return JSON.stringify(data, null, 2)');
      expect(result).toContain('return String(data)');
      expect(result).toContain('console.log(formatted)');
    });
  });

  describe('Collection Operations', () => {
    test('should transpile Formation (structured data)', () => {
      const trafCode = `
        StartEngine {
          Remember items SetTo Passengers ["a", "b", "c"]
          Remember structured SetTo Formation(items)
          Announce structured
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let items = ["a", "b", "c"]');
      expect(result).toContain('let structured =');
      expect(result).toContain('if (Array.isArray(data))');
      expect(result).toContain('return data.reduce((acc, item, index)');
      expect(result).toContain('acc[index] = item');
      expect(result).toContain('console.log(structured)');
    });

    test('should transpile Convoy (grouped operations)', () => {
      const trafCode = `
        StartEngine {
          Remember numbers SetTo Passengers [1, 2, 3, 4, 5]
          Remember doubled SetTo Convoy(numbers, "double")
          Announce doubled
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let numbers = [1, 2, 3, 4, 5]');
      expect(result).toContain('let doubled =');
      expect(result).toContain('(numbers || []).map("double")');
      expect(result).toContain('console.log(doubled)');
    });
  });

  describe('Complex Integration', () => {
    test('should handle multiple enhanced features together', () => {
      const trafCode = `
        StartEngine {
          Remember data SetTo Passengers [1, 2, 3, 4, 5]
          
          CheckMirror (Inspection(data)) {
            Remember turboValue SetTo Turbo(42)
            Remember formatted SetTo WriteSign(data)
            UnloadCargo(formatted)
          } TakeAlternate {
            Announce "Data validation failed!"
          }
        }
      `;
      
      const result = transpile(trafCode);
      
      // Check that all enhanced features are properly transpiled
      expect(result).toContain('let data = [1, 2, 3, 4, 5]');
      expect(result).toContain('return data !== null && data !== undefined');
      expect(result).toContain('let turboValue =');
      expect(result).toContain('/* TURBO: Optimized operation */');
      expect(result).toContain('let formatted =');
      expect(result).toContain('JSON.stringify(data, null, 2)');
      expect(result).toContain('📤 UNLOADING CARGO');
      expect(result).toContain('console.log("Data validation failed!")');
    });
  });
});