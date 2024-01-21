import z from "zod";

export type PeopleEntry = z.infer<typeof PeopleSchema>;
export const PeopleSchema = z.object({
  id: z.string().length(21),
  name: z.string(),
  age: z.number().int(),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
});
