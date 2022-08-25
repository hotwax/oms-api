function hasError(resp: any) {
  return !!resp.data._ERROR_MESSAGE_ || !!resp.data._ERROR_MESSAGE_LIST_ || resp.data.error;
}

function isError(resp: any): boolean {
  return resp.code === 'error'
}

export { hasError, isError }