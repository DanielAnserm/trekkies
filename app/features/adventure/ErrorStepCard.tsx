import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import Markdown from "react-markdown";

type Props = {
    categoryId?: string;
};

export const ErrorStepCard = ({ categoryId }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Récupérer les messages personnalisés par catégorie si disponible
    const hasCategoryMessage =
        categoryId && t(`scenario.prerequisites.categories.${categoryId}.title`, { defaultValue: "" });

    const title = hasCategoryMessage ? t(`scenario.prerequisites.categories.${categoryId}.title`) : t("errorStepCard.title");

    const description = hasCategoryMessage
        ? t(`scenario.prerequisites.categories.${categoryId}.description`)
        : t("errorStepCard.description");

    const suggestion = hasCategoryMessage ? t(`scenario.prerequisites.categories.${categoryId}.suggestion`) : null;

    return (
        <LayoutCard>
            <LayoutCardHeader>
                <div className="flex text-center justify-center flex-col gap-2">
                    <LockClosedIcon className="w-16 h-16 text-warning mx-auto" />
                    <h2>{title}</h2>
                </div>
            </LayoutCardHeader>
            <LayoutCardBody>
                <div className="text-secondary">
                    <Markdown>{description}</Markdown>
                </div>

                {suggestion && (
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="text-secondary [&_ul]:list-disc [&_ul]:list-inside">
                            <Markdown>{suggestion}</Markdown>
                        </div>
                    </div>
                )}

                <Button as={Link} href="/" color="primary" size="lg" className="mt-4">
                    {hasCategoryMessage ? t("scenario.prerequisites.backHome") : t("common.backHome")}
                </Button>
            </LayoutCardBody>
        </LayoutCard>
    );
};
