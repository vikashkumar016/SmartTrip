import * as z from "zod";


// ===============================
// Common fields
// ===============================

const destinationSchema = z
  .string()
  .trim()
  .min(2, "Destination must contain at least 2 characters")
  .max(100, "Destination is too long");


const dateSchema = z.iso.date({
  message: "Date must be in YYYY-MM-DD format",
});


const budgetSchema = z.coerce
  .number()
  .min(0, "Budget cannot be negative");


const travelersSchema = z.coerce
  .number()
  .int("Travelers must be a whole number")
  .min(1, "At least one traveler is required");


const interestsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1)
  )
  .max(
    10,
    "You can select maximum 10 interests"
  )
  .default([]);



// ===============================
// CREATE TRIP
// ===============================

export const createTripSchema = z
  .object({
    destination: destinationSchema,

    startDate: dateSchema,

    endDate: dateSchema,

    budget: budgetSchema,

    travelers: travelersSchema,

    interests: interestsSchema,
  })

  .refine(
    (data) => {
      return (
        new Date(data.endDate) >=
        new Date(data.startDate)
      );
    },
    {
      message:
        "End date cannot be before start date",

      path: ["endDate"],
    }
  );



// ===============================
// UPDATE TRIP
// ===============================

export const updateTripSchema =
  z.object({
    destination:
      destinationSchema.optional(),

    startDate:
      dateSchema.optional(),

    endDate:
      dateSchema.optional(),

    budget:
      budgetSchema.optional(),

    travelers:
      travelersSchema.optional(),

    interests:
      z.array(
        z.string().trim().min(1)
      )
        .max(10)
        .optional(),
  });



// ===============================
// TRIP ID PARAM
// ===============================

export const tripIdParamSchema =
  z.object({
    id: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid trip ID"
      ),
  });