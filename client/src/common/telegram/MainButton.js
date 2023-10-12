import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { TWA } from './api';

export function TWAMainButtonController(props) {
    const {
        text,
        onClick,
        loading,
        disabled,
        visible = false
    } = props;

    useLayoutEffect(() => {
        if (!onClick) return;
        TWA.MainButton.onClick(onClick);
        return () => {
            TWA.MainButton.offClick(onClick);
        };
    }, [onClick]);

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
        TWA.onEvent('themeChanged', () => {
             setButtonParams();
        });
    }, []);

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
