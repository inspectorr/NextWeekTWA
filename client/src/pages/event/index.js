import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { addHours, format, getHours } from 'date-fns';

import { FormInput } from 'common/FormInput';
import Page from 'pages/Page';
import { TWA } from 'telegram/api';
import { TWAMainButton } from 'telegram/MainButton';
import { TWABackButton } from 'telegram/BackButton';
import { useRequest } from 'helpers/hooks';
import { combineDateTime, leadingNullStr } from 'helpers/date';
import { appUrls, apiUrls } from 'urls';
import styles from './style.module.scss';


export function EventPage() {
    const { secretKey, datetime } = useParams();
    const date = format(new Date(datetime), 'yyyy-MM-dd');

    return (
        <Page>
            <div>
                New event on { new Date(date).toLocaleDateString() }
            </div>
            <EventForm datetime={ datetime } />
            <TWABackButton
                to={ appUrls.week(secretKey, date) }
            />
        </Page>
    );
}

export function EventForm({ datetime }) {
    const { secretKey } = useParams();
    const date = format(new Date(datetime), 'yyyy-MM-dd');

    const {
        request: createEvent,
        isOk
    } = useRequest({
        method: 'POST',
        url: apiUrls.createEvent(secretKey)
    });

    const formApi = useForm({});

    useEffect(() => {
        formApi.setValue('start_date', format(new Date(datetime), 'HH:mm'));
        formApi.setValue('end_date', format(addHours(new Date(datetime), 1), 'HH:mm'));
    }, [datetime]);

    const onSubmit = useCallback((data) => {
        const payload = {
            'title': data.title,
            'start_date': combineDateTime(date, data.start_date),
            'end_date': combineDateTime(date, data.end_date)
        };
        createEvent({
            data: payload
        });
    }, []);

    useEffect(() => {
        if (isOk) {
            TWA.close();
        }
    }, [isOk]);

    return (
        <FormProvider { ...formApi }>
            <form>
                <FormInput
                    name="title"
                    inputProps={ { placeholder: 'Add title...' } }
                />
                <FormInput
                    label="From"
                    name="start_date"
                    required
                    inputProps={ { type: 'time' } }
                />
                <FormInput
                    label="To"
                    name="end_date"
                    required
                    inputProps={ { type: 'time' } }
                />
            </form>
            <TWAMainButton
                text="BOOK EVENT"
                onClick={ formApi?.handleSubmit(onSubmit) }
            />
        </FormProvider>
    );
}

function HourView({
    datetime,
    minuteStep = 15
}) {
    const hour = getHours(new Date(datetime));

    const minutes = useMemo(() => {
        const result = [];
        let current = 0;
        while (current < 60) {
            result.push(current);
            current += minuteStep;
        }
        return result;
    }, []);

    return (
        <div className={ styles.hourView }>
            { minutes.map(minute => {
                const time = `${leadingNullStr(hour)}:${leadingNullStr(minute)}`;
                return (
                    <div key={ time } className={ styles.hourViewRow }>
                        <div className={ styles.hourViewRowLabel }>{ time }</div>
                        <div className={ styles.hourViewRowSlot }></div>
                    </div>
                );
            }) }
        </div>
    );
}
