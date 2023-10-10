import { useEffect } from 'react';
import cn from 'classnames';

import { TWA } from 'common/telegram/api';
import styles from './style.module.scss';
import { TWAMainButtonController } from 'common/telegram/MainButton';
import { TWABackButtonController } from 'common/telegram/BackButton';
import PropTypes from 'prop-types';

export default function Page({
    children,
    twaHeaderSecondary = false,
    mainButtonProps = {},
    backButtonProps = {},
}) {
    useEffect(() => {
        TWA.headerColor = twaHeaderSecondary ? 'secondary_bg_color' : 'bg_color';
    }, []);

    return (
        <div
            className={ cn(styles.page, twaHeaderSecondary && styles.pageSecondary) }
        >
            { children }
            <TWAMainButtonController
                { ...mainButtonProps }
            />
            <TWABackButtonController
                { ...backButtonProps }
            />
        </div>
    );
}

Page.propTypes = {
    twaHeaderSecondary: PropTypes.bool,
    mainButtonProps: PropTypes.shape(TWAMainButtonController.propTypes),
    backButtonProps: PropTypes.shape(TWABackButtonController.propTypes),
};
