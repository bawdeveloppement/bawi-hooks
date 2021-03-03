import { useEffect } from "react";
import { useState } from "react";
/**
 * 
 * @param {*} itemName 
 * @returns { null | object }
 */
const getLocalItem = (itemName) => {
    if (!localStorage) return null;
    let itemValue = localStorage.getItem(itemName);
    if (itemValue) {
        return JSON.parse(itemValue || '{}').value;
    } else return null;
}

// On stock sous le format json le type et la valeur de l'item
const setLocalItem = (itemName, itemValue) => {
    if (!localStorage) return null;
    if (typeof(itemValue) === "object") {
        if (Array.isArray(itemValue)) {
            localStorage.setItem(itemName, JSON.stringify({ type: "array", value: itemValue }))
        } else {
            localStorage.setItem(itemName, JSON.stringify({ type: "object", value: itemValue }))
        }
    } else  localStorage.setItem(itemName, JSON.stringify({ type: typeof(itemValue), value: itemValue }));

    return getLocalItem(itemName);
}

const removeLocalItem = (itemName) => {
    if (!localStorage) return null;
    return localStorage.removeItem(itemName);
}
/**
 * @author Hermann
 * @param { String | null} stateName 
 * @param {*} stateValue 
 * @description Create, update, destroy a localItem of localStorage and at the same time store it in localState
 */
export const useLocalState = ( stateName, stateValue ) => {
    const [ localState, setLocalState ] = useState( getLocalItem(stateName) || setLocalItem(stateName, stateValue));

    useEffect(() => {
        const localItem = getLocalItem( stateName )
        localItem == null ? setLocalState( setLocalItem(stateName, stateValue) ) : setLocalState( localItem )
    }, [stateName, stateValue])

    return [
        /* GET */   localState,
        /* PUT */   ( newValue ) => setLocalState( setLocalItem(stateName, newValue) ),
        /* DEL */   () => setLocalState( removeLocalItem(stateName) )
    ]
}

export default useLocalState;
