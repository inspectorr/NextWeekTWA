import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import Page from 'pages/Page';
import { appUrls } from 'urls';


export function CalendarPage() {
    const navigate = useNavigate();

    function onClickDay(date) {
        navigate(appUrls.week(format(date, 'yyyy-MM-dd')));
    }

    return (
        <Page>
            <ReactCalendar
                onClickDay={ onClickDay }
                calendarType="iso8601"
            />
        </Page>
    );
}
