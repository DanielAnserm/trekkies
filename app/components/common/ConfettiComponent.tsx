import type {
    GlobalOptions as ConfettiGlobalOptions,
    CreateTypes as ConfettiInstance,
    Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";
import { createContext, useCallback, useEffect, useImperativeHandle, useMemo, useRef, type Ref } from "react";

type Api = {
    fire: (options?: ConfettiOptions) => void;
};

type Props = React.ComponentPropsWithRef<"canvas"> & {
    options?: ConfettiOptions;
    globalOptions?: ConfettiGlobalOptions;
    manualstart?: boolean;
    children?: React.ReactNode;
    ref?: Ref<ConfettiRef>
};

export type ConfettiRef = Api | null;

const ConfettiContext = createContext<Api>({} as Api);

export const ConfettiComponent = (
    { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, children, ref, ...rest }: Props
) => {
    const instanceRef = useRef<ConfettiInstance | null>(null);

    const canvasRef = useCallback(
        (node: HTMLCanvasElement) => {
            if (node !== null) {
                if (instanceRef.current) return;
                instanceRef.current = confetti.create(node, {
                    ...globalOptions,
                    resize: true,
                });
            } else {
                if (instanceRef.current) {
                    instanceRef.current.reset();
                    instanceRef.current = null;
                }
            }
        },
        [globalOptions]
    );
    const fire = useCallback(
        async (opts = {}) => {
            try {
                await instanceRef.current?.({ ...options, ...opts });
            } catch (error) {
                console.error("Confetti error:", error);
            }
        },
        [options]
    );

    const api = useMemo(
        () => ({
            fire,
        }),
        [fire]
    );

    useImperativeHandle(ref, () => api, [api]);

    useEffect(() => {
        if (!manualstart) {
            (async () => {
                try {
                    await fire();
                } catch (error) {
                    console.error("Confetti effect error:", error);
                }
            })();
        }
    }, [manualstart, fire]);


    return (
        <ConfettiContext.Provider value={api}>
            {/* <canvas className="hidden" ref={canvasRef} {...rest} /> */}
            {/* {children} */}
        </ConfettiContext.Provider>
    );
};
