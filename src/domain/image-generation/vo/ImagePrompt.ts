import { z } from 'zod';

export namespace ImagePrompt {
  export const schema = z.object({
    text: z.string().min(1),
    style: z.enum(['kawaii', 'photorealistic']),
    size: z.string(),
  });

  export type t = z.infer<typeof schema>;

  export const create = (value: unknown): t => {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new Error(`Invalid image prompt: ${result.error.message}`);
    }
    return result.data;
  };
}
