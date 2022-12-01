declare const userProfileTransformRule: {
    item: {
        userId: string;
        username: string;
        userFullName: string;
        emailAddress: string;
        partyId: string;
        timeZone: string;
        facilities: string;
    };
    operate: {
        run: (facilities: any) => any;
        on: string;
    }[];
};
export { userProfileTransformRule };
