export const apiUrls = {
    auth: '/api/bot/auth/',
    createEvent: (secretKey) => `/api/event/${secretKey}/create/`,
    listEvents: (secretKey, fromIsoDatetime, toIsoDatetime) => {
        return `/api/event/${secretKey}/list/?from_datetime=${fromIsoDatetime}&to_datetime=${toIsoDatetime}`;
    },
};

export const appUrls = {
    calendar: (secretKey) => `/${secretKey}/`,
    week: (secretKey, date) => `/${secretKey}/week/${date}/`,
    event: (secretKey, datetime) => `/${secretKey}/event/${datetime}/`,
};
