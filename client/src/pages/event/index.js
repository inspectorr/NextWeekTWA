import { useCallback, useEffect } from 'react';
import { FormProvider, useFormContext, useForm, Form } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { addHours, format } from 'date-fns';

import Page from 'common/Page';
import { TWA } from 'common/telegram/api';
import { useRequest } from 'helpers/hooks';
import { combineDateTime } from 'helpers/date';
import { appUrls, apiUrls } from 'urls';
import styles from './style.module.scss';


export function EventPage() {
    const { secretKey, datetime } = useParams();
    const date = format(new Date(datetime), 'yyyy-MM-dd');

    const {
        request: createEvent,
        isLoading,
        isOk
    } = useRequest({
        method: 'POST',
        url: apiUrls.createEvent(secretKey)
    });

    const formApi = useForm();

    const defaultStartTime = format(new Date(datetime), 'HH:mm');
    const defaultEndTime = format(addHours(new Date(datetime), 1), 'HH:mm');

    const onSubmit = useCallback((data) => {
        const payload = {
            'title': data.title,
            'start_date': combineDateTime(date, defaultStartTime),
            'end_date': combineDateTime(date, defaultEndTime)
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
        <Page
            twaHeaderSecondary
            mainButtonProps={ {
                visible: true,
                text: 'CONFIRM',
                onClick: formApi?.handleSubmit(onSubmit),
                loading: isLoading
            } }
            backButtonProps={ {
                visible: true,
                to: appUrls.week(secretKey, date)
            } }
        >
            <div className={ styles.event }>
                <div className={ styles.header }>
                    🗓 NEW EVENT { new Date(date).toLocaleDateString() }
                </div>
                <div>
                    { defaultStartTime } - { defaultEndTime }
                </div>
            </div>
            <div className={ styles.field }>
                <FormProvider { ...formApi }>
                    <Form>
                        <FormInput
                            name="title"
                            inputProps={ {
                                placeholder: 'Add title...',
                                autoFocus: true
                            } }
                        />
                    </Form>
                </FormProvider>
            </div>
        </Page>
    );
}

export function FormInput({
    name,
    required = false,
    inputProps = {}
}) {
    const { register } = useFormContext();
    return (
        <div className={ styles.formInput }>
            <input
                { ...register(name, { required }) }
                { ...inputProps }
            />
        </div>
    );
}
