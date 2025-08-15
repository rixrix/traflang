// TrafLang String Operations Tests - Comprehensive testing for all string operations
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';
import { TokenType } from '../types';

describe('TrafLang String Operations', () => {
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

  describe('String Concatenation (Join)', () => {
    test('should handle string concatenation with Join operator', () => {
      const code = `
        StartEngine {
          Remember greeting SetTo "Hello" Join " " Join "World"
          Announce greeting
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let greeting = "Hello" + " " + "World";');
      expect(result).toContain('console.log(greeting);');
    });

    test('should handle string concatenation with variables', () => {
      const code = `
        StartEngine {
          Remember firstName SetTo "John"
          Remember lastName SetTo "Doe"
          Remember fullName SetTo firstName Join " " Join lastName
          Announce fullName
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let firstName = "John";');
      expect(result).toContain('let lastName = "Doe";');
      expect(result).toContain('let fullName = firstName + " " + lastName;');
    });

    test('should handle mixed string and number concatenation', () => {
      const code = `
        StartEngine {
          Remember age SetTo 25
          Remember message SetTo "I am " Join age Join " years old"
          Announce message
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let age = 25;');
      expect(result).toContain('let message = "I am " + age + " years old";');
    });
  });

  describe('String Method Operations', () => {
    test('should handle Contains method (includes)', () => {
      const code = `
        StartEngine {
          Remember text SetTo "Hello World"
          Remember hasHello SetTo text Contains "Hello"
          Announce hasHello
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "Hello World";');
      expect(result).toContain('let hasHello = text.includes("Hello");');
    });

    test('should handle StartsWith method', () => {
      const code = `
        StartEngine {
          Remember text SetTo "Hello World"
          Remember startsWithHello SetTo text StartsWith "Hello"
          Announce startsWithHello
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "Hello World";');
      expect(result).toContain('let startsWithHello = text.startsWith("Hello");');
    });

    test('should handle Split method', () => {
      const code = `
        StartEngine {
          Remember text SetTo "apple,banana,cherry"
          Remember fruits SetTo text Split ","
          Announce fruits
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "apple,banana,cherry";');
      expect(result).toContain('let fruits = text.split(",");');
    });

    test('should handle Replace method', () => {
      const code = `
        StartEngine {
          Remember text SetTo "Hello World"
          Remember newText SetTo text Replace "World" "Universe"
          Announce newText
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "Hello World";');
      expect(result).toContain('let newText = text.replace("World", "Universe");');
    });

    test('should handle ToUpper method (toUpperCase)', () => {
      const code = `
        StartEngine {
          Remember text SetTo "hello world"
          Remember upperText SetTo text ToUpper
          Announce upperText
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "hello world";');
      expect(result).toContain('let upperText = text.toUpperCase();');
    });

    test('should handle ToLower method (toLowerCase)', () => {
      const code = `
        StartEngine {
          Remember text SetTo "HELLO WORLD"
          Remember lowerText SetTo text ToLower
          Announce lowerText
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "HELLO WORLD";');
      expect(result).toContain('let lowerText = text.toLowerCase();');
    });
  });

  describe('String Method Chaining', () => {
    test('should handle chained string methods', () => {
      const code = `
        StartEngine {
          Remember text SetTo "  Hello World  "
          Remember processed SetTo text ToUpper Replace "WORLD" "UNIVERSE"
          Announce processed
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "  Hello World  ";');
      expect(result).toContain('let processed = text.toUpperCase().replace("WORLD", "UNIVERSE");');
    });

    test('should handle complex string method chaining', () => {
      const code = `
        StartEngine {
          Remember csv SetTo "apple,BANANA,Cherry"
          Remember fruits SetTo csv ToLower Split ","
          Remember firstFruit SetTo fruits[0] ToUpper
          Announce firstFruit
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let csv = "apple,BANANA,Cherry";');
      expect(result).toContain('let fruits = csv.toLowerCase().split(",");');
      expect(result).toContain('let firstFruit = fruits[0].toUpperCase();');
    });
  });

  describe('String Operations in Expressions', () => {
    test('should handle string operations in conditional expressions', () => {
      const code = `
        StartEngine {
          Remember email SetTo "user@example.com"
          CheckMirror (email Contains "@") {
            Announce "Valid email format"
          } TakeAlternate {
            Announce "Invalid email format"
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let email = "user@example.com";');
      expect(result).toContain('if (email.includes("@")) {');
      expect(result).toContain('console.log("Valid email format");');
      expect(result).toContain('} else {');
      expect(result).toContain('console.log("Invalid email format");');
    });

    test('should handle string operations in function calls', () => {
      const code = `
        Drive processText CarryWith input {
          ParkCar input ToUpper Replace " " "_"
        }
        
        StartEngine {
          Remember result SetTo GoTo processText Bring "hello world"
          Announce result
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('function processText(input) {');
      expect(result).toContain('return input.toUpperCase().replace(" ", "_");');
      expect(result).toContain('let result = processText("hello world");');
    });
  });

  describe('String Literals and Escaping', () => {
    test('should handle string literals with quotes', () => {
      const code = `
        StartEngine {
          Remember message SetTo "She said \\"Hello\\""
          Announce message
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let message = "She said \\"Hello\\"";');
    });

    test('should handle empty strings', () => {
      const code = `
        StartEngine {
          Remember empty SetTo ""
          Remember notEmpty SetTo empty Join "Now has content"
          Announce notEmpty
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let empty = "";');
      expect(result).toContain('let notEmpty = empty + "Now has content";');
    });

    test('should handle strings with special characters', () => {
      const code = `
        StartEngine {
          Remember special SetTo "Line 1\\nLine 2\\tTabbed"
          Announce special
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let special = "Line 1\\nLine 2\\tTabbed";');
    });
  });

  describe('String Operations with Arrays', () => {
    test('should handle string split creating arrays', () => {
      const code = `
        StartEngine {
          Remember text SetTo "red,green,blue"
          Remember colors SetTo text Split ","
          Remember count SetTo colors CountPassengers
          Announce count
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let text = "red,green,blue";');
      expect(result).toContain('let colors = text.split(",");');
      expect(result).toContain('let count = colors.length;');
    });

    test('should handle array join operations', () => {
      const code = `
        StartEngine {
          Remember colors SetTo Passengers ["red", "green", "blue"]
          Remember joined SetTo colors Join "-"
          Announce joined
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let colors = ["red", "green", "blue"];');
      expect(result).toContain('let joined = colors + "-";'); // Note: This might need special handling for array.join()
    });
  });

  describe('Error Cases and Edge Cases', () => {
    test('should handle string operations on variables', () => {
      const code = `
        StartEngine {
          Remember name SetTo "john"
          Remember capitalName SetTo name ToUpper
          Remember hasJ SetTo capitalName Contains "J"
          Announce hasJ
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let name = "john";');
      expect(result).toContain('let capitalName = name.toUpperCase();');
      expect(result).toContain('let hasJ = capitalName.includes("J");');
    });

    test('should handle string operations in complex expressions', () => {
      const code = `
        StartEngine {
          Remember firstName SetTo "John"
          Remember lastName SetTo "Doe"
          Remember fullName SetTo firstName ToUpper Join " " Join lastName ToLower
          Announce fullName
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let firstName = "John";');
      expect(result).toContain('let lastName = "Doe";');
      expect(result).toContain('let fullName = firstName.toUpperCase() + " " + lastName.toLowerCase();');
    });
  });

  describe('Integration with Other Language Features', () => {
    test('should handle string operations in loops', () => {
      const code = `
        StartEngine {
          Remember words SetTo Passengers ["hello", "world", "test"]
          CheckEach words Drive CarryWith word {
            Remember upper SetTo word ToUpper
            Announce upper
          }
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let words = ["hello", "world", "test"];');
      expect(result).toContain('words.forEach(function(word) {');
      expect(result).toContain('let upper = word.toUpperCase();');
      expect(result).toContain('console.log(upper);');
    });

    test('should handle string operations in object properties', () => {
      const code = `
        StartEngine {
          Remember person SetTo Glove {
            name: "John Doe",
            email: "john@example.com"
          }
          Remember hasAt SetTo person.email Contains "@"
          Announce hasAt
        }
      `;
      
      const result = transpileCode(code);
      expect(result).toContain('let person = {');
      expect(result).toContain('name: "John Doe",');
      expect(result).toContain('email: "john@example.com"');
      expect(result).toContain('let hasAt = person.email.includes("@");');
    });
  });
});