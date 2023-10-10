import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TWA } from './api';

export function TWABackButtonController({
    to,
    visible = false
}) {
    const navigation = useNavigate();

    function onClick() {
        navigation(to);
    }

    useLayoutEffect(() => {
        TWA.BackButton.isVisible = visible;
        TWA.BackButton.onClick(onClick);
        return () => {
            TWA.BackButton.offClick(onClick);
        };
    }, [visible, onClick]);

    return null;
}

TWABackButtonController.propTypes = {
    to: PropTypes.string,
};
