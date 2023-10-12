import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTWAEvent } from 'helpers/hooks';
import { TWA } from './api';

export function TWAMainButtonController(props) {
    const {
        text,
        loading,
        disabled,
        onClick = () => {},
        visible = false
    } = props;

    useTWAEvent('mainButtonClicked', onClick);
    useTWAEvent('themeChanged', setButtonParams);

    const propsRef = useRef({});
    useLayoutEffect(() => {
        propsRef.current = props;
    });

    function setButtonParams() {
        const { visible = false, disabled, loading, text } = propsRef.current;
        const color = disabled || loading ? TWA.themeParams.secondary_bg_color : '#33CC00';
        const textColor = disabled || loading ? TWA.themeParams.hint_color : TWA.themeParams.button_text_color;
        TWA.MainButton.setParams({
            text,
            color,
            text_color: textColor,
            is_active: !disabled && !loading,
            is_visible: visible
        });
    }

    useLayoutEffect(() => {
        if (loading) {
            TWA.MainButton.showProgress();
        } else {
            TWA.MainButton.hideProgress();
        }
        setButtonParams();
    }, [visible, disabled, loading, text]);

    return null;
}

TWAMainButtonController.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
};
