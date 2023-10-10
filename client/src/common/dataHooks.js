import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { format, getHours } from 'date-fns';

import { useRequest } from 'helpers/hooks';
import { apiUrls } from 'urls';


export function useRemoteEvents(startDateIsoString, endDateIsoString) {
    const { secretKey } = useParams();

    const {
        request: listEvents,
        result,
        isLoading
    } = useRequest({ method: 'GET' });

    useEffect(() => {
        listEvents({
            url: apiUrls.listEvents(secretKey, startDateIsoString, endDateIsoString),
        });
    }, [startDateIsoString, endDateIsoString]);

    return [formatEvents(result?.data ?? {}), isLoading]
}

function formatEvents(data) {
    if (!data) {
        return {};
    }
    const events = {};
    for (const event of data) {
        const date = new Date(event.start_date);
        const isoDate = format(date, 'yyyy-MM-dd');
        const hour = String(getHours(date));
        if (!events[isoDate]) {
            events[isoDate] = {};
        }
        if (!events[isoDate][hour]) {
            events[isoDate][hour] = [];
        }
        events[isoDate][hour].push(event);
    }
    return events;
}
