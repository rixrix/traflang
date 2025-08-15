// Debug test for parser issues
import { Parser } from '../parser';
import { Lexer } from '../lexer';

describe('Parser Debug', () => {
  function parseCode(code: string) {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    console.log('Tokens:', tokens.map(t => `${t.type}:${t.value}`));
    expect(lexErrors).toHaveLength(0);
    
    const parser = new Parser(tokens);
    return parser.parse();
  }

  test('should debug StartEngine parsing', () => {
    const code = `StartEngine { Announce "Hello" }`;
    
    const { program, errors } = parseCode(code);
    console.log('Errors:', errors);
    console.log('Program:', JSON.stringify(program, null, 2));
  });

  test('TEST: Minimal reproduction of Drive CarryWith issue', () => {
    console.log('=== MINIMAL REPRODUCTION TEST ===');
    
    // Test different contexts to isolate the issue
    const contexts = [
      {
        name: 'Simple expression',
        code: `numbers FilterPassengers Drive CarryWith n { ParkCar n }`,
        shouldWork: true
      },
      {
        name: 'Inside StartEngine',
        code: `StartEngine { Remember x SetTo numbers FilterPassengers Drive CarryWith n { ParkCar n } }`,
        shouldWork: false
      },
      {
        name: 'With Passengers array',
        code: `StartEngine { Remember nums SetTo Passengers [1,2] Remember x SetTo nums FilterPassengers Drive CarryWith n { ParkCar n } }`,
        shouldWork: false
      }
    ];
    
    contexts.forEach(({ name, code, shouldWork }) => {
      console.log(`\n--- Testing: ${name} ---`);
      
      const lexer = new Lexer(code);
      const { tokens } = lexer.tokenize();
      
      const parser = new Parser(tokens);
      let result;
      
      try {
        if (code.startsWith('StartEngine')) {
          result = parser.parse();
          const hasErrors = result.errors.length > 0;
          console.log(shouldWork ? 
            (hasErrors ? `❌ Expected to work but failed: ${result.errors[0]?.message}` : '✅ Works as expected') :
            (hasErrors ? '✅ Fails as expected' : '❌ Expected to fail but worked')
          );
          if (hasErrors) {
            console.log(`   Error: Line ${result.errors[0]?.line}, Col ${result.errors[0]?.column}: ${result.errors[0]?.message}`);
          }
        } else {
          result = parser['parseExpression']();
          console.log(shouldWork ? '✅ Works as expected' : '❌ Expected to fail but worked');
        }
      } catch (e) {
        console.log(shouldWork ? `❌ Expected to work but failed: ${e.message}` : '✅ Fails as expected');
      }
    });
  });

  test('should debug string chaining issue', () => {
    const code = `StartEngine {
  Remember csv SetTo "apple,BANANA,Cherry"
  Remember fruits SetTo csv ToLower Split ","
  Remember firstFruit SetTo fruits[0] ToUpper
  Announce firstFruit
}`;
    
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    console.log('Lexer errors:', lexErrors);
    
    // Focus on the problematic line tokens
    console.log('All tokens:');
    tokens.forEach((t, i) => console.log(`${i}: ${t.type}:${t.value}`));
    
    const parser = new Parser(tokens);
    const { program, errors } = parser.parse();
    console.log('Parser Errors:', errors);
    
    if (program.startEngine?.body?.body) {
      console.log('StartEngine body statements:', program.startEngine.body.body.length);
      program.startEngine.body.body.forEach((stmt, i) => {
        console.log(`Statement ${i}:`, stmt.type);
        if (stmt.type === 'VariableDeclaration') {
          const varDecl = stmt as import('../types').VariableDeclaration;
          console.log(`  Variable: ${varDecl.declarations[0].id.name}`);
          console.log(`  Init type: ${varDecl.declarations[0].init?.type}`);
        }
      });
    }
  });
});