import { useCallback, useEffect } from 'react';
import { TWA } from './api';

export function TWAMainButton({
    text,
    onClick,
}) {
    useEffect(() => {
        TWA.MainButton.text = text;
        TWA.MainButton.onClick(onClick);
        TWA.MainButton.isVisible = true;

        return () => {
            TWA.MainButton.offClick(onClick);
            TWA.MainButton.isVisible = false;
        };
    }, []);

    return null;
}
