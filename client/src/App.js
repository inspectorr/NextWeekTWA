import { Calendar } from './calendar/Calendar';
import { TWA } from './telegram';

function App() {
    return (
        <div className="App">
            { JSON.stringify(TWA.initData) }
            <Calendar />
        </div>
    );
}

export default App;
