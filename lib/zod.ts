import { email, z } from "zod"

export const signUpSchema =z.object({
  firstName:z.string().min(2,"firstName must be at least 2 characters"),
  lastName:z.string().min(2,"lastName must be at least 2 characters"),
  
  email:z.string().min(1,"email is required").email("Invalid email"),
   password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

}).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  )
  import { object, string } from "zod"
 
export const logInSchema = object({
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({error: "Password is required" })
    
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})