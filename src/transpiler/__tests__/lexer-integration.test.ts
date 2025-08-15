// TrafLang Lexer Integration Tests
import { Lexer } from '../lexer';
import { TokenType } from '../types';

describe('TrafLang Lexer Integration', () => {
  test('should tokenize a complete TrafLang program with all features', () => {
    const code = `
      DriverNote This is a complete TrafLang program demonstrating all features
      
      Drive calculateFuelCost CarryWith distance CarryWith pricePerLiter {
        Manual
        This function calculates the fuel cost
        based on distance and price per liter
        Manual
        
        Remember consumption SetTo distance DivideBy 10
        Remember cost SetTo consumption Times pricePerLiter
        
        CheckMirror (cost FasterThan 50) {
          Announce "Expensive trip!"
        } TakeAlternate {
          Announce "Affordable trip"
        }
        
        ParkCar cost
      }
      
      StartEngine {
        Remember distance SetTo 100
        NeverForget pricePerLiter SetTo 1.5
        Remember passengers SetTo Passengers ["Alice", "Bob"]
        Remember car SetTo Glove {
          brand: "Toyota",
          fuel: 50,
          speed: 0
        }
        
        CheckMirror (CountPassengers passengers FasterThan 0) {
          Announce "We have passengers!"
          CheckEach passengers Drive CarryWith passenger {
            Announce "Passenger: " Join passenger
          }
        }
        
        Remember tripCost SetTo GoTo calculateFuelCost Bring distance Bring pricePerLiter
        Announce "Total trip cost: $" Join tripCost
        
        TryRoute {
          CheckMirror (car.fuel SlowerThan 10) {
            ThrowError "Low fuel!"
          }
          car.speed SetTo 80
        } IfLost CarryWith error {
          Alert error
        } Finally {
          Announce "Trip completed"
        }
      }
    `;
    
    const lexer = new Lexer(code);
    const { tokens, errors } = lexer.tokenize();
    
    // Should have no lexical errors
    expect(errors).toHaveLength(0);
    
    // Should have a reasonable number of tokens
    expect(tokens.length).toBeGreaterThan(50);
    
    // Check for presence of key token types
    const tokenTypes = tokens.map(t => t.type);
    expect(tokenTypes).toContain(TokenType.KEYWORD);
    expect(tokenTypes).toContain(TokenType.IDENTIFIER);
    expect(tokenTypes).toContain(TokenType.STRING_LITERAL);
    expect(tokenTypes).toContain(TokenType.NUMBER_LITERAL);
    expect(tokenTypes).toContain(TokenType.OPERATOR);
    expect(tokenTypes).toContain(TokenType.SINGLE_LINE_COMMENT);
    expect(tokenTypes).toContain(TokenType.MULTI_LINE_COMMENT);
    expect(tokenTypes).toContain(TokenType.LEFT_BRACE);
    expect(tokenTypes).toContain(TokenType.RIGHT_BRACE);
    expect(tokenTypes).toContain(TokenType.EOF);
    
    // Check for specific keywords
    const keywordValues = tokens.filter(t => t.type === TokenType.KEYWORD).map(t => t.value);
    expect(keywordValues).toContain('StartEngine');
    expect(keywordValues).toContain('Drive');
    expect(keywordValues).toContain('Remember');
    expect(keywordValues).toContain('NeverForget');
    expect(keywordValues).toContain('CheckMirror');
    expect(keywordValues).toContain('TakeAlternate');
    expect(keywordValues).toContain('TryRoute');
    expect(keywordValues).toContain('IfLost');
    expect(keywordValues).toContain('Finally');
    expect(keywordValues).toContain('Passengers');
    expect(keywordValues).toContain('Glove');
    
    // Check for specific operators
    const operatorValues = tokens.filter(t => t.type === TokenType.OPERATOR).map(t => t.value);
    expect(operatorValues).toContain('DivideBy');
    expect(operatorValues).toContain('Times');
    expect(operatorValues).toContain('FasterThan');
    expect(operatorValues).toContain('SlowerThan');
    expect(operatorValues).toContain('Join');
    expect(operatorValues).toContain('CountPassengers');
    expect(operatorValues).toContain('CheckEach');
    expect(operatorValues).toContain('Announce');
    expect(operatorValues).toContain('Alert');
    
    // Verify line and column tracking works
    const firstToken = tokens[0];
    expect(firstToken.line).toBeGreaterThan(0);
    expect(firstToken.column).toBeGreaterThan(0);
    
    // Verify EOF token is last
    const lastToken = tokens[tokens.length - 1];
    expect(lastToken.type).toBe(TokenType.EOF);
  });

  test('should handle all operator mappings correctly', () => {
    const lexer = new Lexer('');
    
    // Test arithmetic operators
    expect(lexer.getOperatorMapping('Add')).toBe('+');
    expect(lexer.getOperatorMapping('Subtract')).toBe('-');
    expect(lexer.getOperatorMapping('Times')).toBe('*');
    expect(lexer.getOperatorMapping('DivideBy')).toBe('/');
    expect(lexer.getOperatorMapping('SpeedUp')).toBe('++');
    expect(lexer.getOperatorMapping('SlowDown')).toBe('--');
    
    // Test comparison operators
    expect(lexer.getOperatorMapping('SameAs')).toBe('==');
    expect(lexer.getOperatorMapping('ExactlyLike')).toBe('===');
    expect(lexer.getOperatorMapping('FasterThan')).toBe('>');
    expect(lexer.getOperatorMapping('SlowerThan')).toBe('<');
    
    // Test logical operators
    expect(lexer.getOperatorMapping('And')).toBe('&&');
    expect(lexer.getOperatorMapping('Or')).toBe('||');
    expect(lexer.getOperatorMapping('Not')).toBe('!');
    
    // Test string operators
    expect(lexer.getOperatorMapping('Join')).toBe('+');
    expect(lexer.getOperatorMapping('Contains')).toBe('.includes');
    expect(lexer.getOperatorMapping('Split')).toBe('.split');
    
    // Test array operators
    expect(lexer.getOperatorMapping('PickUp')).toBe('.push');
    expect(lexer.getOperatorMapping('DropOff')).toBe('.pop');
    expect(lexer.getOperatorMapping('CountPassengers')).toBe('.length');
    
    // Test console operators
    expect(lexer.getOperatorMapping('Announce')).toBe('console.log');
    expect(lexer.getOperatorMapping('Warn')).toBe('console.warn');
    expect(lexer.getOperatorMapping('Alert')).toBe('console.error');
  });

  test('should handle all boolean and special value mappings correctly', () => {
    const lexer = new Lexer('');
    
    // Test boolean mappings
    expect(lexer.getBooleanMapping('Yes')).toBe('true');
    expect(lexer.getBooleanMapping('No')).toBe('false');
    
    // Test special value mappings
    expect(lexer.getSpecialValueMapping('Empty')).toBe('null');
    expect(lexer.getSpecialValueMapping('Unknown')).toBe('undefined');
  });

  test('should properly categorize all TrafLang keywords', () => {
    const testCases = [
      // Core language constructs
      { code: 'StartEngine', expectedType: TokenType.KEYWORD },
      { code: 'Drive', expectedType: TokenType.KEYWORD },
      { code: 'Remember', expectedType: TokenType.KEYWORD },
      { code: 'CheckMirror', expectedType: TokenType.KEYWORD },
      
      // Operators
      { code: 'Add', expectedType: TokenType.OPERATOR },
      { code: 'SameAs', expectedType: TokenType.OPERATOR },
      { code: 'Announce', expectedType: TokenType.OPERATOR },
      
      // Boolean literals
      { code: 'Yes', expectedType: TokenType.BOOLEAN_LITERAL },
      { code: 'No', expectedType: TokenType.BOOLEAN_LITERAL },
      
      // Special values
      { code: 'Empty', expectedType: TokenType.LITERAL },
      { code: 'Unknown', expectedType: TokenType.LITERAL },
      
      // Regular identifiers
      { code: 'myVariable', expectedType: TokenType.IDENTIFIER },
      { code: 'functionName', expectedType: TokenType.IDENTIFIER },
    ];
    
    testCases.forEach(({ code, expectedType }) => {
      const lexer = new Lexer(code);
      const { tokens, errors } = lexer.tokenize();
      
      expect(errors).toHaveLength(0);
      expect(tokens[0].type).toBe(expectedType);
      expect(tokens[0].value).toBe(code);
    });
  });
});