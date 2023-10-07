import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useRequest } from './helpers/hooks';
import { CalendarPage } from './pages/calendar';
import { WeekPage } from './pages/week';
import { EventPage } from './pages/event';
import { apiUrls } from './urls';
import './app.css';


function App() {
    const [response, isLoading, authenticate] = useRequest({
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
                    <Route path="/event/:date/:start" element={ <EventPage /> } />
                    <Route path="/week/:date" element={ <WeekPage /> } />
                    <Route path="/" element={ <CalendarPage /> } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
