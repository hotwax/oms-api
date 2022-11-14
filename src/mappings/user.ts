const userProfileTransformRule = {
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
    run: function(facilities: any) {
      return facilities.map((facility: any) => ({
        facilityId: facility.facilityId,
        facilityName: facility.name,
        roleTypeId: facility.roleTypeId,
        roleTypeDescription: facility.roleTypeDescription
      }))
    },
    on: "facilities"
  }]
}

export { userProfileTransformRule }
