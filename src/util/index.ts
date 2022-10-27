function hasError(resp: any) {
  return !!resp.data._ERROR_MESSAGE_ || !!resp.data._ERROR_MESSAGE_LIST_ || resp.data.error;
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