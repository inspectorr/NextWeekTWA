import { useEffect } from 'react';
import cn from 'classnames';
import { format, startOfWeek, addDays, getDate } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';

import Page from 'pages/Page';
import { combineDateTime } from 'helpers/date';
import { appUrls } from 'urls';
import { TWA } from 'telegram/api';
import { TWABackButton } from 'telegram/BackButton';
import styles from 'pages/week/style.module.scss';


export function WeekPage() {
    const { date } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        TWA.expand();
    }, []);

    function onHourClick(selectedDate, selectedTime) {
        navigate(appUrls.event(combineDateTime(selectedDate, selectedTime)));
    }

    const weekStart = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const week = weekDates?.map((weekDate) => {
        const weekDayName = format(weekDate, 'EEEEE');
        const dateOfMonth = getDate(weekDate);
        return (
            <div key={ weekDayName } className={ cn(styles.cell, styles.cellHeader) }>
                <div>{ weekDayName }</div>
                <div>{ dateOfMonth }</div>
            </div>
        );
    });

    const hours = Array.from({ length: 24 }, (_, i) => {
        const time = i < 10 ? `0${i}` : `${i}`;
        const formattedTime = `${time}:00`
        return (
            <div className={ styles.row }>
                <div className={ styles.cell }>{ `${time}:00` }</div>
                { weekDates?.map((date) => {
                    return (
                        <div
                            className={ styles.cell }
                            onClick={ () => onHourClick(format(date, 'yyyy-MM-dd'), formattedTime) }
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
        <Page>
            <div className={ styles.table }>
                <div className={ cn(styles.row, styles.rowHeader) }>
                    <div className={ cn(styles.cell, styles.cellHeader) }>
                        *
                    </div>
                    { week }
                </div>
                <div
                    className={ styles.tableBody }
                >
                    { hours }
                </div>
            </div>
            <TWABackButton
                to={ appUrls.calendar }
            />
        </Page>
    );
}
