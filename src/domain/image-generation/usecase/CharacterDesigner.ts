import type { BusinessConcept } from "@domain/image-generation/entity/BusinessConcept";
import { ImagePrompt } from "@domain/image-generation/vo/ImagePrompt";
import { CanvasRules } from "@domain/image-generation/vo/CanvasRules";

export namespace CharacterDesigner {
  // Character Variations
  export enum CharacterVariation {
    BASE = "base",
    ICON = "icon",
    STORYTELLING = "storytelling",
    MASCOT = "mascot",
    SECRET_AGENT = "secret_agent",
  }

  // Base Image Style
  const BASE_IMAGE_STYLE = `
  soft white background color. doodle style
  `;

  // Canvas layout builder
  const buildCanvasLayout = (canvas: CanvasRules.t): string => {
    return `
    CANVAS LAYOUT:
    - Square ${canvas.aspect} aspect ratio, fixed 1:1 format (like an Instagram post).
    - Character perfectly centered both vertically and horizontally.
    - Inner padding of about ${canvas.paddingPx}px visual spacing, ensuring no part of the character touches the canvas edges.
    - The background fills all remaining space evenly with a solid flat color (no frame or border).
    - The character stands clearly visible in the middle of the square, with a soft neutral drop shadow under their body.
    - Have background color by complementary color.
    `;
  };

  // Character base reference builder
  const buildCharacterBaseReference = (concept: BusinessConcept.t): string => {
    const keywords = concept.keywords.join(", ");
    return `
Character: ${concept.characterDescription}
Keywords: ${keywords}
Color Palette: ${concept.colorPalette.primary}, ${concept.colorPalette.secondary}, ${concept.colorPalette.accent}
Secret Agent Name: ${concept.secretAgentName}
`;
  };

  // Base reference template
  const buildBasePrompt = (
    concept: BusinessConcept.t,
    canvas: CanvasRules.t,
    imageStyle: ImagePrompt.t
  ): ImagePrompt.t => {
    const characterReference = buildCharacterBaseReference(concept);
    const canvasLayout = buildCanvasLayout(canvas);
    const promptText = `
${BASE_IMAGE_STYLE}

${canvasLayout}

${characterReference}

BASE REFERENCE: This is the foundational character design that will be used as reference for all variations. Create a clear, detailed character that can be consistently referenced in future generations.
`;

    return {
      text: promptText,
      style: imageStyle.style,
      size: canvas.size,
    };
  };

  // Icon template
  const buildIconPrompt = (
    concept: BusinessConcept.t,
    canvas: CanvasRules.t,
    imageStyle: ImagePrompt.t
  ): ImagePrompt.t => {
    const characterReference = buildCharacterBaseReference(concept);
    const canvasLayout = buildCanvasLayout(canvas);
    const promptText = `
${BASE_IMAGE_STYLE}

${canvasLayout}

${characterReference}

ICON DESIGN: Super kawaii style, just the head only of the same character. Clean flat color style with simplified details and bold readable outlines. Add text "${concept.businessName}" below or beside the mascot in a rounded bold font that matches its personality with sans serif font. No secret agent name.

IMPORTANT: Use a solid opaque flat background color (${concept.colorPalette.accent} or complementary color). Simple flat color only for icon design. Different facial expression from the base reference. Soft white background color.
`;

    return {
      text: promptText,
      style: imageStyle.style,
      size: canvas.size,
    };
  };

  // Storytelling template
  const buildStorytellingPrompt = (
    concept: BusinessConcept.t,
    canvas: CanvasRules.t,
    imageStyle: ImagePrompt.t
  ): ImagePrompt.t => {
    const characterReference = buildCharacterBaseReference(concept);
    const canvasLayout = buildCanvasLayout(canvas);
    const promptText = `
${BASE_IMAGE_STYLE}

${canvasLayout}

${characterReference}

STORYTELLING: Generate a 4-panel comic strip featuring the same character. Each panel should have same size pixels, have background color, showing a cohesive storyline about ${concept.businessType}. Use the same character design but in different poses/actions and dialogs. Panel 1: Character greetings customers "Hello!". Panel 2: ${concept.businessType} activity. Panel 3: Customer interaction. Panel 4: Happy ending.
`;

    return {
      text: promptText,
      style: imageStyle.style,
      size: canvas.size,
    };
  };

  // Mascot template
  const buildMascotPrompt = (
    concept: BusinessConcept.t,
    canvas: CanvasRules.t,
    imageStyle: ImagePrompt.t
  ): ImagePrompt.t => {
    const characterReference = buildCharacterBaseReference(concept);
    const canvasLayout = buildCanvasLayout(canvas);
    const promptText = `
${BASE_IMAGE_STYLE}

${canvasLayout}

${characterReference}

MASCOT: Generate a photorealistic and lively scene of a life-sized realistic character design mascot with a warm crowd of locals and tourists. Based on the same character, but make it photorealistic and life-sized. The character should feel welcoming and appropriate for ${concept.businessType}. Natural, authentic cultural interactions. No text description.
`;

    return {
      text: promptText,
      style: imageStyle.style,
      size: canvas.size,
    };
  };

  const buildSecretAgentPrompt = (
    concept: BusinessConcept.t,
    canvas: CanvasRules.t,
    imageStyle: ImagePrompt.t
  ): ImagePrompt.t => {
    const characterReference = buildCharacterBaseReference(concept);
    const canvasLayout = buildCanvasLayout(canvas);
    const promptText = `
  ${BASE_IMAGE_STYLE}
  
  ${canvasLayout}
  
  ${characterReference}
  
  SECRET AGENT: Transform the same character into a secret agent wearing a sleek black suit, black tie, white shirt, and iconic black sunglasses. The character maintains their original personality and features but now looks professional and mysterious like Men in Black agents. Full body image. Add a subtle government badge or "${concept.secretAgentName}" insignia. The character should look serious and cool while retaining their kawaii charm. Black suit should be well-fitted and professional. Soft white background color.
  `;

    return {
      text: promptText,
      style: imageStyle.style,
      size: canvas.size,
    };
  };

  // Main prompt builder
  export const buildPrompt = (
    concept: BusinessConcept.t,
    variation: CharacterVariation = CharacterVariation.BASE,
    canvas: CanvasRules.t = CanvasRules.defaultCanvas,
    imageStyle: ImagePrompt.t = ImagePrompt.create({
      text: "kawaii style character design",
      style: "kawaii",
      size: "1024x1024",
    })
  ): ImagePrompt.t => {
    switch (variation) {
      case CharacterVariation.BASE:
        return buildBasePrompt(concept, canvas, imageStyle);
      case CharacterVariation.ICON:
        return buildIconPrompt(concept, canvas, imageStyle);
      case CharacterVariation.STORYTELLING:
        return buildStorytellingPrompt(concept, canvas, imageStyle);
      case CharacterVariation.MASCOT:
        return buildMascotPrompt(concept, canvas, imageStyle);
      case CharacterVariation.SECRET_AGENT:
        return buildSecretAgentPrompt(concept, canvas, imageStyle);
      default:
        return buildBasePrompt(concept, canvas, imageStyle);
    }
  };

  // Helper methods
  export const getAllVariations = (): CharacterVariation[] => {
    return Object.values(CharacterVariation);
  };

  export const getVariationDescription = (
    variation: CharacterVariation
  ): string => {
    const descriptions = {
      [CharacterVariation.BASE]: "Base reference character design",
      [CharacterVariation.ICON]: "Head-only icon design with business name",
      [CharacterVariation.STORYTELLING]: "4-panel comic strip storytelling",
      [CharacterVariation.MASCOT]:
        "Photorealistic mascot with locals and tourists",
      [CharacterVariation.SECRET_AGENT]:
        "Secret agent in black suit and sunglasses",
    };
    return descriptions[variation];
  };
}
