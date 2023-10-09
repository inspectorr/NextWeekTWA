import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useRequest } from 'helpers/hooks';
import { WeekPage } from 'pages/week';
import { EventPage } from 'pages/event';
import { apiUrls, appUrls } from 'urls';
import 'app.css';


function App() {
    const {
        request: authenticate,
        result
    } = useRequest({
        url: apiUrls.auth,
        method: 'POST'
    });

    useEffect(() => {
        authenticate();
    }, []);

    useEffect(() => {
        if (!result?.data?.config) return;
        localStorage.setItem('TELEGRAM_BOT_USERNAME', result.data.config.TELEGRAM_BOT_USERNAME);
        localStorage.setItem('TELEGRAM_WEB_APP_NAME', result.data.config.TELEGRAM_WEB_APP_NAME);
    }, [result]);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route
                        path={ appUrls.week(':secretKey', ':date') }
                        element={ <WeekPage /> }
                    />
                    <Route
                        path={ appUrls.event(':secretKey', ':datetime') }
                        element={ <EventPage /> }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
