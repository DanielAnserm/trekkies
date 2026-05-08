import { Card, CardBody, CardHeader } from "@heroui/react";

type Props = {
    children?: React.ReactNode;
};



export const LayoutCard = ({ children }: Props) => {
    return <Card className="max-w-lg w-full h-full text-center grow-1">{children}</Card>;
};

export const LayoutCardBody = ({ children }: Props) => {
    return <CardBody className="gap-4 text-center">{children}</CardBody>;
};

export const LayoutCardHeader = ({ children }: Props) => {
    return <CardHeader className="text-large font-semibold text-center justify-center">{children}</CardHeader>;
};
