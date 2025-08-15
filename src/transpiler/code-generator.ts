// TrafLang Code Generator - Comprehensive JavaScript code generator
import {
  Program,
  ASTNode,
  Statement,
  Expression,
  FunctionDeclaration,
  VariableDeclaration,
  VariableDeclarator,
  BlockStatement,
  IfStatement,
  WhileStatement,
  ForStatement,
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
  FunctionExpression
} from './types';

export class CodeGenerator {
  private indentLevel: number = 0;
  private readonly INDENT = '  '; // 2 spaces

  generate(ast: Program): string {
    const parts: string[] = [];

    // Generate all regular functions first
    for (const stmt of ast.body) {
      if (stmt.type === 'FunctionDeclaration') {
        parts.push(this.generateStatement(stmt));
        parts.push('');
      }
    }

    // Generate other statements (variables, classes, etc.)
    for (const stmt of ast.body) {
      if (stmt.type !== 'FunctionDeclaration') {
        const generated = this.generateStatement(stmt);
        if (generated.trim()) {
          parts.push(generated);
        }
      }
    }

    // Generate StartEngine as main function and auto-call it
    if (ast.startEngine) {
      parts.push(this.generateStartEngine(ast.startEngine));
      parts.push('');
      parts.push('// Auto-execute the main function');
      parts.push('main();');
    }

    return parts.join('\n');
  }

  private generateStartEngine(startEngine: FunctionDeclaration): string {
    // Convert StartEngine to main function
    const mainFunction: FunctionDeclaration = {
      ...startEngine,
      name: 'main'
    };
    return this.generateFunctionDeclaration(mainFunction);
  }

  private generateStatement(stmt: Statement): string {
    switch (stmt.type) {
      case 'FunctionDeclaration':
        return this.generateFunctionDeclaration(stmt as FunctionDeclaration);
      case 'VariableDeclaration':
        return this.generateVariableDeclaration(stmt as VariableDeclaration);
      case 'BlockStatement':
        return this.generateBlockStatement(stmt as BlockStatement);
      case 'IfStatement':
        return this.generateIfStatement(stmt as IfStatement);
      case 'WhileStatement':
        return this.generateWhileStatement(stmt as WhileStatement);
      case 'ForStatement':
        return this.generateForStatement(stmt as ForStatement);
      case 'ForOfStatement':
        return this.generateForOfStatement(stmt as ForOfStatement);
      case 'BreakStatement':
        return this.generateBreakStatement(stmt as BreakStatement);
      case 'ContinueStatement':
        return this.generateContinueStatement(stmt as ContinueStatement);
      case 'ReturnStatement':
        return this.generateReturnStatement(stmt as ReturnStatement);
      case 'ThrowStatement':
        return this.generateThrowStatement(stmt as ThrowStatement);
      case 'TryStatement':
        return this.generateTryStatement(stmt as TryStatement);
      case 'SwitchStatement':
        return this.generateSwitchStatement(stmt as SwitchStatement);
      case 'ExpressionStatement':
        return this.generateExpressionStatement(stmt as ExpressionStatement);
      case 'EmptyStatement':
        return this.generateEmptyStatement(stmt as EmptyStatement);
      default:
        return `// Unsupported statement type: ${stmt.type}`;
    }
  }

  private generateExpression(expr: Expression): string {
    switch (expr.type) {
      case 'Identifier':
        return this.generateIdentifier(expr as Identifier);
      case 'Literal':
        return this.generateLiteral(expr as Literal);
      case 'BinaryExpression':
        return this.generateBinaryExpression(expr as BinaryExpression);
      case 'UnaryExpression':
        return this.generateUnaryExpression(expr as UnaryExpression);
      case 'AssignmentExpression':
        return this.generateAssignmentExpression(expr as AssignmentExpression);
      case 'CallExpression':
        return this.generateCallExpression(expr as CallExpression);
      case 'MemberExpression':
        return this.generateMemberExpression(expr as MemberExpression);
      case 'ArrayExpression':
        return this.generateArrayExpression(expr as ArrayExpression);
      case 'ObjectExpression':
        return this.generateObjectExpression(expr as ObjectExpression);
      case 'ThisExpression':
        return this.generateThisExpression(expr as ThisExpression);
      case 'UpdateExpression':
        return this.generateUpdateExpression(expr as UpdateExpression);
      case 'LogicalExpression':
        return this.generateLogicalExpression(expr as LogicalExpression);
      case 'ConditionalExpression':
        return this.generateConditionalExpression(expr as ConditionalExpression);
      case 'AwaitExpression':
        return this.generateAwaitExpression(expr as AwaitExpression);
      case 'FunctionExpression':
        return this.generateFunctionExpression(expr as FunctionExpression);
      default:
        return `/* Unsupported expression type: ${expr.type} */`;
    }
  }

  // Statement generators
  private generateFunctionDeclaration(node: FunctionDeclaration): string {
    const params = node.parameters.map(p => p.name).join(', ');
    const body = this.generateBlockStatement(node.body);
    return `function ${node.name}(${params}) ${body}`;
  }

  private generateVariableDeclaration(node: VariableDeclaration): string {
    const declarations = node.declarations.map(decl => {
      const init = decl.init ? ` = ${this.generateExpression(decl.init)}` : '';
      return `${decl.id.name}${init}`;
    }).join(', ');

    // Map TrafLang variable types to JavaScript
    const jsKind = this.mapVariableKind(node.kind);
    return `${this.getIndent()}${jsKind} ${declarations};`;
  }

  private mapVariableKind(kind: 'Remember' | 'NeverForget' | 'QuickNote'): string {
    switch (kind) {
      case 'Remember': return 'let';
      case 'NeverForget': return 'const';
      case 'QuickNote': return 'var';
      default: return 'let';
    }
  }

  private generateBlockStatement(node: BlockStatement): string {
    this.indentLevel++;
    const body = node.body.map(stmt => this.generateStatement(stmt)).join('\n');
    this.indentLevel--;
    return `{\n${body}\n${this.getIndent()}}`;
  }

  private generateIfStatement(node: IfStatement): string {
    const test = this.generateExpression(node.test);
    const consequent = this.generateStatement(node.consequent);
    let result = `${this.getIndent()}if (${test}) ${consequent}`;
    
    if (node.alternate) {
      if (node.alternate.type === 'IfStatement') {
        // else if
        result += ` else ${this.generateStatement(node.alternate).trim()}`;
      } else {
        // else
        result += ` else ${this.generateStatement(node.alternate)}`;
      }
    }
    
    return result;
  }

  private generateWhileStatement(node: WhileStatement): string {
    const test = this.generateExpression(node.test);
    const body = this.generateStatement(node.body);
    return `${this.getIndent()}while (${test}) ${body}`;
  }

  private generateForStatement(node: ForStatement): string {
    const init = node.init ? this.generateForInit(node.init) : '';
    const test = node.test ? this.generateExpression(node.test) : '';
    const update = node.update ? this.generateExpression(node.update) : '';
    const body = this.generateStatement(node.body);
    return `${this.getIndent()}for (${init}; ${test}; ${update}) ${body}`;
  }

  private generateForInit(init: VariableDeclaration | Expression): string {
    if (init.type === 'VariableDeclaration') {
      const varDecl = init as VariableDeclaration;
      const declarations = varDecl.declarations.map(decl => {
        const initExpr = decl.init ? ` = ${this.generateExpression(decl.init)}` : '';
        return `${decl.id.name}${initExpr}`;
      }).join(', ');
      return `${this.mapVariableKind(varDecl.kind)} ${declarations}`;
    } else {
      return this.generateExpression(init);
    }
  }

  private generateForOfStatement(node: ForOfStatement): string {
    const left = node.left.type === 'VariableDeclaration' 
      ? this.generateForInit(node.left as VariableDeclaration)
      : this.generateExpression(node.left as Expression);
    const right = this.generateExpression(node.right);
    const body = this.generateStatement(node.body);
    return `${this.getIndent()}for (${left} of ${right}) ${body}`;
  }

  private generateBreakStatement(_node: BreakStatement): string {
    return `${this.getIndent()}break;`;
  }

  private generateContinueStatement(_node: ContinueStatement): string {
    return `${this.getIndent()}continue;`;
  }

  private generateReturnStatement(node: ReturnStatement): string {
    const arg = node.argument ? ` ${this.generateExpression(node.argument)}` : '';
    return `${this.getIndent()}return${arg};`;
  }

  private generateThrowStatement(node: ThrowStatement): string {
    const arg = this.generateExpression(node.argument);
    return `${this.getIndent()}throw ${arg};`;
  }

  private generateTryStatement(node: TryStatement): string {
    let result = `${this.getIndent()}try ${this.generateBlockStatement(node.block)}`;
    
    if (node.handler) {
      result += ` catch${this.generateCatchClause(node.handler)}`;
    }
    
    if (node.finalizer) {
      result += ` finally ${this.generateBlockStatement(node.finalizer)}`;
    }
    
    return result;
  }

  private generateCatchClause(node: CatchClause): string {
    const param = node.param ? `(${node.param.name})` : '';
    return `${param} ${this.generateBlockStatement(node.body)}`;
  }

  private generateSwitchStatement(node: SwitchStatement): string {
    const discriminant = this.generateExpression(node.discriminant);
    this.indentLevel++;
    const cases = node.cases.map(c => this.generateSwitchCase(c)).join('\n');
    this.indentLevel--;
    return `${this.getIndent()}switch (${discriminant}) {\n${cases}\n${this.getIndent()}}`;
  }

  private generateSwitchCase(node: SwitchCase): string {
    const test = node.test ? `case ${this.generateExpression(node.test)}:` : 'default:';
    this.indentLevel++;
    const consequent = node.consequent.map(stmt => this.generateStatement(stmt)).join('\n');
    this.indentLevel--;
    return `${this.getIndent()}${test}\n${consequent}`;
  }

  private generateExpressionStatement(node: ExpressionStatement): string {
    return `${this.getIndent()}${this.generateExpression(node.expression)};`;
  }

  private generateEmptyStatement(_node: EmptyStatement): string {
    return `${this.getIndent()};`;
  }


  // Expression generators
  private generateIdentifier(node: Identifier): string {
    return node.name;
  }

  private generateLiteral(node: Literal): string {
    // Handle special values based on raw token value
    if (node.raw) {
      const specialValues: { [key: string]: string } = {
        'Empty': 'null',
        'Unknown': 'undefined',
        'Yes': 'true',
        'No': 'false'
      };
      
      if (specialValues[node.raw]) {
        return specialValues[node.raw];
      }
    }
    
    if (typeof node.value === 'string') {
      // If we have the raw token value, use it directly (it already has proper escaping)
      if (node.raw && typeof node.raw === 'string' && node.raw.startsWith('"') && node.raw.endsWith('"')) {
        return node.raw;
      }
      
      // Otherwise, escape quotes and return properly formatted string
      const escaped = node.value.replace(/"/g, '\\"');
      return `"${escaped}"`;
    }
    
    if (node.value === null) {
      return 'null';
    }
    
    if (node.value === undefined) {
      return 'undefined';
    }
    
    return String(node.value);
  }

  private generateBinaryExpression(node: BinaryExpression): string {
    const left = this.generateExpression(node.left);
    const right = this.generateExpression(node.right);
    const operator = this.mapBinaryOperator(node.operator);
    return `${left} ${operator} ${right}`;
  }

  private mapBinaryOperator(operator: string): string {
    // Map TrafLang operators to JavaScript operators
    const operatorMap: { [key: string]: string } = {
      'Add': '+',
      'Join': '+',
      'Subtract': '-',
      'Times': '*',
      'DivideBy': '/',
      'Modulo': '%',
      '%': '%',
      'SameAs': '==',
      'DifferentFrom': '!=',
      'ExactlyLike': '===',
      'NotExactlyLike': '!==',
      'FasterThan': '>',
      'SlowerThan': '<',
      'AtLeastAs': '>=',
      'AtMostAs': '<=',
      'And': '&&',
      'Or': '||'
    };
    return operatorMap[operator] || operator;
  }

  private generateUnaryExpression(node: UnaryExpression): string {
    const operator = this.mapUnaryOperator(node.operator);
    let argument = this.generateExpression(node.argument);
    
    // Add parentheses around binary expressions to preserve operator precedence
    if (node.argument.type === 'BinaryExpression' || node.argument.type === 'LogicalExpression') {
      argument = `(${argument})`;
    }
    
    // Some operators need a space (typeof), others don't (!, -)
    const needsSpace = ['typeof'].includes(operator);
    const space = needsSpace ? ' ' : '';
    
    return node.prefix ? `${operator}${space}${argument}` : `${argument}${operator}`;
  }

  private mapUnaryOperator(operator: string): string {
    const operatorMap: { [key: string]: string } = {
      'Not': '!',
      'Subtract': '-'
    };
    return operatorMap[operator] || operator;
  }

  private generateAssignmentExpression(node: AssignmentExpression): string {
    const left = this.generateExpression(node.left);
    const right = this.generateExpression(node.right);
    const operator = node.operator === 'SetTo' ? '=' : node.operator;
    return `${left} ${operator} ${right}`;
  }

  private generateCallExpression(node: CallExpression): string {
    // Handle special cases for Object methods
    if (node.callee.type === 'MemberExpression') {
      const memberExpr = node.callee as MemberExpression;
      if (memberExpr.property.type === 'Identifier') {
        const propertyName = (memberExpr.property as Identifier).name;
        
        // Handle Object.keys and Object.values
        if (propertyName === 'ListCompartments') {
          const object = this.generateExpression(memberExpr.object);
          return `Object.keys(${object})`;
        }
        
        if (propertyName === 'CheckContents') {
          const object = this.generateExpression(memberExpr.object);
          return `Object.values(${object})`;
        }
      }
    }
    
    // Handle enhanced driving terminology with special JavaScript generation
    if (node.callee.type === 'Identifier') {
      const functionName = (node.callee as Identifier).name;
      return this.generateEnhancedDrivingCall(functionName, node.arguments);
    }
    
    const callee = this.generateCalleeExpression(node.callee);
    const args = node.arguments.map(arg => this.generateExpression(arg)).join(', ');
    return `${callee}(${args})`;
  }

  private generateEnhancedDrivingCall(functionName: string, args: Expression[]): string {
    const argStrings = args.map(arg => this.generateExpression(arg));
    
    switch (functionName) {
      case 'Inspection':
        // Data validation - generate validation function
        return `(function(data) { 
          try { 
            return data !== null && data !== undefined && typeof data !== 'undefined'; 
          } catch(e) { 
            return false; 
          } 
        })(${argStrings[0] || 'null'})`;
        
      case 'PassInspection':
        // Validation success check
        return `(${argStrings[0] || 'false'}) === true`;
        
      case 'Turbo':
        // Optimization hints - add performance comment
        return `/* TURBO: Optimized operation */ (${argStrings[0] || 'null'})`;
        
      case 'EcoMode':
        // Memory efficiency - add memory-conscious comment
        return `/* ECO: Memory efficient */ (${argStrings[0] || 'null'})`;
        
      case 'Mechanic':
        // Debugging mode - add console.debug
        return `(console.debug('🔧 MECHANIC:', ${argStrings[0] || 'null'}), ${argStrings[0] || 'null'})`;
        
      case 'Diagnostic':
        // Error analysis - add detailed logging
        return `(function(data) { 
          console.info('🔍 DIAGNOSTIC:', typeof data, data); 
          return data; 
        })(${argStrings[0] || 'null'})`;
        
      case 'LoadCargo':
        // Data loading - simulate data loading
        return `(function(source) { 
          console.log('📦 LOADING CARGO from:', source); 
          return source; 
        })(${argStrings[0] || 'null'})`;
        
      case 'UnloadCargo':
        // Data output - simulate data output
        return `(function(data) { 
          console.log('📤 UNLOADING CARGO:', data); 
          return data; 
        })(${argStrings[0] || 'null'})`;
        
      case 'AskPassenger':
        // Input prompts - use prompt function
        return `prompt(${argStrings[0] || '"Enter input:"'})`;
        
      case 'ListenToRadio':
        // Event handling - use addEventListener
        if (argStrings.length >= 2) {
          return `addEventListener(${argStrings[0]}, ${argStrings[1]})`;
        }
        return `addEventListener('message', ${argStrings[0] || 'function() {}'})`;
        
      case 'Calculate':
        // Math operations prefix - evaluate mathematical expression
        return `(function(expr) { 
          try { 
            return eval(expr); 
          } catch(e) { 
            console.warn('⚠️ CALCULATION ERROR:', e.message); 
            return 0; 
          } 
        })(${argStrings[0] || '0'})`;
        
      case 'Measure':
        // Comparisons - compare two values
        if (argStrings.length >= 2) {
          return `(function(a, b) { 
            if (a > b) return 1; 
            if (a < b) return -1; 
            return 0; 
          })(${argStrings[0]}, ${argStrings[1]})`;
        }
        return `0`;
        
      case 'ReadSign':
        // Text parsing - parse string data
        return `(function(text) { 
          try { 
            return JSON.parse(text); 
          } catch(e) { 
            return text.toString(); 
          } 
        })(${argStrings[0] || '""'})`;
        
      case 'WriteSign':
        // Text formatting - format data as string
        return `(function(data) { 
          if (typeof data === 'object') { 
            return JSON.stringify(data, null, 2); 
          } 
          return String(data); 
        })(${argStrings[0] || 'null'})`;
        
      case 'Convoy':
        // Grouped operations - apply operation to collection
        if (argStrings.length >= 2) {
          return `(${argStrings[0]} || []).map(${argStrings[1]})`;
        }
        return `[]`;
        
      case 'Formation':
        // Structured data - organize data into structure
        return `(function(data) { 
          if (Array.isArray(data)) { 
            return data.reduce((acc, item, index) => { 
              acc[index] = item; 
              return acc; 
            }, {}); 
          } 
          return data; 
        })(${argStrings[0] || 'null'})`;
        
      default:
        // Fall back to regular function call
        const callee = this.generateCalleeExpression({ type: 'Identifier', name: functionName, location: { line: 1, column: 1 } } as Identifier);
        return `${callee}(${argStrings.join(', ')})`;
    }
  }

  private generateCalleeExpression(callee: Expression): string {
    // Handle special built-in function mappings
    if (callee.type === 'Identifier') {
      const name = (callee as Identifier).name;
      const builtinMap: { [key: string]: string } = {
        'Announce': 'console.log',
        'Warn': 'console.warn',
        'Alert': 'console.error',
        'DelayFor': 'setTimeout',
        'RepeatEvery': 'setInterval',
        'RoundUp': 'Math.ceil',
        'RoundDown': 'Math.floor',
        'Random': 'Math.random',
        'ListCompartments': 'Object.keys',
        'CheckContents': 'Object.values',
        'WhatType': 'typeof',
        'IsTypeOf': 'instanceof',
        
        // Enhanced driving terminology mappings
        'Inspection': 'validateData',
        'PassInspection': 'isValid',
        'Turbo': 'optimize',
        'EcoMode': 'memoryEfficient',
        'Mechanic': 'debug',
        'Diagnostic': 'analyze',
        'LoadCargo': 'loadData',
        'UnloadCargo': 'outputData',
        'AskPassenger': 'prompt',
        'ListenToRadio': 'addEventListener',
        'Calculate': 'calculate',
        'Measure': 'compare',
        'ReadSign': 'parse',
        'WriteSign': 'format',
        'Convoy': 'groupOperation',
        'Formation': 'structureData'
      };
      return builtinMap[name] || name;
    }
    return this.generateExpression(callee);
  }

  private generateMemberExpression(node: MemberExpression): string {
    const object = this.generateExpression(node.object);
    
    if (node.computed) {
      const property = this.generateExpression(node.property);
      return `${object}[${property}]`;
    } else {
      // Handle special case for CheckCompartment - it should be direct property access
      if (node.property.type === 'Identifier' && (node.property as Identifier).name === 'CheckCompartment') {
        // This shouldn't happen in normal parsing, but if it does, treat as error
        return `${object}./* CheckCompartment should not be a member expression */`;
      }
      
      const propertyName = this.generateMemberProperty(node.property);
      return `${object}.${propertyName}`;
    }
  }

  private generateMemberProperty(property: Expression): string {
    if (property.type === 'Identifier') {
      const name = (property as Identifier).name;
      // Map TrafLang method names to JavaScript
      const methodMap: { [key: string]: string } = {
        // Array methods
        'PickUp': 'push',
        'DropOff': 'pop',
        'FirstOut': 'shift',
        'FirstIn': 'unshift',
        'CountPassengers': 'length',
        'FindPassenger': 'find',
        'FilterPassengers': 'filter',
        'CheckEach': 'forEach',
        'Transform': 'map',
        'Combine': 'reduce',
        
        // String methods
        'Contains': 'includes',
        'StartsWith': 'startsWith',
        'Split': 'split',
        'Replace': 'replace',
        'ToUpper': 'toUpperCase',
        'ToLower': 'toLowerCase',
        
        // Object methods
        'CheckCompartment': '', // This should be handled as direct property access
        'HasCompartment': 'hasOwnProperty'
      };
      return methodMap[name] || name;
    }
    return this.generateExpression(property);
  }

  private generateArrayExpression(node: ArrayExpression): string {
    const elements = node.elements.map(el => el ? this.generateExpression(el) : 'null').join(', ');
    return `[${elements}]`;
  }

  private generateObjectExpression(node: ObjectExpression): string {
    this.indentLevel++;
    const properties = node.properties.map(prop => this.generateProperty(prop)).join(',\n');
    this.indentLevel--;
    if (properties) {
      return `{\n${properties}\n${this.getIndent()}}`;
    }
    return '{}';
  }

  private generateProperty(node: Property): string {
    const key = node.computed 
      ? `[${this.generateExpression(node.key)}]`
      : node.key.type === 'Identifier' 
        ? (node.key as Identifier).name
        : this.generateExpression(node.key);
    const value = this.generateExpression(node.value);
    return `${this.getIndent()}${key}: ${value}`;
  }

  private generateThisExpression(_node: ThisExpression): string {
    return 'this';
  }

  private generateUpdateExpression(node: UpdateExpression): string {
    const operator = this.mapUpdateOperator(node.operator);
    const argument = this.generateExpression(node.argument);
    return node.prefix ? `${operator}${argument}` : `${argument}${operator}`;
  }

  private mapUpdateOperator(operator: string): string {
    const operatorMap: { [key: string]: string } = {
      'SpeedUp': '++',
      'SlowDown': '--'
    };
    return operatorMap[operator] || operator;
  }

  private generateLogicalExpression(node: LogicalExpression): string {
    const left = this.generateExpression(node.left);
    const right = this.generateExpression(node.right);
    return `${left} ${node.operator} ${right}`;
  }

  private generateConditionalExpression(node: ConditionalExpression): string {
    const test = this.generateExpression(node.test);
    const consequent = this.generateExpression(node.consequent);
    const alternate = this.generateExpression(node.alternate);
    return `${test} ? ${consequent} : ${alternate}`;
  }

  private generateAwaitExpression(node: AwaitExpression): string {
    const argument = this.generateExpression(node.argument);
    return `await ${argument}`;
  }

  private generateFunctionExpression(node: FunctionExpression): string {
    const params = node.params.map(p => p.name).join(', ');
    const asyncKeyword = node.async ? 'async ' : '';
    
    // For simple functions with a single return statement, use single-line format
    if (node.body.body.length === 1 && node.body.body[0].type === 'ReturnStatement') {
      const returnStmt = node.body.body[0] as import('./types').ReturnStatement;
      const returnExpr = returnStmt.argument ? this.generateExpression(returnStmt.argument) : '';
      return `${asyncKeyword}function(${params}) { return ${returnExpr}; }`;
    }
    
    // For more complex functions, use multi-line format
    const body = this.generateBlockStatement(node.body);
    return `${asyncKeyword}function(${params}) ${body}`;
  }

  // Utility methods
  private getIndent(): string {
    return this.INDENT.repeat(this.indentLevel);
  }
}