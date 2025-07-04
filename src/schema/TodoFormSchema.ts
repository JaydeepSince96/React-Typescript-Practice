import * as z from "zod";

export const formSchema = z
  .object({
    task: z.string().min(1, "Task is required"),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
  })
  .refine((data) => data.startDate, {
    message: "Start date is required.",
    path: ["startDate"],
  })
  .refine((data) => data.endDate, {
    message: "End date is required.",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );