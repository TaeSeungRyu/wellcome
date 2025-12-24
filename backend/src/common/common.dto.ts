export class ResponseDto {
  result?: {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    data?: any;
  };
  error?: string;
  message?: string;
  status?: number;
  constructor(
    result?: {
      success: boolean;
      accessToken?: string;
      refreshToken?: string;
      data?: any;
    },
    error?: string,
    message?: string,
    status?: number,
  ) {
    if (result) this.result = result;
    if (error) this.error = error;
    if (message) this.message = message;
    if (status) this.status = status;
  }
}
