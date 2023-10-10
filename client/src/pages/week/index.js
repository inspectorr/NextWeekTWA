import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { format, startOfWeek, endOfWeek, addDays, getDate, getHours, getMinutes, addHours } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import cn from 'classnames';

import Page from 'common/Page';
import { combineDateTime, leadingNullStr } from 'helpers/date';
import { appUrls } from 'urls';
import { TWA } from 'telegram/api';
import { useRemoteEvents } from 'common/dataHooks';
import { ShareIconSVG } from 'common/ShareIcon';
import { useStateWithRef } from 'helpers/hooks';
import styles from 'pages/week/style.module.scss';
import { TWAMainButtonController } from 'telegram/MainButton';


export function WeekPage() {
    let { secretKey, date } = useParams();
    date = date === 'current' ? format(new Date(), 'yyyy-MM-dd') : date;

    const navigate = useNavigate();

    useLayoutEffect(() => {
        TWA.expand();
    }, []);

    const [selectedDatetime, setSelectedDatetime, selectedDatetimeRef] = useStateWithRef();

    const [selectedIsoDate, selectedHour] = useMemo(() => {
        if (!selectedDatetime) {
            return [];
        }
        return [format(new Date(selectedDatetime), 'yyyy-MM-dd'), getHours(new Date(selectedDatetime))];
    }, [selectedDatetime]);


    function onHourClick(date, time) {
        setSelectedDatetime(combineDateTime(date, time));
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
                <div className={ cn(styles.cell, styles.cellStarter) }>{ formattedTime }</div>
                { weekDates?.map((date) => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    const hourEvents = events[formattedDate]?.[hour] ?? [];
                    return (
                        <div
                            key={ formattedDate + formattedTime }
                            className={ styles.cell }
                            onMouseDown={ () => onHourClick(formattedDate, formattedTime) }
                        >
                            { hourEvents.map(event => {
                                return (
                                    <HourEvent
                                        hour={ hour }
                                        startDate={ new Date(event.start_date) }
                                        endDate={ new Date(event.end_date) }
                                    />
                                );
                            }) }
                            { selectedIsoDate === formattedDate && hour === selectedHour && (
                                <HourEvent
                                    hour={ hour }
                                    startDate={ new Date(selectedDatetime) }
                                    endDate={ addHours(new Date(selectedDatetime), 1) }
                                    isSelected
                                />
                            ) }
                        </div>
                    );
                }) }
            </div>
        );
    });

    function toEventBooking() {
        navigate(appUrls.event(secretKey, selectedDatetimeRef.current));
    }

    const tableBodyRef = useRef();

    useEffect(() => {
        const el = tableBodyRef.current;
        if (!el) return;
        const firstRow = el.querySelector(`.${styles.row}`);
        if (!firstRow) return;
        el.scrollTo({ top: firstRow.offsetHeight * 9, behavior: 'smooth' })
    }, []);

    if (!date) {
        return null;
    }

    return (
        <Page>
            <div className={ styles.table }>
                <div className={ cn(styles.row, styles.rowHeader) }>
                    <div className={ cn(styles.cell, styles.cellHeader) }>
                        <ShareWeek
                            date={ date }
                            secretKey={ secretKey }
                        />
                    </div>
                    { week }
                </div>
                <div
                    className={ cn(styles.tableBody) }
                    ref={ tableBodyRef }
                >
                    { hours }
                </div>
            </div>
            <TWAMainButtonController
                text={ !selectedDatetime ? 'SELECT TIME' : 'CONTINUE'  }
                disabled={ !selectedDatetime }
                onClick={ toEventBooking }
            />
        </Page>
    );
}


function HourEvent({
    hour,
    startDate,
    endDate,
    isSelected
}) {
    const startMinute = getMinutes(startDate);
    const endHour = getHours(endDate) || 24;
    const endMinute = getMinutes(endDate);
    const hourDiff = endHour - hour;
    const top = Math.floor(startMinute / 60 * 100);
    const height = hourDiff * 100 + Math.floor(+ endMinute / 60 * 100) - top;
    return (
        <div
            className={ cn(styles.cellEvent, isSelected && styles.cellEventSelected) }
            style={ {
                top: `${top}%`,
                height: `${height}%`
            } }
        >
        </div>
    );
}

function ShareWeek({
    secretKey,
    date
}) {
    const formattedDate = format(new Date(date), 'yyyyMMdd');
    const bot = localStorage.getItem('TELEGRAM_BOT_USERNAME');
    const app = localStorage.getItem('TELEGRAM_WEB_APP_NAME');
    const link = `https://t.me/${bot}/${app}?startapp=${secretKey}-${formattedDate}`;

    function handleClick() {
        window.navigator.share({
            title: 'Book me on Next Week!',
            text: 'Link to a Telegram web app.',
            url: link
        }).then(() => {
            TWA.close();
        }).catch(() => {
            console.info('Sharing aborted');
        });
    }

    return (
        <div
            onClick={ handleClick }
            style={ {
                transform: 'scale(1.5)',
            } }
        >
            <ShareIconSVG
                fillColor={ TWA.themeParams.link_color }
            />
        </div>
    );
}
