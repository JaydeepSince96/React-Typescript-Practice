import * as z from "zod";

export const formSchema = z.object({
  task: z.string().min(1, "Task is required"),
});
