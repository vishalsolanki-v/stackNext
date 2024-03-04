import * as z from 'zod'
export const QuestionSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters.",
    }).max(130, {message: "Title cannot be more than 130 characters"}),
    explanation: z.string().min(100),
    tags:z.array(z.string().min(1).max(15)).min(1).max(4),
})

export const AnswerSchema = z.object({
  answer:z.string().min(100)
})