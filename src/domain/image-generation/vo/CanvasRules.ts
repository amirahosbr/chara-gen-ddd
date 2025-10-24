import z from 'zod';

export namespace CanvasRules {
  export const schema = z.object({
    aspect: z.literal('1:1'),
    size: z.literal('1024x1024'),
    paddingPx: z.literal(2),
    alignment: z.literal('center'),
    border: z.literal(false),
  });

  export type t = z.infer<typeof schema>;

  export const create = (value: unknown): t => {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new Error(`Invalid canvas rules: ${result.error.message}`);
    }
    return result.data;
  };

  export const defaultCanvas: t = {
    aspect: '1:1',
    size: '1024x1024',
    paddingPx: 2,
    alignment: 'center',
    border: false,
  };
}
