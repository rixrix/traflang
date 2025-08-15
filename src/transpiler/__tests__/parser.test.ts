// TrafLang Parser Tests - Comprehensive AST Parser Testing
import { Parser } from '../parser';
import { Lexer } from '../lexer';
import { TokenType } from '../types';

describe('TrafLang Parser', () => {
  function parseCode(code: string) {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    expect(lexErrors).toHaveLength(0);
    
    const parser = new Parser(tokens);
    return parser.parse();
  }

  describe('Function Declarations', () => {
    test('should parse basic function declaration', () => {
      const code = `
        Drive calculateSpeed CarryWith distance CarryWith time {
          ParkCar distance DivideBy time
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.body).toHaveLength(1);
      
      const func = program.body[0];
      expect(func.type).toBe('FunctionDeclaration');
      expect((func as any).name).toBe('calculateSpeed');
      expect((func as any).parameters).toHaveLength(2);
      expect((func as any).parameters[0].name).toBe('distance');
      expect((func as any).parameters[1].name).toBe('time');
    });

    test('should parse StartEngine function', () => {
      const code = `
        StartEngine {
          Announce "Hello, World!"
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.startEngine).toBeDefined();
      expect(program.startEngine!.name).toBe('StartEngine');
      expect(program.startEngine!.parameters).toHaveLength(0);
    });

    test('should parse function with no parameters', () => {
      const code = `
        Drive greet {
          Announce "Hello!"
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.body).toHaveLength(1);
      
      const func = program.body[0];
      expect((func as any).parameters).toHaveLength(0);
    });
  });

  describe('Variable Declarations', () => {
    test('should parse Remember (let) declarations', () => {
      const code = `Remember speed SetTo 60`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.body).toHaveLength(1);
      
      const varDecl = program.body[0];
      expect(varDecl.type).toBe('VariableDeclaration');
      expect((varDecl as any).kind).toBe('Remember');
      expect((varDecl as any).declarations).toHaveLength(1);
      expect((varDecl as any).declarations[0].id.name).toBe('speed');
    });

    test('should parse NeverForget (const) declarations', () => {
      const code = `NeverForget maxSpeed SetTo 120`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const varDecl = program.body[0];
      expect((varDecl as any).kind).toBe('NeverForget');
      expect((varDecl as any).declarations[0].id.name).toBe('maxSpeed');
    });

    test('should parse QuickNote (var) declarations', () => {
      const code = `QuickNote temp SetTo 0`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const varDecl = program.body[0];
      expect((varDecl as any).kind).toBe('QuickNote');
      expect((varDecl as any).declarations[0].id.name).toBe('temp');
    });

    test('should parse variable declaration without initialization', () => {
      const code = `Remember x`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const varDecl = program.body[0];
      expect((varDecl as any).declarations[0].init).toBeUndefined();
    });
  });

  describe('Control Flow - If Statements', () => {
    test('should parse basic if statement', () => {
      const code = `
        CheckMirror (speed FasterThan 60) {
          Announce "Speeding!"
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.body).toHaveLength(1);
      
      const ifStmt = program.body[0];
      expect(ifStmt.type).toBe('IfStatement');
      expect((ifStmt as any).test.type).toBe('BinaryExpression');
      expect((ifStmt as any).consequent.type).toBe('BlockStatement');
      expect((ifStmt as any).alternate).toBeUndefined();
    });

    test('should parse if-else statement', () => {
      const code = `
        CheckMirror (speed FasterThan 60) {
          Announce "Speeding!"
        } TakeAlternate {
          Announce "Safe speed"
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const ifStmt = program.body[0];
      expect((ifStmt as any).alternate).toBeDefined();
      expect((ifStmt as any).alternate.type).toBe('BlockStatement');
    });

    test('should parse if-else if statement', () => {
      const code = `
        CheckMirror (speed FasterThan 80) {
          Announce "Too fast!"
        } ConsiderRoute (speed FasterThan 60) {
          Announce "Speeding"
        } TakeAlternate {
          Announce "Safe"
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const ifStmt = program.body[0];
      expect((ifStmt as any).alternate.type).toBe('IfStatement');
    });
  });

  describe('Control Flow - Loops', () => {
    test('should parse while loop', () => {
      const code = `
        WhileDriving (speed SlowerThan 60) {
          speed SpeedUp
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.body).toHaveLength(1);
      
      const whileStmt = program.body[0];
      expect(whileStmt.type).toBe('WhileStatement');
      expect((whileStmt as any).test.type).toBe('BinaryExpression');
      expect((whileStmt as any).body.type).toBe('BlockStatement');
    });

    test('should parse for loop', () => {
      const code = `
        KeepDriving (Remember i SetTo 0; i SlowerThan 10; i SpeedUp) {
          Announce i
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const forStmt = program.body[0];
      expect(forStmt.type).toBe('ForStatement');
      expect((forStmt as any).init.type).toBe('VariableDeclaration');
      expect((forStmt as any).test.type).toBe('BinaryExpression');
      expect((forStmt as any).update.type).toBe('UpdateExpression');
    });

    test('should parse for-of loop (Cruise)', () => {
      const code = `
        Cruise (Remember passenger In passengers) {
          Announce passenger
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const forOfStmt = program.body[0];
      expect(forOfStmt.type).toBe('ForOfStatement');
      expect((forOfStmt as any).left.type).toBe('VariableDeclaration');
      expect((forOfStmt as any).right.type).toBe('Identifier');
    });
  });

  describe('Control Flow - Switch Statements', () => {
    test('should parse switch statement', () => {
      const code = `
        ChooseRoute (speed) {
          IfRoute 30: {
            Announce "City speed"
            StopCar
          }
          IfRoute 60: {
            Announce "Highway speed"
            StopCar
          }
          DefaultRoute: {
            Announce "Unknown speed"
          }
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const switchStmt = program.body[0];
      expect(switchStmt.type).toBe('SwitchStatement');
      expect((switchStmt as any).discriminant.type).toBe('Identifier');
      expect((switchStmt as any).cases).toHaveLength(3);
      expect((switchStmt as any).cases[0].test.value).toBe(30);
      expect((switchStmt as any).cases[2].test).toBeNull(); // default case
    });
  });

  describe('Control Flow - Break and Continue', () => {
    test('should parse break statement', () => {
      const code = `StopCar`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const breakStmt = program.body[0];
      expect(breakStmt.type).toBe('BreakStatement');
    });

    test('should parse continue statement', () => {
      const code = `KeepGoing`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const continueStmt = program.body[0];
      expect(continueStmt.type).toBe('ContinueStatement');
    });
  });

  describe('Control Flow - Return and Throw', () => {
    test('should parse return statement with value', () => {
      const code = `ParkCar speed Times 2`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const returnStmt = program.body[0];
      expect(returnStmt.type).toBe('ReturnStatement');
      expect((returnStmt as any).argument.type).toBe('BinaryExpression');
    });

    test('should parse return statement without value', () => {
      const code = `ParkCar`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const returnStmt = program.body[0];
      expect((returnStmt as any).argument).toBeNull();
    });

    test('should parse throw statement', () => {
      const code = `ThrowError "Something went wrong"`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const throwStmt = program.body[0];
      expect(throwStmt.type).toBe('ThrowStatement');
      expect((throwStmt as any).argument.type).toBe('Literal');
    });
  });

  describe('Error Handling - Try-Catch-Finally', () => {
    test('should parse try-catch statement', () => {
      const code = `
        TryRoute {
          ThrowError "test"
        } IfLost (error) {
          Announce error
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const tryStmt = program.body[0];
      expect(tryStmt.type).toBe('TryStatement');
      expect((tryStmt as any).block.type).toBe('BlockStatement');
      expect((tryStmt as any).handler.type).toBe('CatchClause');
      expect((tryStmt as any).handler.param.name).toBe('error');
    });

    test('should parse try-finally statement', () => {
      const code = `
        TryRoute {
          Announce "trying"
        } Finally {
          Announce "cleanup"
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const tryStmt = program.body[0];
      expect((tryStmt as any).finalizer.type).toBe('BlockStatement');
    });

    test('should parse try-catch-finally statement', () => {
      const code = `
        TryRoute {
          ThrowError "test"
        } IfLost (error) {
          Announce error
        } Finally {
          Announce "cleanup"
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const tryStmt = program.body[0];
      expect((tryStmt as any).handler).toBeDefined();
      expect((tryStmt as any).finalizer).toBeDefined();
    });
  });

  describe('Expressions - Binary Operations', () => {
    test('should parse arithmetic expressions', () => {
      const code = `Remember result SetTo a Add b Times c`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const varDecl = program.body[0];
      const init = (varDecl as any).declarations[0].init;
      expect(init.type).toBe('BinaryExpression');
      expect(init.operator).toBe('+');
      expect(init.right.type).toBe('BinaryExpression');
      expect(init.right.operator).toBe('*');
    });

    test('should parse comparison expressions', () => {
      const code = `Remember isGreater SetTo speed FasterThan 60`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('BinaryExpression');
      expect(init.operator).toBe('>');
    });

    test('should parse logical expressions', () => {
      const code = `Remember canDrive SetTo hasLicense And age AtLeastAs 18`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('LogicalExpression');
      expect(init.operator).toBe('&&');
    });

    test('should parse equality expressions', () => {
      const code = `Remember isSame SetTo a ExactlyLike b`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('BinaryExpression');
      expect(init.operator).toBe('===');
    });
  });

  describe('Expressions - Unary Operations', () => {
    test('should parse unary not expression', () => {
      const code = `Remember isNotReady SetTo Not ready`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('UnaryExpression');
      expect(init.operator).toBe('!');
      expect(init.prefix).toBe(true);
    });

    test('should parse unary minus expression', () => {
      const code = `Remember negative SetTo Subtract x`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('UnaryExpression');
      expect(init.operator).toBe('-');
    });
  });

  describe('Expressions - Update Operations', () => {
    test('should parse increment expression', () => {
      const code = `speed SpeedUp`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const exprStmt = program.body[0];
      const expr = (exprStmt as any).expression;
      expect(expr.type).toBe('UpdateExpression');
      expect(expr.operator).toBe('++');
      expect(expr.prefix).toBe(false);
    });

    test('should parse decrement expression', () => {
      const code = `speed SlowDown`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const expr = (program.body[0] as any).expression;
      expect(expr.type).toBe('UpdateExpression');
      expect(expr.operator).toBe('--');
    });
  });

  describe('Expressions - Assignment', () => {
    test('should parse assignment expression', () => {
      const code = `speed SetTo 60`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const expr = (program.body[0] as any).expression;
      expect(expr.type).toBe('AssignmentExpression');
      expect(expr.operator).toBe('=');
      expect(expr.left.name).toBe('speed');
      expect(expr.right.value).toBe(60);
    });
  });

  describe('Expressions - Function Calls', () => {
    test('should parse function call with parentheses', () => {
      const code = `calculateSpeed(100, 2)`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const expr = (program.body[0] as any).expression;
      expect(expr.type).toBe('CallExpression');
      expect(expr.callee.name).toBe('calculateSpeed');
      expect(expr.arguments).toHaveLength(2);
    });

    test('should parse TrafLang function call syntax', () => {
      const code = `GoTo calculateSpeed Bring 100 Bring 2`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const expr = (program.body[0] as any).expression;
      expect(expr.type).toBe('CallExpression');
      expect(expr.callee.name).toBe('calculateSpeed');
      expect(expr.arguments).toHaveLength(2);
    });
  });

  describe('Expressions - Member Access', () => {
    test('should parse dot notation member access', () => {
      const code = `car.speed`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const expr = (program.body[0] as any).expression;
      expect(expr.type).toBe('MemberExpression');
      expect(expr.object.name).toBe('car');
      expect(expr.property.name).toBe('speed');
      expect(expr.computed).toBe(false);
    });

    test('should parse bracket notation member access', () => {
      const code = `car["speed"]`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const expr = (program.body[0] as any).expression;
      expect(expr.type).toBe('MemberExpression');
      expect(expr.computed).toBe(true);
    });

    test('should parse TrafLang member access syntax', () => {
      const code = `car Compartment speed`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const expr = (program.body[0] as any).expression;
      expect(expr.type).toBe('MemberExpression');
      expect(expr.object.name).toBe('car');
      expect(expr.property.name).toBe('speed');
    });
  });

  describe('Data Structures - Arrays', () => {
    test('should parse array literal', () => {
      const code = `Remember numbers SetTo [1, 2, 3]`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('ArrayExpression');
      expect(init.elements).toHaveLength(3);
      expect(init.elements[0].value).toBe(1);
    });

    test('should parse TrafLang array syntax', () => {
      const code = `Remember passengers SetTo Passengers ["Alice", "Bob"]`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('ArrayExpression');
      expect(init.elements).toHaveLength(2);
    });

    test('should parse empty array', () => {
      const code = `Remember empty SetTo []`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.elements).toHaveLength(0);
    });
  });

  describe('Data Structures - Objects', () => {
    test('should parse object literal', () => {
      const code = `Remember car SetTo { brand: "Toyota", speed: 60 }`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('ObjectExpression');
      expect(init.properties).toHaveLength(2);
      expect(init.properties[0].key.name).toBe('brand');
      expect(init.properties[0].value.value).toBe('Toyota');
    });

    test('should parse TrafLang object syntax', () => {
      const code = `Remember car SetTo Glove { brand: "Toyota", speed: 60 }`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('ObjectExpression');
      expect(init.properties).toHaveLength(2);
    });

    test('should parse empty object', () => {
      const code = `Remember empty SetTo {}`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.properties).toHaveLength(0);
    });
  });

  describe('Literals', () => {
    test('should parse string literals', () => {
      const code = `Remember message SetTo "Hello, World!"`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('Literal');
      expect(init.value).toBe('Hello, World!');
    });

    test('should parse number literals', () => {
      const code = `Remember pi SetTo 3.14159`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('Literal');
      expect(init.value).toBe(3.14159);
    });

    test('should parse boolean literals', () => {
      const code = `Remember isReady SetTo Yes`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('Literal');
      expect(init.value).toBe(true);
    });

    test('should parse null and undefined literals', () => {
      const code1 = `Remember nothing SetTo Empty`;
      const code2 = `Remember unknown SetTo Unknown`;
      
      const { program: prog1 } = parseCode(code1);
      const { program: prog2 } = parseCode(code2);
      
      const init1 = (prog1.body[0] as any).declarations[0].init;
      const init2 = (prog2.body[0] as any).declarations[0].init;
      
      expect(init1.value).toBe(null);
      expect(init2.value).toBe(undefined);
    });
  });

  describe('Special Expressions', () => {
    test('should parse await expression', () => {
      const code = `Remember result SetTo WaitFor fetchData()`;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      
      const init = (program.body[0] as any).declarations[0].init;
      expect(init.type).toBe('AwaitExpression');
      expect(init.argument.type).toBe('CallExpression');
    });
  });

  describe('Complex Examples', () => {
    test('should parse complete TrafLang program', () => {
      const code = `
        Drive calculateFuelCost CarryWith distance CarryWith pricePerLiter {
          Remember consumption SetTo distance DivideBy 10
          CheckMirror (consumption FasterThan 20) {
            Announce "High fuel consumption!"
          }
          ParkCar consumption Times pricePerLiter
        }
        
        StartEngine {
          Remember distance SetTo 150
          Remember price SetTo 1.5
          Remember cost SetTo GoTo calculateFuelCost Bring distance Bring price
          
          CheckMirror (cost FasterThan 30) {
            Announce "Expensive trip: $" Join cost
          } TakeAlternate {
            Announce "Affordable trip: $" Join cost
          }
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.body).toHaveLength(1); // calculateFuelCost function
      expect(program.startEngine).toBeDefined();
      expect(program.startEngine!.name).toBe('StartEngine');
    });

    test('should parse nested control structures', () => {
      const code = `
        StartEngine {
          Remember speed SetTo 0
          
          KeepDriving (Remember i SetTo 0; i SlowerThan 5; i SpeedUp) {
            speed SetTo speed Add 10
            
            CheckMirror (speed FasterThan 40) {
              CheckMirror (speed FasterThan 60) {
                Announce "Too fast!"
                StopCar
              } TakeAlternate {
                Announce "Good speed"
              }
            }
          }
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.startEngine).toBeDefined();
    });

    test('should parse error handling with complex logic', () => {
      const code = `
        StartEngine {
          TryRoute {
            Remember data SetTo GoTo fetchData
            CheckMirror (data ExactlyLike Empty) {
              ThrowError "No data received"
            }
            Announce data
          } IfLost (error) {
            Announce "Error occurred: " Join error
          } Finally {
            Announce "Cleanup completed"
          }
        }
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors).toHaveLength(0);
      expect(program.startEngine).toBeDefined();
    });
  });

  describe('Symbol Table Management', () => {
    test('should track symbols in global scope', () => {
      const code = `
        Remember globalVar SetTo 42
        Drive testFunc {
          Remember localVar SetTo 10
        }
      `;
      
      const lexer = new Lexer(code);
      const { tokens } = lexer.tokenize();
      const parser = new Parser(tokens);
      const { program } = parser.parse();
      
      const globalScope = parser.getGlobalScope();
      expect(globalScope.symbols.has('globalVar')).toBe(true);
      expect(globalScope.symbols.has('testFunc')).toBe(true);
      expect(globalScope.symbols.has('localVar')).toBe(false); // Should be in function scope
    });
  });

  describe('Error Handling', () => {
    test('should handle syntax errors gracefully', () => {
      const code = `Remember x SetTo`;
      
      const { program, errors } = parseCode(code);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].type).toBe('syntax');
      expect(errors[0].drivingMessage).toContain('🛑');
    });

    test('should handle unexpected tokens', () => {
      const code = `Remember x SetTo 5 @`;
      
      const lexer = new Lexer(code);
      const { tokens, errors: lexErrors } = lexer.tokenize();
      expect(lexErrors.length).toBeGreaterThan(0); // Lexer should catch the @ symbol
    });

    test('should synchronize after errors', () => {
      const code = `
        Remember x SetTo
        Remember y SetTo 10
      `;
      
      const { program, errors } = parseCode(code);
      expect(errors.length).toBeGreaterThan(0);
      // Parser should recover and parse the second statement
      expect(program.body.length).toBeGreaterThan(0);
    });
  });
});