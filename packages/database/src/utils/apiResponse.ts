export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export function createApiResponse<T>(
  statusCode: number,
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success: statusCode >= 200 && statusCode < 300,
    statusCode,
    message,
    data,
  };
}
