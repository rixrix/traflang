import { TrafLangTranspiler } from '../transpiler';

describe('TrafLang Transpiler - Basic Functionality', () => {
  let transpiler: TrafLangTranspiler;

  beforeEach(() => {
    transpiler = new TrafLangTranspiler();
  });

  test('transpiles simple StartEngine block', () => {
    const input = `StartEngine {
  Remember greeting SetTo "Hello, TrafLang!"
  Announce greeting
}`;

    const result = transpiler.transpile(input);
    
    expect(result.success).toBe(true);
    expect(result.javascript).toBeDefined();
    expect(result.javascript).toContain('function main()');
    expect(result.javascript).toContain('let greeting = "Hello, TrafLang!"');
    expect(result.javascript).toContain('console.log(greeting)');
    expect(result.javascript).toContain('main()');
    expect(result.errors).toHaveLength(0);
  });

  test('handles empty StartEngine block', () => {
    const input = `StartEngine {
}`;

    const result = transpiler.transpile(input);
    
    expect(result.success).toBe(true);
    expect(result.javascript).toContain('function main()');
    expect(result.javascript).toContain('main()');
  });

  test('transpiles variables correctly', () => {
    const input = `StartEngine {
  Remember speed SetTo 60
  NeverForget maxSpeed SetTo 120
  QuickNote distance SetTo 100
}`;

    const result = transpiler.transpile(input);
    
    expect(result.success).toBe(true);
    expect(result.javascript).toContain('let speed = 60');
    expect(result.javascript).toContain('const maxSpeed = 120');
    expect(result.javascript).toContain('var distance = 100');
  });

  test('handles syntax errors gracefully', () => {
    const input = `StartEngine {
  Remember speed SetTo
}`;

    const result = transpiler.transpile(input);
    
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].type).toBe('syntax');
  });
});