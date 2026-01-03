class IndexUtilities {
  static sendResponse<T>(statusCode: number, data: T, message: string) {
    return {
      statusCode,
      data,
      message,
      success: statusCode < 400,
    };
  }
}

export default IndexUtilities;
