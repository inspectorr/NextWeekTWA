import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { format, getHours } from 'date-fns';

import { useRequest } from 'helpers/hooks';
import { apiUrls } from 'urls';


export function useRemoteEvents(startDate, endDate) {
    const { secretKey } = useParams();

    const {
        request: listEvents,
        result
    } = useRequest({ method: 'GET' });

    useEffect(() => {
        listEvents({
            url: apiUrls.listEvents(secretKey, startDate.toISOString(), endDate.toISOString()),
        });
    }, [startDate, endDate]);

    return useMemo(() => {
        if (!result || !result.data) {
            return {};
        }

        const store = {};
        for (const event of result.data) {
            const date = new Date(event.start_date);
            const isoDate = format(date, 'yyyy-MM-dd');
            const hour = String(getHours(date));
            if (!store[isoDate]) {
                store[isoDate] = {};
            }
            if (!store[isoDate][hour]) {
                store[isoDate][hour] = [];
            }
            store[isoDate][hour].push(event);
        }
        return store;
    }, [result]);
}
