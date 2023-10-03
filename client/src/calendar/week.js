import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import cn from 'classnames';

import styles from './style.module.scss';

dayjs.extend(localeData);
dayjs.extend(weekOfYear);


const weekdays = dayjs.weekdaysMin();

export function Week({
    day,
    toCalendar,
}) {
    const weekStart = dayjs(day).startOf('week');
    const week = weekdays?.map((weekDayName, i) => {
        const weekDay = weekStart.add(i, 'day');
        const date = weekDay.date();
        return (
            <div key={ weekDayName } className={ cn(styles.cell, styles.cellHeader) }>
                <div>{ weekDayName }</div>
                <div>{ date }</div>
            </div>
        );
    });

    const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i < 10 ? `0${i}` : `${i}`;
        return (
            <div className={ styles.row }>
                <div className={ styles.cell }>{ `${hour}:00` }</div>
                { weekdays?.map(() => {
                    return (
                        <div className={ styles.cell } />
                    );
                }) }
            </div>
        );
    });

    if (!day) {
        return null;
    }

    return (
        <div className={ styles.table }>
            <div className={ cn(styles.row, styles.rowHeader) }>
                <div className={ cn(styles.cell, styles.cellHeader) }>
                    <button onClick={ toCalendar }>Back</button>
                </div>
                { week }
            </div>
            <div
                className={ styles.tableBody }
            >
                { hours }
            </div>
        </div>
    );
}
