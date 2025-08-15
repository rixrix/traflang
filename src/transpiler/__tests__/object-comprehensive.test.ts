// Comprehensive Object Operations Test - Demonstrating ALL implemented features
import { Lexer } from '../lexer';
import { Parser } from '../parser';
import { CodeGenerator } from '../code-generator';

describe('Comprehensive Object Operations', () => {
  function transpileCode(code: string): { result: string; errors: unknown[] } {
    const lexer = new Lexer(code);
    const { tokens, errors: lexErrors } = lexer.tokenize();
    
    const parser = new Parser(tokens);
    const { program, errors: parseErrors } = parser.parse();
    
    const generator = new CodeGenerator();
    const result = generator.generate(program);
    
    return { result, errors: [...lexErrors, ...parseErrors] };
  }

  test.skip('should demonstrate safe object operations working together', () => {
    const code = `
      StartEngine {
        DriverNote Create a car object with multiple properties
        Remember car SetTo Glove {
          brand: "Toyota",
          model: "Camry",
          year: 2023,
          features: Passengers ["GPS", "Bluetooth", "AC"]
        }
        
        DriverNote Basic property access using Compartment
        Remember brand SetTo car Compartment brand
        Remember model SetTo car Compartment model
        
        DriverNote Property access using CheckCompartment method
        Remember year SetTo car CheckCompartment year
        
        DriverNote Check if property exists using HasCompartment
        Remember hasBrand SetTo car HasCompartment "brand"
        Remember hasColor SetTo car HasCompartment "color"
        
        DriverNote Nested object access
        Remember firstFeature SetTo car Compartment features[0]
        
        DriverNote Output all results
        Announce "Car brand: " Join brand
        Announce "Car model: " Join model
        Announce "Car year: " Join year
        Announce "Has brand property: " Join hasBrand
        Announce "Has color property: " Join hasColor
        Announce "First feature: " Join firstFeature
      }
    `;
    
    const { result, errors } = transpileCode(code);
    
    // Should have no errors
    expect(errors).toHaveLength(0);
    
    // Verify object declaration
    expect(result).toContain('let car = {');
    expect(result).toContain('brand: "Toyota"');
    expect(result).toContain('model: "Camry"');
    expect(result).toContain('year: 2023');
    expect(result).toContain('features: ["GPS", "Bluetooth", "AC"]');
    
    // Verify property access methods
    expect(result).toContain('let brand = car.brand');
    expect(result).toContain('let model = car.model');
    expect(result).toContain('let year = car.year');
    
    // Verify object methods
    expect(result).toContain('let hasBrand = car.hasOwnProperty("brand")');
    expect(result).toContain('let hasColor = car.hasOwnProperty("color")');
    
    // Verify nested access
    expect(result).toContain('let firstFeature = car.features[0]');
    
    // Verify console outputs
    expect(result).toContain('console.log("Car brand: " + brand)');
    expect(result).toContain('console.log("Car model: " + model)');
    expect(result).toContain('console.log("Car year: " + year)');
    expect(result).toContain('console.log("Has brand property: " + hasBrand)');
    expect(result).toContain('console.log("Has color property: " + hasColor)');
    expect(result).toContain('console.log("First feature: " + firstFeature)');
    
    // Commented out to prevent memory issues
    // console.log('Generated JavaScript:');
    // console.log('===================');
    // console.log(result);
    // console.log('===================');
  });
});