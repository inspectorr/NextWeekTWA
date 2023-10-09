import { useEffect } from 'react';
import { TWA } from './api';
import { useNavigate } from 'react-router-dom';

export function TWABackButton({
    to,
}) {
    const navigation = useNavigate();

    function onClick() {
        navigation(to);
    }

    useEffect(() => {
        TWA.BackButton.onClick(onClick);
        TWA.BackButton.isVisible = true;

        return () => {
            TWA.BackButton.offClick(onClick);
            TWA.BackButton.isVisible = false;
        };
    }, []);

    return null;
}
