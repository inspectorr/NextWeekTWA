import { useEffect } from 'react';
import { useRequest } from './helpers/hooks';
import { Calendar } from './calendar/Calendar';
import { TWA } from './telegram';
import { apiUrls } from './urls';

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
            <Calendar />
        </div>
    );
}

export default App;
