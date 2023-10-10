import { useEffect, useRef, useState } from 'react';
import { axiosRequest } from './request';

export function useRequest(axiosReqObj) {
    const [result, _setResult] = useState(null);
    const [error, _setError] = useState(null);
    const [isLoading, _setIsLoading] = useState(false);
    const [isOk, _setIsOk] = useState(null);

    function request(axiosLocalReqObj = {}) {
        const payload = { ...axiosReqObj, ...axiosLocalReqObj };
        _setIsLoading(true);
        _setResult(null);
        _setError(null);
        _setIsOk(null);
        axiosRequest(payload)
            .then((result) => {
                if (result.status >= 200 && result.status < 300) {
                    _setResult(result);
                    _setIsOk(true);
                } else {
                    throw result;
                }
            })
            .catch((error) => {
                console.error(error);
                _setError(error);
                _setIsOk(false);
            })
            .finally(() => {
                _setIsLoading(false);
            });
    }

    return {
        isOk,
        result,
        error,
        isLoading,
        request,
        _setResult
    }
}

export function useStateWithRef(defaultState) {
    const [state, setState] = useState(defaultState);
    const ref = useRef(defaultState);
    useEffect(() => {
        ref.current = state;
    }, [state]);
    return [state, setState, ref];
}

export function useClassNameAnimation(element, className, time) {
    const timerRef = useRef(-1);

    function animate() {
        if (!element) return;
        element.classList.add(className);
        timerRef.current = setTimeout(() => {
            element.classList.remove(className);
        }, time);
    }

    return animate;
}

export function useTimerBool(time) {
    const [bool, setBool] = useState(false);

    function setTimer() {
        setTimeout(() => {
            setBool(true);
        }, time);
    }

    return [bool, setTimer];
}
