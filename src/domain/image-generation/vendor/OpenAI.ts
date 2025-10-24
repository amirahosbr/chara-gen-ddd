import OpenAI from 'openai';
import { GenerateCharacterImages } from '@domain/image-generation/usecase/GenerateCharacterImages';
import { writeFileSync, mkdirSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateBaseImage = async (prompt: string): Promise<string> => {
  console.log('📸 Generating base reference image...');

  const response = await openai.responses.create({
    model: 'gpt-5',
    input: prompt,
    tools: [{ type: 'image_generation' }],
  });

  const imageData = response.output
    .filter((output) => output.type === 'image_generation_call')
    .map((output) => output.result);

  if (imageData.length === 0) {
    throw new Error('No base image generated');
  }

  const baseImageBase64 = imageData[0] as string;

  // Save base image
  mkdirSync('image-generation/images', { recursive: true });
  writeFileSync(
    'image-generation/images/base-reference.png',
    Buffer.from(baseImageBase64, 'base64'),
  );

  console.log('✅ Base reference image saved');
  return baseImageBase64;
};

export const generateStorytellingImage = async (
  prompt: string,
  _baseImageId: string,
): Promise<string> => {
  console.log('📖 Generating 4-panel storytelling...');

  const response = await openai.responses.create({
    model: 'gpt-5',
    input: prompt,
    tools: [{ type: 'image_generation' }],
  });

  const imageData = response.output
    .filter((output) => output.type === 'image_generation_call')
    .map((output) => output.result);

  if (imageData.length === 0) {
    throw new Error('No storytelling image generated');
  }

  const storytellingImageBase64 = imageData[0] as string;
  console.log('✅ 4-panel storytelling generated');
  return storytellingImageBase64;
};

export const generateMascotImage = async (
  prompt: string,
  _baseImageId: string,
): Promise<string> => {
  console.log('🎭 Generating realistic mascot...');

  const response = await openai.responses.create({
    model: 'gpt-5',
    input: prompt,
    tools: [{ type: 'image_generation' }],
  });

  const imageData = response.output
    .filter((output) => output.type === 'image_generation_call')
    .map((output) => output.result);

  if (imageData.length === 0) {
    throw new Error('No mascot image generated');
  }

  const mascotImageBase64 = imageData[0] as string;
  console.log('✅ Realistic mascot generated');
  return mascotImageBase64;
};

// Functional implementation of interface
export const openAIImageGenerator: GenerateCharacterImages.ImageGenerator = {
  generateBaseImage,
  generateStorytellingImage,
  generateMascotImage,
};

// Runner function for direct execution //
async function runAISdkDirectly() {
  try {
    console.log('🎨 Running AISdk directly...');

    const { BusinessConcept } = await import('../entity/BusinessConcept');
    const { CharacterDesigner } = await import('../usecase/CharacterDesigner');
    const { CanvasRules } = await import('../vo/CanvasRules');

    const businessConcept = BusinessConcept.createCharacterDesign();
    const canvas = CanvasRules.defaultCanvas;

    // 1. Generate BASE image first
    const basePrompt = CharacterDesigner.buildPrompt(
      businessConcept,
      CharacterDesigner.CharacterVariation.BASE,
      canvas,
    );

    console.log('📝 Generating BASE image...');
    const baseResponse = await openai.responses.create({
      model: 'gpt-5',
      input: basePrompt.text,
      tools: [{ type: 'image_generation' }],
    });

    // Save BASE image
    const baseImageData = baseResponse.output
      .filter((output) => output.type === 'image_generation_call')
      .map((output) => output.result);

    if (baseImageData.length > 0) {
      const baseImageBase64 = baseImageData[0] as string;
      writeFileSync(
        'image-generation/images/base-reference.webp',
        Buffer.from(baseImageBase64, 'base64'),
      );
      console.log('✅ Base image saved');
    }

    // 2. Generate variation image using previous_response_id
    const storytellingPrompt = CharacterDesigner.buildPrompt(
      businessConcept,
      CharacterDesigner.CharacterVariation.STORYTELLING,
      canvas,
    );

    console.log('📖 Generating image variation...');
    const storytellingResponse = await openai.responses.create({
      model: 'gpt-5',
      previous_response_id: baseResponse.id, // ✅ Reference the base image
      input: storytellingPrompt.text,
      tools: [{ type: 'image_generation' }],
    });

    // Save variation image
    const storytellingImageData = storytellingResponse.output
      .filter((output) => output.type === 'image_generation_call')
      .map((output) => output.result);

    if (storytellingImageData.length > 0) {
      const storytellingImageBase64 = storytellingImageData[0] as string;
      writeFileSync(
        'image-generation/images/variation.webp',
        Buffer.from(storytellingImageBase64, 'base64'),
      );
      console.log('✅ Variation image saved');
    }

    return {
      baseImage: baseImageData[0],
      storytellingImage: storytellingImageData[0],
      businessConcept,
    };
  } catch (error) {
    console.error('❌ AISdk direct run failed:', error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAISdkDirectly()
    .then((result) => {
      console.log('🎉 AISdk completed successfully!');
      console.log('Business:', result.businessConcept.businessName);
      console.log('Image generated:', !!result.baseImage);
    })
    .catch((error) => {
      console.error('💥 AISdk failed:', error.message);
      process.exit(1);
    });
}
