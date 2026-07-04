export type ApiResponse<T> =
  | { success: true; data: T | null }
  | { success: false; error: string };

export function ok<T>(data: T | null = null): ApiResponse<T> {
  return { success: true, data };
}

export function fail(error: string): ApiResponse<never> {
  return { success: false, error };
}
