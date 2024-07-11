"use client"

import { useCallback, useState } from "react"
import { ErrorTypes } from "../types"



export function useHandleResult<T extends object>() {
    const [error, setError] = useState<ErrorTypes | null>(null);
    const [success, setSuccess] = useState<T | null>(null);

    const handleResult = useCallback((result: ErrorTypes | T) => {
        if ('code' in result ) {
            setError(result as ErrorTypes);
            setSuccess(null);  // Clear success if error occurs
        } else {
            setSuccess(result as T);
            setError(null);  // Clear error if success occurs
        }
    }, []);

    return { error, success, handleResult };
}