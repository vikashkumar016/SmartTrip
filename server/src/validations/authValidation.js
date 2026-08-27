import * as z from "zod";


export const registerSchema =
  z.object({

    name: z
      .string()
      .trim()
      .min(
        2,
        "Name must contain at least 2 characters"
      )
      .max(50),

    email: z.email(
      "Please provide a valid email"
    ),

    password: z
      .string()
      .min(
        6,
        "Password must contain at least 6 characters"
      )
      .max(100),

  });


export const loginSchema =
  z.object({

    email: z.email(
      "Please provide a valid email"
    ),

    password: z
      .string()
      .min(
        1,
        "Password is required"
      ),

  });