import type { VerificationResult, VerificationIssue, VerificationWarning, VariableData } from "./scenarioVerifier";

/**
 * Génère le rapport VARIABLES_REPORT.md (format tableau)
 */
export function generateVariablesReport(customVariables: Map<string, VariableData>): string {
    let markdown = '# Rapport des Variables Custom\n\n';

    // Catégoriser les variables
    const varsByCategory = {
        created: [] as [string, VariableData][],
        usedOnly: [] as [string, VariableData][],
        unused: [] as [string, VariableData][]
    };

    customVariables.forEach((varData, varName) => {
        if (varData.createdIn.size > 0 && varData.usedIn.size > 0) {
            varsByCategory.created.push([varName, varData]);
        } else if (varData.createdIn.size === 0 && varData.usedIn.size > 0) {
            varsByCategory.usedOnly.push([varName, varData]);
        } else if (varData.createdIn.size > 0 && varData.usedIn.size === 0) {
            varsByCategory.unused.push([varName, varData]);
        }
    });

    markdown += `## ✅ Variables Créées et Utilisées (${varsByCategory.created.length})\n\n`;
    markdown += '| Variable | Statut | Scénarios Créateurs | Utilisations | Opérations | Détails |\n';
    markdown += '|----------|--------|---------------------|--------------|------------|----------|\n';

    varsByCategory.created.sort((a, b) => a[0].localeCompare(b[0])).forEach(([varName, varData]) => {
        const creations = varData.operations.filter(op => op.type === 'creation');
        const usages = varData.operations.filter(op => op.type === 'usage');
        const creatorsShort = Array.from(varData.createdIn).slice(0, 2).join(', ');
        const creatorsMore = varData.createdIn.size > 2 ? ` +${varData.createdIn.size - 2}` : '';

        // Résumer les opérations
        const opTypes: Record<string, number> = {};
        creations.forEach(op => {
            const operation = (op as any).operation || 'set';
            opTypes[operation] = (opTypes[operation] || 0) + 1;
        });
        const opSummary = Object.entries(opTypes).map(([op, count]) => `${op}:${count}`).join(', ');

        markdown += `| \`${varName}\` | ✅ OK | ${creatorsShort}${creatorsMore} | ${usages.length} | ${creations.length} | ${opSummary} |\n`;
    });

    markdown += `\n## ❌ Variables Utilisées mais Jamais Créées (${varsByCategory.usedOnly.length})\n\n`;
    markdown += '| Variable | Statut | Utilisations | Exemples d\'Utilisation |\n';
    markdown += '|----------|--------|--------------|-------------------------|\n';

    varsByCategory.usedOnly.forEach(([varName, varData]) => {
        const usages = varData.operations.filter(op => op.type === 'usage').slice(0, 2);
        const usageExamples = usages.map(u => `${(u as any).scenarioId}`).join(', ');
        const moreUsages = varData.usedIn.size > 2 ? ` +${varData.usedIn.size - 2}` : '';

        markdown += `| \`${varName}\` | ❌ **ERREUR** | ${varData.usedIn.size} | ${usageExamples}${moreUsages} |\n`;
    });

    markdown += `\n## ⚠️ Variables Créées mais Jamais Utilisées (${varsByCategory.unused.length})\n\n`;
    markdown += '| Variable | Statut | Scénarios Créateurs | Nombre de Créations | Raison Probable |\n';
    markdown += '|----------|--------|---------------------|---------------------|------------------|\n';

    varsByCategory.unused.forEach(([varName, varData]) => {
        const creators = Array.from(varData.createdIn).join(', ');
        const creations = varData.operations.filter(op => op.type === 'creation');

        // Détecter si c'est un problème d'espaces
        let reason = 'Variable inutilisée';
        if (varName.trim() !== varName) {
            const trimmed = varName.trim();
            const trimmedVar = customVariables.get(trimmed);
            if (trimmedVar && trimmedVar.usedIn.size > 0) {
                reason = `❗ Espace dans le nom! Version "\`${trimmed}\`" utilisée ${trimmedVar.usedIn.size} fois`;
            } else {
                reason = '❗ Espace dans le nom';
            }
        }

        markdown += `| \`${varName}\` | ⚠️ Non utilisée | ${creators} | ${creations.length} | ${reason} |\n`;
    });

    // Ajouter un résumé global
    markdown += `\n## 📊 Résumé Global\n\n`;
    markdown += '| Catégorie | Nombre | Pourcentage |\n';
    markdown += '|-----------|--------|-------------|\n';
    const total = varsByCategory.created.length + varsByCategory.usedOnly.length + varsByCategory.unused.length;
    if (total > 0) {
        markdown += `| ✅ Fonctionnelles | ${varsByCategory.created.length} | ${Math.round(varsByCategory.created.length / total * 100)}% |\n`;
        markdown += `| ❌ Erreurs (jamais créées) | ${varsByCategory.usedOnly.length} | ${Math.round(varsByCategory.usedOnly.length / total * 100)}% |\n`;
        markdown += `| ⚠️ Inutilisées | ${varsByCategory.unused.length} | ${Math.round(varsByCategory.unused.length / total * 100)}% |\n`;
        markdown += `| **Total** | **${total}** | **100%** |\n`;
    }

    return markdown;
}

/**
 * Génère le rapport VARIABLES_DETAILED_REPORT.md (ultra-détaillé)
 */
export function generateDetailedVariablesReport(customVariables: Map<string, VariableData>): string {
    let markdown = '# Rapport Ultra-Détaillé des Variables Custom\n\n';
    markdown += `**Total de variables custom**: ${Array.from(customVariables.keys()).filter(k => k.startsWith('_') || k.startsWith('$')).length}\n\n`;
    markdown += '---\n\n';

    // Trier les variables par nom
    const sortedVars = Array.from(customVariables.entries())
        .filter(([name]) => name.startsWith('_') || name.startsWith('$'))
        .sort(([a], [b]) => a.localeCompare(b));

    sortedVars.forEach(([varName, varData]) => {
        markdown += `## \`${varName}\`\n\n`;

        // Statut
        let status = '✅ Fonctionnelle';
        if (varData.createdIn.size === 0 && varData.usedIn.size > 0) {
            status = '❌ **ERREUR**: Utilisée mais jamais créée';
        } else if (varData.createdIn.size > 0 && varData.usedIn.size === 0) {
            status = '⚠️ Créée mais jamais utilisée';
        }

        markdown += `**Statut**: ${status}\n\n`;

        // Statistiques
        markdown += `### 📊 Statistiques\n\n`;
        markdown += `- **Créée dans**: ${varData.createdIn.size} scénario(s)\n`;
        markdown += `- **Utilisée dans**: ${varData.usedIn.size} endroit(s)\n`;
        markdown += `- **Total d'opérations**: ${varData.operations.length}\n\n`;

        // Liste des scénarios où elle est créée
        if (varData.createdIn.size > 0) {
            markdown += `**Scénarios créateurs**: ${Array.from(varData.createdIn).join(', ')}\n\n`;
        }

        // Toutes les opérations dans l'ordre chronologique
        markdown += `### 📝 Historique Complet des Opérations\n\n`;

        const creations = varData.operations.filter(op => op.type === 'creation');
        const usages = varData.operations.filter(op => op.type === 'usage');

        if (creations.length > 0) {
            markdown += `#### 🔧 Créations/Modifications (${creations.length})\n\n`;
            markdown += '| Scénario | Location | Opération | Valeur |\n';
            markdown += '|----------|----------|-----------|--------|\n';
            creations.forEach(op => {
                const creation = op as any;
                const location = creation.location.replace(/^Scenario [^ ]+ > /, '');
                markdown += `| \`${creation.scenarioId}\` | ${location} | **${creation.operation}** | \`${creation.value}\` |\n`;
            });
            markdown += '\n';
        }

        if (usages.length > 0) {
            markdown += `#### 📖 Utilisations (${usages.length})\n\n`;
            markdown += '| Scénario | Location | Condition |\n';
            markdown += '|----------|----------|----------|\n';
            usages.forEach(op => {
                const usage = op as any;
                const location = usage.location.replace(/^Scenario [^ ]+ > /, '').replace(/^Category [^ ]+ > /, 'Cat: ');
                markdown += `| \`${usage.scenarioId}\` | ${location} | \`${usage.condition}\` |\n`;
            });
            markdown += '\n';
        }

        markdown += '---\n\n';
    });

    return markdown;
}

/**
 * Génère le rapport WARNINGS_REPORT.md (warnings détaillés)
 */
export function generateWarningsReport(warnings: VerificationWarning[]): string {
    let markdown = '# Rapport Détaillé des Avertissements\n\n';
    markdown += `**Total**: ${warnings.length} avertissements\n\n`;

    const warningsByType: Record<string, VerificationWarning[]> = {};
    warnings.forEach(warning => {
        if (!warningsByType[warning.type]) {
            warningsByType[warning.type] = [];
        }
        warningsByType[warning.type].push(warning);
    });

    Object.keys(warningsByType).forEach(type => {
        markdown += `## ${type} (${warningsByType[type].length})\n\n`;

        if (type === 'UNREACHABLE_STAGES') {
            markdown += '### Analyse des Stages Non Atteignables\n\n';
            warningsByType[type].forEach(warning => {
                markdown += `#### Scénario: \`${warning.scenario}\`\n\n`;
                if ((warning as any).stages) {
                    markdown += `**Stages concernés**: ${(warning as any).stages.map((s: string) => `\`${s}\``).join(', ')}\n\n`;
                }
                markdown += `**Raisons**:\n\n`;
                if (warning.reasons) {
                    warning.reasons.forEach(reason => {
                        markdown += `- ${reason}\n`;
                    });
                }
                markdown += '\n';
            });
        } else if (type === 'ALL_CHOICES_CONDITIONAL') {
            markdown += '### Risque de Blocage du Joueur\n\n';
            markdown += 'Ces stages ont **tous leurs choix conditionnels**, ce qui signifie que si aucune condition n\'est satisfaite, le joueur sera bloqué.\n\n';

            // Grouper par scénario
            const byScenario: Record<string, string[]> = {};
            warningsByType[type].forEach(warning => {
                if (!byScenario[warning.scenario!]) {
                    byScenario[warning.scenario!] = [];
                }
                byScenario[warning.scenario!].push((warning as any).stage || '');
            });

            Object.entries(byScenario).forEach(([scenario, stages]) => {
                markdown += `- **${scenario}** (${stages.length} stages): ${stages.slice(0, 5).join(', ')}`;
                if (stages.length > 5) {
                    markdown += `, ... et ${stages.length - 5} autres`;
                }
                markdown += '\n';
            });
            markdown += '\n';
        } else if (type === 'VARIABLE_NEVER_USED') {
            markdown += '### Variables Créées mais Jamais Utilisées\n\n';
            markdown += 'Ces variables sont créées dans des scénarios mais ne sont jamais référencées dans aucune condition.\n\n';
            warningsByType[type].forEach(warning => {
                markdown += `#### \`${(warning as any).variable}\`\n\n`;
                if ((warning as any).createdIn) {
                    markdown += `- **Créée dans**: ${(warning as any).createdIn.join(', ')}\n`;
                }
                markdown += `- **Jamais utilisée**: Aucune condition ne référence cette variable\n`;
                markdown += `- **Impact**: Variable inutile, peut être supprimée\n\n`;
            });
        } else {
            // Autres types d'avertissements
            warningsByType[type].forEach(warning => {
                markdown += `- ${warning.message}\n`;
                if (warning.scenario) markdown += `  - Scenario: ${warning.scenario}\n`;
                if ((warning as any).stage) markdown += `  - Stage: ${(warning as any).stage}\n`;
            });
            markdown += '\n';
        }
    });

    return markdown;
}

/**
 * Génère le rapport SCENARIO_ISSUES_REPORT.md (erreurs et solutions)
 */
export function generateIssuesReport(issues: VerificationIssue[], stats: any): string {
    let markdown = '# Rapport de Vérification des Scénarios\n\n';
    markdown += `**Date**: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

    markdown += `## 📊 Statistiques\n\n`;
    markdown += `- **Total de scénarios**: ${stats.totalScenarios}\n`;
    markdown += `- **Total de stages**: ${stats.totalStages}\n`;
    markdown += `- **Total de choix**: ${stats.totalChoices}\n`;
    markdown += `- **Choix avec conditions**: ${stats.choicesWithConditions}\n`;
    markdown += `- **Erreurs trouvées**: ${issues.length}\n\n`;

    if (issues.length === 0) {
        markdown += `## ✅ Aucune erreur trouvée !\n\n`;
        markdown += `Tous les scénarios sont valides.\n`;
        return markdown;
    }

    markdown += `## ❌ Erreurs Trouvées (${issues.length})\n\n`;

    // Grouper par type
    const issuesByType: Record<string, VerificationIssue[]> = {};
    issues.forEach(issue => {
        if (!issuesByType[issue.type]) {
            issuesByType[issue.type] = [];
        }
        issuesByType[issue.type].push(issue);
    });

    Object.entries(issuesByType).forEach(([type, typeIssues]) => {
        markdown += `### ${type} (${typeIssues.length})\n\n`;

        typeIssues.forEach((issue, index) => {
            markdown += `${index + 1}. **${issue.message}**\n`;
            if (issue.scenario) markdown += `   - Scénario: \`${issue.scenario}\`\n`;
            if (issue.location) markdown += `   - Location: ${issue.location}\n`;
            if (issue.condition) markdown += `   - Condition: \`${issue.condition}\`\n`;
            markdown += '\n';
        });
    });

    return markdown;
}

/**
 * Télécharge un fichier texte
 */
export function downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Génère et télécharge tous les rapports
 */
export function downloadAllReports(result: VerificationResult) {
    // 1. Variables Report (tableau)
    const variablesReport = generateVariablesReport(result.customVariables);
    downloadFile('VARIABLES_REPORT.md', variablesReport);

    // 2. Detailed Variables Report
    const detailedVariablesReport = generateDetailedVariablesReport(result.customVariables);
    downloadFile('VARIABLES_DETAILED_REPORT.md', detailedVariablesReport);

    // 3. Warnings Report
    const warningsReport = generateWarningsReport(result.warnings);
    downloadFile('WARNINGS_REPORT.md', warningsReport);

    // 4. Issues Report
    const issuesReport = generateIssuesReport(result.issues, result.stats);
    downloadFile('SCENARIO_ISSUES_REPORT.md', issuesReport);

    // 5. JSON Report complet
    const jsonReport = {
        stats: result.stats,
        issues: result.issues.map(issue => ({
            type: issue.type,
            message: issue.message,
            scenario: issue.scenario,
            location: issue.location,
            condition: issue.condition
        })),
        warnings: result.warnings.map(warning => ({
            type: warning.type,
            message: warning.message,
            scenario: warning.scenario,
            reasons: warning.reasons
        })),
        customVariables: Object.fromEntries(
            Array.from(result.customVariables.entries()).map(([name, data]) => [
                name,
                {
                    createdIn: Array.from(data.createdIn),
                    usedIn: Array.from(data.usedIn),
                    operations: data.operations
                }
            ])
        )
    };
    downloadFile('scenario-verification-report.json', JSON.stringify(jsonReport, null, 2));
}
