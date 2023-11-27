export interface SuccessResponse<T = any> {
  data: T;
  message: string;
  statusCode: number;
  success: boolean;
}
