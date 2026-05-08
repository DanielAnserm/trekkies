import { Outlet } from "react-router";

type Props = {};

const Main = (props: Props) => {
    return (
        <main className="flex flex-col gap-4 items-center justify-center h-full w-full grow-1 mx-auto">
            <Outlet />
        </main>
    );
};

export default Main;
