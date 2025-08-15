// TrafLang Lexer Tests
import { Lexer } from '../lexer';
import { TokenType } from '../types';

describe('TrafLang Lexer', () => {
    let lexer: Lexer;

    describe('Basic Tokenization', () => {
        test('should tokenize empty string', () => {
            lexer = new Lexer('');
            const { tokens, errors } = lexer.tokenize();

            expect(tokens).toHaveLength(1);
            expect(tokens[0].type).toBe(TokenType.EOF);
            expect(errors).toHaveLength(0);
        });

        test('should handle whitespace correctly', () => {
            lexer = new Lexer('   \t\n\r   ');
            const { tokens, errors } = lexer.tokenize();

            expect(tokens).toHaveLength(1);
            expect(tokens[0].type).toBe(TokenType.EOF);
            expect(errors).toHaveLength(0);
        });
    });

    describe('Core Keywords (Requirement 1.1-1.36)', () => {
        test('should tokenize entry point and function keywords', () => {
            lexer = new Lexer('StartEngine Drive GoTo ParkCar');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(5); // 4 keywords + EOF
            expect(tokens[0]).toEqual({
                type: TokenType.KEYWORD,
                value: 'StartEngine',
                line: 1,
                column: 1
            });
            expect(tokens[1]).toEqual({
                type: TokenType.KEYWORD,
                value: 'Drive',
                line: 1,
                column: 13
            });
            expect(tokens[2]).toEqual({
                type: TokenType.KEYWORD,
                value: 'GoTo',
                line: 1,
                column: 19
            });
            expect(tokens[3]).toEqual({
                type: TokenType.KEYWORD,
                value: 'ParkCar',
                line: 1,
                column: 24
            });
        });

        test('should tokenize control flow keywords', () => {
            lexer = new Lexer('CheckMirror TakeAlternate ConsiderRoute KeepDriving StopCar KeepGoing');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(7); // 6 keywords + EOF

            const expectedKeywords = ['CheckMirror', 'TakeAlternate', 'ConsiderRoute', 'KeepDriving', 'StopCar', 'KeepGoing'];
            expectedKeywords.forEach((keyword, index) => {
                expect(tokens[index].type).toBe(TokenType.KEYWORD);
                expect(tokens[index].value).toBe(keyword);
            });
        });

        test('should tokenize variable declaration keywords', () => {
            lexer = new Lexer('Remember NeverForget QuickNote SetTo');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(5); // 4 keywords + EOF

            const expectedKeywords = ['Remember', 'NeverForget', 'QuickNote', 'SetTo'];
            expectedKeywords.forEach((keyword, index) => {
                expect(tokens[index].type).toBe(TokenType.KEYWORD);
                expect(tokens[index].value).toBe(keyword);
            });
        });

        test('should tokenize function parameter keywords', () => {
            lexer = new Lexer('CarryWith Bring');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(3); // 2 keywords + EOF
            expect(tokens[0].value).toBe('CarryWith');
            expect(tokens[1].value).toBe('Bring');
        });

        test('should tokenize object access keywords', () => {
            lexer = new Lexer('Passengers Glove Compartment');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 keywords + EOF

            const expectedKeywords = ['Passengers', 'Glove', 'Compartment'];
            expectedKeywords.forEach((keyword, index) => {
                expect(tokens[index].type).toBe(TokenType.KEYWORD);
                expect(tokens[index].value).toBe(keyword);
            });
        });

        test('should tokenize error handling keywords', () => {
            lexer = new Lexer('TryRoute IfLost Finally ThrowError');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(5); // 4 keywords + EOF

            const expectedKeywords = ['TryRoute', 'IfLost', 'Finally', 'ThrowError'];
            expectedKeywords.forEach((keyword, index) => {
                expect(tokens[index].type).toBe(TokenType.KEYWORD);
                expect(tokens[index].value).toBe(keyword);
            });
        });

        test('should tokenize loop and switch keywords', () => {
            lexer = new Lexer('WhileDriving ChooseRoute IfRoute DefaultRoute');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(5); // 4 keywords + EOF

            const expectedKeywords = ['WhileDriving', 'ChooseRoute', 'IfRoute', 'DefaultRoute'];
            expectedKeywords.forEach((keyword, index) => {
                expect(tokens[index].type).toBe(TokenType.KEYWORD);
                expect(tokens[index].value).toBe(keyword);
            });
        });

        test('should tokenize scope keywords', () => {
            lexer = new Lexer('InCar OnRoad');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(3); // 2 keywords + EOF
            expect(tokens[0].value).toBe('InCar');
            expect(tokens[1].value).toBe('OnRoad');
        });
    });

    describe('Operators (Requirement 5.1-5.22)', () => {
        test('should tokenize arithmetic operators', () => {
            lexer = new Lexer('SpeedUp SlowDown Add Subtract Times DivideBy');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(7); // 6 operators + EOF

            const expectedOperators = ['SpeedUp', 'SlowDown', 'Add', 'Subtract', 'Times', 'DivideBy'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize comparison operators', () => {
            lexer = new Lexer('SameAs DifferentFrom ExactlyLike NotExactlyLike FasterThan SlowerThan AtLeastAs AtMostAs');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(9); // 8 operators + EOF

            const expectedOperators = ['SameAs', 'DifferentFrom', 'ExactlyLike', 'NotExactlyLike', 'FasterThan', 'SlowerThan', 'AtLeastAs', 'AtMostAs'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize logical operators', () => {
            lexer = new Lexer('And Or Not');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 operators + EOF

            const expectedOperators = ['And', 'Or', 'Not'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize string operators', () => {
            lexer = new Lexer('Join Contains StartsWith Split Replace ToUpper ToLower');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(8); // 7 operators + EOF

            const expectedOperators = ['Join', 'Contains', 'StartsWith', 'Split', 'Replace', 'ToUpper', 'ToLower'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize array operators', () => {
            lexer = new Lexer('PickUp DropOff FirstOut FirstIn CountPassengers FindPassenger FilterPassengers CheckEach Transform Combine');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(11); // 10 operators + EOF

            const expectedOperators = ['PickUp', 'DropOff', 'FirstOut', 'FirstIn', 'CountPassengers', 'FindPassenger', 'FilterPassengers', 'CheckEach', 'Transform', 'Combine'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize object operators', () => {
            lexer = new Lexer('CheckCompartment HasCompartment ListCompartments CheckContents');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(5); // 4 operators + EOF

            const expectedOperators = ['CheckCompartment', 'HasCompartment', 'ListCompartments', 'CheckContents'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize async and timing operators', () => {
            lexer = new Lexer('WaitFor Promise DelayFor RepeatEvery');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(5); // 4 operators + EOF

            const expectedOperators = ['WaitFor', 'Promise', 'DelayFor', 'RepeatEvery'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize type checking and math operators', () => {
            lexer = new Lexer('WhatType IsTypeOf RoundUp RoundDown Random');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(6); // 5 operators + EOF

            const expectedOperators = ['WhatType', 'IsTypeOf', 'RoundUp', 'RoundDown', 'Random'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });

        test('should tokenize console operators', () => {
            lexer = new Lexer('Announce Warn Alert');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 operators + EOF

            const expectedOperators = ['Announce', 'Warn', 'Alert'];
            expectedOperators.forEach((operator, index) => {
                expect(tokens[index].type).toBe(TokenType.OPERATOR);
                expect(tokens[index].value).toBe(operator);
            });
        });
    });

    describe('Enhanced Driving Terminology (Requirement 10.1-10.10)', () => {
        test('should tokenize enhanced driving keywords', () => {
            lexer = new Lexer('Cruise ManualDrive TrafficLight Inspection PassInspection Turbo EcoMode Mechanic Diagnostic');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(10); // 9 keywords + EOF

            const expectedKeywords = ['Cruise', 'ManualDrive', 'TrafficLight', 'Inspection', 'PassInspection', 'Turbo', 'EcoMode', 'Mechanic', 'Diagnostic'];
            expectedKeywords.forEach((keyword, index) => {
                expect(tokens[index].type).toBe(TokenType.KEYWORD);
                expect(tokens[index].value).toBe(keyword);
            });
        });

        test('should tokenize data and text processing keywords', () => {
            lexer = new Lexer('LoadCargo UnloadCargo AskPassenger ListenToRadio Calculate Measure ReadSign WriteSign Convoy Formation');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(11); // 10 keywords + EOF

            const expectedKeywords = ['LoadCargo', 'UnloadCargo', 'AskPassenger', 'ListenToRadio', 'Calculate', 'Measure', 'ReadSign', 'WriteSign', 'Convoy', 'Formation'];
            expectedKeywords.forEach((keyword, index) => {
                expect(tokens[index].type).toBe(TokenType.KEYWORD);
                expect(tokens[index].value).toBe(keyword);
            });
        });
    });

    describe('Literals', () => {
        test('should tokenize string literals with double quotes', () => {
            lexer = new Lexer('"Hello, World!"');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(2); // string + EOF
            expect(tokens[0]).toEqual({
                type: TokenType.STRING_LITERAL,
                value: '"Hello, World!"',
                line: 1,
                column: 1
            });
        });

        test('should tokenize string literals with single quotes', () => {
            lexer = new Lexer("'Hello, World!'");
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(2); // string + EOF
            expect(tokens[0]).toEqual({
                type: TokenType.STRING_LITERAL,
                value: "'Hello, World!'",
                line: 1,
                column: 1
            });
        });

        test('should handle escaped characters in strings', () => {
            lexer = new Lexer('"Hello\\nWorld\\t!"');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(2); // string + EOF
            expect(tokens[0].value).toBe('"Hello\\nWorld\\t!"');
        });

        test('should tokenize integer numbers', () => {
            lexer = new Lexer('123 456 0');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 numbers + EOF

            expect(tokens[0]).toEqual({
                type: TokenType.NUMBER_LITERAL,
                value: '123',
                line: 1,
                column: 1
            });
            expect(tokens[1]).toEqual({
                type: TokenType.NUMBER_LITERAL,
                value: '456',
                line: 1,
                column: 5
            });
            expect(tokens[2]).toEqual({
                type: TokenType.NUMBER_LITERAL,
                value: '0',
                line: 1,
                column: 9
            });
        });

        test('should tokenize decimal numbers', () => {
            lexer = new Lexer('123.45 0.5 999.999');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 numbers + EOF

            expect(tokens[0].value).toBe('123.45');
            expect(tokens[1].value).toBe('0.5');
            expect(tokens[2].value).toBe('999.999');
        });

        test('should tokenize boolean literals', () => {
            lexer = new Lexer('Yes No');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(3); // 2 booleans + EOF

            expect(tokens[0]).toEqual({
                type: TokenType.BOOLEAN_LITERAL,
                value: 'Yes',
                line: 1,
                column: 1
            });
            expect(tokens[1]).toEqual({
                type: TokenType.BOOLEAN_LITERAL,
                value: 'No',
                line: 1,
                column: 5
            });
        });

        test('should tokenize special values', () => {
            lexer = new Lexer('Empty Unknown');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(3); // 2 special values + EOF

            expect(tokens[0]).toEqual({
                type: TokenType.LITERAL,
                value: 'Empty',
                line: 1,
                column: 1
            });
            expect(tokens[1]).toEqual({
                type: TokenType.LITERAL,
                value: 'Unknown',
                line: 1,
                column: 7
            });
        });
    });

    describe('Comments', () => {
        test('should tokenize single-line comments', () => {
            lexer = new Lexer('DriverNote This is a comment');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(2); // comment + EOF
            expect(tokens[0]).toEqual({
                type: TokenType.SINGLE_LINE_COMMENT,
                value: 'DriverNote This is a comment',
                line: 1,
                column: 1
            });
        });

        test('should tokenize multi-line comments', () => {
            lexer = new Lexer('Manual\nThis is a\nmulti-line comment\nManual');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(2); // comment + EOF
            expect(tokens[0].type).toBe(TokenType.MULTI_LINE_COMMENT);
            expect(tokens[0].value).toBe('Manual\nThis is a\nmulti-line comment\nManual');
        });

        test('should handle comments with code', () => {
            lexer = new Lexer('StartEngine DriverNote This is a comment\nRemember x SetTo 5');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(7); // StartEngine + comment + Remember + x + SetTo + 5 + EOF
            expect(tokens[0].value).toBe('StartEngine');
            expect(tokens[1].type).toBe(TokenType.SINGLE_LINE_COMMENT);
            expect(tokens[2].value).toBe('Remember');
        });
    });

    describe('Delimiters', () => {
        test('should tokenize parentheses', () => {
            lexer = new Lexer('()');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(3); // ( + ) + EOF
            expect(tokens[0].type).toBe(TokenType.LEFT_PAREN);
            expect(tokens[1].type).toBe(TokenType.RIGHT_PAREN);
        });

        test('should tokenize braces', () => {
            lexer = new Lexer('{}');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(3); // { + } + EOF
            expect(tokens[0].type).toBe(TokenType.LEFT_BRACE);
            expect(tokens[1].type).toBe(TokenType.RIGHT_BRACE);
        });

        test('should tokenize brackets', () => {
            lexer = new Lexer('[]');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(3); // [ + ] + EOF
            expect(tokens[0].type).toBe(TokenType.LEFT_BRACKET);
            expect(tokens[1].type).toBe(TokenType.RIGHT_BRACKET);
        });

        test('should tokenize punctuation', () => {
            lexer = new Lexer(';,.:');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(5); // ; + , + . + : + EOF
            expect(tokens[0].type).toBe(TokenType.SEMICOLON);
            expect(tokens[1].type).toBe(TokenType.COMMA);
            expect(tokens[2].type).toBe(TokenType.DOT);
            expect(tokens[3].type).toBe(TokenType.COLON);
        });
    });

    describe('Identifiers', () => {
        test('should tokenize valid identifiers', () => {
            lexer = new Lexer('myVariable functionName className');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 identifiers + EOF

            expect(tokens[0]).toEqual({
                type: TokenType.IDENTIFIER,
                value: 'myVariable',
                line: 1,
                column: 1
            });
            expect(tokens[1]).toEqual({
                type: TokenType.IDENTIFIER,
                value: 'functionName',
                line: 1,
                column: 12
            });
            expect(tokens[2]).toEqual({
                type: TokenType.IDENTIFIER,
                value: 'className',
                line: 1,
                column: 25
            });
        });

        test('should tokenize identifiers with numbers', () => {
            lexer = new Lexer('var1 test123 item2');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 identifiers + EOF

            expect(tokens[0].value).toBe('var1');
            expect(tokens[1].value).toBe('test123');
            expect(tokens[2].value).toBe('item2');
        });
    });

    describe('Line and Column Tracking', () => {
        test('should track line numbers correctly', () => {
            lexer = new Lexer('StartEngine\nRemember\nDrive');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 keywords + EOF

            expect(tokens[0].line).toBe(1);
            expect(tokens[1].line).toBe(2);
            expect(tokens[2].line).toBe(3);
        });

        test('should track column numbers correctly', () => {
            lexer = new Lexer('StartEngine Remember Drive');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens).toHaveLength(4); // 3 keywords + EOF

            expect(tokens[0].column).toBe(1);
            expect(tokens[1].column).toBe(13);
            expect(tokens[2].column).toBe(22);
        });

        test('should handle mixed line and column tracking', () => {
            lexer = new Lexer('StartEngine {\n  Remember x SetTo 5\n}');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);

            expect(tokens[0]).toEqual({
                type: TokenType.KEYWORD,
                value: 'StartEngine',
                line: 1,
                column: 1
            });
            expect(tokens[1]).toEqual({
                type: TokenType.LEFT_BRACE,
                value: '{',
                line: 1,
                column: 13
            });
            expect(tokens[2]).toEqual({
                type: TokenType.KEYWORD,
                value: 'Remember',
                line: 2,
                column: 3
            });
        });
    });

    describe('Error Handling', () => {
        test('should handle unterminated string literals', () => {
            lexer = new Lexer('"unterminated string');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(1);
            expect(errors[0].type).toBe('unterminated_string');
            expect(errors[0].drivingMessage).toContain('🛑 STOP!');
            expect(errors[0].line).toBe(1);
            expect(errors[0].column).toBe(1);
        });

        test('should handle unterminated multi-line comments', () => {
            lexer = new Lexer('Manual\nThis comment is not closed');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(1);
            expect(errors[0].type).toBe('unterminated_comment');
            expect(errors[0].drivingMessage).toContain('🚧 ROAD WORK AHEAD');
            expect(errors[0].line).toBe(1);
            expect(errors[0].column).toBe(1);
        });

        test('should handle invalid characters', () => {
            lexer = new Lexer('StartEngine @ invalid');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(1);
            expect(errors[0].type).toBe('invalid_token');
            expect(errors[0].drivingMessage).toContain('🚫 ROADBLOCK');
            expect(tokens[1].type).toBe(TokenType.INVALID);
        });

        test('should handle invalid number formats', () => {
            lexer = new Lexer('123.');
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(1);
            expect(errors[0].type).toBe('invalid_number');
            expect(errors[0].drivingMessage).toContain('⚠️ SPEED CHECK');
        });
    });

    describe('Utility Methods', () => {
        beforeEach(() => {
            lexer = new Lexer('');
        });

        test('should provide operator mappings', () => {
            expect(lexer.getOperatorMapping('Add')).toBe('+');
            expect(lexer.getOperatorMapping('SameAs')).toBe('==');
            expect(lexer.getOperatorMapping('And')).toBe('&&');
            expect(lexer.getOperatorMapping('Announce')).toBe('console.log');
            expect(lexer.getOperatorMapping('NonExistent')).toBeUndefined();
        });

        test('should provide boolean mappings', () => {
            expect(lexer.getBooleanMapping('Yes')).toBe('true');
            expect(lexer.getBooleanMapping('No')).toBe('false');
            expect(lexer.getBooleanMapping('Maybe')).toBeUndefined();
        });

        test('should provide special value mappings', () => {
            expect(lexer.getSpecialValueMapping('Empty')).toBe('null');
            expect(lexer.getSpecialValueMapping('Unknown')).toBe('undefined');
            expect(lexer.getSpecialValueMapping('Something')).toBeUndefined();
        });
    });

    describe('Complex Examples', () => {
        test('should tokenize a complete TrafLang function', () => {
            const code = `
        Drive calculateSpeed CarryWith distance CarryWith time {
          Remember speed SetTo distance DivideBy time
          CheckMirror (speed FasterThan 60) {
            Announce "Speeding!"
          }
          ParkCar speed
        }
      `;

            lexer = new Lexer(code);
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);
            expect(tokens.length).toBeGreaterThan(20);

            // Check some key tokens
            expect(tokens[0].value).toBe('Drive');
            expect(tokens[1].value).toBe('calculateSpeed');
            expect(tokens[2].value).toBe('CarryWith');
            expect(tokens[3].value).toBe('distance');
        });

        test('should tokenize mixed content with comments', () => {
            const code = `
        DriverNote This is a function to calculate fuel cost
        Drive calculateFuel CarryWith distance {
          Manual
          This function calculates fuel consumption
          based on distance traveled
          Manual
          Remember consumption SetTo distance DivideBy 10
          ParkCar consumption
        }
      `;

            lexer = new Lexer(code);
            const { tokens, errors } = lexer.tokenize();

            expect(errors).toHaveLength(0);

            // Should have both single-line and multi-line comments
            const commentTokens = tokens.filter(t =>
                t.type === TokenType.SINGLE_LINE_COMMENT ||
                t.type === TokenType.MULTI_LINE_COMMENT
            );
            expect(commentTokens).toHaveLength(2);
        });
    });
});