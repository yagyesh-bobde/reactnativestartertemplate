import { queryOptions, useQuery } from '@tanstack/react-query';
import { getGreeting } from '../api/get-greeting';
import { exampleKeys } from '../api/keys';

export const greetingQueryOptions = () =>
  queryOptions({ queryKey: exampleKeys.greeting(), queryFn: getGreeting });

export const useGreetingQuery = () => useQuery(greetingQueryOptions());
