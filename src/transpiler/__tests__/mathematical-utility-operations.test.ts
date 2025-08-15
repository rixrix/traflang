// TrafLang Mathematical and Utility Operations Tests - Comprehensive testing for all math and utility operations
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';
import { TokenType } from '../types';

describe('TrafLang Mathematical and Utility Operations', () => {
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

  describe('Mathematical Operations', () => {
    test('should handle RoundUp operation (Math.ceil)', () => {
      const code = `
        StartEngine {
          Remember value SetTo 4.3
          Remember rounded SetTo RoundUp value
          Announce rounded
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = 4.3;');
      expect(result).toContain('let rounded = Math.ceil(value);');
      expect(result).toContain('console.log(rounded);');
    });

    test('should handle RoundDown operation (Math.floor)', () => {
      const code = `
        StartEngine {
          Remember value SetTo 4.7
          Remember rounded SetTo RoundDown value
          Announce rounded
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = 4.7;');
      expect(result).toContain('let rounded = Math.floor(value);');
      expect(result).toContain('console.log(rounded);');
    });

    test('should handle Random operation (Math.random)', () => {
      const code = `
        StartEngine {
          Remember randomValue SetTo Random
          Announce randomValue
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let randomValue = Math.random();');
      expect(result).toContain('console.log(randomValue);');
    });

    test('should handle complex mathematical expressions', () => {
      const code = `
        StartEngine {
          Remember value SetTo 4.7
          Remember result SetTo RoundUp (value Times Random)
          Announce result
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = 4.7;');
      expect(result).toContain('let result = Math.ceil(value * Math.random());');
    });

    test('should handle mathematical operations in function calls', () => {
      const code = `
        Drive calculateArea CarryWith radius {
          Remember pi SetTo 3.14159
          Remember area SetTo pi Times radius Times radius
          ParkCar RoundUp area
        }
        
        StartEngine {
          Remember result SetTo GoTo calculateArea Bring 5.5
          Announce result
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function calculateArea(radius) {');
      expect(result).toContain('let pi = 3.14159;');
      expect(result).toContain('let area = pi * radius * radius;');
      expect(result).toContain('return Math.ceil(area);');
      expect(result).toContain('let result = calculateArea(5.5);');
    });
  });

  describe('Type Checking Operations', () => {
    test('should handle WhatType operation (typeof)', () => {
      const code = `
        StartEngine {
          Remember value SetTo 42
          Remember valueType SetTo WhatType value
          Announce valueType
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = 42;');
      expect(result).toContain('let valueType = typeof value;');
      expect(result).toContain('console.log(valueType);');
    });

    test('should handle IsTypeOf operation (instanceof)', () => {
      const code = `
        StartEngine {
          Remember arr SetTo Passengers [1, 2, 3]
          Remember isArray SetTo arr IsTypeOf Array
          Announce isArray
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let arr = [1, 2, 3];');
      expect(result).toContain('let isArray = arr instanceof Array;');
      expect(result).toContain('console.log(isArray);');
    });

    test('should handle type checking in conditional expressions', () => {
      const code = `
        StartEngine {
          Remember value SetTo "hello"
          CheckMirror (WhatType value SameAs "string") {
            Announce "It's a string!"
          } TakeAlternate {
            Announce "Not a string"
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = "hello";');
      expect(result).toContain('if (typeof value == "string") {');
      expect(result).toContain('console.log("It\'s a string!");');
      expect(result).toContain('} else {');
      expect(result).toContain('console.log("Not a string");');
    });

    test('should handle complex type checking scenarios', () => {
      const code = `
        Drive checkType CarryWith input {
          Remember inputType SetTo WhatType input
          CheckMirror (inputType SameAs "number") {
            ParkCar "It's a number"
          } ConsiderRoute (inputType SameAs "string") {
            ParkCar "It's a string"
          } TakeAlternate {
            ParkCar "Unknown type"
          }
        }
        
        StartEngine {
          Remember result1 SetTo GoTo checkType Bring 42
          Remember result2 SetTo GoTo checkType Bring "hello"
          Announce result1
          Announce result2
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function checkType(input) {');
      expect(result).toContain('let inputType = typeof input;');
      expect(result).toContain('if (inputType == "number") {');
      expect(result).toContain('return "It\'s a number";');
      expect(result).toContain('} else if (inputType == "string") {');
      expect(result).toContain('return "It\'s a string";');
    });
  });

  describe('Null and Undefined Handling', () => {
    test('should handle Empty value (null)', () => {
      const code = `
        StartEngine {
          Remember value SetTo Empty
          Announce value
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = null;');
      expect(result).toContain('console.log(value);');
    });

    test('should handle Unknown value (undefined)', () => {
      const code = `
        StartEngine {
          Remember value SetTo Unknown
          Announce value
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = undefined;');
      expect(result).toContain('console.log(value);');
    });

    test('should handle null/undefined checking', () => {
      const code = `
        StartEngine {
          Remember value SetTo Empty
          CheckMirror (value SameAs Empty) {
            Announce "Value is null"
          }
          
          Remember other SetTo Unknown
          CheckMirror (other SameAs Unknown) {
            Announce "Other is undefined"
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let value = null;');
      expect(result).toContain('if (value == null) {');
      expect(result).toContain('let other = undefined;');
      expect(result).toContain('if (other == undefined) {');
    });

    test('should handle null/undefined in function parameters', () => {
      const code = `
        Drive processValue CarryWith input {
          CheckMirror (input SameAs Empty) {
            ParkCar "Input is null"
          } ConsiderRoute (input SameAs Unknown) {
            ParkCar "Input is undefined"
          } TakeAlternate {
            ParkCar input
          }
        }
        
        StartEngine {
          Remember result1 SetTo GoTo processValue Bring Empty
          Remember result2 SetTo GoTo processValue Bring Unknown
          Remember result3 SetTo GoTo processValue Bring "valid"
          Announce result1
          Announce result2
          Announce result3
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function processValue(input) {');
      expect(result).toContain('if (input == null) {');
      expect(result).toContain('return "Input is null";');
      expect(result).toContain('} else if (input == undefined) {');
      expect(result).toContain('return "Input is undefined";');
      expect(result).toContain('let result1 = processValue(null);');
      expect(result).toContain('let result2 = processValue(undefined);');
      expect(result).toContain('let result3 = processValue("valid");');
    });
  });

  describe('Boolean Values', () => {
    test('should handle Yes value (true)', () => {
      const code = `
        StartEngine {
          Remember isActive SetTo Yes
          Announce isActive
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let isActive = true;');
      expect(result).toContain('console.log(isActive);');
    });

    test('should handle No value (false)', () => {
      const code = `
        StartEngine {
          Remember isActive SetTo No
          Announce isActive
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let isActive = false;');
      expect(result).toContain('console.log(isActive);');
    });

    test('should handle boolean operations', () => {
      const code = `
        StartEngine {
          Remember a SetTo Yes
          Remember b SetTo No
          Remember result1 SetTo a And b
          Remember result2 SetTo a Or b
          Remember result3 SetTo Not a
          Announce result1
          Announce result2
          Announce result3
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let a = true;');
      expect(result).toContain('let b = false;');
      expect(result).toContain('let result1 = a && b;');
      expect(result).toContain('let result2 = a || b;');
      expect(result).toContain('let result3 = !a;');
    });

    test('should handle boolean values in conditional expressions', () => {
      const code = `
        StartEngine {
          Remember isReady SetTo Yes
          CheckMirror (isReady SameAs Yes) {
            Announce "System is ready"
          } TakeAlternate {
            Announce "System not ready"
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let isReady = true;');
      expect(result).toContain('if (isReady == true) {');
      expect(result).toContain('console.log("System is ready");');
    });
  });

  describe('Timing Functions', () => {
    test('should handle DelayFor operation (setTimeout)', () => {
      const code = `
        StartEngine {
          DelayFor Drive {
            Announce "Delayed message"
          } 1000
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('setTimeout(function() {');
      expect(result).toContain('console.log("Delayed message");');
      expect(result).toContain('}, 1000);');
    });

    test('should handle RepeatEvery operation (setInterval)', () => {
      const code = `
        StartEngine {
          RepeatEvery Drive {
            Announce "Repeated message"
          } 2000
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('setInterval(function() {');
      expect(result).toContain('console.log("Repeated message");');
      expect(result).toContain('}, 2000);');
    });

    test('should handle timing functions with variables', () => {
      const code = `
        StartEngine {
          Remember delay SetTo 1500
          Remember message SetTo "Hello after delay"
          DelayFor Drive {
            Announce message
          } delay
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let delay = 1500;');
      expect(result).toContain('let message = "Hello after delay";');
      expect(result).toContain('setTimeout(function() {');
      expect(result).toContain('console.log(message);');
      expect(result).toContain('}, delay);');
    });

    test('should handle timing functions in complex scenarios', () => {
      const code = `
        Drive startTimer CarryWith duration CarryWith callback {
          DelayFor callback duration
        }
        
        StartEngine {
          GoTo startTimer Bring 3000 Bring Drive {
            Announce "Timer finished!"
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function startTimer(duration, callback) {');
      expect(result).toContain('setTimeout(callback, duration);');
      expect(result).toContain('startTimer(3000, function() {');
      expect(result).toContain('console.log("Timer finished!");');
    });
  });

  describe('Combined Operations', () => {
    test('should handle mathematical operations with type checking', () => {
      const code = `
        Drive safeAdd CarryWith a CarryWith b {
          CheckMirror (WhatType a SameAs "number" And WhatType b SameAs "number") {
            ParkCar a Add b
          } TakeAlternate {
            ParkCar Empty
          }
        }
        
        StartEngine {
          Remember result1 SetTo GoTo safeAdd Bring 5 Bring 3
          Remember result2 SetTo GoTo safeAdd Bring "5" Bring 3
          Announce result1
          Announce result2
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function safeAdd(a, b) {');
      expect(result).toContain('if (typeof a == "number" && typeof b == "number") {');
      expect(result).toContain('return a + b;');
      expect(result).toContain('} else {');
      expect(result).toContain('return null;');
    });

    test('should handle random number generation with rounding', () => {
      const code = `
        Drive randomInt CarryWith min CarryWith max {
          Remember range SetTo max Subtract min
          Remember randomFloat SetTo Random Times range Add min
          ParkCar RoundDown randomFloat
        }
        
        StartEngine {
          Remember dice SetTo GoTo randomInt Bring 1 Bring 7
          Announce dice
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function randomInt(min, max) {');
      expect(result).toContain('let range = max - min;');
      expect(result).toContain('let randomFloat = Math.random() * range + min;');
      expect(result).toContain('return Math.floor(randomFloat);');
      expect(result).toContain('let dice = randomInt(1, 7);');
    });

    test('should handle boolean operations with null checking', () => {
      const code = `
        Drive isValidValue CarryWith value {
          Remember isNotNull SetTo Not (value SameAs Empty)
          Remember isNotUndefined SetTo Not (value SameAs Unknown)
          ParkCar isNotNull And isNotUndefined
        }
        
        StartEngine {
          Remember test1 SetTo GoTo isValidValue Bring "hello"
          Remember test2 SetTo GoTo isValidValue Bring Empty
          Remember test3 SetTo GoTo isValidValue Bring Unknown
          Announce test1
          Announce test2
          Announce test3
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function isValidValue(value) {');
      expect(result).toContain('let isNotNull = !(value == null);');
      expect(result).toContain('let isNotUndefined = !(value == undefined);');
      expect(result).toContain('return isNotNull && isNotUndefined;');
      expect(result).toContain('let test1 = isValidValue("hello");');
      expect(result).toContain('let test2 = isValidValue(null);');
      expect(result).toContain('let test3 = isValidValue(undefined);');
    });

    test('should handle timing with mathematical operations', () => {
      const code = `
        StartEngine {
          Remember baseDelay SetTo 1000
          Remember randomDelay SetTo baseDelay Add RoundUp (Random Times 2000)
          
          DelayFor Drive {
            Announce "Random delay completed"
          } randomDelay
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let baseDelay = 1000;');
      expect(result).toContain('let randomDelay = baseDelay + Math.ceil(Math.random() * 2000);');
      expect(result).toContain('setTimeout(function() {');
      expect(result).toContain('console.log("Random delay completed");');
      expect(result).toContain('}, randomDelay);');
    });
  });

  describe('Error Cases and Edge Cases', () => {
    test('should handle mathematical operations with edge values', () => {
      const code = `
        StartEngine {
          Remember zero SetTo 0
          Remember negative SetTo -5.7
          Remember result1 SetTo RoundUp zero
          Remember result2 SetTo RoundDown negative
          Announce result1
          Announce result2
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let zero = 0;');
      expect(result).toContain('let negative = -5.7;');
      expect(result).toContain('let result1 = Math.ceil(zero);');
      expect(result).toContain('let result2 = Math.floor(negative);');
    });

    test('should handle type checking with complex expressions', () => {
      const code = `
        StartEngine {
          Remember arr SetTo Passengers [1, 2, 3]
          Remember obj SetTo Glove { key: "value" }
          Remember arrType SetTo WhatType arr
          Remember objType SetTo WhatType obj
          Remember isArrayInstance SetTo arr IsTypeOf Array
          Remember isObjectInstance SetTo obj IsTypeOf Object
          Announce arrType
          Announce objType
          Announce isArrayInstance
          Announce isObjectInstance
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let arr = [1, 2, 3];');
      expect(result).toContain('let obj = {');
      expect(result).toContain('key: "value"');
      expect(result).toContain('let arrType = typeof arr;');
      expect(result).toContain('let objType = typeof obj;');
      expect(result).toContain('let isArrayInstance = arr instanceof Array;');
      expect(result).toContain('let isObjectInstance = obj instanceof Object;');
    });
  });
});