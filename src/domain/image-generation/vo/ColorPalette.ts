import { z } from 'zod';

export const ColorPalette = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
});

export type t = Readonly<z.infer<typeof ColorPalette>>;

export const create = (value: unknown): t => {
  const result = ColorPalette.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid ColorPalette: ${result.error.message}`);
  }
  return result.data;
};

export const equals = (a: t, b: t): boolean => {
  return a.primary === b.primary && a.secondary === b.secondary && a.accent === b.accent;
};
