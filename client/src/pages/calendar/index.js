import ReactCalendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import { appUrls } from '../../urls';
import Page from '../Page';


export function CalendarPage() {
    const navigate = useNavigate();

    function onClickDay(date) {
        const formattedDate = date.toISOString().split('T')[0];
        navigate(appUrls.week(formattedDate));
    }

    return (
        <Page>
            <ReactCalendar
                onClickDay={ onClickDay }
            />
        </Page>
    );
}
