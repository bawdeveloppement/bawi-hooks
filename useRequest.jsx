import { useEffect, useState } from "react";
import { axiosClient } from "../../modules/App";
import { CancelToken } from 'axios'
/**
 * 
 * @param { object } requestSchema
 * @param { boolean } requestOnMount 
 * @returns { Array<object, Function> } [ requestLoading, requestData, requestError ]
 */
export const useRequest = (fn) => {
    const [ res, setRes ] = useState({
        data: null,
        complete: false,
        pending: false,
        error: null,
    });
    const [ req, setReq ] = useState();

    useEffect(() => {
        const source = CancelToken.source();
        if (req) {
            setRes({
                data: null,
                pending: true,
                error: null,
                complete: false
            });
            axiosClient(Object.assign({}, req, { cancelToken: source.token }))
                .then(res => 
                    setRes({
                        data: res.data,
                        pending: false,
                        complete: true,
                        error: null
                    })
                )
                .catch(err =>
                    setRes({
                        data: null,
                        pending: false,
                        complete: true,
                        error: err
                    })
                )
        }
        return () => source.cancel('Operation canceled by the browser.')
    }, [req]);

    return [ res, (...args) => setReq(fn(...args)) ];
};
