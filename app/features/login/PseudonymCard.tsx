import { Button, Card, CardBody, CardHeader, Form, Input, Skeleton } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";

export const PseudonymCard = () => {
    const { t } = useTranslation();
    const { userProfile, loading, sync, setPseudo, setError } = usePseudoContext();
    const navigate = useNavigate();
    const handleSetPseudo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        const pseudonym = data["pseudo"]?.toString()?.trim();
        console.log("Pseudonyme entré:", pseudonym);
        // if (!pseudonym) {
        //     setError("Veuillez entrer un pseudonyme");
        //     return;
        // }

        try {
            await setPseudo(pseudonym);
            navigate("/game/start");
        } catch (error) {
            // Error already handled in setPseudo
        }
    };

    if (sync) {
        return (
            <Card className="max-w-lg w-full h-full text-center grow-1  mx-auto">
                <CardHeader className="text-large font-semibold text-center justify-center">
                    <h2>{t("login.title")}</h2>
                </CardHeader>
                <CardBody className="gap-4">
                    <p>{t("login.description")}</p>
                </CardBody>
            </Card>
        );
    }
    return (
        <Card className="max-w-lg w-full h-full text-center grow-1 mx-auto">
            <CardHeader className="text-large font-semibold text-center justify-center">
                <h1>{t("login.title")}</h1>
            </CardHeader>
            <CardBody className="gap-4 mx-auto">
                <p>{t("login.description")}</p>
                {/* <div className="flex flex-col gap-4 text-center w-full my-auto"> */}
                    <Skeleton isLoaded={!sync}>
                        <Form className="w-full flex flex-col gap-4  mx-auto" onSubmit={handleSetPseudo}>
                            <Input
                                errorMessage={t("login.form.username.required")}
                                label={t("login.form.username.label")}
                                labelPlacement="outside-top"
                                name="pseudo"
                                defaultValue={userProfile?.pseudonym || ""}
                                type="text"
                                size="lg"
                                maxLength={50}
                            />

                            <Button
                                type="submit"
                                size="lg"
                                isLoading={loading}
                                isDisabled={loading}
                                color="primary"
                                className="w-full max-w-2xs mx-auto mt-10 animate-appearance-in"
                            >
                                {t("login.form.submit.label")}
                            </Button>
                        </Form>
                    </Skeleton>
                {/* </div> */}
            </CardBody>
        </Card>
    );
};
