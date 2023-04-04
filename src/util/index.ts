function hasError(resp: any) {
  return typeof response.data != "object" || !!response.data._ERROR_MESSAGE_ || !!response.data._ERROR_MESSAGE_LIST_ || !!response.data.error;
}

function isError(resp: any): boolean {
  return resp.code === 'error'
}

function getIdentification(identifications: any, id: string): string {
  let externalId = ''
  if (identifications) {
    const externalIdentification = identifications.find((identification: any) => identification.startsWith(id))
    const externalIdentificationSplit = externalIdentification ? externalIdentification.split('/') : [];
    externalId = externalIdentificationSplit[1] ? externalIdentificationSplit[1] : '';
  }
  return externalId;
}

export { getIdentification, hasError, isError }
