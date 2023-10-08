import { useEffect, useLayoutEffect } from 'react';
import { TWA } from './api';

export function TWAMainButtonController({
    text,
    onClick,
    disabled,
}) {
    useLayoutEffect(() => {
        if (disabled) {
            TWA.MainButton.disable();
            TWA.MainButton.textColor = TWA.themeParams.hint_color;
            TWA.MainButton.color = TWA.themeParams.secondary_bg_color;
        } else {
            TWA.MainButton.enable();
            TWA.MainButton.textColor = TWA.themeParams.button_text_color;
            TWA.MainButton.color = '#33CC00';
        }
    }, [disabled]);

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

    return null;
}
