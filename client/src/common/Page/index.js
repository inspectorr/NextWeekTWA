import { useEffect } from 'react';
import cn from 'classnames';

import { TWA } from 'telegram/api';
import styles from './style.module.scss';

export default function Page({
    children,
    twaHeaderSecondary = false
}) {
    useEffect(() => {
        TWA.headerColor = twaHeaderSecondary ? 'secondary_bg_color' : 'bg_color';
    }, []);

    return (
        <div
            className={ cn(styles.page, twaHeaderSecondary && styles.pageSecondary) }
        >
            { children }
        </div>
    );
}
