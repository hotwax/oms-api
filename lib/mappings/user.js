"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userProfileTransformRule = void 0;
var userProfileTransformRule = {
  item: {
    userId: "userLoginId",
    username: "userLoginId",
    userFullName: "partyName",
    emailAddress: "email",
    partyId: "partyId",
    timeZone: "userTimeZone",
    facilities: "facilities"
  },
  operate: [{
    run: function run(facilities) {
      return facilities.map(function (facility) {
        return {
          facilityId: facility.facilityId,
          facilityName: facility.name,
          roleTypeId: facility.roleTypeId,
          roleTypeDescription: facility.roleTypeDescription
        };
      });
    },
    on: "facilities"
  }]
};
exports.userProfileTransformRule = userProfileTransformRule;