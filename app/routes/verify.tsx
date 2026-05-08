import type { Route } from "./+types/verify";
import { useState, useEffect, useMemo } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Tabs,
    Tab,
    Chip,
    Divider,
    Code,
    ScrollShadow
} from "@heroui/react";
import { verifyScenarios, type VerificationResult } from "~/utils/scenarioVerifier";
import {
    generateVariablesReport,
    generateDetailedVariablesReport,
    generateWarningsReport,
    generateIssuesReport
} from "~/utils/reportGenerator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

// Composants personnalisés pour ReactMarkdown avec style injecté (compact)
const markdownComponents: Components = {
    h1: ({ children }) => (
        <h1 className="text-2xl font-bold mb-2 mt-3 text-foreground">{children}</h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-xl font-bold mb-2 mt-3 text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-lg font-semibold mb-1 mt-2 text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
        <h4 className="text-base font-semibold mb-1 mt-2 text-foreground">{children}</h4>
    ),
    p: ({ children }) => (
        <p className="mb-2 text-foreground text-sm leading-snug">{children}</p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc list-inside mb-2 space-y-0.5 text-foreground text-sm">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-inside mb-2 space-y-0.5 text-foreground text-sm">{children}</ol>
    ),
    li: ({ children }) => (
        <li className="ml-3 text-foreground text-sm">{children}</li>
    ),
    strong: ({ children }) => (
        <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="italic text-foreground">{children}</em>
    ),
    code: ({ inline, children }: any) => {
        if (inline) {
            return (
                <code className="bg-default-200 dark:bg-default-100 text-primary px-1 py-0.5 rounded text-xs font-mono">
                    {children}
                </code>
            );
        }
        return (
            <code className="block bg-default-200 dark:bg-default-100 text-foreground p-2 rounded my-2 overflow-x-auto font-mono text-xs">
                {children}
            </code>
        );
    },
    pre: ({ children }) => (
        <pre className="bg-default-200 dark:bg-default-100 p-2 rounded my-2 overflow-x-auto">
            {children}
        </pre>
    ),
    table: ({ children }) => (
        <div className="overflow-x-auto my-2">
            <table className="min-w-full border-collapse border border-default-300 dark:border-default-600 text-sm">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-default-200 dark:bg-default-100">
            {children}
        </thead>
    ),
    tbody: ({ children }) => (
        <tbody>{children}</tbody>
    ),
    tr: ({ children }) => (
        <tr className="border-b border-default-300 dark:border-default-600">
            {children}
        </tr>
    ),
    th: ({ children }) => (
        <th className="border border-default-300 dark:border-default-600 px-2 py-1 text-left font-semibold text-foreground bg-default-200 dark:bg-default-100 text-xs">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="border border-default-300 dark:border-default-600 px-2 py-1 text-foreground text-xs">
            {children}
        </td>
    ),
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-primary pl-3 my-2 italic text-default-600 text-sm">
            {children}
        </blockquote>
    ),
    hr: () => (
        <hr className="my-3 border-default-300 dark:border-default-600" />
    ),
    a: ({ href, children }) => (
        <a
            href={href}
            className="text-primary hover:underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    ),
};

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Verification des Scénarios - Trekkie" },
        { name: "description", content: "Vérification en direct des scénarios et catégories" }
    ];
}

export default function Verify() {
    const [scenariosJson, setScenariosJson] = useState<string>("");
    const [categoriesJson, setCategoriesJson] = useState<string>("");
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Charger les données initiales depuis les fichiers
    useEffect(() => {
        const loadData = async () => {
            try {
                const [scenariosResponse, categoriesResponse] = await Promise.all([
                    fetch("/api/scenarios/scenarios.json"),
                    fetch("/api/category/categories.json")
                ]);

                if (scenariosResponse.ok) {
                    const scenariosData = await scenariosResponse.json();
                    setScenariosJson(JSON.stringify(scenariosData, null, 2));
                }

                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    setCategoriesJson(JSON.stringify(categoriesData, null, 2));
                }
            } catch (err) {
                console.error("Erreur lors du chargement des données:", err);
            }
        };

        loadData();
    }, []);

    const handleVerify = () => {
        setLoading(true);
        setError("");
        setVerificationResult(null);

        try {
            const scenariosData = JSON.parse(scenariosJson);
            const categoriesData = JSON.parse(categoriesJson);

            const result = verifyScenarios(scenariosData, categoriesData);
            setVerificationResult(result);
        } catch (err: any) {
            setError(`Erreur de parsing JSON: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Générer les rapports markdown
    const issuesReportMd = useMemo(() => {
        if (!verificationResult) return '';
        return generateIssuesReport(verificationResult.issues, verificationResult.stats);
    }, [verificationResult]);

    const variablesReportMd = useMemo(() => {
        if (!verificationResult) return '';
        return generateVariablesReport(verificationResult.customVariables);
    }, [verificationResult]);

    const detailedVariablesReportMd = useMemo(() => {
        if (!verificationResult) return '';
        return generateDetailedVariablesReport(verificationResult.customVariables);
    }, [verificationResult]);

    const warningsReportMd = useMemo(() => {
        if (!verificationResult) return '';
        return generateWarningsReport(verificationResult.warnings);
    }, [verificationResult]);

    return (
        <div className="container mx-auto p-4 max-w-[1900px]">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-1">🔍 Vérification des Scénarios</h1>
                <p className="text-default-500 text-sm">
                    Vérifiez la cohérence et la validité de vos scénarios et catégories
                </p>
            </div>

            <Divider className="mb-4" />

            {/* Éditeurs JSON */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <Card shadow="sm" className="border-1">
                    <CardHeader className="flex gap-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 py-2">
                        <div className="flex flex-col flex-1">
                            <p className="text-base font-semibold">📄 Scénarios JSON</p>
                            <p className="text-xs text-default-500">Collez votre fichier scenarios.json</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-0">
                        <textarea
                            className="w-full h-[350px] font-mono text-xs p-3 bg-transparent focus:outline-none resize-none"
                            value={scenariosJson}
                            onChange={(e) => setScenariosJson(e.target.value)}
                            placeholder='{"scenarios": [...]}'
                            spellCheck={false}
                        />
                    </CardBody>
                </Card>

                <Card shadow="sm" className="border-1">
                    <CardHeader className="flex gap-2 bg-gradient-to-r from-secondary-50 to-success-50 dark:from-secondary-900/20 dark:to-success-900/20 py-2">
                        <div className="flex flex-col flex-1">
                            <p className="text-base font-semibold">📑 Catégories JSON</p>
                            <p className="text-xs text-default-500">Collez votre fichier categories.json</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-0">
                        <textarea
                            className="w-full h-[350px] font-mono text-xs p-3 bg-transparent focus:outline-none resize-none"
                            value={categoriesJson}
                            onChange={(e) => setCategoriesJson(e.target.value)}
                            placeholder='{"categories": {...}}'
                            spellCheck={false}
                        />
                    </CardBody>
                </Card>
            </div>

            {/* Bouton de vérification */}
            <div className="flex justify-center mb-4">
                <Button
                    color="primary"
                    size="md"
                    onClick={handleVerify}
                    isLoading={loading}
                    disabled={!scenariosJson || !categoriesJson}
                    className="font-semibold px-8"
                    radius="full"
                >
                    {loading ? "Vérification..." : "🚀 Vérifier"}
                </Button>
            </div>

            {/* Erreur de parsing */}
            {error && (
                <Card className="mb-4 border-2 border-danger" shadow="sm">
                    <CardBody className="py-2">
                        <div className="flex items-center gap-2">
                            <Chip color="danger" variant="flat" size="sm">❌ Erreur</Chip>
                            <p className="text-danger font-semibold text-sm">{error}</p>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Résultats de la vérification */}
            {verificationResult && (
                <div className="space-y-4">
                    <Divider />

                    {/* Statistiques */}
                    <Card shadow="md" className="border-1">
                        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 py-2">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                📊 Statistiques Globales
                            </h2>
                        </CardHeader>
                        <Divider />
                        <CardBody className="py-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                <Card shadow="sm" className="bg-blue-50 dark:bg-blue-900/20 border-1 border-blue-200 dark:border-blue-800">
                                    <CardBody className="text-center py-3">
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{verificationResult.stats.totalScenarios}</p>
                                        <p className="text-xs text-default-600 mt-0.5">Scénarios</p>
                                    </CardBody>
                                </Card>
                                <Card shadow="sm" className="bg-purple-50 dark:bg-purple-900/20 border-1 border-purple-200 dark:border-purple-800">
                                    <CardBody className="text-center py-3">
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{verificationResult.stats.totalStages}</p>
                                        <p className="text-xs text-default-600 mt-0.5">Stages</p>
                                    </CardBody>
                                </Card>
                                <Card shadow="sm" className="bg-green-50 dark:bg-green-900/20 border-1 border-green-200 dark:border-green-800">
                                    <CardBody className="text-center py-3">
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{verificationResult.stats.totalChoices}</p>
                                        <p className="text-xs text-default-600 mt-0.5">Choix</p>
                                    </CardBody>
                                </Card>
                                <Card shadow="sm" className="bg-orange-50 dark:bg-orange-900/20 border-1 border-orange-200 dark:border-orange-800">
                                    <CardBody className="text-center py-3">
                                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{verificationResult.stats.choicesWithConditions}</p>
                                        <p className="text-xs text-default-600 mt-0.5">Conditionnels</p>
                                    </CardBody>
                                </Card>
                                <Card shadow="sm" className="bg-red-50 dark:bg-red-900/20 border-1 border-red-200 dark:border-red-800">
                                    <CardBody className="text-center py-3">
                                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{verificationResult.issues.length}</p>
                                        <p className="text-xs text-default-600 mt-0.5">Erreurs</p>
                                    </CardBody>
                                </Card>
                                <Card shadow="sm" className="bg-yellow-50 dark:bg-yellow-900/20 border-1 border-yellow-200 dark:border-yellow-800">
                                    <CardBody className="text-center py-3">
                                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{verificationResult.warnings.length}</p>
                                        <p className="text-xs text-default-600 mt-0.5">Avertissements</p>
                                    </CardBody>
                                </Card>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Onglets de Résultats */}
                    <Card shadow="md" className="border-1">
                        <CardBody className="p-0">
                            <Tabs
                                aria-label="Résultats de vérification"
                                size="md"
                                variant="underlined"
                                classNames={{
                                    tabList: "gap-4 w-full relative rounded-none p-2 border-b border-divider",
                                    cursor: "w-full bg-primary",
                                    tab: "max-w-fit px-3 h-10",
                                    tabContent: "group-data-[selected=true]:text-primary font-semibold text-sm"
                                }}
                            >
                                {/* Issues */}
                                <Tab
                                    key="issues"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <span>❌ Erreurs</span>
                                            <Chip size="sm" color="danger" variant="flat">{verificationResult.issues.length}</Chip>
                                        </div>
                                    }
                                >
                                    <ScrollShadow className="max-h-[600px] p-4">
                                        <div className="space-y-3">
                                            {verificationResult.issues.length === 0 ? (
                                                <Card className="bg-success-50 dark:bg-success-900/20 border-2 border-success">
                                                    <CardBody className="text-center py-8">
                                                        <p className="text-2xl mb-2">✅</p>
                                                        <p className="text-success-600 dark:text-success-400 font-semibold text-lg">
                                                            Aucune erreur trouvée !
                                                        </p>
                                                        <p className="text-default-500 text-sm mt-2">
                                                            Tous les scénarios sont valides
                                                        </p>
                                                    </CardBody>
                                                </Card>
                                            ) : (
                                                verificationResult.issues.map((issue, index) => (
                                                    <Card key={index} shadow="sm" className="border-l-4 border-danger">
                                                        <CardBody className="py-3">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <Chip color="danger" size="sm" variant="flat" className="text-xs">{issue.type}</Chip>
                                                                {issue.scenario && (
                                                                    <Code size="sm" className="text-xs">{issue.scenario}</Code>
                                                                )}
                                                            </div>
                                                            <p className="font-semibold text-default-700 mb-1 text-sm">{issue.message}</p>
                                                            {issue.location && (
                                                                <p className="text-xs text-default-500 flex items-center gap-1 mb-1">
                                                                    <span>📍</span> {issue.location}
                                                                </p>
                                                            )}
                                                            {issue.condition && (
                                                                <Code className="w-full mt-1" size="sm">
                                                                    {issue.condition}
                                                                </Code>
                                                            )}
                                                        </CardBody>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </ScrollShadow>
                                </Tab>

                                {/* Warnings */}
                                <Tab
                                    key="warnings"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <span>⚠️ Avertissements</span>
                                            <Chip size="sm" color="warning" variant="flat">{verificationResult.warnings.length}</Chip>
                                        </div>
                                    }
                                >
                                    <ScrollShadow className="max-h-[600px] p-4">
                                        <div className="space-y-4">
                                            {verificationResult.warnings.length === 0 ? (
                                                <Card className="bg-success-50 dark:bg-success-900/20 border-2 border-success">
                                                    <CardBody className="text-center py-12">
                                                        <p className="text-2xl mb-2">✅</p>
                                                        <p className="text-success-600 dark:text-success-400 font-semibold text-lg">
                                                            Aucun avertissement !
                                                        </p>
                                                    </CardBody>
                                                </Card>
                                            ) : (
                                                verificationResult.warnings.map((warning, index) => (
                                                    <Card key={index} shadow="sm" className="border-l-4 border-warning">
                                                        <CardBody className="py-3">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <Chip color="warning" size="sm" variant="flat" className="text-xs">{warning.type}</Chip>
                                                                {warning.scenario && (
                                                                    <Code size="sm" className="text-xs">{warning.scenario}</Code>
                                                                )}
                                                            </div>
                                                            <p className="font-semibold text-default-700 mb-1 text-sm">{warning.message}</p>
                                                            {warning.reasons && warning.reasons.length > 0 && (
                                                                <ul className="text-xs text-default-600 list-disc list-inside mt-2 space-y-0.5">
                                                                    {warning.reasons.map((reason, rIndex) => (
                                                                        <li key={rIndex}>{reason}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </CardBody>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    </ScrollShadow>
                                </Tab>

                                {/* Variables */}
                                <Tab
                                    key="variables"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <span>🔧 Variables</span>
                                            <Chip size="sm" color="primary" variant="flat">{verificationResult.customVariables.size}</Chip>
                                        </div>
                                    }
                                >
                                    <ScrollShadow className="max-h-[600px] p-4">
                                        <div className="space-y-4">
                                            {verificationResult.customVariables.size === 0 ? (
                                                <Card className="bg-default-100">
                                                    <CardBody className="text-center py-12">
                                                        <p className="text-default-400">Aucune variable custom trouvée</p>
                                                    </CardBody>
                                                </Card>
                                            ) : (
                                                Array.from(verificationResult.customVariables.entries()).map(([varName, varData]) => {
                                                    const hasError = varData.createdIn.size === 0 && varData.usedIn.size > 0;
                                                    const isUnused = varData.createdIn.size > 0 && varData.usedIn.size === 0;
                                                    const borderColor = hasError ? "border-danger" : isUnused ? "border-warning" : "border-success";

                                                    return (
                                                        <Card key={varName} shadow="sm" className={`border-l-4 ${borderColor}`}>
                                                            <CardBody className="py-3">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <Code className="text-sm font-bold">{varName}</Code>
                                                                    <Chip
                                                                        color={hasError ? "danger" : isUnused ? "warning" : "success"}
                                                                        size="sm"
                                                                        variant="flat"
                                                                        className="text-xs"
                                                                    >
                                                                        {hasError ? "❌ Jamais créée" :
                                                                         isUnused ? "⚠️ Jamais utilisée" :
                                                                         "✅ Fonctionnelle"}
                                                                    </Chip>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <div>
                                                                        <p className="font-semibold text-xs text-default-600 mb-1">
                                                                            Créations: {varData.createdIn.size}
                                                                        </p>
                                                                        {varData.createdIn.size > 0 && (
                                                                            <div className="space-y-0.5">
                                                                                {Array.from(varData.createdIn).slice(0, 3).map((scenario, i) => (
                                                                                    <Code key={i} size="sm" className="block text-xs">{scenario}</Code>
                                                                                ))}
                                                                                {varData.createdIn.size > 3 && (
                                                                                    <p className="text-xs text-default-400">+{varData.createdIn.size - 3} autres...</p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-xs text-default-600 mb-1">
                                                                            Utilisations: {varData.usedIn.size}
                                                                        </p>
                                                                        {varData.usedIn.size > 0 && (
                                                                            <div className="space-y-0.5">
                                                                                {Array.from(varData.usedIn).slice(0, 3).map((usageStr, i) => {
                                                                                    try {
                                                                                        const usage = JSON.parse(usageStr);
                                                                                        return <Code key={i} size="sm" className="block text-xs">{usage.scenarioId}</Code>;
                                                                                    } catch {
                                                                                        return null;
                                                                                    }
                                                                                })}
                                                                                {varData.usedIn.size > 3 && (
                                                                                    <p className="text-xs text-default-400">+{varData.usedIn.size - 3} autres...</p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <Divider className="my-2" />

                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                    <span className="text-xs font-semibold text-default-600">Opérations:</span>
                                                                    {["add", "set", "remove"].map(opType => {
                                                                        const count = varData.operations.filter(op => op.operation === opType).length;
                                                                        if (count > 0) {
                                                                            return (
                                                                                <Chip key={opType} size="sm" variant="flat" color="secondary" className="text-xs">
                                                                                    {opType}: {count}
                                                                                </Chip>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })}
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </ScrollShadow>
                                </Tab>

                                {/* Rapport Erreurs */}
                                <Tab
                                    key="issues-report"
                                    title={<span>📋 Rapport Erreurs</span>}
                                >
                                    <ScrollShadow className="max-h-[600px] p-4">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={markdownComponents}
                                        >
                                            {issuesReportMd}
                                        </ReactMarkdown>
                                    </ScrollShadow>
                                </Tab>

                                {/* Rapport Variables Tableau */}
                                <Tab
                                    key="variables-table-report"
                                    title={<span>📊 Variables (Tableau)</span>}
                                >
                                    <ScrollShadow className="max-h-[600px] p-4">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={markdownComponents}
                                        >
                                            {variablesReportMd}
                                        </ReactMarkdown>
                                    </ScrollShadow>
                                </Tab>

                                {/* Rapport Variables Détaillé */}
                                <Tab
                                    key="variables-detailed-report"
                                    title={<span>🔍 Variables Détaillé</span>}
                                >
                                    <ScrollShadow className="max-h-[600px] p-4">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={markdownComponents}
                                        >
                                            {detailedVariablesReportMd}
                                        </ReactMarkdown>
                                    </ScrollShadow>
                                </Tab>

                                {/* Rapport Avertissements */}
                                <Tab
                                    key="warnings-report"
                                    title={<span>⚠️ Avertissements Détaillés</span>}
                                >
                                    <ScrollShadow className="max-h-[600px] p-4">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={markdownComponents}
                                        >
                                            {warningsReportMd}
                                        </ReactMarkdown>
                                    </ScrollShadow>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                </div>
            )}
        </div>
    );
}
