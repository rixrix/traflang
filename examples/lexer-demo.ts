// TrafLang Lexer Demonstration
import { Lexer, TokenType } from '../src/transpiler';

// Example TrafLang code demonstrating all features
const trafLangCode = `
DriverNote This is a sample TrafLang program

Drive greetPassenger CarryWith name {
  Announce "Welcome aboard, " Join name Join "!"
  ParkCar Yes
}

StartEngine {
  Remember passengers SetTo Passengers ["Alice", "Bob", "Charlie"]
  NeverForget maxSpeed SetTo 120
  Remember currentSpeed SetTo 0
  
  Manual
  Let's start our journey and greet all passengers
  This demonstrates multi-line comments
  Manual
  
  CheckEach passengers Drive CarryWith passenger {
    GoTo greetPassenger Bring passenger
  }
  
  KeepDriving WhileDriving (currentSpeed SlowerThan maxSpeed) {
    currentSpeed SpeedUp
    CheckMirror (currentSpeed SameAs 60) {
      Announce "Reached city speed limit"
    }
  }
  
  CheckMirror (currentSpeed ExactlyLike maxSpeed) {
    Announce "At maximum speed!"
  } TakeAlternate {
    Announce "Speed: " Join currentSpeed
  }
  
  TryRoute {
    CheckMirror (passengers.length FasterThan 3) {
      ThrowError "Too many passengers!"
    }
  } IfLost CarryWith error {
    Alert error
  } Finally {
    Announce "Journey completed safely"
  }
}
`;

// Tokenize the code
console.log('🚗 TrafLang Lexer Demo\n');
console.log('Input TrafLang Code:');
console.log('='.repeat(50));
console.log(trafLangCode);
console.log('='.repeat(50));

const lexer = new Lexer(trafLangCode);
const { tokens, errors } = lexer.tokenize();

console.log('\n📊 Tokenization Results:');
console.log(`Total tokens: ${tokens.length}`);
console.log(`Lexical errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Lexical Errors:');
  errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error.drivingMessage}`);
    console.log(`   Line ${error.line}, Column ${error.column}: ${error.message}`);
  });
}

console.log('\n🔍 Token Analysis:');

// Count tokens by type
const tokenCounts = tokens.reduce((counts, token) => {
  counts[token.type] = (counts[token.type] || 0) + 1;
  return counts;
}, {} as Record<string, number>);

Object.entries(tokenCounts).forEach(([type, count]) => {
  console.log(`${type}: ${count}`);
});

console.log('\n📝 Sample Tokens:');

// Show first 20 tokens with details
tokens.slice(0, 20).forEach((token, index) => {
  const typeIcon = {
    [TokenType.KEYWORD]: '🔑',
    [TokenType.OPERATOR]: '⚙️',
    [TokenType.IDENTIFIER]: '🏷️',
    [TokenType.STRING_LITERAL]: '📝',
    [TokenType.NUMBER_LITERAL]: '🔢',
    [TokenType.BOOLEAN_LITERAL]: '✅',
    [TokenType.SINGLE_LINE_COMMENT]: '💬',
    [TokenType.MULTI_LINE_COMMENT]: '📄',
    [TokenType.LEFT_BRACE]: '🔓',
    [TokenType.RIGHT_BRACE]: '🔒',
  }[token.type] || '❓';
  
  console.log(`${index + 1:2}. ${typeIcon} ${token.type.padEnd(20)} "${token.value}" (${token.line}:${token.column})`);
});

if (tokens.length > 20) {
  console.log(`... and ${tokens.length - 20} more tokens`);
}

console.log('\n🗺️ Operator Mappings Demo:');
const operatorExamples = ['Add', 'SameAs', 'FasterThan', 'Announce', 'CountPassengers'];
operatorExamples.forEach(op => {
  const jsEquivalent = lexer.getOperatorMapping(op);
  console.log(`${op} → ${jsEquivalent}`);
});

console.log('\n🚦 Boolean & Special Values:');
console.log(`Yes → ${lexer.getBooleanMapping('Yes')}`);
console.log(`No → ${lexer.getBooleanMapping('No')}`);
console.log(`Empty → ${lexer.getSpecialValueMapping('Empty')}`);
console.log(`Unknown → ${lexer.getSpecialValueMapping('Unknown')}`);

console.log('\n✅ Lexer demonstration completed!');