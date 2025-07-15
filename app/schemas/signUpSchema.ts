import {z} from 'zod'
import { email } from 'zod/v4'

export const usernameValidation = z
    .string()
    .min(2, "Username must atleast 3 charater")
    .max(25, "Username must be no more longer than 25")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special charater")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 charater"}),
})





























