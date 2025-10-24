import type { BusinessConcept } from '@domain/image-generation/entity/BusinessConcept';
import { CharacterDesigner } from '@domain/image-generation/usecase/CharacterDesigner';
import type { CanvasRules } from '@domain/image-generation/vo/CanvasRules';

export namespace GenerateCharacterImages {
  export interface ImageGenerationResult {
    baseImage: string;
    storytellingImage: string;
    mascotImage: string;
    businessConcept: BusinessConcept.t;
    prompts: {
      base: string;
      storytelling: string;
      mascot: string;
    };
  }

  export interface ImageGenerator {
    generateBaseImage(prompt: string): Promise<string>;
    generateStorytellingImage(prompt: string, baseImageId: string): Promise<string>;
    generateMascotImage(prompt: string, baseImageId: string): Promise<string>;
  }

  export const execute = async (
    businessConcept: BusinessConcept.t,
    canvas: CanvasRules.t,
    imageGenerator: ImageGenerator,
  ): Promise<ImageGenerationResult> => {
    // 1. Generate all prompts in Domain Layer
    const basePrompt = CharacterDesigner.buildPrompt(
      businessConcept,
      CharacterDesigner.CharacterVariation.BASE,
      canvas,
    );

    const storytellingPrompt = CharacterDesigner.buildPrompt(
      businessConcept,
      CharacterDesigner.CharacterVariation.STORYTELLING,
      canvas,
    );

    const mascotPrompt = CharacterDesigner.buildPrompt(
      businessConcept,
      CharacterDesigner.CharacterVariation.MASCOT,
      canvas,
    );

    // 2. Call vendor implementations with prompts
    const baseImage = await imageGenerator.generateBaseImage(basePrompt.text);
    const storytellingImage = await imageGenerator.generateStorytellingImage(
      storytellingPrompt.text,
      baseImage,
    );
    const mascotImage = await imageGenerator.generateMascotImage(mascotPrompt.text, baseImage);

    return {
      baseImage,
      storytellingImage,
      mascotImage,
      businessConcept,
      prompts: {
        base: basePrompt.text,
        storytelling: storytellingPrompt.text,
        mascot: mascotPrompt.text,
      },
    };
  };
}
