// Main TrafLang Transpiler
import { Lexer } from './lexer';
import { Parser } from './parser';
import { CodeGenerator } from './code-generator';
import { TranspilerResult } from './types';

export class TrafLangTranspiler {
  transpile(source: string): TranspilerResult {
    try {
      // Tokenize
      const lexer = new Lexer(source);
      const lexResult = lexer.tokenize();

      // Check for lexer errors
      if (lexResult.errors && lexResult.errors.length > 0) {
        return {
          success: false,
          javascript: '',
          errors: lexResult.errors.map(err => ({
            message: err.message,
            line: err.line,
            column: err.column,
            type: 'syntax' as const,
            drivingMessage: '🛑 STOP! Cannot read the road signs - ' + err.message,
          })),
        };
      }

      // Parse
      const parser = new Parser(lexResult.tokens);
      const parseResult = parser.parse();

      // Check for parse errors
      if (parseResult.errors && parseResult.errors.length > 0) {
        return {
          success: false,
          javascript: '',
          errors: parseResult.errors.map(err => ({
            message: err.message,
            line: err.line,
            column: err.column,
            type: 'syntax' as const,
            drivingMessage: err.drivingMessage || '🛑 STOP! Road hazard detected',
          })),
        };
      }

      // Generate JavaScript
      const generator = new CodeGenerator();
      const javascript = generator.generate(parseResult.program);

      return {
        success: true,
        javascript,
        errors: [],
      };
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            message: error instanceof Error ? error.message : 'Unknown error',
            line: 1,
            column: 1,
            type: 'syntax',
            drivingMessage: 'Road hazard detected! Check your route syntax.',
          },
        ],
      };
    }
  }
}