import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useRequest } from 'helpers/hooks';
import { CalendarPage } from 'pages/calendar';
import { WeekPage } from 'pages/week';
import { EventPage } from 'pages/event';
import { apiUrls, appUrls } from 'urls';
import 'app.css';


function App() {
    const {
        request: authenticate
    } = useRequest({
        url: apiUrls.auth,
        method: 'POST'
    });

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        key={1}
                        path={ appUrls.calendar(':secretKey') }
                        element={ <CalendarPage /> }
                    />
                    <Route
                        key={2}
                        path={ appUrls.week(':secretKey', ':date') }
                        element={ <WeekPage /> }
                    />
                    <Route
                        key={3}
                        path={ appUrls.event(':secretKey', ':datetime') }
                        element={ <EventPage /> }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
