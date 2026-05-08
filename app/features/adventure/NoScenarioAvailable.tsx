import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Link } from "react-router";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";

type Props = {
    categoryId?: string;
};

export const NoScenarioAvailable = ({ categoryId }: Props) => {
    const { t } = useTranslation();

    // Récupérer les messages personnalisés par catégorie si disponible
    const hasCategoryMessage = categoryId && t(`scenario.noScenario.categories.${categoryId}.title`, { defaultValue: "" });

    const title = hasCategoryMessage
        ? t(`scenario.noScenario.categories.${categoryId}.title`)
        : t("scenario.noScenario.title");

    const description = hasCategoryMessage
        ? t(`scenario.noScenario.categories.${categoryId}.description`)
        : categoryId
        ? t("scenario.noScenario.descriptionWithCategory", { category: categoryId })
        : t("scenario.noScenario.description");

    const suggestion = hasCategoryMessage ? t(`scenario.noScenario.categories.${categoryId}.suggestion`) : null;

    return (
        <LayoutCard>
            <LayoutCardHeader>
                <div className="flex text-center justify-center flex-col gap-2">
                    <CheckCircleIcon className="w-16 h-16 text-success mx-auto" />
                    <h2>{title}</h2>
                </div>
            </LayoutCardHeader>
            <LayoutCardBody>
                <div className="text-secondary">
                    <Markdown>{description}</Markdown>
                </div>

                {hasCategoryMessage && suggestion ? (
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="text-secondary [&_ul]:list-disc [&_ul]:list-inside">
                            <Markdown>{suggestion}</Markdown>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 mt-4">
                        <p className="text-sm text-default-500 whitespace-pre-line">
                            {t("scenario.noScenario.suggestions")}
                        </p>
                    </div>
                )}

                <Button as={Link} href="/" color="primary" size="lg" className="mt-4">
                    {t("scenario.noScenario.backHome")}
                </Button>
            </LayoutCardBody>
        </LayoutCard>
    );
};
