"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIdentification = getIdentification;
exports.hasError = hasError;
exports.isError = isError;

function hasError(resp) {
  return !!resp.data._ERROR_MESSAGE_ || !!resp.data._ERROR_MESSAGE_LIST_ || resp.data.error;
}

function isError(resp) {
  return resp.code === 'error';
}

function getIdentification(identifications, id) {
  var externalId = '';

  if (identifications) {
    var externalIdentification = identifications.find(function (identification) {
      return identification.startsWith(id);
    });
    var externalIdentificationSplit = externalIdentification ? externalIdentification.split('/') : [];
    externalId = externalIdentificationSplit[1] ? externalIdentificationSplit[1] : '';
  }

  return externalId;
}