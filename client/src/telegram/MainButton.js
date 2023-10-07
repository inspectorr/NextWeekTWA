import { useCallback, useEffect } from 'react';
import { TWA } from './api';

export function TWAMainButton({
    text,
    onClick,
}) {
    const handleOnClick = useCallback(() => {
        // todo ?
        onClick();
    }, [onClick]);

    useEffect(() => {
        TWA.MainButton.text = text;
        TWA.MainButton.onClick(handleOnClick);
        TWA.MainButton.isVisible = true;

        return () => {
            TWA.MainButton.offClick(handleOnClick);
            TWA.MainButton.isVisible = false;
        };
    }, [text, handleOnClick]);

    return null;
}
