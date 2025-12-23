export class ResponseDto {
  result?: {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    data?: any;
  };
  error?: string;
  message?: string;
  constructor();
  constructor(
    result: {
      success: boolean;
      accessToken: string;
      refreshToken: string;
      data?: any;
    },
    error: string,
    message: string,
  );
  constructor(
    result?: {
      success: boolean;
      accessToken?: string;
      refreshToken?: string;
      data?: any;
    },
    error?: string,
    message?: string,
  );
  constructor(
    result?: {
      success: boolean;
      accessToken?: string;
      refreshToken?: string;
      data?: any;
    },
    error?: string,
    message?: string,
  ) {
    if (result) this.result = result;
    if (error) this.error = error;
    if (message) this.message = message;
  }
}
