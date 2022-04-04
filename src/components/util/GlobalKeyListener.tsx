import { useEffect } from "react";
import { Key } from "ts-key-enum";

export interface GlobalKeyListenerParams {
    keyDownListeners?: Partial<Record<Key, (e: KeyboardEvent) => any>>;
    keyPressListeners?: Partial<Record<Key, (e: KeyboardEvent) => any>>;
    keyUpListeners?: Partial<Record<Key, (e: KeyboardEvent) => any>>;
}

export function GlobalKeyListener(props: React.PropsWithChildren<GlobalKeyListenerParams>) {
    const keyListener = (listeners?: Partial<Record<Key, (e: KeyboardEvent) => any>>) => (event: KeyboardEvent) => {
        if (listeners) {
            for (const key in listeners) {
                if (key === event.key) {
                    const handler = listeners[key as Key]
                    if (handler != undefined) {
                        handler(event)
                    }
                }
            }
        }
    }
    
    const keyDownListener = keyListener(props.keyDownListeners)
    const keyPressListener = keyListener(props.keyPressListeners)
    const keyUpListener = keyListener(props.keyUpListeners)

    useEffect(() => {
        window.addEventListener("keydown", keyDownListener)
        window.addEventListener("keypress", keyPressListener)
        window.addEventListener("keyup", keyUpListener)

        return () => {
            window.removeEventListener("keydown", keyDownListener)
            window.removeEventListener("keypress", keyPressListener)
            window.removeEventListener("keyup", keyUpListener)
        }
    })


    return (
        <>
            {props.children}
        </>
    );
}
