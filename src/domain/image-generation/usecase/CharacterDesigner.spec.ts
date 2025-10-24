import { describe, it, expect } from 'vitest';
import { CharacterDesigner } from './CharacterDesigner';
import { BusinessConcept } from '@domain/image-generation/entity/BusinessConcept';

describe('CharacterDesigner', () => {
  const businessConcept = BusinessConcept.createCharacterDesign();

  describe('buildPrompt', () => {
    it('should generate base reference prompt', () => {
      const prompt = CharacterDesigner.buildPrompt(
        businessConcept,
        CharacterDesigner.CharacterVariation.BASE,
      );

      expect(prompt.text).toContain('BASE REFERENCE');
      expect(prompt.text).toContain('Square 1:1 aspect ratio');
      expect(prompt.text).toContain('perfectly centered');
      expect(prompt.text).toContain('padding');
      expect(prompt.text).toContain(businessConcept.characterDescription);
      expect(prompt.text).toContain(businessConcept.secretAgentName);
      expect(prompt.style).toBe('kawaii');
      expect(prompt.size).toBe('1024x1024');
    });

    it('should generate logo prompt', () => {
      const prompt = CharacterDesigner.buildPrompt(
        businessConcept,
        CharacterDesigner.CharacterVariation.ICON,
      );

      expect(prompt.text).toContain('the head only of the same character');
      expect(prompt.text).toContain(businessConcept.businessName);
      expect(prompt.style).toBe('kawaii');
      expect(prompt.size).toBe('1024x1024');
    });

    it('should default to base variation', () => {
      const prompt = CharacterDesigner.buildPrompt(businessConcept);

      expect(prompt.text).toContain('BASE REFERENCE');
    });
  });

  describe('getAllVariations', () => {
    it('should return all character variations', () => {
      const variations = CharacterDesigner.getAllVariations();

      expect(variations).toContain(CharacterDesigner.CharacterVariation.BASE);
      expect(variations).toContain(CharacterDesigner.CharacterVariation.ICON);
      expect(variations).toContain(CharacterDesigner.CharacterVariation.STORYTELLING);
      expect(variations).toContain(CharacterDesigner.CharacterVariation.MASCOT);
    });
  });

  describe('getVariationDescription', () => {
    it('should return correct descriptions', () => {
      expect(
        CharacterDesigner.getVariationDescription(CharacterDesigner.CharacterVariation.BASE),
      ).toBe('Base reference character design');

      expect(
        CharacterDesigner.getVariationDescription(CharacterDesigner.CharacterVariation.ICON),
      ).toBe('Head-only icon design with business name');

      expect(
        CharacterDesigner.getVariationDescription(
          CharacterDesigner.CharacterVariation.STORYTELLING,
        ),
      ).toBe('4-panel comic strip storytelling');

      expect(
        CharacterDesigner.getVariationDescription(CharacterDesigner.CharacterVariation.MASCOT),
      ).toBe('Photorealistic mascot with locals and tourists');
    });
  });
});
