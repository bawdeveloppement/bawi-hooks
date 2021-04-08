import { cloneElement, useEffect, createRef, useState } from 'react'

export const Animator = ({ keyframes, timing, children }) => {
    const childrenRef = createRef();
    const element = cloneElement(children, { props: children.props, ref: childrenRef })

    useEffect(() => {
        if (childrenRef && childrenRef.current) {
            childrenRef.current.animate(keyframes, timing);
        }
    }, [ keyframes, timing, childrenRef ])

    return element
}

// Génération des keyframes grace à la futur Web Animation IDE
// https://github.com/bawdeveloppement/web-animator
export const useAnimator = (ref, { keyframes, timing }) => {
    const [ animation, setAnimation ] = useState()

    useEffect(() => {
        if (ref && ref.current) {
            let animation = ref.current.animate(keyframes, timing )
            setAnimation(animation)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return animation
}
