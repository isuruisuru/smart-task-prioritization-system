import React, { useEffect } from 'react'

interface useDetectOutsideProps{
    ref: React.RefObject<HTMLElement | null>
    callback: () => void
}

function useDetectOutside({ref, callback}: useDetectOutsideProps) {
    useEffect(() => {
        // handler to detect clicks outside of the ref
        const handleClickOutside = (event: any) => {
            if(ref.current && !ref.current.contains(event.target)){
                callback();
            }
        }

        // add event listener
        document.addEventListener("mousedown", handleClickOutside);

        // cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    },[ref, callback]);
  return ref
}

export default useDetectOutside