import axios from 'axios';
import { TWA } from '../telegram';

function getHeaders() {
    const headers = {'content-type': 'application/json'};
    const telegramAuthToken = TWA?.initData;
    if (telegramAuthToken) {
        headers['X-Telegram-Auth-Token'] = telegramAuthToken;
    }
    return headers;
}

const request = axios.create({
    baseURL: '/',
    headers: getHeaders()
});

export default request;
