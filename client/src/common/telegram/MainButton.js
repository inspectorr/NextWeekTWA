import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { TWA } from './api';

export function TWAMainButtonController({
    text,
    onClick,
    loading,
    disabled,
    visible = false
}) {
    useLayoutEffect(() => {
        TWA.MainButton.isVisible = visible;
    }, [visible]);

    useLayoutEffect(() => {
        if (!onClick) return;
        TWA.MainButton.onClick(onClick);
        return () => {
            TWA.MainButton.offClick(onClick);
        };
    }, [onClick]);

    useLayoutEffect(() => {
        if (loading) {
            TWA.MainButton.showProgress();
            TWA.MainButton.disable();
        } else {
            TWA.MainButton.hideProgress();
            TWA.MainButton.enable();
        }
    }, [loading]);

    useLayoutEffect(() => {
        TWA.MainButton.text = text;
    }, [text]);

    const disabledRef = useRef();
    useLayoutEffect(() => {
        disabledRef.current = disabled;
    }, [disabled]);

    function setColorSettings() {
        if (disabledRef.current) {
            TWA.MainButton.disable();
            TWA.MainButton.textColor = TWA.themeParams.hint_color;
            TWA.MainButton.color = TWA.themeParams.secondary_bg_color;
        } else {
            TWA.MainButton.enable();
            TWA.MainButton.textColor = TWA.themeParams.button_text_color;
            TWA.MainButton.color = '#33CC00';
        }
    }

    useLayoutEffect(() => {
        setColorSettings();
    }, [disabled]);

    useLayoutEffect(() => {
        TWA.onEvent('themeChanged', () => {
             setColorSettings();
        });
    }, []);

    return null;
}

TWAMainButtonController.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
};
