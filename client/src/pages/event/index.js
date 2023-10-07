import { useCallback } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { TWAMainButton } from 'telegram/MainButton';
import { NavigationButton } from 'common/NavigationButton';
import { useRequest } from 'helpers/hooks';
import Page from 'pages/Page';
import { appUrls, apiUrls } from 'urls';
import { combineDateTime } from '../../helpers/date';

export function EventPage() {
    const [res, isLoading, createEvent] = useRequest({ method: 'POST' });

    const { date } = useParams();

    const formApi = useForm();

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

    return (
        <Page>
            <NavigationButton
                title="Back"
                to={ appUrls.calendar }
            />
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
                text="CREATE EVENT"
                onClick={ formApi?.handleSubmit(onSubmit) }
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
