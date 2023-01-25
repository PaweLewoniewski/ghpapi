export const message = {
    errorMsg: (queryText, storeText) => {
        if (queryText !== undefined) {
            const errorMsg = [{ errorText: `There is no game ${queryText} in the ${storeText} store` }];
            return errorMsg;
        } 
        else return;
    },
    systemPlatform: (storeText) => {
        if (storeText !== undefined) {
            if (storeText.includes("ps")) {
                return 'PS';
            }
            else if (storeText.includes("xbox-live")) {
                return 'Xbox';
            }
            else return 'Win';
        } else return;
    },
    platformDisplay: (storeText) => {
        if (storeText !== undefined) {
            if (storeText.includes("origin")) {
                return 'Origin';
            }
            else if (storeText.includes("steam")) {
                return 'Steam';
            }
            else if (storeText.includes("uplay")) {
                return 'Uplay';
            }
            else if (storeText.includes("epic")) {
                return 'Epic';
            }
            else if (storeText.includes("xbox-live")) {
                return 'XBox Live';
            }
            else if (storeText.includes("rockstar")) {
                return 'Rockstar Game Luncher';
            }
            else if (storeText.includes("windows")) {
                return 'Windows Store';
            }
            else return 'Other';
        } else return;
    },
    regionDisplay: (storeText) => {
        if (storeText !== undefined) {
            if (storeText.includes("europe")) {
                return 'Europe';
            }
            if (storeText.includes("global")) {
                return 'Global';
            }
            if (storeText.includes("united-states")) {
                return 'USA';
            }
            else return 'Other';
        } else return;
    },
};