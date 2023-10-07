export const apiUrls = {
    auth: '/api/bot/auth/',
    createEvent: '/api/event/create/',
};

export const appUrls = {
    calendar: '/',
    week: (date) => `/week/${date}`,
    event: (datetime) => `/event/${datetime}`,
};
