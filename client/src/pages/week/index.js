import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
// import isoWeek from 'dayjs/plugin/isoWeek';
import cn from 'classnames';

import { apiUrls, appUrls } from '../../urls';
import styles from '../style.module.scss';
import { NavigationButton } from '../../common/NavigationButton';

dayjs.extend(localeData);
dayjs.extend(weekOfYear);
// dayjs.extend(isoWeek);


const weekdays = dayjs.weekdaysMin();

export function WeekPage() {
    const { date } = useParams();
    const navigate = useNavigate();

    function onHourClick(startTime) {
        navigate(appUrls.event(date, startTime));
    }

    const weekStart = dayjs(date).startOf('week');
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
        const time = i < 10 ? `0${i}` : `${i}`;
        return (
            <div className={ styles.row }>
                <div className={ styles.cell }>{ `${time}:00` }</div>
                { weekdays?.map(() => {
                    return (
                        <div
                            className={ styles.cell }
                            onClick={ () => onHourClick(time) }
                        />
                    );
                }) }
            </div>
        );
    });

    if (!date) {
        return null;
    }

    return (
        <div className={ styles.table }>
            <div className={ cn(styles.row, styles.rowHeader) }>
                <div className={ cn(styles.cell, styles.cellHeader) }>
                    <NavigationButton
                        title="Back"
                        to={ appUrls.calendar }
                    />
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
