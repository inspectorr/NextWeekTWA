import { useEffect, useLayoutEffect, useRef } from 'react';
import { format, startOfWeek, endOfWeek, addDays, getDate, getHours, getMinutes, addHours } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import cn from 'classnames';

import Page from 'common/Page';
import { combineDateTime, leadingNullStr } from 'helpers/date';
import { appUrls } from 'urls';
import { TWA } from 'common/telegram/api';
import { useRemoteEvents } from 'common/dataHooks';
import { ShareIconSVG } from 'common/ShareIcon';
import { useClassNameAnimation, useStateWithRef, useTimerBool, useTWAEvent } from 'helpers/hooks';
import styles from 'pages/week/style.module.scss';


export function WeekPage() {
    let { secretKey, date } = useParams();
    date = date === 'current' ? format(new Date(), 'yyyy-MM-dd') : date;

    const navigate = useNavigate();

    const [selectedDatetime, setSelectedDatetime, selectedDatetimeRef] = useStateWithRef();

    const [selectedIsoDate, selectedHour] = selectedDatetime ? [
        format(new Date(selectedDatetime), 'yyyy-MM-dd'), getHours(new Date(selectedDatetime))
    ] : [];

    function handleHourSelection(date, time) {
        setSelectedDatetime(combineDateTime(date, time));
    }

    const weekStart = startOfWeek(new Date(date), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(date), { weekStartsOn: 1 });

    const [events, isLoading] = useRemoteEvents(weekStart.toISOString(), weekEnd.toISOString());

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

                    function handleCellClick() {
                        if (hourEvents.length > 0) {
                            tableBodyShakingAnimation();
                            return;
                        }
                        handleHourSelection(formattedDate, formattedTime);
                    }

                    return (
                        <div
                            key={ formattedDate + formattedTime }
                            className={ styles.cell }
                            onClick={ handleCellClick }
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
    const [fadedIn, setFadeInTimer] = useTimerBool(600);
    const tableBodyShakingAnimation = useClassNameAnimation(tableBodyRef.current, styles.tableBodyShaking, 300);

    useLayoutEffect(() => {
        TWA.expand();
    }, []);

    useEffect(() => {
        setFadeInTimer();
        scrollToDayStart();
    }, []);

    useTWAEvent('viewportChanged', scrollToDayStart);

    function scrollToDayStart() {
        const SCROLL_TO_HOUR = 9;
        const el = tableBodyRef.current;
        if (!el) return;
        const firstRow = el.querySelector(`.${styles.row}`);
        if (!firstRow) return;
        el.scrollTo({ top: firstRow.offsetHeight * SCROLL_TO_HOUR, behavior: 'smooth' });
    }

    if (!date) {
        return null;
    }

    return (
        <Page
            mainButtonProps={ {
                visible: true,
                text: !selectedDatetime ? 'SELECT TIME' : 'CONTINUE',
                disabled: !selectedDatetime,
                loading: isLoading,
                onClick: toEventBooking,
            } }
        >
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
                    className={ cn(styles.tableBody, !fadedIn && styles.tableBodyFadeIn) }
                    ref={ tableBodyRef }
                >
                    { hours }
                </div>
            </div>
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

    const ref = useRef();
    const [fadedIn, setFadeInTimer] = useTimerBool(300);
    const busyAnimation = useClassNameAnimation(ref.current, styles.cellEventBusy, 500);
    useEffect(() => {
        setFadeInTimer();
    }, []);

    function handleClick() {
        busyAnimation();
    }

    return (
        <div
            className={ cn(styles.cellEvent, isSelected && styles.cellEventSelected, !fadedIn && styles.cellEventFadeIn) }
            style={ {
                top: `${top}%`,
                height: `${height}%`
            } }
            ref={ ref }
            onClick={ handleClick }
        />
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
