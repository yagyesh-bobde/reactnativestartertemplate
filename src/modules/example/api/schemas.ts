import { z } from 'zod';

export const greetingSchema = z.object({ message: z.string() });

export type Greeting = z.infer<typeof greetingSchema>;
