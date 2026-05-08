import { Image } from "@heroui/react";

type Props = {
    children: React.ReactNode;
};

export const BaseLayout = ({ children }: Props) => {
    return (
        <div className="h-dvh max-h-[900px] w-full">
            <div className="overflow-auto h-full flex flex-col w-full items-center">
                <Image
                    src="/images/logo-black.svg"
                    alt="Trekkie Logo"
                    className="h-8 mx-auto mt-2"
                    loading="eager"
                    draggable={false}
                    radius="none"
                />
                <div className="mx-auto p-4 grid grid-rows-[1fr_auto] min-h-[calc(100%_-_2.5rem)] gap-8 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};
