class CommonResponse {
  async RESPONSE(
    status: number = 0,
    response: any = {},
    count: number = 0,
    message: string = ""
  ) {
    return {
      status: status,
      response: response,
      count: count,
      message: message,
    };
  }
}
export default CommonResponse;
