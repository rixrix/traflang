// TrafLang Lexical Analyzer (Tokenizer)
import { Token, TokenType, LexerError } from './types';

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private errors: LexerError[] = [];

  // Complete mapping of ALL TrafLang keywords from Requirements 1 and 5
  private readonly keywords = new Set([
    // Core language constructs (Requirement 1.1-1.36)
    'StartEngine',      // Entry point
    'Drive',            // Function declaration
    'GoTo',             // Function call
    'CheckMirror',      // if statement
    'TakeAlternate',    // else statement
    'ConsiderRoute',    // else if statement
    'KeepDriving',      // for/while loop
    'StopCar',          // break statement
    'KeepGoing',        // continue statement
    'ParkCar',          // return statement
    'Remember',         // let variable declaration
    'NeverForget',      // const declaration
    'QuickNote',        // var declaration
    'SetTo',            // assignment operation
    'CarryWith',        // function parameter
    'Bring',            // function argument
    'TryRoute',         // try statement
    'IfLost',           // catch statement
    'Finally',          // finally statement
    'ThrowError',       // throw statement
    'WhileDriving',     // while loop condition
    'ChooseRoute',      // switch statement
    'IfRoute',          // case statement
    'DefaultRoute',     // default case
    'Passengers',       // array
    'Glove',            // object literal
    'Compartment',      // object property
    'DriverNote',       // single-line comment
    'Manual',           // multi-line comment
    'InCar',            // local scope
    'OnRoad',           // global scope
    
    // Enhanced driving terminology (Requirement 10.1-10.10)
    'Cruise',           // automatic iteration
    'ManualDrive',      // manual iteration control
    'TrafficLight',     // complex conditional logic
    'Inspection',       // data validation
    'PassInspection',   // validation success
    'Turbo',            // optimization hints
    'EcoMode',          // memory efficiency
    'Mechanic',         // debugging mode
    'Diagnostic',       // error analysis
    'LoadCargo',        // data loading
    'UnloadCargo',      // data output
    'AskPassenger',     // input prompts
    'ListenToRadio',    // event handling
    'Calculate',        // math operations prefix
    'Measure',          // comparisons
    'ReadSign',         // parsing
    'WriteSign',        // formatting
    'Convoy',           // grouped operations
    'Formation',        // structured data
    'In',               // for...of iteration keyword
  ]);

  // Complete mapping of ALL operators from Requirement 5
  private readonly operators = new Map([
    // Arithmetic operators (Requirement 5.1-5.2)
    ['SpeedUp', '++'],          // increment
    ['SlowDown', '--'],         // decrement
    ['Add', '+'],               // addition
    ['Subtract', '-'],          // subtraction
    ['Times', '*'],             // multiplication
    ['DivideBy', '/'],          // division
    ['Modulo', '%'],            // modulo
    
    // Comparison operators (Requirement 5.3-5.6)
    ['SameAs', '=='],           // equality
    ['DifferentFrom', '!='],    // inequality
    ['ExactlyLike', '==='],     // strict equality
    ['NotExactlyLike', '!=='],  // strict inequality
    ['FasterThan', '>'],        // greater than
    ['SlowerThan', '<'],        // less than
    ['AtLeastAs', '>='],        // greater than or equal
    ['AtMostAs', '<='],         // less than or equal
    
    // Logical operators (Requirement 5.7)
    ['And', '&&'],              // logical AND
    ['Or', '||'],               // logical OR
    ['Not', '!'],               // logical NOT
    
    // String operations (Requirement 5.8, 5.20)
    ['Join', '+'],              // string concatenation
    ['Contains', '.includes'],   // includes method
    ['StartsWith', '.startsWith'], // startsWith method
    ['Split', '.split'],        // split method
    ['Replace', '.replace'],    // replace method
    ['ToUpper', '.toUpperCase'], // toUpperCase method
    ['ToLower', '.toLowerCase'], // toLowerCase method
    
    // Array operations (Requirement 5.9-5.11)
    ['PickUp', '.push'],        // push method
    ['DropOff', '.pop'],        // pop method
    ['FirstOut', '.shift'],     // shift method
    ['FirstIn', '.unshift'],    // unshift method
    ['CountPassengers', '.length'], // length property
    ['FindPassenger', '.find'], // find method
    ['FilterPassengers', '.filter'], // filter method
    ['CheckEach', '.forEach'],  // forEach method
    ['Transform', '.map'],      // map method
    ['Combine', '.reduce'],     // reduce method
    
    // Object operations (Requirement 5.12-5.13)
    ['CheckCompartment', '.'],  // property access
    ['HasCompartment', '.hasOwnProperty'], // hasOwnProperty method
    ['ListCompartments', 'Object.keys'], // Object.keys method
    ['CheckContents', 'Object.values'], // Object.values method
    
    // Async operations (Requirement 5.14)
    ['WaitFor', 'await'],       // await keyword
    ['Promise', 'Promise'],     // Promise constructor
    
    // Timing operations (Requirement 5.15)
    ['DelayFor', 'setTimeout'], // setTimeout function
    ['RepeatEvery', 'setInterval'], // setInterval function
    
    // Type checking (Requirement 5.17-5.18)
    ['WhatType', 'typeof'],     // typeof operator
    ['IsTypeOf', 'instanceof'], // instanceof operator
    
    // Math operations (Requirement 5.21)
    ['RoundUp', 'Math.ceil'],   // Math.ceil method
    ['RoundDown', 'Math.floor'], // Math.floor method
    ['Random', 'Math.random'],  // Math.random method
    
    // Console output (Requirement 5.22)
    ['Announce', 'console.log'], // console.log method
    ['Warn', 'console.warn'],   // console.warn method
    ['Alert', 'console.error'], // console.error method
  ]);

  // Boolean literals (Requirement 5.19)
  private readonly booleanLiterals = new Map([
    ['Yes', 'true'],
    ['No', 'false']
  ]);

  // Special values (Requirement 5.18)
  private readonly specialValues = new Map([
    ['Empty', 'null'],
    ['Unknown', 'undefined']
  ]);

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): { tokens: Token[], errors: LexerError[] } {
    const tokens: Token[] = [];
    this.errors = [];
    
    while (this.position < this.source.length) {
      const token = this.nextToken();
      if (token.type !== TokenType.WHITESPACE && token.type !== TokenType.NEWLINE && token.type !== TokenType.EOF) {
        tokens.push(token);
      }
    }
    
    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    });
    
    return { tokens, errors: this.errors };
  }

  private nextToken(): Token {
    this.skipWhitespace();
    
    if (this.position >= this.source.length) {
      return this.createToken(TokenType.EOF, '');
    }

    const char = this.source[this.position];
    const startLine = this.line;
    const startColumn = this.column;

    // Handle comments - need to check for exact matches followed by whitespace or end of input
    if (this.matchKeywordExact('DriverNote')) {
      return this.readSingleLineComment();
    }
    
    if (this.matchKeywordExact('Manual')) {
      return this.readMultiLineComment();
    }

    // Handle string literals
    if (char === '"' || char === "'") {
      return this.readStringLiteral();
    }

    // Handle numbers
    if (this.isDigit(char)) {
      return this.readNumber();
    }

    // Handle identifiers and keywords
    if (this.isAlpha(char)) {
      return this.readIdentifierOrKeyword();
    }

    // Handle delimiters and operators
    return this.readDelimiterOrOperator();
  }

  private skipWhitespace(): void {
    while (this.position < this.source.length) {
      const char = this.source[this.position];
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
      } else if (char === '\n') {
        this.advance();
        this.line++;
        this.column = 1;
      } else {
        break;
      }
    }
  }

  private readSingleLineComment(): Token {
    const start = this.position;
    const startColumn = this.column;
    
    // Skip "DriverNote"
    this.position += 10;
    this.column += 10;
    
    // Read until end of line
    while (this.position < this.source.length && this.source[this.position] !== '\n') {
      this.advance();
    }
    
    return {
      type: TokenType.SINGLE_LINE_COMMENT,
      value: this.source.slice(start, this.position),
      line: this.line,
      column: startColumn,
    };
  }

  private readMultiLineComment(): Token {
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    // Skip "Manual"
    this.position += 6;
    this.column += 6;
    
    let foundClosing = false;
    
    // Look for closing "Manual"
    while (this.position < this.source.length) {
      if (this.matchKeyword('Manual')) {
        // Skip closing "Manual"
        this.position += 6;
        this.column += 6;
        foundClosing = true;
        break;
      }
      
      if (this.source[this.position] === '\n') {
        this.line++;
        this.column = 1;
      } else {
        this.column++;
      }
      this.position++;
    }
    
    // Check if comment was properly closed
    if (!foundClosing) {
      this.addError('unterminated_comment', startLine, startColumn, 
        'Unterminated multi-line comment', 
        '🚧 ROAD WORK AHEAD: Your Manual comment is missing its closing - complete your driving manual!');
    }
    
    return {
      type: TokenType.MULTI_LINE_COMMENT,
      value: this.source.slice(start, this.position),
      line: startLine,
      column: startColumn,
    };
  }

  private readStringLiteral(): Token {
    const quote = this.source[this.position];
    const start = this.position;
    const startLine = this.line;
    const startColumn = this.column;
    
    this.advance(); // Skip opening quote
    
    while (this.position < this.source.length && this.source[this.position] !== quote) {
      if (this.source[this.position] === '\\') {
        this.advance(); // Skip escape character
        if (this.position < this.source.length) {
          this.advance(); // Skip escaped character
        }
      } else if (this.source[this.position] === '\n') {
        this.line++;
        this.column = 1;
        this.position++;
      } else {
        this.advance();
      }
    }
    
    if (this.position >= this.source.length) {
      this.addError('unterminated_string', startLine, startColumn,
        'Unterminated string literal',
        '🛑 STOP! Missing road sign: Your string is missing its closing quote - complete your message!');
    } else {
      this.advance(); // Skip closing quote
    }
    
    return {
      type: TokenType.STRING_LITERAL,
      value: this.source.slice(start, this.position),
      line: startLine,
      column: startColumn,
    };
  }

  private readNumber(): Token {
    const start = this.position;
    const startColumn = this.column;
    let hasDecimal = false;
    
    // Handle negative sign
    if (this.source[this.position] === '-') {
      this.advance();
    }
    
    while (this.position < this.source.length) {
      const char = this.source[this.position];
      
      if (this.isDigit(char)) {
        this.advance();
      } else if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        this.advance();
      } else {
        break;
      }
    }
    
    const value = this.source.slice(start, this.position);
    
    // Validate number format - check for invalid patterns like standalone "." or numbers ending with "."
    if (value === '.' || value === '-' || (value.endsWith('.') && value.length > 1 && value.split('.').length === 2 && value.split('.')[1] === '')) {
      this.addError('invalid_number', this.line, startColumn,
        'Invalid number format',
        '⚠️ SPEED CHECK: Invalid number format - check your speedometer reading!');
    }
    
    return {
      type: TokenType.NUMBER_LITERAL,
      value,
      line: this.line,
      column: startColumn,
    };
  }

  private readIdentifierOrKeyword(): Token {
    const start = this.position;
    const startColumn = this.column;
    
    while (this.position < this.source.length && this.isAlphaNumeric(this.source[this.position])) {
      this.advance();
    }
    
    const value = this.source.slice(start, this.position);
    
    // Check for keywords
    if (this.keywords.has(value)) {
      return {
        type: TokenType.KEYWORD,
        value,
        line: this.line,
        column: startColumn,
      };
    }
    
    // Check for operators
    if (this.operators.has(value)) {
      return {
        type: TokenType.OPERATOR,
        value,
        line: this.line,
        column: startColumn,
      };
    }
    
    // Check for boolean literals
    if (this.booleanLiterals.has(value)) {
      return {
        type: TokenType.BOOLEAN_LITERAL,
        value,
        line: this.line,
        column: startColumn,
      };
    }
    
    // Check for special values
    if (this.specialValues.has(value)) {
      return {
        type: TokenType.LITERAL,
        value,
        line: this.line,
        column: startColumn,
      };
    }
    
    // Regular identifier
    return {
      type: TokenType.IDENTIFIER,
      value,
      line: this.line,
      column: startColumn,
    };
  }

  private readDelimiterOrOperator(): Token {
    const char = this.source[this.position];
    const startColumn = this.column;
    
    this.advance();
    
    switch (char) {
      case '(':
        return this.createToken(TokenType.LEFT_PAREN, char, startColumn);
      case ')':
        return this.createToken(TokenType.RIGHT_PAREN, char, startColumn);
      case '{':
        return this.createToken(TokenType.LEFT_BRACE, char, startColumn);
      case '}':
        return this.createToken(TokenType.RIGHT_BRACE, char, startColumn);
      case '[':
        return this.createToken(TokenType.LEFT_BRACKET, char, startColumn);
      case ']':
        return this.createToken(TokenType.RIGHT_BRACKET, char, startColumn);
      case ';':
        return this.createToken(TokenType.SEMICOLON, char, startColumn);
      case ',':
        return this.createToken(TokenType.COMMA, char, startColumn);
      case '.':
        return this.createToken(TokenType.DOT, char, startColumn);
      case ':':
        return this.createToken(TokenType.COLON, char, startColumn);
      case '%':
        return this.createToken(TokenType.OPERATOR, char, startColumn);
      case '-':
        // Check if this is a negative number or subtraction operator
        if (this.position < this.source.length && this.isDigit(this.source[this.position])) {
          // This is a negative number, back up and read as number
          this.position--;
          this.column--;
          return this.readNumber();
        } else {
          // This is a subtraction operator
          return this.createToken(TokenType.OPERATOR, char, startColumn);
        }
      default:
        this.addError('invalid_token', this.line, startColumn,
          `Invalid character: ${char}`,
          `🚫 ROADBLOCK: Unknown road sign '${char}' - this symbol is not part of the driving experience!`);
        return this.createToken(TokenType.INVALID, char, startColumn);
    }
  }

  private matchKeyword(keyword: string): boolean {
    if (this.position + keyword.length > this.source.length) {
      return false;
    }
    
    const slice = this.source.slice(this.position, this.position + keyword.length);
    return slice === keyword;
  }

  private matchKeywordExact(keyword: string): boolean {
    if (this.position + keyword.length > this.source.length) {
      return false;
    }
    
    const slice = this.source.slice(this.position, this.position + keyword.length);
    if (slice !== keyword) {
      return false;
    }
    
    // Check that the keyword is not part of a larger identifier
    const nextChar = this.source[this.position + keyword.length];
    return !nextChar || !this.isAlphaNumeric(nextChar);
  }

  private createToken(type: TokenType, value: string, column?: number): Token {
    return {
      type,
      value,
      line: this.line,
      column: column || this.column,
    };
  }

  private advance(): void {
    this.position++;
    this.column++;
  }

  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private addError(type: LexerError['type'], line: number, column: number, message: string, drivingMessage: string): void {
    this.errors.push({
      type,
      line,
      column,
      message,
      drivingMessage,
    });
  }

  // Utility method to get JavaScript equivalent of TrafLang operator
  getOperatorMapping(trafLangOperator: string): string | undefined {
    return this.operators.get(trafLangOperator);
  }

  // Utility method to get JavaScript equivalent of boolean literal
  getBooleanMapping(trafLangBoolean: string): string | undefined {
    return this.booleanLiterals.get(trafLangBoolean);
  }

  // Utility method to get JavaScript equivalent of special value
  getSpecialValueMapping(trafLangValue: string): string | undefined {
    return this.specialValues.get(trafLangValue);
  }
}