import { z } from "zod";
import { ColorPalette } from "@domain/image-generation/vo/ColorPalette";

export namespace BusinessConcept {
  export const schema = z.object({
    businessName: z.string(),
    businessType: z.string(),
    characterDescription: z.string(),
    keywords: z.array(z.string()),
    secretAgentName: z.string(),
    colorPalette: ColorPalette,
  });

  export type t = Readonly<z.infer<typeof schema>>;

  export const create = (value: unknown): t => {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new Error(`Invalid business concept: ${result.error.message}`);
    }
    return result.data;
  };

  export const createCharacterDesign = (): t =>
    create({
      businessName: "Stealth Slurp",
      businessType: "Midnight Ramen Stand",
      characterDescription:
        "red-panda ninja in charcoal hakama, stealthily ladling ramen with a shuriken-shaped ladle, tail balancing a tray of steaming bowls",
      keywords: [
        "red-panda ninja",
        "shuriken ladle",
        "charcoal hakama",
        "stealth tail",
        "ramen bowls",
        "steam swirls",
        "disgusted",
        "annoyed",
        "chibi heroic mascot in dynamic pose",
        "thick outline",
        "bright cel-shaded colors",
        "vibrant saturated palette",
        "high contrast highlights",
        "sparkling metallic or holographic gradient background",
        "soft top-left lighting",
        "consistent brightness",
        "flat kawaii vector finish",
        "no realism",
      ],
      secretAgentName: "Agent Shadow-Tail",
      colorPalette: {
        primary: "charcoal",
        secondary: "crimson",
        accent: "bamboo-green",
      },
    });
}
