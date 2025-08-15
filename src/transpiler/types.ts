// TrafLang Type Definitions

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export enum TokenType {
  // Core language constructs
  KEYWORD = 'KEYWORD',
  IDENTIFIER = 'IDENTIFIER',
  LITERAL = 'LITERAL',
  STRING_LITERAL = 'STRING_LITERAL',
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  BOOLEAN_LITERAL = 'BOOLEAN_LITERAL',
  
  // Operators
  OPERATOR = 'OPERATOR',
  ARITHMETIC_OPERATOR = 'ARITHMETIC_OPERATOR',
  COMPARISON_OPERATOR = 'COMPARISON_OPERATOR',
  LOGICAL_OPERATOR = 'LOGICAL_OPERATOR',
  ASSIGNMENT_OPERATOR = 'ASSIGNMENT_OPERATOR',
  UNARY_OPERATOR = 'UNARY_OPERATOR',
  
  // Delimiters and punctuation
  DELIMITER = 'DELIMITER',
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_BRACKET = 'LEFT_BRACKET',
  RIGHT_BRACKET = 'RIGHT_BRACKET',
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  DOT = 'DOT',
  COLON = 'COLON',
  
  // Comments and whitespace
  COMMENT = 'COMMENT',
  SINGLE_LINE_COMMENT = 'SINGLE_LINE_COMMENT',
  MULTI_LINE_COMMENT = 'MULTI_LINE_COMMENT',
  WHITESPACE = 'WHITESPACE',
  NEWLINE = 'NEWLINE',
  
  // Special tokens
  EOF = 'EOF',
  INVALID = 'INVALID'
}

export interface SourceLocation {
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  location: SourceLocation;
}

export interface Program extends ASTNode {
  type: 'Program';
  body: Statement[];
  startEngine?: FunctionDeclaration;
}

export interface Statement extends ASTNode {
  // Base interface for all statement nodes
}

export interface Expression extends ASTNode {
  // Base interface for all expression nodes
}

export interface FunctionDeclaration extends Statement {
  type: 'FunctionDeclaration';
  name: string;
  parameters: Parameter[];
  body: BlockStatement;
}

export interface Parameter {
  name: string;
  type?: string;
}

export interface BlockStatement extends Statement {
  type: 'BlockStatement';
  body: Statement[];
}

export interface VariableDeclaration extends Statement {
  type: 'VariableDeclaration';
  declarations: VariableDeclarator[];
  kind: 'Remember' | 'NeverForget' | 'QuickNote';
}

export interface VariableDeclarator {
  id: Identifier;
  init?: Expression;
}

export interface Identifier extends Expression {
  type: 'Identifier';
  name: string;
}

// Expression types
export interface Literal extends Expression {
  type: 'Literal';
  value: string | number | boolean | null;
  raw: string;
}

export interface BinaryExpression extends Expression {
  type: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends Expression {
  type: 'UnaryExpression';
  operator: string;
  argument: Expression;
  prefix: boolean;
}

export interface AssignmentExpression extends Expression {
  type: 'AssignmentExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface CallExpression extends Expression {
  type: 'CallExpression';
  callee: Expression;
  arguments: Expression[];
}

export interface MemberExpression extends Expression {
  type: 'MemberExpression';
  object: Expression;
  property: Expression;
  computed: boolean;
}

export interface ArrayExpression extends Expression {
  type: 'ArrayExpression';
  elements: (Expression | null)[];
}

export interface ObjectExpression extends Expression {
  type: 'ObjectExpression';
  properties: Property[];
}

export interface Property extends ASTNode {
  type: 'Property';
  key: Expression;
  value: Expression;
  kind: 'init' | 'get' | 'set';
  method: boolean;
  shorthand: boolean;
  computed: boolean;
}

export interface ThisExpression extends Expression {
  type: 'ThisExpression';
}

export interface UpdateExpression extends Expression {
  type: 'UpdateExpression';
  operator: '++' | '--';
  argument: Expression;
  prefix: boolean;
}

export interface LogicalExpression extends Expression {
  type: 'LogicalExpression';
  operator: '&&' | '||';
  left: Expression;
  right: Expression;
}

export interface ConditionalExpression extends Expression {
  type: 'ConditionalExpression';
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface AwaitExpression extends Expression {
  type: 'AwaitExpression';
  argument: Expression;
}

// Statement types
export interface ExpressionStatement extends Statement {
  type: 'ExpressionStatement';
  expression: Expression;
}

export interface IfStatement extends Statement {
  type: 'IfStatement';
  test: Expression;
  consequent: Statement;
  alternate?: Statement;
}

export interface WhileStatement extends Statement {
  type: 'WhileStatement';
  test: Expression;
  body: Statement;
}

export interface ForStatement extends Statement {
  type: 'ForStatement';
  init?: VariableDeclaration | Expression | null;
  test?: Expression | null;
  update?: Expression | null;
  body: Statement;
}

export interface ForInStatement extends Statement {
  type: 'ForInStatement';
  left: VariableDeclaration | Expression;
  right: Expression;
  body: Statement;
}

export interface ForOfStatement extends Statement {
  type: 'ForOfStatement';
  left: VariableDeclaration | Expression;
  right: Expression;
  body: Statement;
}

export interface BreakStatement extends Statement {
  type: 'BreakStatement';
  label?: Identifier | null;
}

export interface ContinueStatement extends Statement {
  type: 'ContinueStatement';
  label?: Identifier | null;
}

export interface ReturnStatement extends Statement {
  type: 'ReturnStatement';
  argument?: Expression | null;
}

export interface ThrowStatement extends Statement {
  type: 'ThrowStatement';
  argument: Expression;
}

export interface TryStatement extends Statement {
  type: 'TryStatement';
  block: BlockStatement;
  handler?: CatchClause | null;
  finalizer?: BlockStatement | null;
}

export interface CatchClause extends ASTNode {
  type: 'CatchClause';
  param?: Identifier | null;
  body: BlockStatement;
}

export interface SwitchStatement extends Statement {
  type: 'SwitchStatement';
  discriminant: Expression;
  cases: SwitchCase[];
}

export interface SwitchCase extends ASTNode {
  type: 'SwitchCase';
  test?: Expression | null;
  consequent: Statement[];
}

export interface EmptyStatement extends Statement {
  type: 'EmptyStatement';
}

export interface FunctionExpression extends Expression {
  type: 'FunctionExpression';
  id?: Identifier | null;
  params: Parameter[];
  body: BlockStatement;
  generator: boolean;
  async: boolean;
}

// Symbol table for scope management
export interface Symbol {
  name: string;
  type: 'variable' | 'function' | 'parameter';
  scope: 'local' | 'global';
  dataType?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'function' | 'unknown';
  line: number;
  column: number;
}

export interface Scope {
  type: 'global' | 'function' | 'block';
  symbols: Map<string, Symbol>;
  parent?: Scope;
}

// Parser error types
export interface ParseError {
  message: string;
  line: number;
  column: number;
  type: 'syntax' | 'semantic' | 'reference';
  drivingMessage: string;
}

export interface LexerError {
  message: string;
  line: number;
  column: number;
  type: 'invalid_token' | 'unterminated_string' | 'unterminated_comment' | 'invalid_number';
  drivingMessage: string;
}

export interface CompilerError {
  message: string;
  line: number;
  column: number;
  type: 'syntax' | 'runtime' | 'reference';
  drivingMessage: string;
}

export interface TranspilerResult {
  success: boolean;
  javascript?: string;
  errors: CompilerError[];
}