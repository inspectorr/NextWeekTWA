import { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { addHours, format, getHours } from 'date-fns';

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

    const {
        request: createEvent,
        isOk
    } = useRequest({
        method: 'POST',
        url: apiUrls.createEvent(secretKey)
    });

    const formApi = useForm({
        defaultValues: {
            start_date: format(new Date(datetime), 'HH:mm'),
            end_date: format(addHours(new Date(datetime), 1), 'HH:mm'),
        },
    });

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
        <Page>
            <div>
                Event on { new Date(date).toLocaleDateString() }
            </div>
            <HourView
                datetime={ datetime }
            />
            <FormProvider { ...formApi }>
                <form>
                    <FormInput
                        name="title"
                        inputProps={ { placeholder: 'Add title...' } }
                    />
                    <FormInput
                        name="start_date"
                        required
                        inputProps={ { type: 'time' } }
                    />
                    <FormInput
                        name="end_date"
                        required
                        inputProps={ { type: 'time' } }
                    />
                </form>
            </FormProvider>
            <TWAMainButton
                text="BOOK EVENT"
                onClick={ formApi?.handleSubmit(onSubmit) }
            />
            <TWABackButton
                to={ appUrls.week(secretKey, date) }
            />
        </Page>
    );
}

function FormInput({
    name,
    required = false,
    inputProps = {}
}) {
    const { register } = useFormContext();
    return (
        <input
            { ...register(name, { required }) }
            { ...inputProps }
        />
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
                console.log({time})
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
