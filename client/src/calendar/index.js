import { useState } from 'react';
import ReactCalendar from 'react-calendar';
import { Week } from './week';
import cn from 'classnames';
import styles from './style.module.scss';

export function Calendar() {
    const [day, setDay] = useState(null);

    function onClickDay(date) {
        setDay(date);
    }

    return (
        <div>
            <View isCurrent={ !day }>
                <ReactCalendar
                    onClickDay={ onClickDay }
                />
            </View>
            <View isCurrent={ day }>
                <Week
                    day={ day }
                    toCalendar={ () => { setDay(null); } }
                />
            </View>
        </div>
    );
}

function View({ isCurrent, children }) {
    return (
        <div className={ cn(styles.view, isCurrent && styles.viewCurrent) } >
            { children }
        </div>
    );
}
