import { useEffect, useState } from "react";


/**
 * A custom hook that returns a boolean value indicating whether the component is ready or not
 * @returns boolean value indicating whether the component is ready or not
 */
export default function useReady() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true)
    }, [])

    return ready
}