import { z } from "zod";

// Shared by the Media Library and the Route Handler (the API repeats the limit).
export const MAX_ALT_TEXT = 200;

export const UpdateMediaSchema = z.object({
  altText: z
    .string()
    .max(MAX_ALT_TEXT, `Use at most ${MAX_ALT_TEXT} characters`)
    .refine((value) => !/[\u0000-\u001f]/.test(value), {
      message: "Use plain text only",
    }),
});
