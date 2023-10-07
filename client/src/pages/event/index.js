import { useCallback, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { addHours, format } from 'date-fns';

import Page from 'pages/Page';
import { TWA } from 'telegram/api';
import { TWAMainButton } from 'telegram/MainButton';
import { TWABackButton } from 'telegram/BackButton';
import { useRequest } from 'helpers/hooks';
import { combineDateTime } from 'helpers/date';
import { appUrls, apiUrls } from 'urls';


export function EventPage() {
    const {
        request: createEvent,
        isOk
    } = useRequest({ method: 'POST' });

    const { datetime } = useParams();
    const date = format(new Date(datetime), 'yyyy-MM-dd');

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
            url: apiUrls.createEvent,
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
                Creating event on { new Date(date).toLocaleDateString() }
            </div>
            <FormProvider { ...formApi }>
                <form>
                    <FormInput
                        name="title"
                        inputProps={ { placeholder: 'Add title...' } }
                    />
                    <FormInput
                        name="start_date"
                        required
                        inputProps={ { type: 'time', step: 900 } }
                    />
                    <FormInput
                        name="end_date"
                        required
                        inputProps={ { type: 'time', step: 900 } }
                    />
                </form>
            </FormProvider>
            <TWAMainButton
                text="CREATE EVENT"
                onClick={ formApi?.handleSubmit(onSubmit) }
            />
            <TWABackButton
                to={ appUrls.week(date) }
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
