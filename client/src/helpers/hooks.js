import { useState } from 'react';
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
        _setResult,
    }
}
