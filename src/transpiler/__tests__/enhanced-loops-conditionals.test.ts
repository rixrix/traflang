// Enhanced Driving Terminology - Loops and Conditionals Tests
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';

describe('Enhanced Driving Terminology - Loops and Conditionals', () => {
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

  describe('Advanced Loop Constructs', () => {
    test('should transpile Cruise (for...of loops)', () => {
      const trafCode = `
        StartEngine {
          Remember items SetTo Passengers ["apple", "banana", "cherry"]
          Cruise (Remember item In items) {
            Announce item
          }
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let items = ["apple", "banana", "cherry"]');
      expect(result).toContain('for (let item of items)');
      expect(result).toContain('console.log(item)');
    });

    test('should transpile ManualDrive (manual iteration control)', () => {
      const trafCode = `
        StartEngine {
          ManualDrive (Remember i SetTo 0; i SlowerThan 5; i SpeedUp) {
            Announce i
          }
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('for (let i = 0; i < 5; i++)');
      expect(result).toContain('console.log(i)');
    });

    test('should transpile ManualDrive with existing variable', () => {
      const trafCode = `
        StartEngine {
          Remember counter SetTo 0
          ManualDrive (counter SetTo 0; counter SlowerThan 3; counter SpeedUp) {
            Announce "Count: " Join counter
          }
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let counter = 0');
      expect(result).toContain('for (counter = 0; counter < 3; counter++)');
      expect(result).toContain('console.log("Count: " + counter)');
    });
  });

  describe('Complex Conditional Logic', () => {
    test('should transpile TrafficLight (nested if-else statements)', () => {
      const trafCode = `
        StartEngine {
          Remember speed SetTo 60
          TrafficLight (speed FasterThan 80) {
            Announce "Too fast!"
          } TakeAlternate {
            Announce "Good speed"
          }
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let speed = 60');
      expect(result).toContain('if (speed > 80)');
      expect(result).toContain('console.log("Too fast!")');
      expect(result).toContain('} else {');
      expect(result).toContain('console.log("Good speed")');
    });

    test('should transpile TrafficLight with multiple conditions', () => {
      const trafCode = `
        StartEngine {
          Remember speed SetTo 45
          TrafficLight (speed FasterThan 80) {
            Announce "Speeding!"
          } ConsiderRoute (speed FasterThan 60) {
            Announce "Fast but legal"
          } TakeAlternate {
            Announce "Normal speed"
          }
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let speed = 45');
      expect(result).toContain('if (speed > 80)');
      expect(result).toContain('console.log("Speeding!")');
      expect(result).toContain('} else if (speed > 60)');
      expect(result).toContain('console.log("Fast but legal")');
      expect(result).toContain('} else {');
      expect(result).toContain('console.log("Normal speed")');
    });
  });

  describe('Combined Advanced Features', () => {
    test('should handle Cruise with enhanced features', () => {
      const trafCode = `
        StartEngine {
          Remember data SetTo Passengers [1, 2, 3, 4, 5]
          
          CheckMirror (Inspection(data)) {
            Cruise (Remember item In data) {
              Remember processed SetTo Turbo(item Times 2)
              Announce processed
            }
          }
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let data = [1, 2, 3, 4, 5]');
      expect(result).toContain('return data !== null && data !== undefined');
      expect(result).toContain('for (let item of data)');
      expect(result).toContain('let processed =');
      expect(result).toContain('/* TURBO: Optimized operation */');
      expect(result).toContain('(item * 2)');
      expect(result).toContain('console.log(processed)');
    });

    test('should handle ManualDrive with enhanced features', () => {
      const trafCode = `
        StartEngine {
          Remember results SetTo Passengers []
          
          ManualDrive (Remember i SetTo 0; i SlowerThan 3; i SpeedUp) {
            Remember value SetTo Calculate("Math.pow(2, " Join i Join ")")
            Remember optimized SetTo EcoMode(value)
            results PickUp optimized
          }
          
          Announce results
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let results = []');
      expect(result).toContain('for (let i = 0; i < 3; i++)');
      expect(result).toContain('let value =');
      expect(result).toContain('try {');
      expect(result).toContain('return eval(expr)');
      expect(result).toContain('let optimized =');
      expect(result).toContain('/* ECO: Memory efficient */');
      expect(result).toContain('results.push(optimized)');
      expect(result).toContain('console.log(results)');
    });

    test('should handle TrafficLight with validation and debugging', () => {
      const trafCode = `
        StartEngine {
          Remember input SetTo AskPassenger("Enter a number:")
          Remember parsed SetTo ReadSign(input)
          
          TrafficLight (Inspection(parsed)) {
            Remember diagnostic SetTo Diagnostic(parsed)
            Announce "Valid input processed"
          } TakeAlternate {
            Remember error SetTo "Invalid input"
            Mechanic(error)
          }
        }
      `;
      
      const result = transpile(trafCode);
      expect(result).toContain('let input =');
      expect(result).toContain('prompt("Enter a number:")');
      expect(result).toContain('let parsed =');
      expect(result).toContain('JSON.parse(text)');
      expect(result).toContain('return data !== null && data !== undefined');
      expect(result).toContain('let diagnostic =');
      expect(result).toContain('🔍 DIAGNOSTIC');
      expect(result).toContain('console.log("Valid input processed")');
      expect(result).toContain('let error = "Invalid input"');
      expect(result).toContain('🔧 MECHANIC');
    });
  });
});