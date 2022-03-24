import { useEffect, useState } from "react";

export function useClientOnly(): boolean {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);
    return isClient;
}
