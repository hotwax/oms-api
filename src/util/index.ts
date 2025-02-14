import { telecomCode } from './telecomCode'

function hasError(response: any) {
  return typeof response.data != "object" || !!response.data._ERROR_MESSAGE_ || !!response.data._ERROR_MESSAGE_LIST_ || !!response.data.error;
}

function isError(response: any): boolean {
  return response.code === 'error'
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

function getTelecomCountryCode(code: string) {
  return telecomCode[code]
}

function jsonParse(value: any): any {
  let parsedValue;
  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    parsedValue = value;
  }
  return parsedValue;
}

export { getTelecomCountryCode, getIdentification, hasError, isError, jsonParse }
