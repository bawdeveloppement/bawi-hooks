import { useCallback, useEffect, useState } from "react";

export default function useDoubleClick (ref, callback, msDetector = 300 ) {
    const [ clickTimes, setClickTimes ] = useState([]);
    const [ sinceLastClick, setSinceLastClick ] = useState(0);

    useEffect(() => {
        if (clickTimes.length > 1) setSinceLastClick(clickTimes[ clickTimes.length - 1] - clickTimes[clickTimes.length - 2])
    }, [clickTimes])

    const handleClick = useCallback((e) => {
        setClickTimes([ ...clickTimes, Date.now() ])
    }, [ clickTimes ]);

    useEffect(() => {
        if (sinceLastClick !== 0 && sinceLastClick < msDetector) {
            callback();
            setSinceLastClick(0)
            setClickTimes([])
        }
    }, [ sinceLastClick, callback, msDetector ])

    useEffect(() => {
        const currentRef = ref.current;
        currentRef.addEventListener('click', handleClick);
        return () => {
            currentRef.removeEventListener('click', handleClick);
        };
    });
}
