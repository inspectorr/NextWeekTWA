import { useEffect, useLayoutEffect, useRef } from 'react';
import { TWA } from './api';

export function TWAMainButton({
    text,
    onClick,
    loading,
    disabled,
}) {
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

    useLayoutEffect(() => {
        TWA.MainButton.onClick(onClick);
        TWA.MainButton.isVisible = true;

        // return () => {
        //     TWA.MainButton.offClick(onClick);
        //     TWA.MainButton.isVisible = false;
        // };
    }, []);

    useLayoutEffect(() => {
        TWA.onEvent('themeChanged', () => {
             setColorSettings();
        });
    }, []);

    return null;
}
