export interface User {
  userId: string;
  username: string;
  userFullName: string;
  locale?: string;
  timeZone?: string;
  externalUserId?: string;
  emailAddress?: string;
  partyId?: string;
  facilities?: Array<{
    facilityId?: string;
    facilityName?: string;
    roleTypeId?: string;
    roleTypeDescription?: string;
  }>
}