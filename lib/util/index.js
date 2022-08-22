"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasError = hasError;
exports.isError = isError;

function hasError(resp) {
  return !!resp.data._ERROR_MESSAGE_ || !!resp.data._ERROR_MESSAGE_LIST_ || resp.data.error;
}

function isError(resp) {
  return resp.code === 'error';
}