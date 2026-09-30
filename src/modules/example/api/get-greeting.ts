import { greetingSchema, type Greeting } from './schemas';

// Stubbed so the template runs without a backend. Replace with:
//   apiClient.get('/greeting', greetingSchema)  (from '@core/api/client')
export async function getGreeting(): Promise<Greeting> {
  return greetingSchema.parse({ message: 'Hello from the starter template' });
}
