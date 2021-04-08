# My react hooks
There is my hooks created during projects

## Animator
### Description
Permet d'utiliser Web_animation_v1 version plug and play grace à un react hook. Des potentiels mise à jour seront à prévoir.
Voir les issues : https://github.com/bawdeveloppement/my-react-hooks/issues
### Example:
```jsx
import { createRef } from 'react';
import { useAnimator } from '../../libs/Hooks/Animator'
import PropTypes from 'prop-types'

const dashKeyframes = [
    { offset: 0.0, strokeDasharray: "1, 150", strokeDashoffset: 0 },
    { offset: 0.5, strokeDasharray: "90, 150", strokeDashoffset: -35 },
    { offset: 1.0, strokeDasharray: "90, 150", strokeDashoffset: -124 },
]

const rotateKeyframes = [
    { offset: 0.0, transform: 'rotate(0deg)' },
    { offset: 1.0, transform: 'rotate(360deg)' }
]

const spinnerTiming = {
    duration: 2000,
    iterations: Infinity,
    easing: "linear"
}

const pathTiming = {
    duration: 1500,
    iterations: Infinity,
    easing: "ease-in-out"
}

export const SpinnerUsingHook = ({ className = "w-5 z-10 inline" }) => {
    const spinnerRef = createRef();
    const spinnerPathRef = createRef();
    // https://developer.mozilla.org/en-US/docs/Web/API/Animation
    const { play, pause, ...Animation.properties } = useAnimator(spinnerRef, { keyframes: rotateKeyframes, timing: spinnerTiming }) // L'animation est joué par défault
    useAnimator(spinnerPathRef, { keyframes: dashKeyframes, timing: pathTiming })

    return (
        <svg className={ className } ref={spinnerRef} viewBox="0 0 50 50">
            <circle className="path" style={{ stroke: 'rgb(13, 14, 15)', strokeLinecap: 'round' }} ref={spinnerPathRef} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
    );
}

SpinnerUsingHook.propTypes = {
    className: PropTypes.string
}
```

## UseLocalState - A hook for manipulating localStorage object. create / update / delete.
 - [x] create a key & assigning default value (ex: ```const [ name, setName, delName ] = useLocalState("name", "Baw") )```;

## UseInitToken - A hook for using access_token & refresh_token correctly.
 - [x] useLocalState to store / update / delete the access_token & refresh_token in localStorage.
 - [x] check the state of the access_token everytime it is updated & store this state in a memoryState called tokenState. TokenState { EXPIRED, MISSING, VALID }
 - [x] if the token is valid, update the token with a refresh token.

## UseTimeOut - A hook for executing an asynchronous callback. 
See [example](https://github.com/bawdeveloppement/react-usetimeout)
