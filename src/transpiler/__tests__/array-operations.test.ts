// TrafLang Array Operations Tests - Comprehensive testing for all array operations
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';

describe('TrafLang Array Operations', () => {
  function transpileCode(code: string): string {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    expect(lexErrors).toHaveLength(0);
    
    const parser = new Parser(tokens);
    const { program, errors: parseErrors } = parser.parse();
    expect(parseErrors).toHaveLength(0);
    
    const generator = new CodeGenerator();
    return generator.generate(program);
  }

  describe('Array Declaration (Passengers)', () => {
    test('should handle array declaration with Passengers keyword', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          Announce passengers
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('console.log(passengers);');
    });

    test('should handle empty array declaration', () => {
      const code = `
        StartEngine {
          Remember emptyList SetTo Passengers []
          Announce emptyList
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let emptyList = [];');
    });

    test('should handle mixed type arrays', () => {
      const code = `
        StartEngine {
          Remember mixed SetTo Passengers ["text", 42, Yes, Empty]
          Announce mixed
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let mixed = ["text", 42, true, null];');
    });
  });

  describe('Array Methods - Adding/Removing Elements', () => {
    test('should handle PickUp method (push)', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob"]
          passengers PickUp "Charlie"
          Announce passengers
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob"];');
      expect(result).toContain('passengers.push("Charlie");');
    });

    test('should handle DropOff method (pop)', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          Remember lastPassenger SetTo passengers DropOff
          Announce lastPassenger
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('let lastPassenger = passengers.pop();');
    });

    test('should handle FirstOut method (shift)', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          Remember firstPassenger SetTo passengers FirstOut
          Announce firstPassenger
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('let firstPassenger = passengers.shift();');
    });

    test('should handle FirstIn method (unshift)', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Bob", "Charlie"]
          passengers FirstIn "Alice"
          Announce passengers
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Bob", "Charlie"];');
      expect(result).toContain('passengers.unshift("Alice");');
    });
  });

  describe('Array Properties and Information', () => {
    test('should handle CountPassengers property (length)', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          Remember count SetTo passengers CountPassengers
          Announce count
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('let count = passengers.length;');
    });
  });

  describe('Array Search and Filter Methods', () => {
    test('should handle FindPassenger method (find)', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          Remember found SetTo passengers FindPassenger Drive CarryWith p { ParkCar p SameAs "Bob" }
          Announce found
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('let found = passengers.find(function(p) { return p == "Bob"; });');
    });

    test('should handle FilterPassengers method (filter)', () => {
      const code = `
        StartEngine {
          Remember numbers SetTo Passengers [1, 2, 3, 4, 5]
          Remember evens SetTo numbers FilterPassengers Drive CarryWith n { ParkCar n % 2 SameAs 0 }
          Announce evens
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let numbers = [1, 2, 3, 4, 5];');
      expect(result).toContain('let evens = numbers.filter(function(n) { return n % 2 == 0; });');
    });
  });

  describe('Array Iteration Methods', () => {
    test('should handle CheckEach method (forEach)', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          passengers CheckEach Drive CarryWith passenger {
            Announce passenger
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('passengers.forEach(function(passenger) {');
      expect(result).toContain('console.log(passenger);');
    });

    test('should handle Transform method (map)', () => {
      const code = `
        StartEngine {
          Remember numbers SetTo Passengers [1, 2, 3]
          Remember doubled SetTo numbers Transform Drive CarryWith n { ParkCar n Times 2 }
          Announce doubled
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let numbers = [1, 2, 3];');
      expect(result).toContain('let doubled = numbers.map(function(n) { return n * 2; });');
    });

    test('should handle Combine method (reduce)', () => {
      const code = `
        StartEngine {
          Remember numbers SetTo Passengers [1, 2, 3, 4]
          Remember sum SetTo numbers Combine Drive CarryWith acc CarryWith curr { ParkCar acc Add curr } 0
          Announce sum
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let numbers = [1, 2, 3, 4];');
      expect(result).toContain('let sum = numbers.reduce(function(acc, curr) { return acc + curr; }, 0);');
    });
  });

  describe('Array Access and Manipulation', () => {
    test('should handle array index access', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          Remember first SetTo passengers[0]
          Remember second SetTo passengers[1]
          Announce first
          Announce second
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('let first = passengers[0];');
      expect(result).toContain('let second = passengers[1];');
    });

    test('should handle array index assignment', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          passengers[1] SetTo "Robert"
          Announce passengers
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('passengers[1] = "Robert";');
    });
  });

  describe('Array Method Chaining', () => {
    test('should handle chained array methods', () => {
      const code = `
        StartEngine {
          Remember numbers SetTo Passengers [1, 2, 3, 4, 5]
          Remember result SetTo numbers FilterPassengers Drive CarryWith n { ParkCar n FasterThan 2 } Transform Drive CarryWith n { ParkCar n Times 2 }
          Announce result
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let numbers = [1, 2, 3, 4, 5];');
      expect(result).toContain('let result = numbers.filter(function(n) { return n > 2; }).map(function(n) { return n * 2; });');
    });

    test('should handle complex array method chaining', () => {
      const code = `
        StartEngine {
          Remember words SetTo Passengers ["hello", "world", "test", "array"]
          Remember result SetTo words FilterPassengers Drive CarryWith w { ParkCar w CountPassengers FasterThan 4 } Transform Drive CarryWith w { ParkCar w ToUpper }
          Announce result
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let words = ["hello", "world", "test", "array"];');
      expect(result).toContain('let result = words.filter(function(w) { return w.length > 4; }).map(function(w) { return w.toUpperCase(); });');
    });
  });

  describe('Array Operations in Expressions', () => {
    test('should handle array operations in conditional expressions', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob"]
          CheckMirror (passengers CountPassengers FasterThan 1) {
            Announce "Multiple passengers"
          } TakeAlternate {
            Announce "Single or no passengers"
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob"];');
      expect(result).toContain('if (passengers.length > 1) {');
      expect(result).toContain('console.log("Multiple passengers");');
    });

    test('should handle array operations in loops', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
          KeepDriving (Remember i SetTo 0; i SlowerThan passengers CountPassengers; i SpeedUp) {
            Announce passengers[i]
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob", "Charlie"];');
      expect(result).toContain('for (let i = 0; i < passengers.length; i++) {');
      expect(result).toContain('console.log(passengers[i]);');
    });
  });

  describe('Integration with Other Language Features', () => {
    test('should handle arrays in function parameters and returns', () => {
      const code = `
        Drive processPassengers CarryWith passengerList {
          Remember processed SetTo passengerList Transform Drive CarryWith p { ParkCar p ToUpper }
          ParkCar processed
        }
        
        StartEngine {
          Remember passengers SetTo Passengers ["alice", "bob", "charlie"]
          Remember result SetTo GoTo processPassengers Bring passengers
          Announce result
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function processPassengers(passengerList) {');
      expect(result).toContain('let processed = passengerList.map(function(p) { return p.toUpperCase(); });');
      expect(result).toContain('return processed;');
      expect(result).toContain('let passengers = ["alice", "bob", "charlie"];');
      expect(result).toContain('let result = processPassengers(passengers);');
    });

    test('should handle arrays with object elements', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers [
            Glove { name: "Alice", age: 30 },
            Glove { name: "Bob", age: 25 }
          ]
          Remember names SetTo passengers Transform Drive CarryWith p { ParkCar p.name }
          Announce names
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = [');
      expect(result).toContain('name: "Alice"');
      expect(result).toContain('age: 30');
      expect(result).toContain('name: "Bob"');
      expect(result).toContain('age: 25');
      expect(result).toContain('let names = passengers.map(function(p) { return p.name; });');
    });
  });

  describe('Array Edge Cases and Error Handling', () => {
    test('should handle nested arrays', () => {
      const code = `
        StartEngine {
          Remember matrix SetTo Passengers [
            Passengers [1, 2, 3],
            Passengers [4, 5, 6],
            Passengers [7, 8, 9]
          ]
          Remember firstRow SetTo matrix[0]
          Announce firstRow
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let matrix = [');
      expect(result).toContain('[1, 2, 3],');
      expect(result).toContain('[4, 5, 6],');
      expect(result).toContain('[7, 8, 9]');
      expect(result).toContain('let firstRow = matrix[0];');
    });

    test('should handle array operations with variables', () => {
      const code = `
        StartEngine {
          Remember passengers SetTo Passengers ["Alice", "Bob"]
          Remember newPassenger SetTo "Charlie"
          passengers PickUp newPassenger
          Remember count SetTo passengers CountPassengers
          Announce count
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let passengers = ["Alice", "Bob"];');
      expect(result).toContain('let newPassenger = "Charlie";');
      expect(result).toContain('passengers.push(newPassenger);');
      expect(result).toContain('let count = passengers.length;');
    });
  });
});