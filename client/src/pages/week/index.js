import { useEffect, useMemo } from 'react';
import cn from 'classnames';
import { format, startOfWeek, endOfWeek, addDays, getDate, getHours, getMinutes } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';

import Page from 'pages/Page';
import { combineDateTime, leadingNullStr } from 'helpers/date';
import { appUrls } from 'urls';
import { TWA } from 'telegram/api';
import { TWABackButton } from 'telegram/BackButton';
import { useRemoteEvents } from 'common/dataHooks';
import styles from 'pages/week/style.module.scss';


export function WeekPage() {
    const { secretKey, date } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        TWA.expand();
    }, []);

    function onHourClick(selectedDate, selectedTime) {
        navigate(appUrls.event(secretKey, combineDateTime(selectedDate, selectedTime)));
    }

    const weekStart = useMemo(() => startOfWeek(new Date(date), { weekStartsOn: 1 }), [date]);
    const weekEnd = useMemo(() => endOfWeek(new Date(date), { weekStartsOn: 1 }), [date]);

    const events = useRemoteEvents(weekStart, weekEnd);

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

    const hours = Array.from({ length: 24 }, (_, hour) => {
        const time = leadingNullStr(hour);
        const formattedTime = `${time}:00`;
        return (
            <div className={ styles.row }>
                <div className={ styles.cell }>{ formattedTime }</div>
                { weekDates?.map((date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    const hourEvents = events[formattedDate]?.[hour] ?? [];
                    return (
                        <div
                            key={ formattedDate + formattedTime }
                            className={ styles.cell }
                            onClick={ () => onHourClick(formattedDate, formattedTime) }
                        >
                            { hourEvents.map(event => {
                                const startMinute = getMinutes(new Date(event.start_date));
                                const endHour = getHours(new Date(event.end_date));
                                const hourDiff = endHour - hour;
                                const endMinute = getMinutes(new Date(event.end_date));
                                const top = Math.floor(startMinute / 60 * 100);
                                const height = hourDiff * 100 + Math.floor(+ endMinute / 60 * 100) - top;
                                return (
                                    <div
                                        className={ styles.cellEvent }
                                        style={ {
                                            top: `${top}%`,
                                            height: `${height}%`
                                        } }
                                    />
                                );
                            }) }
                        </div>
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
                to={ appUrls.calendar(secretKey) }
            />
        </Page>
    );
}
