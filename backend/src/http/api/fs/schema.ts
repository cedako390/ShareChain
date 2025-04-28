import {z} from "zod";

export const BaseEntry = z.object({
  id: z.number(),
  name: z.string(),
  is_folder: z.boolean(),
  parent_id: z.number(),
});

export const CreateEntrySchema = z.object({
  name: z.string(),
  full_path: z.string(),
  is_folder: z.boolean(),
  parent_id: z.number().nullable(),
})

export const CreateEntryType = typeof z.infer<typeof CreateEntrySchema>;