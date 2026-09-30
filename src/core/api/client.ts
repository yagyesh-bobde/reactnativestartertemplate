import type { ZodType } from 'zod';
import { env } from '@core/env';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    throw new ApiError(`Request failed: ${path}`, response.status);
  }

  return schema.parse(await response.json());
}

export const apiClient = {
  get: <T>(path: string, schema: ZodType<T>) => request(path, schema),
  post: <T>(path: string, schema: ZodType<T>, body: unknown) =>
    request(path, schema, { method: 'POST', body: JSON.stringify(body) }),
};
