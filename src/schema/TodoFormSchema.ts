import * as z from "zod";
import { TaskLabel } from "@/api/types";

export const formSchema = z
  .object({
    task: z.string().min(1, "Task is required"),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    priority: z.nativeEnum(TaskLabel),
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
        // Compare only the date part (ignore time) to allow same day dates
        const startDateOnly = new Date(data.startDate.getFullYear(), data.startDate.getMonth(), data.startDate.getDate());
        const endDateOnly = new Date(data.endDate.getFullYear(), data.endDate.getMonth(), data.endDate.getDate());
        return endDateOnly >= startDateOnly;
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );