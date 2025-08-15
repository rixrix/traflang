// TrafLang Parser - Comprehensive AST Parser for all language constructs
import {
  Token,
  TokenType,
  Program,
  Statement,
  Expression,
  FunctionDeclaration,
  VariableDeclaration,
  VariableDeclarator,
  BlockStatement,
  IfStatement,
  WhileStatement,
  ForStatement,
  ForInStatement,
  ForOfStatement,
  BreakStatement,
  ContinueStatement,
  ReturnStatement,
  ThrowStatement,
  TryStatement,
  CatchClause,
  SwitchStatement,
  SwitchCase,
  ExpressionStatement,
  EmptyStatement,
  Identifier,
  Literal,
  BinaryExpression,
  UnaryExpression,
  AssignmentExpression,
  CallExpression,
  MemberExpression,
  ArrayExpression,
  ObjectExpression,
  Property,
  ThisExpression,
  UpdateExpression,
  LogicalExpression,
  ConditionalExpression,
  AwaitExpression,
  FunctionExpression,
  Parameter,
  ParseError,
  Symbol,
  Scope
} from './types';

export class Parser {
  private tokens: Token[];
  private position: number = 0;
  private errors: ParseError[] = [];
  private currentScope: Scope;
  private globalScope: Scope;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.globalScope = {
      type: 'global',
      symbols: new Map(),
    };
    this.currentScope = this.globalScope;
  }

  parse(): { program: Program; errors: ParseError[] } {
    this.errors = [];
    const body: Statement[] = [];
    let startEngine: FunctionDeclaration | undefined;

    try {
      while (!this.isAtEnd()) {
        // Skip comments
        if (this.match(TokenType.SINGLE_LINE_COMMENT, TokenType.MULTI_LINE_COMMENT)) {
          continue;
        }

        const stmt = this.parseStatement();
        if (stmt) {
          // Check if this is the StartEngine function
          if (stmt.type === 'FunctionDeclaration' && (stmt as FunctionDeclaration).name === 'StartEngine') {
            startEngine = stmt as FunctionDeclaration;
          } else {
            body.push(stmt);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.addError('syntax', error.message, `🛑 STOP! Road hazard: ${error.message}`);
      }
    }

    const program: Program = {
      type: 'Program',
      body,
      startEngine,
      location: { line: 1, column: 1 },
    };

    return { program, errors: this.errors };
  }

  // Statement parsing methods
  private parseStatement(): Statement | null {
    try {
      // Handle different statement types based on keywords
      if (this.check(TokenType.KEYWORD)) {
        const keyword = this.currentToken().value;

        switch (keyword) {
          case 'Drive':
          case 'StartEngine':
            return this.parseFunctionDeclaration();
          case 'Remember':
          case 'NeverForget':
          case 'QuickNote':
            return this.parseVariableDeclaration();
          case 'CheckMirror':
            return this.parseIfStatement();
          case 'KeepDriving':
            return this.parseLoopStatement();
          case 'WhileDriving':
            return this.parseWhileStatement();
          case 'Cruise':
            return this.parseForOfStatement();
          case 'ManualDrive':
            return this.parseManualDriveStatement();
          case 'TrafficLight':
            return this.parseTrafficLightStatement();
          case 'ChooseRoute':
            return this.parseSwitchStatement();
          case 'TryRoute':
            return this.parseTryStatement();
          case 'StopCar':
            return this.parseBreakStatement();
          case 'KeepGoing':
            return this.parseContinueStatement();
          case 'ParkCar':
            return this.parseReturnStatement();
          case 'ThrowError':
            return this.parseThrowStatement();
            case '{':
            return this.parseBlockStatement();
          default:
            // Try to parse as expression statement
            return this.parseExpressionStatement();
        }
      }

      // Check for assignment expressions (identifier followed by SetTo)
      // Only treat as assignment if it's NOT a variable declaration
      if (this.check(TokenType.IDENTIFIER)) {
        // Look ahead to see if this is an assignment (not a variable declaration)
        if (this.position + 1 < this.tokens.length &&
          this.tokens[this.position + 1].type === TokenType.KEYWORD &&
          this.tokens[this.position + 1].value === 'SetTo') {
          return this.parseAssignmentStatement();
        }
      }

      // Handle delimiters
      if (this.check(TokenType.LEFT_BRACE)) {
        return this.parseBlockStatement();
      }

      if (this.check(TokenType.SEMICOLON)) {
        this.advance();
        return this.createEmptyStatement();
      }

      // Handle operators that represent function calls at statement level
      if (this.check(TokenType.OPERATOR)) {
        const token = this.currentToken();
        if (['Announce', 'Warn', 'Alert', 'CheckEach', 'Transform', 'FilterPassengers', 'FindPassenger'].includes(token.value)) {
          return this.parseExpressionStatement();
        }
      }

      // Handle enhanced driving terminology that can be used as expressions
      if (this.check(TokenType.KEYWORD)) {
        const token = this.currentToken();
        if (['Inspection', 'PassInspection', 'Turbo', 'EcoMode', 'Mechanic', 'Diagnostic',
             'LoadCargo', 'UnloadCargo', 'AskPassenger', 'ListenToRadio', 'Calculate', 'Measure',
             'ReadSign', 'WriteSign', 'Formation', 'Convoy'].includes(token.value)) {
          return this.parseExpressionStatement();
        }
      }

      // Default to expression statement
      return this.parseExpressionStatement();
    } catch (error) {
      // Error recovery - skip to next statement
      this.synchronize();
      return null;
    }
  }

  private parseFunctionDeclaration(): FunctionDeclaration {
    const startToken = this.currentToken();
    const isStartEngine = startToken.value === 'StartEngine';

    this.advance(); // consume 'Drive' or 'StartEngine'

    let name: string;
    if (isStartEngine) {
      name = 'StartEngine';
    } else {
      const nameToken = this.expect(TokenType.IDENTIFIER);
      name = nameToken.value;
    }

    // Enter function scope
    this.enterScope('function');

    const parameters: Parameter[] = [];

    // Parse parameters (CarryWith param1 CarryWith param2 ...)
    while (this.check(TokenType.KEYWORD) && this.currentToken().value === 'CarryWith') {
      this.advance(); // consume 'CarryWith'
      const paramToken = this.expect(TokenType.IDENTIFIER);
      parameters.push({
        name: paramToken.value,
      });

      // Add parameter to symbol table
      this.defineSymbol({
        name: paramToken.value,
        type: 'parameter',
        scope: 'local',
        line: paramToken.line,
        column: paramToken.column,
      });
    }

    const body = this.parseBlockStatement();

    // Exit function scope
    this.exitScope();

    // Add function to symbol table
    this.defineSymbol({
      name,
      type: 'function',
      scope: 'global',
      line: startToken.line,
      column: startToken.column,
    });

    return {
      type: 'FunctionDeclaration',
      name,
      parameters,
      body,
      location: { line: startToken.line, column: startToken.column },
    };
  }

  private parseVariableDeclaration(): VariableDeclaration {
    const kindToken = this.advance(); // consume 'Remember', 'NeverForget', or 'QuickNote'
    const kind = kindToken.value as 'Remember' | 'NeverForget' | 'QuickNote';

    const declarations: VariableDeclarator[] = [];

    do {
      const idToken = this.expect(TokenType.IDENTIFIER);
      const id: Identifier = {
        type: 'Identifier',
        name: idToken.value,
        location: { line: idToken.line, column: idToken.column },
      };

      let init: Expression | undefined;
      if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'SetTo') {
        this.advance(); // consume 'SetTo'
        init = this.parseExpression();
      }

      declarations.push({ id, init });

      // Add variable to symbol table
      this.defineSymbol({
        name: idToken.value,
        type: 'variable',
        scope: this.currentScope.type === 'global' ? 'global' : 'local',
        line: idToken.line,
        column: idToken.column,
      });

    } while (this.match(TokenType.COMMA));

    this.consumeStatementEnd();

    return {
      type: 'VariableDeclaration',
      declarations,
      kind,
      location: { line: kindToken.line, column: kindToken.column },
    };
  }

  private parseAssignmentStatement(): ExpressionStatement {
    const left = this.parseIdentifier();
    this.expect(TokenType.KEYWORD); // consume 'SetTo'
    const right = this.parseExpression();

    const assignment: AssignmentExpression = {
      type: 'AssignmentExpression',
      operator: '=',
      left,
      right,
      location: left.location,
    };

    this.consumeStatementEnd();

    return {
      type: 'ExpressionStatement',
      expression: assignment,
      location: left.location,
    };
  }

  private parseIdentifier(): Identifier {
    const token = this.expect(TokenType.IDENTIFIER);
    return {
      type: 'Identifier',
      name: token.value,
      location: { line: token.line, column: token.column },
    };
  }

  private parseIfStatement(): IfStatement {
    const ifToken = this.advance(); // consume 'CheckMirror'

    this.expect(TokenType.LEFT_PAREN);
    const test = this.parseExpression();
    this.expect(TokenType.RIGHT_PAREN);

    const consequent = this.parseStatement()!;

    let alternate: Statement | undefined;
    if (this.check(TokenType.KEYWORD)) {
      const altKeyword = this.currentToken().value;
      if (altKeyword === 'TakeAlternate') {
        this.advance(); // consume 'TakeAlternate'
        alternate = this.parseStatement()!;
      } else if (altKeyword === 'ConsiderRoute') {
        // else if - parse as another if statement
        alternate = this.parseIfStatement();
      }
    }

    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
      location: { line: ifToken.line, column: ifToken.column },
    };
  }

  private parseWhileStatement(): WhileStatement {
    const whileToken = this.advance(); // consume 'WhileDriving'

    this.expect(TokenType.LEFT_PAREN);
    const test = this.parseExpression();
    this.expect(TokenType.RIGHT_PAREN);

    const body = this.parseStatement()!;

    return {
      type: 'WhileStatement',
      test,
      body,
      location: { line: whileToken.line, column: whileToken.column },
    };
  }

  private parseLoopStatement(): ForStatement {
    const forToken = this.advance(); // consume 'KeepDriving'

    this.expect(TokenType.LEFT_PAREN);

    // Parse init
    let init: VariableDeclaration | Expression | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      if (this.check(TokenType.KEYWORD) &&
        ['Remember', 'NeverForget', 'QuickNote'].includes(this.currentToken().value)) {
        // For variable declaration in for loop, we need to handle it specially
        // to avoid consuming the semicolon
        const kindToken = this.advance();
        const kind = kindToken.value as 'Remember' | 'NeverForget' | 'QuickNote';

        const idToken = this.expect(TokenType.IDENTIFIER);
        const id: Identifier = {
          type: 'Identifier',
          name: idToken.value,
          location: { line: idToken.line, column: idToken.column },
        };

        let initExpr: Expression | undefined;
        if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'SetTo') {
          this.advance(); // consume 'SetTo'
          initExpr = this.parseExpression();
        }

        const declarations: VariableDeclarator[] = [{ id, init: initExpr }];

        // Add variable to symbol table
        this.defineSymbol({
          name: idToken.value,
          type: 'variable',
          scope: this.currentScope.type === 'global' ? 'global' : 'local',
          line: idToken.line,
          column: idToken.column,
        });

        init = {
          type: 'VariableDeclaration',
          declarations,
          kind,
          location: { line: kindToken.line, column: kindToken.column },
        };
      } else {
        init = this.parseExpression();
      }
    }
    this.expect(TokenType.SEMICOLON);

    // Parse test
    let test: Expression | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      test = this.parseExpression();
    }
    this.expect(TokenType.SEMICOLON);

    // Parse update
    let update: Expression | null = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      update = this.parseExpression();
    }
    this.expect(TokenType.RIGHT_PAREN);

    const body = this.parseStatement()!;

    return {
      type: 'ForStatement',
      init,
      test,
      update,
      body,
      location: { line: forToken.line, column: forToken.column },
    };
  }

  private parseForOfStatement(): ForOfStatement {
    const forToken = this.advance(); // consume 'Cruise'

    this.expect(TokenType.LEFT_PAREN);

    // Parse left side (variable declaration or identifier)
    let left: VariableDeclaration | Expression;
    if (this.check(TokenType.KEYWORD) &&
      ['Remember', 'NeverForget', 'QuickNote'].includes(this.currentToken().value)) {
      // Similar to for loop, handle variable declaration specially
      const kindToken = this.advance();
      const kind = kindToken.value as 'Remember' | 'NeverForget' | 'QuickNote';

      const idToken = this.expect(TokenType.IDENTIFIER);
      const id: Identifier = {
        type: 'Identifier',
        name: idToken.value,
        location: { line: idToken.line, column: idToken.column },
      };

      const declarations: VariableDeclarator[] = [{ id, init: undefined }];

      // Add variable to symbol table
      this.defineSymbol({
        name: idToken.value,
        type: 'variable',
        scope: this.currentScope.type === 'global' ? 'global' : 'local',
        line: idToken.line,
        column: idToken.column,
      });

      left = {
        type: 'VariableDeclaration',
        declarations,
        kind,
        location: { line: kindToken.line, column: kindToken.column },
      };
    } else {
      left = this.parseExpression();
    }

    // Expect 'In' keyword for iteration
    if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'In') {
      this.advance(); // consume 'In'
    } else {
      this.addError('syntax', 'Expected "In" keyword in for-of loop', '🛑 STOP! Expected "In" for cruise control');
    }

    const right = this.parseExpression();
    this.expect(TokenType.RIGHT_PAREN);

    const body = this.parseStatement()!;

    return {
      type: 'ForOfStatement',
      left,
      right,
      body,
      location: { line: forToken.line, column: forToken.column },
    };
  }

  // Enhanced driving terminology parsing methods
  private parseManualDriveStatement(): ForStatement {
    // ManualDrive → manual iteration control (traditional for loop)
    const forToken = this.currentToken();
    this.advance(); // consume 'ManualDrive'
    
    this.expect(TokenType.LEFT_PAREN);

    // Parse init
    let init: VariableDeclaration | Expression | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      if (this.check(TokenType.KEYWORD) &&
        ['Remember', 'NeverForget', 'QuickNote'].includes(this.currentToken().value)) {
        // For variable declaration in for loop, we need to handle it specially
        // to avoid consuming the semicolon
        const kindToken = this.advance();
        const kind = kindToken.value as 'Remember' | 'NeverForget' | 'QuickNote';

        const idToken = this.expect(TokenType.IDENTIFIER);
        const id: Identifier = {
          type: 'Identifier',
          name: idToken.value,
          location: { line: idToken.line, column: idToken.column },
        };

        let initExpr: Expression | undefined;
        if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'SetTo') {
          this.advance(); // consume 'SetTo'
          initExpr = this.parseExpression();
        }

        const declarations: VariableDeclarator[] = [{ id, init: initExpr }];

        // Add variable to symbol table
        this.defineSymbol({
          name: idToken.value,
          type: 'variable',
          scope: this.currentScope.type === 'global' ? 'global' : 'local',
          line: idToken.line,
          column: idToken.column,
        });

        init = {
          type: 'VariableDeclaration',
          declarations,
          kind,
          location: { line: kindToken.line, column: kindToken.column },
        };
      } else {
        init = this.parseExpression();
      }
    }
    this.expect(TokenType.SEMICOLON);

    // Parse test
    let test: Expression | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      test = this.parseExpression();
    }
    this.expect(TokenType.SEMICOLON);

    // Parse update
    let update: Expression | null = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      update = this.parseExpression();
    }
    this.expect(TokenType.RIGHT_PAREN);

    const body = this.parseStatement()!;

    return {
      type: 'ForStatement',
      init,
      test,
      update,
      body,
      location: { line: forToken.line, column: forToken.column },
    };
  }

  private parseTrafficLightStatement(): IfStatement {
    // TrafficLight → complex conditional logic (nested if-else)
    const ifToken = this.advance(); // consume 'TrafficLight'
    
    this.expect(TokenType.LEFT_PAREN);
    const test = this.parseExpression();
    this.expect(TokenType.RIGHT_PAREN);

    const consequent = this.parseStatement()!;

    let alternate: Statement | undefined;
    if (this.check(TokenType.KEYWORD)) {
      const altKeyword = this.currentToken().value;
      if (altKeyword === 'TakeAlternate') {
        this.advance(); // consume 'TakeAlternate'
        alternate = this.parseStatement()!;
      } else if (altKeyword === 'ConsiderRoute') {
        // else if - parse as another if statement
        alternate = this.parseIfStatement();
      }
    }

    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
      location: { line: ifToken.line, column: ifToken.column },
    };
  }



  private parseSwitchStatement(): SwitchStatement {
    const switchToken = this.advance(); // consume 'ChooseRoute'

    this.expect(TokenType.LEFT_PAREN);
    const discriminant = this.parseExpression();
    this.expect(TokenType.RIGHT_PAREN);

    this.expect(TokenType.LEFT_BRACE);

    const cases: SwitchCase[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.KEYWORD)) {
        const caseKeyword = this.previous().value;

        if (caseKeyword === 'IfRoute') {
          // case statement
          const test = this.parseExpression();
          this.expect(TokenType.COLON);

          const consequent: Statement[] = [];
          while (!this.check(TokenType.KEYWORD) && !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) consequent.push(stmt);
          }

          cases.push({
            type: 'SwitchCase',
            test,
            consequent,
            location: { line: this.currentToken().line, column: this.currentToken().column },
          });
        } else if (caseKeyword === 'DefaultRoute') {
          // default case
          this.expect(TokenType.COLON);

          const consequent: Statement[] = [];
          while (!this.check(TokenType.KEYWORD) && !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            const stmt = this.parseStatement();
            if (stmt) consequent.push(stmt);
          }

          cases.push({
            type: 'SwitchCase',
            test: null,
            consequent,
            location: { line: this.currentToken().line, column: this.currentToken().column },
          });
        }
      } else {
        this.advance(); // skip unexpected tokens
      }
    }

    this.expect(TokenType.RIGHT_BRACE);

    return {
      type: 'SwitchStatement',
      discriminant,
      cases,
      location: { line: switchToken.line, column: switchToken.column },
    };
  }

  private parseTryStatement(): TryStatement {
    const tryToken = this.advance(); // consume 'TryRoute'

    const block = this.parseBlockStatement();

    let handler: CatchClause | null = null;
    let finalizer: BlockStatement | null = null;

    if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'IfLost') {
      this.advance(); // consume 'IfLost'
      let param: Identifier | null = null;

      if (this.match(TokenType.LEFT_PAREN)) {
        const paramToken = this.expect(TokenType.IDENTIFIER);
        param = {
          type: 'Identifier',
          name: paramToken.value,
          location: { line: paramToken.line, column: paramToken.column },
        };
        this.expect(TokenType.RIGHT_PAREN);
      }

      const body = this.parseBlockStatement();

      handler = {
        type: 'CatchClause',
        param,
        body,
        location: { line: this.currentToken().line, column: this.currentToken().column },
      };
    }

    if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'Finally') {
      this.advance(); // consume 'Finally'
      finalizer = this.parseBlockStatement();
    }

    return {
      type: 'TryStatement',
      block,
      handler,
      finalizer,
      location: { line: tryToken.line, column: tryToken.column },
    };
  }

  private parseBreakStatement(): BreakStatement {
    const breakToken = this.advance(); // consume 'StopCar'
    this.consumeStatementEnd();

    return {
      type: 'BreakStatement',
      label: null,
      location: { line: breakToken.line, column: breakToken.column },
    };
  }

  private parseContinueStatement(): ContinueStatement {
    const continueToken = this.advance(); // consume 'KeepGoing'
    this.consumeStatementEnd();

    return {
      type: 'ContinueStatement',
      label: null,
      location: { line: continueToken.line, column: continueToken.column },
    };
  }

  private parseReturnStatement(): ReturnStatement {
    const returnToken = this.advance(); // consume 'ParkCar'

    let argument: Expression | null = null;
    if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      argument = this.parseExpression();
    }

    this.consumeStatementEnd();

    return {
      type: 'ReturnStatement',
      argument,
      location: { line: returnToken.line, column: returnToken.column },
    };
  }

  private parseThrowStatement(): ThrowStatement {
    const throwToken = this.advance(); // consume 'ThrowError'

    const argument = this.parseExpression();
    this.consumeStatementEnd();

    return {
      type: 'ThrowStatement',
      argument,
      location: { line: throwToken.line, column: throwToken.column },
    };
  }


  private parseBlockStatement(): BlockStatement {
    const startToken = this.currentToken();
    this.expect(TokenType.LEFT_BRACE);

    this.enterScope('block');

    const body: Statement[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const stmt = this.parseStatement();
      if (stmt) body.push(stmt);
    }

    this.expect(TokenType.RIGHT_BRACE);
    this.exitScope();

    return {
      type: 'BlockStatement',
      body,
      location: { line: startToken.line, column: startToken.column },
    };
  }

  private parseExpressionStatement(): ExpressionStatement {
    const expression = this.parseExpression();
    this.consumeStatementEnd();

    return {
      type: 'ExpressionStatement',
      expression,
      location: expression.location,
    };
  }

  private createEmptyStatement(): EmptyStatement {
    return {
      type: 'EmptyStatement',
      location: { line: this.currentToken().line, column: this.currentToken().column },
    };
  }

  // Expression parsing methods with operator precedence
  private parseExpression(): Expression {
    return this.parseAssignment();
  }

  private parseAssignment(): Expression {
    const expr = this.parseConditional();

    if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'SetTo') {
      this.advance(); // consume 'SetTo'
      const operator = '=';
      const right = this.parseAssignment();

      return {
        type: 'AssignmentExpression',
        operator,
        left: expr,
        right,
        location: expr.location,
      } as AssignmentExpression;
    }

    return expr;
  }

  private parseConditional(): Expression {
    const expr = this.parseLogicalOr();

    if (this.check(TokenType.OPERATOR) && this.currentToken().value === '?') {
      this.advance(); // consume the '?' operator
      const consequent = this.parseExpression();
      this.expect(TokenType.COLON);
      const alternate = this.parseConditional();

      return {
        type: 'ConditionalExpression',
        test: expr,
        consequent,
        alternate,
        location: expr.location,
      } as ConditionalExpression;
    }

    return expr;
  }

  private parseLogicalOr(): Expression {
    let expr = this.parseLogicalAnd();

    while (this.check(TokenType.OPERATOR) && this.currentToken().value === 'Or') {
      this.advance(); // consume the 'Or' operator
      const operator = '||';
      const right = this.parseLogicalAnd();

      expr = {
        type: 'LogicalExpression',
        operator,
        left: expr,
        right,
        location: expr.location,
      } as LogicalExpression;
    }

    return expr;
  }

  private parseLogicalAnd(): Expression {
    let expr = this.parseEquality();

    while (this.check(TokenType.OPERATOR) && this.currentToken().value === 'And') {
      this.advance(); // consume the 'And' operator
      const operator = '&&';
      const right = this.parseEquality();

      expr = {
        type: 'LogicalExpression',
        operator,
        left: expr,
        right,
        location: expr.location,
      } as LogicalExpression;
    }

    return expr;
  }

  private parseEquality(): Expression {
    let expr = this.parseComparison();

    while (this.check(TokenType.OPERATOR)) {
      const opValue = this.currentToken().value;
      let operator: string;

      // Only consume equality operators
      switch (opValue) {
        case 'SameAs':
          operator = '==';
          break;
        case 'DifferentFrom':
          operator = '!=';
          break;
        case 'ExactlyLike':
          operator = '===';
          break;
        case 'NotExactlyLike':
          operator = '!==';
          break;
        default:
          // Not an equality operator, don't consume it
          return expr;
      }

      // Only advance if we found a valid equality operator
      this.advance();

      const right = this.parseComparison();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        location: expr.location,
      } as BinaryExpression;
    }

    return expr;
  }

  private parseComparison(): Expression {
    let expr = this.parseAddition();

    while (this.check(TokenType.OPERATOR)) {
      const opValue = this.currentToken().value;
      let operator: string;

      // Only consume comparison operators
      switch (opValue) {
        case 'FasterThan':
          operator = '>';
          break;
        case 'SlowerThan':
          operator = '<';
          break;
        case 'AtLeastAs':
          operator = '>=';
          break;
        case 'AtMostAs':
          operator = '<=';
          break;
        case 'IsTypeOf':
          operator = 'instanceof';
          break;
        default:
          // Not a comparison operator, don't consume it
          return expr;
      }

      // Only advance if we found a valid comparison operator
      this.advance();

      const right = this.parseAddition();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        location: expr.location,
      } as BinaryExpression;
    }

    return expr;
  }

  private parseAddition(): Expression {
    let expr = this.parseMultiplication();

    while (this.check(TokenType.OPERATOR)) {
      const opValue = this.currentToken().value;
      let operator: string;

      // Only consume addition/subtraction operators
      switch (opValue) {
        case 'Add':
        case 'Join':
          operator = '+';
          break;
        case 'Subtract':
          operator = '-';
          break;
        default:
          // Not an addition/subtraction operator, don't consume it
          return expr;
      }

      // Only advance if we found a valid addition/subtraction operator
      this.advance();

      const right = this.parseMultiplication();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        location: expr.location,
      } as BinaryExpression;
    }

    return expr;
  }

  private parseMultiplication(): Expression {
    let expr = this.parseUnary();

    while (this.check(TokenType.OPERATOR)) {
      const opValue = this.currentToken().value;
      let operator: string;

      // Only consume multiplication/division operators
      switch (opValue) {
        case 'Times':
          operator = '*';
          break;
        case 'DivideBy':
          operator = '/';
          break;
        case 'Modulo':
        case '%':
          operator = '%';
          break;
        default:
          // Not a multiplication/division operator, don't consume it
          return expr;
      }

      // Only advance if we found a valid multiplication/division operator
      this.advance();

      const right = this.parseUnary();
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right,
        location: expr.location,
      } as BinaryExpression;
    }

    return expr;
  }

  private parseUnary(): Expression {
    if (this.check(TokenType.OPERATOR)) {
      const opValue = this.currentToken().value;
      let operator: string;

      // Only consume unary operators
      switch (opValue) {
        case 'Not':
          operator = '!';
          break;
        case 'Subtract':
          operator = '-';
          break;
        case 'WaitFor':
          this.advance(); // consume the operator
          return this.parseAwaitExpression();
        default:
          // Not a unary operator, don't consume it
          return this.parseUpdate();
      }

      // Only advance if we found a valid unary operator
      this.advance();

      const argument = this.parseUnary();
      return {
        type: 'UnaryExpression',
        operator,
        argument,
        prefix: true,
        location: { line: this.currentToken().line, column: this.currentToken().column },
      } as UnaryExpression;
    }

    return this.parseUpdate();
  }

  private parseAwaitExpression(): AwaitExpression {
    const argument = this.parseUnary();

    return {
      type: 'AwaitExpression',
      argument,
      location: argument.location,
    };
  }

  private parseUpdate(): Expression {
    const expr = this.parseCall();

    if (this.check(TokenType.OPERATOR)) {
      const opValue = this.currentToken().value;
      let operator: '++' | '--';

      // Only consume update operators
      switch (opValue) {
        case 'SpeedUp':
          operator = '++';
          break;
        case 'SlowDown':
          operator = '--';
          break;
        default:
          // Not an update operator, don't consume it
          return expr;
      }

      // Only advance if we found a valid update operator
      this.advance();

      return {
        type: 'UpdateExpression',
        operator,
        argument: expr,
        prefix: false,
        location: expr.location,
      } as UpdateExpression;
    }

    return expr;
  }

  private parseCall(): Expression {
    let expr = this.parseMember();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  private finishCall(callee: Expression): CallExpression {
    const args: Expression[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        args.push(this.parseExpression());
      } while (this.match(TokenType.COMMA));
    }

    this.expect(TokenType.RIGHT_PAREN);

    return {
      type: 'CallExpression',
      callee,
      arguments: args,
      location: callee.location,
    };
  }

  private parseMember(): Expression {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.DOT)) {
        const property = this.expect(TokenType.IDENTIFIER);
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: {
            type: 'Identifier',
            name: property.value,
            location: { line: property.line, column: property.column },
          },
          computed: false,
          location: expr.location,
        } as MemberExpression;
      } else if (this.match(TokenType.LEFT_BRACKET)) {
        const property = this.parseExpression();
        this.expect(TokenType.RIGHT_BRACKET);
        expr = {
          type: 'MemberExpression',
          object: expr,
          property,
          computed: true,
          location: expr.location,
        } as MemberExpression;
      } else if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'Compartment') {
        this.advance(); // consume 'Compartment'
        // Object property access with TrafLang syntax
        const property = this.expect(TokenType.IDENTIFIER);
        expr = {
          type: 'MemberExpression',
          object: expr,
          property: {
            type: 'Identifier',
            name: property.value,
            location: { line: property.line, column: property.column },
          },
          computed: false,
          location: expr.location,
        } as MemberExpression;
      } else if (this.check(TokenType.OPERATOR)) {
        // Check if this is an object/array/string method
        const opValue = this.currentToken().value;

        const methodOperators = [
          // String methods
          'Contains', 'StartsWith', 'Split', 'Replace', 'ToUpper', 'ToLower',
          // Array methods
          'PickUp', 'DropOff', 'FirstOut', 'FirstIn', 'CountPassengers',
          'FindPassenger', 'FilterPassengers', 'CheckEach', 'Transform', 'Combine',
          // Object methods
          'HasCompartment'
        ];

        const propertyAccessOperators = [
          'CheckCompartment'
        ];

        const functionCallOperators = ['Announce', 'Warn', 'Alert'];

        if (propertyAccessOperators.includes(opValue)) {
          this.advance(); // consume the operator
          // For CheckCompartment, the next token should be the property name
          const property = this.expect(TokenType.IDENTIFIER);
          expr = {
            type: 'MemberExpression',
            object: expr,
            property: {
              type: 'Identifier',
              name: property.value,
              location: { line: property.line, column: property.column },
            },
            computed: false,
            location: expr.location,
          } as MemberExpression;
        } else if (methodOperators.includes(opValue)) {
          this.advance(); // consume the operator
          const opToken = this.previous();
          
          // Create member expression for the method
          const memberExpr = {
            type: 'MemberExpression' as const,
            object: expr,
            property: {
              type: 'Identifier' as const,
              name: opValue,
              location: { line: opToken.line, column: opToken.column },
            },
            computed: false,
            location: expr.location,
          };

          // Properties that don't take arguments (not method calls)
          const propertyAccess = ['CountPassengers'];

          // Methods that don't take arguments
          const noArgMethods = ['ToUpper', 'ToLower'];
          
          // Methods that take exactly one argument (function-taking methods)
          const oneArgMethods = ['CheckEach', 'Transform', 'FindPassenger', 'FilterPassengers'];
          
          // Methods that take exactly one simple argument (not functions)
          const oneSimpleArgMethods = ['Contains', 'StartsWith', 'Split', 'HasCompartment'];
          
          // Methods that take exactly two simple arguments
          const twoSimpleArgMethods = ['Replace'];
          
          // Methods that take a function + additional arguments
          const functionPlusArgsMethods = ['Combine']; // function + initial value

          if (propertyAccess.includes(opValue)) {
            // This is a property access, not a method call
            expr = memberExpr;
          } else {
            // This is a method call - parse arguments
            const args: Expression[] = [];
            
            if (!noArgMethods.includes(opValue)) {
              if (oneArgMethods.includes(opValue)) {
                // Methods that take exactly one argument - parse only one
                args.push(this.parsePrimary()); // Use parsePrimary instead of parseUnary to avoid method chaining
              } else if (oneSimpleArgMethods.includes(opValue)) {
                // Methods that take exactly one simple argument - parse only one
                args.push(this.parseUnary());
              } else if (twoSimpleArgMethods.includes(opValue)) {
                // Methods that take exactly two simple arguments - parse exactly two
                args.push(this.parseUnary());
                if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
                  !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE) &&
                  !this.isStatementTerminator()) {
                  args.push(this.parseUnary());
                }
              } else if (functionPlusArgsMethods.includes(opValue)) {
                // Methods that take a function + additional arguments
                args.push(this.parsePrimary()); // Parse the function argument
                // Parse additional arguments until we hit a terminator
                while (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
                  !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE) &&
                  !this.isStatementTerminator()) {
                  
                  args.push(this.parseUnary());

                  // Break if we hit a statement terminator
                  if (this.isStatementTerminator()) {
                    break;
                  }
                }
              } else {
                // Parse arguments until we hit a statement terminator or another operator
                while (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
                  !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE) &&
                  !this.isStatementTerminator()) {
                  
                  args.push(this.parseUnary());

                  // Break if we hit a statement terminator
                  if (this.isStatementTerminator()) {
                    break;
                  }
                }
              }
            }

            // Create call expression
            expr = {
              type: 'CallExpression',
              callee: memberExpr,
              arguments: args,
              location: expr.location,
            } as CallExpression;
          }
        } else if (functionCallOperators.includes(opValue)) {
          break;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return expr;
  }

  private isStatementTerminator(): boolean {
    // Check for explicit terminators
    if (this.check(TokenType.SEMICOLON) || 
        this.check(TokenType.RIGHT_BRACE) || 
        this.check(TokenType.EOF)) {
      return true;
    }
    
    // Keywords that start new statements should terminate expressions
    if (this.check(TokenType.KEYWORD)) {
      const keywordValue = this.currentToken().value;
      const statementKeywords = [
        'Remember', 'NeverForget', 'QuickNote',
        'CheckMirror', 'TrafficLight', 
        'KeepDriving', 'WhileDriving', 'Cruise', 'ManualDrive',
        'StopEngine', 'ContinueRoute', 'ParkCar', 'SoundHorn',
        'StartEngine', 'TryRoute', 'RoadBlock', 'SafeRoute'
      ];
      
      return statementKeywords.includes(keywordValue);
    }
    
    // Check for operators that should NOT terminate (can be chained)
    if (this.check(TokenType.OPERATOR)) {
      const opValue = this.currentToken().value;
      const chainableOperators = [
        // Function operators that take arguments
        'CheckEach', 'Transform', 'FindPassenger', 'FilterPassengers', 'Combine',
        // Method operators that can be chained
        'Contains', 'StartsWith', 'Split', 'Replace', 'ToUpper', 'ToLower',
        'PickUp', 'DropOff', 'FirstOut', 'FirstIn', 'CountPassengers',
        'HasCompartment', 'CheckCompartment'
      ];
      
      // Statement operators that terminate expressions
      const statementOperators = ['Announce', 'Warn', 'Alert'];
      
      // If it's a statement operator, it terminates
      if (statementOperators.includes(opValue)) {
        return true;
      }
      
      return !chainableOperators.includes(opValue);
    }
    
    return false;
  }

  private parsePrimary(): Expression {
    // Handle literals
    if (this.match(TokenType.STRING_LITERAL)) {
      const token = this.previous();
      return {
        type: 'Literal',
        value: token.value.slice(1, -1), // Remove quotes
        raw: token.value,
        location: { line: token.line, column: token.column },
      } as Literal;
    }

    if (this.match(TokenType.NUMBER_LITERAL)) {
      const token = this.previous();
      return {
        type: 'Literal',
        value: parseFloat(token.value),
        raw: token.value,
        location: { line: token.line, column: token.column },
      } as Literal;
    }

    if (this.match(TokenType.BOOLEAN_LITERAL)) {
      const token = this.previous();
      return {
        type: 'Literal',
        value: token.value === 'Yes',
        raw: token.value,
        location: { line: token.line, column: token.column },
      } as Literal;
    }

    if (this.match(TokenType.LITERAL)) {
      const token = this.previous();
      let value: null | undefined;

      switch (token.value) {
        case 'Empty':
          value = null;
          break;
        case 'Unknown':
          value = undefined;
          break;
        default:
          value = null;
      }

      return {
        type: 'Literal',
        value,
        raw: token.value,
        location: { line: token.line, column: token.column },
      } as Literal;
    }

    // Handle operators that represent function calls
    if (this.check(TokenType.OPERATOR)) {
      const token = this.currentToken();

      // Console operators: Announce, Warn, Alert
      if (['Announce', 'Warn', 'Alert'].includes(token.value)) {
        this.advance(); // consume the operator
        const args: Expression[] = [];

        // Parse a single argument for console functions
        if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
          !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
          args.push(this.parseExpression()); // Parse the full expression as argument
        }

        // Create identifier for the console function
        let functionName: string;
        switch (token.value) {
          case 'Announce':
            functionName = 'console.log';
            break;
          case 'Warn':
            functionName = 'console.warn';
            break;
          case 'Alert':
            functionName = 'console.error';
            break;
          default:
            functionName = token.value;
        }

        const calleeExpr: Identifier = {
          type: 'Identifier',
          name: functionName,
          location: { line: token.line, column: token.column },
        };

        return {
          type: 'CallExpression',
          callee: calleeExpr,
          arguments: args,
          location: { line: token.line, column: token.column },
        } as CallExpression;
      }

      // Array iteration operators: CheckEach, Transform, FilterPassengers, FindPassenger
      if (['CheckEach', 'Transform', 'FilterPassengers', 'FindPassenger'].includes(token.value)) {
        this.advance(); // consume the operator
        const args: Expression[] = [];
        
        // Parse first argument (the array/object)
        if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
          !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
          args.push(this.parseUnary()); // Parse the array argument
        }
        
        // Parse second argument (the function)
        if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
          !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
          args.push(this.parsePrimary()); // Parse the Drive CarryWith function
        }
        
        // Create member expression for array.method(function)
        if (args.length >= 2) {
          const arrayExpr = args[0];
          const functionExpr = args[1];
          
          const memberExpr: MemberExpression = {
            type: 'MemberExpression',
            object: arrayExpr,
            property: {
              type: 'Identifier',
              name: token.value, // Will be mapped by code generator
              location: { line: token.line, column: token.column },
            } as Identifier,
            computed: false,
            location: { line: token.line, column: token.column },
          };
          
          return {
            type: 'CallExpression',
            callee: memberExpr,
            arguments: [functionExpr],
            location: { line: token.line, column: token.column },
          } as CallExpression;
        }
      }

      // Mathematical operations: RoundUp, RoundDown, Random
      if (['RoundUp', 'RoundDown', 'Random'].includes(token.value)) {
        this.advance(); // consume the operator
        const args: Expression[] = [];

        // Random doesn't take arguments, others take one argument
        if (token.value !== 'Random') {
          if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
            !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
            args.push(this.parseUnary()); // Parse the argument
          }
        }

        const calleeExpr: Identifier = {
          type: 'Identifier',
          name: token.value, // Will be mapped in code generator
          location: { line: token.line, column: token.column },
        };

        return {
          type: 'CallExpression',
          callee: calleeExpr,
          arguments: args,
          location: { line: token.line, column: token.column },
        } as CallExpression;
      }

      // Type checking operations: WhatType
      if (token.value === 'WhatType') {
        this.advance(); // consume the operator
        const args: Expression[] = [];

        // Parse the argument
        if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
          !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
          args.push(this.parseUnary()); // Parse the argument
        }

        // WhatType is a unary operator
        return {
          type: 'UnaryExpression',
          operator: 'typeof',
          argument: args[0],
          prefix: true,
          location: { line: token.line, column: token.column },
        } as UnaryExpression;
      }

      // Timing functions: DelayFor, RepeatEvery
      if (['DelayFor', 'RepeatEvery'].includes(token.value)) {
        this.advance(); // consume the operator
        const args: Expression[] = [];

        // Check if this is the Drive { ... } syntax or regular function call syntax
        if (this.check(TokenType.KEYWORD) && this.currentToken().value === 'Drive') {
          // Parse Drive { ... } syntax for anonymous functions
          this.advance(); // consume 'Drive'
          
          // Parse the function body as a simple function with no parameters
          const body = this.parseBlockStatement();
          
          const functionExpr: FunctionExpression = {
            type: 'FunctionExpression',
            id: null,
            params: [],
            body,
            generator: false,
            async: false,
            location: { line: token.line, column: token.column }
          };
          
          args.push(functionExpr);

          // Parse delay/interval argument after the function
          if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
            !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
            args.push(this.parseUnary());
          }
        } else {
          // Parse regular function call syntax: DelayFor callback duration
          // Parse the first argument (callback function)
          if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
            !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
            args.push(this.parseUnary());
          }

          // Parse the second argument (delay/interval)
          if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
            !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
            args.push(this.parseUnary());
          }
        }

        const calleeExpr: Identifier = {
          type: 'Identifier',
          name: token.value, // Will be mapped in code generator
          location: { line: token.line, column: token.column },
        };

        return {
          type: 'CallExpression',
          callee: calleeExpr,
          arguments: args,
          location: { line: token.line, column: token.column },
        } as CallExpression;
      }

      // Object utility functions: ListCompartments, CheckContents
      if (['ListCompartments', 'CheckContents'].includes(token.value)) {
        this.advance(); // consume the operator
        const args: Expression[] = [];

        // Parse a single argument (the object)
        if (!this.check(TokenType.SEMICOLON) && !this.check(TokenType.RIGHT_BRACE) &&
          !this.check(TokenType.EOF) && !this.check(TokenType.NEWLINE)) {
          args.push(this.parseUnary()); // Parse the object argument
        }

        const calleeExpr: Identifier = {
          type: 'Identifier',
          name: token.value, // Will be mapped in code generator
          location: { line: token.line, column: token.column },
        };

        return {
          type: 'CallExpression',
          callee: calleeExpr,
          arguments: args,
          location: { line: token.line, column: token.column },
        } as CallExpression;
      }
    }

    // Handle enhanced driving terminology keywords as function calls
    if (this.check(TokenType.KEYWORD)) {
      const token = this.currentToken();
      
      if (['Inspection', 'PassInspection', 'Turbo', 'EcoMode', 'Mechanic', 'Diagnostic',
           'LoadCargo', 'UnloadCargo', 'AskPassenger', 'ListenToRadio', 'Calculate', 'Measure',
           'ReadSign', 'WriteSign', 'Formation'].includes(token.value)) {
        this.advance(); // consume the keyword
        
        // Check if followed by parentheses for function call
        if (this.check(TokenType.LEFT_PAREN)) {
          this.advance(); // consume '('
          const args: Expression[] = [];
          
          if (!this.check(TokenType.RIGHT_PAREN)) {
            do {
              args.push(this.parseExpression());
            } while (this.match(TokenType.COMMA));
          }
          
          this.expect(TokenType.RIGHT_PAREN);
          
          const calleeExpr: Identifier = {
            type: 'Identifier',
            name: token.value,
            location: { line: token.line, column: token.column },
          };

          return {
            type: 'CallExpression',
            callee: calleeExpr,
            arguments: args,
            location: { line: token.line, column: token.column },
          } as CallExpression;
        }
      }
      
      // Handle Convoy as a special case (needs two arguments)
      if (token.value === 'Convoy') {
        this.advance(); // consume 'Convoy'
        
        if (this.check(TokenType.LEFT_PAREN)) {
          this.advance(); // consume '('
          const args: Expression[] = [];
          
          if (!this.check(TokenType.RIGHT_PAREN)) {
            args.push(this.parseExpression()); // collection
            if (this.match(TokenType.COMMA)) {
              args.push(this.parseExpression()); // operation
            }
          }
          
          this.expect(TokenType.RIGHT_PAREN);
          
          const calleeExpr: Identifier = {
            type: 'Identifier',
            name: 'Convoy',
            location: { line: token.line, column: token.column },
          };

          return {
            type: 'CallExpression',
            callee: calleeExpr,
            arguments: args,
            location: { line: token.line, column: token.column },
          } as CallExpression;
        }
      }
    }

    // Handle keywords that represent expressions
    if (this.check(TokenType.KEYWORD)) {
      const token = this.currentToken();

      switch (token.value) {
        case 'MyCarIs':
          this.advance();
          return {
            type: 'ThisExpression',
            location: { line: token.line, column: token.column },
          } as ThisExpression;
        case 'Passengers':
          this.advance();
          return this.parseArrayExpression();
        case 'Glove':
          this.advance();
          return this.parseObjectExpression();
        case 'GoTo':
          // Handle TrafLang function call syntax: GoTo functionName Bring arg1 Bring arg2
          this.advance(); // consume 'GoTo'
          const callee = this.expect(TokenType.IDENTIFIER);
          const calleeExpr: Identifier = {
            type: 'Identifier',
            name: callee.value,
            location: { line: callee.line, column: callee.column },
          };

          const args: Expression[] = [];
          while (this.check(TokenType.KEYWORD) && this.currentToken().value === 'Bring') {
            this.advance(); // consume 'Bring'
            args.push(this.parseExpression());
          }

          return {
            type: 'CallExpression',
            callee: calleeExpr,
            arguments: args,
            location: { line: token.line, column: token.column },
          } as CallExpression;
        case 'Drive':
          // Handle Drive function expressions
          this.advance(); // consume 'Drive'
          
          // Parse parameters if present (CarryWith param1 CarryWith param2 ...)
          const parameters: Parameter[] = [];
          while (this.check(TokenType.KEYWORD) && this.currentToken().value === 'CarryWith') {
            this.advance(); // consume 'CarryWith'
            const paramToken = this.expect(TokenType.IDENTIFIER);
            parameters.push({
              name: paramToken.value,
            });
          }
          
          // Parse the function body
          const body = this.parseBlockStatement();
          
          return {
            type: 'FunctionExpression',
            id: null,
            params: parameters,
            body,
            generator: false,
            async: false,
            location: { line: token.line, column: token.column }
          } as FunctionExpression;
        default:
          break;
      }
    }


    // Handle identifiers
    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      return {
        type: 'Identifier',
        name: token.value,
        location: { line: token.line, column: token.column },
      } as Identifier;
    }

    // Handle parenthesized expressions
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.parseExpression();
      this.expect(TokenType.RIGHT_PAREN);
      return expr;
    }

    // Handle array literals
    if (this.match(TokenType.LEFT_BRACKET)) {
      this.position--; // back up to re-parse
      return this.parseArrayExpression();
    }

    // Handle object literals
    if (this.match(TokenType.LEFT_BRACE)) {
      this.position--; // back up to re-parse
      return this.parseObjectExpression();
    }

    // Add error and return a placeholder to allow parsing to continue
    const token = this.currentToken();
    this.addError('syntax', 
      `Unexpected token: ${token.type === TokenType.EOF ? 'end of file' : token.value}`,
      `🛑 STOP! Unexpected ${token.type === TokenType.EOF ? 'end of road' : 'obstacle'} - check your route!`);
    
    // Return a placeholder expression to continue parsing
    return {
      type: 'Identifier',
      name: 'undefined',
      location: { line: token.line, column: token.column }
    } as Identifier;
  }

  private parseArrayExpression(): ArrayExpression {
    const startToken = this.currentToken();
    this.expect(TokenType.LEFT_BRACKET);

    const elements: (Expression | null)[] = [];

    if (!this.check(TokenType.RIGHT_BRACKET)) {
      do {
        if (this.check(TokenType.COMMA)) {
          elements.push(null); // sparse array
        } else {
          elements.push(this.parseExpression());
        }
      } while (this.match(TokenType.COMMA));
    }

    this.expect(TokenType.RIGHT_BRACKET);

    return {
      type: 'ArrayExpression',
      elements,
      location: { line: startToken.line, column: startToken.column },
    };
  }

  private parseObjectExpression(): ObjectExpression {
    const startToken = this.currentToken();
    this.expect(TokenType.LEFT_BRACE);

    const properties: Property[] = [];

    if (!this.check(TokenType.RIGHT_BRACE)) {
      do {
        let key: Expression;

        if (this.match(TokenType.IDENTIFIER)) {
          const keyToken = this.previous();
          key = {
            type: 'Identifier',
            name: keyToken.value,
            location: { line: keyToken.line, column: keyToken.column },
          } as Identifier;
        } else if (this.match(TokenType.STRING_LITERAL)) {
          const keyToken = this.previous();
          key = {
            type: 'Literal',
            value: keyToken.value.slice(1, -1),
            raw: keyToken.value,
            location: { line: keyToken.line, column: keyToken.column },
          } as Literal;
        } else {
          throw new Error('Expected property name');
        }

        this.expect(TokenType.COLON);
        const value = this.parseExpression();

        properties.push({
          type: 'Property',
          key,
          value,
          kind: 'init',
          method: false,
          shorthand: false,
          computed: false,
          location: key.location,
        });

      } while (this.match(TokenType.COMMA));
    }

    this.expect(TokenType.RIGHT_BRACE);

    return {
      type: 'ObjectExpression',
      properties,
      location: { line: startToken.line, column: startToken.column },
    };
  }

  private parseFunctionExpression(): FunctionExpression {
    const parameters: Parameter[] = [];

    // Parse parameters (CarryWith param1 CarryWith param2 ...)
    while (this.check(TokenType.KEYWORD) && this.currentToken().value === 'CarryWith') {
      this.advance(); // consume 'CarryWith'
      const paramToken = this.expect(TokenType.IDENTIFIER);
      parameters.push({
        name: paramToken.value,
      });
    }

    this.expect(TokenType.LEFT_BRACE);
    const body = this.parseBlockStatement();

    return {
      type: 'FunctionExpression',
      id: null,
      params: parameters,
      body,
      generator: false,
      async: false,
      location: { line: this.currentToken().line, column: this.currentToken().column },
    };
  }

  private getLocation() {
    const token = this.currentToken();
    return { line: token.line, column: token.column };
  }

  // Symbol table management
  private enterScope(type: 'function' | 'block'): void {
    const newScope: Scope = {
      type,
      symbols: new Map(),
      parent: this.currentScope,
    };
    this.currentScope = newScope;
  }

  private exitScope(): void {
    if (this.currentScope.parent) {
      this.currentScope = this.currentScope.parent;
    }
  }

  private consumeStatementEnd(): void {
    // In TrafLang, statements are separated by newlines or end naturally
    // We don't need to consume anything specific for statement termination
    // This method exists for compatibility but doesn't need to do anything
  }

  private defineSymbol(symbol: Symbol): void {
    if (this.currentScope.symbols.has(symbol.name)) {
      this.addError('semantic',
        `Variable '${symbol.name}' already declared in this scope`,
        `🚧 CONSTRUCTION ZONE: Route '${symbol.name}' already exists - choose a different path!`);
    } else {
      this.currentScope.symbols.set(symbol.name, symbol);
    }
  }

  private lookupSymbol(name: string): Symbol | undefined {
    let scope: Scope | undefined = this.currentScope;

    while (scope) {
      const symbol = scope.symbols.get(name);
      if (symbol) return symbol;
      scope = scope.parent;
    }

    return undefined;
  }

  // Utility methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.currentToken().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.position++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.currentToken().type === TokenType.EOF;
  }

  private previous(): Token {
    return this.tokens[this.position - 1];
  }

  private currentToken(): Token {
    return this.tokens[this.position] || { type: TokenType.EOF, value: '', line: 0, column: 0 };
  }

  private expect(tokenType: TokenType): Token {
    if (this.check(tokenType)) {
      return this.advance();
    }

    const current = this.currentToken();
    this.addError('syntax',
      `Expected ${tokenType}, got ${current.type}`,
      `🛑 STOP! Expected ${tokenType} but found ${current.type} - check your route!`);

    // Return a placeholder token instead of throwing to allow parsing to continue
    return {
      type: tokenType,
      value: tokenType === TokenType.IDENTIFIER ? 'placeholder' : '',
      line: current.line,
      column: current.column
    };
  }


  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.currentToken().type) {
        case TokenType.KEYWORD:
          const keyword = this.currentToken().value;
          if (['Drive', 'StartEngine', 'Remember', 'NeverForget', 'QuickNote',
            'CheckMirror', 'KeepDriving', 'WhileDriving', 'ChooseRoute',
            'TryRoute', 'CarType'].includes(keyword)) {
            return;
          }
          break;
      }

      this.advance();
    }
  }

  private addError(type: ParseError['type'], message: string, drivingMessage: string): void {
    const token = this.currentToken();
    this.errors.push({
      type,
      message,
      drivingMessage,
      line: token.line,
      column: token.column,
    });
  }

  // Public method to get symbol table for debugging/analysis
  public getGlobalScope(): Scope {
    return this.globalScope;
  }
}