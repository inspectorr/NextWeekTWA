import { useEffect } from 'react';
import { useRequest } from './helpers/hooks';
import { Calendar } from './calendar';
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
            <Calendar />
        </div>
    );
}

export default App;
