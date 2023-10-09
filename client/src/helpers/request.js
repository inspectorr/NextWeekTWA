import axios from 'axios';
import { TWA } from 'telegram/api';

function getHeaders() {
    const headers = {'content-type': 'application/json'};
    const telegramAuthToken = TWA?.initData;
    if (telegramAuthToken) {
        headers['X-Telegram-Auth-Token'] = telegramAuthToken;
    }
    return headers;
}

export const axiosRequest = axios.create({
    baseURL: '/',
    headers: getHeaders()
});
