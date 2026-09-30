import { greetingSchema, type Greeting } from './schemas';

// Stubbed so the template runs without a backend. Replace with:
//   apiClient.get('/greeting', greetingSchema)  (from '@core/api/client')
export async function getGreeting(): Promise<Greeting> {
  return greetingSchema.parse({
    message:
      'A bare React Native starter with the boring setup already done, so you can start on the app itself.',
  });
}
