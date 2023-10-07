import { useEffect, useState } from 'react';
import { axiosRequest } from './request';

export function useRequest(axiosReqObj) {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function makeRequest(axiosLocalReqObj = {}) {
        const payload = { ...axiosReqObj, ...axiosLocalReqObj };
        setIsLoading(true);
        axiosRequest(payload)
            .then((result) => {
                setResult(result.data);
            })
            .catch(console.log) // todo error handling
            .finally(() => {
                setIsLoading(false);
            });
    }

    return [result, isLoading, makeRequest, setResult]
}

export function useApi(url) {
    const [result, isLoading, makeRequest, setResult] = useRequest({ method: 'get', url });

    useEffect(() => {
        makeRequest();
    }, []);

    function reload(manual_offline_data) {
        if (manual_offline_data) {
            setResult(manual_offline_data);
            return;
        }

        return makeRequest();
    }

    return [result, isLoading, reload];
}
