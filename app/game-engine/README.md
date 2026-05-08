# Game Engine - Architecture Singleton

Architecture séparée de React pour gérer la logique du jeu Trekkie avec des classes singleton.

## 🏗️ Architecture

```
/app/game-engine/
├── core/
│   ├── GameEngine.ts          # Singleton principal orchestrateur
│   └── GameState.ts           # État du jeu
├── managers/
│   ├── StatsManager.ts        # Gestion des statistiques
│   ├── ProfileManager.ts      # Gestion du profil (traits, intérêts, objectifs)
│   ├── HistoryManager.ts      # Gestion de l'historique
│   └── SaveManager.ts         # Gestion des sauvegardes
├── processors/
│   ├── ChoiceProcessor.ts     # Traitement des choix et changements
│   └── ConditionEvaluator.ts  # Évaluation des conditions
├── hooks/
│   └── useGameEngine.ts       # Hook React pour intégration
├── types/
│   └── index.ts               # Types réexportés
└── index.ts                   # Export principal
```

## 🎮 Utilisation

### Utilisation directe (sans React)

```typescript
import { GameEngine } from "~/game-engine";

// Récupérer l'instance singleton
const engine = GameEngine.getInstance();

// Initialiser le jeu avec un scénario
engine.initialize(scenario, initialStats, initialProfile);

// Écouter les événements
engine.addEventListener((event) => {
  switch (event.type) {
    case "stateChanged":
      console.log("État du jeu modifié");
      break;
    case "statsChanged":
      console.log("Stats modifiées:", engine.getStats());
      break;
    case "profileChanged":
      console.log("Profil modifié:", engine.getProfile());
      break;
    case "choiceMade":
      console.log("Choix effectué:", event.data);
      break;
    case "gameCompleted":
      console.log("Jeu terminé!");
      break;
  }
});

// Gérer un choix du joueur
await engine.handleChoice(choice);

// Récupérer l'état
const stats = engine.getStats();
const profile = engine.getProfile();
const currentStage = engine.getCurrentStage();
const availableChoices = engine.getAvailableChoicesForCurrentStage();
```

### Utilisation avec React (Hook)

```typescript
import { useGameEngine } from "~/game-engine/hooks/useGameEngine";

function GameComponent() {
  const {
    currentStage,
    availableChoices,
    stats,
    profile,
    history,
    isLoading,
    handleChoice,
    initialize,
  } = useGameEngine();

  useEffect(() => {
    // Initialiser le jeu
    initialize(scenario, initialStats, initialProfile);
  }, [scenario]);

  const onChoiceClick = async (choice: Choice) => {
    await handleChoice(choice);
  };

  return (
    <div>
      <h2>{currentStage?.title}</h2>
      <p>{currentStage?.description}</p>

      {availableChoices.map((choice, idx) => (
        <button key={idx} onClick={() => onChoiceClick(choice)}>
          {choice.text}
        </button>
      ))}

      <div>Stats: {JSON.stringify(stats)}</div>
    </div>
  );
}
```

## 🧩 Composants principaux

### GameEngine

Le singleton principal qui orchestre toute la logique du jeu.

**Méthodes principales:**
- `initialize(scenario, stats, profile)` - Initialise le jeu
- `handleChoice(choice)` - Traite un choix du joueur
- `getStats()` - Récupère les statistiques
- `getProfile()` - Récupère le profil
- `getCurrentStage()` - Récupère l'étape actuelle
- `getAvailableChoicesForCurrentStage()` - Récupère les choix disponibles
- `addEventListener(listener)` - Écoute les événements
- `reset()` - Réinitialise le jeu

### StatsManager

Gère les statistiques du joueur (Character, Skills, Context, Experience).

**Méthodes:**
- `initialize(stats)` - Initialise les stats
- `getStats()` - Récupère toutes les stats
- `getStat(key)` - Récupère une stat spécifique
- `applyChanges(changes)` - Applique des modifications (Add/Sub/Set)

### ProfileManager

Gère le profil du joueur (traits, intérêts, objectifs, paramètres).

**Méthodes:**
- `initialize(profile)` - Initialise le profil
- `getProfile()` - Récupère le profil complet
- `applyTraitChanges(changes)` - Modifie les traits
- `applyInterestChanges(changes)` - Modifie les intérêts
- `applyGoalChanges(changes)` - Modifie les objectifs
- `applyPlayerParameterChanges(changes)` - Modifie les paramètres

### ChoiceProcessor

Traite les choix et applique les changements.

**Méthodes:**
- `computeChanges(changes)` - Calcule les changements sans les appliquer (preview)
- `applyChanges(changes)` - Applique les changements
- `applyChoiceAndStageChanges(choiceChanges, stageChanges)` - Applique choix + stage

### ConditionEvaluator

Évalue les conditions des choix et scénarios.

**Méthodes:**
- `evaluate(condition, stats, profile)` - Évalue une condition
- `isChoiceAvailable(condition, stats, profile)` - Vérifie si un choix est disponible
- `isScenarioAccessible(condition, stats, profile)` - Vérifie si un scénario est accessible

### SaveManager

Gère la persistance du jeu.

**Méthodes:**
- `save(...)` - Sauvegarde l'état du jeu
- `load()` - Charge une sauvegarde
- `clear()` - Efface la sauvegarde
- `hasSave()` - Vérifie si une sauvegarde existe

### HistoryManager

Gère l'historique des actions du joueur.

**Méthodes:**
- `initialize(history)` - Initialise l'historique
- `addEntry(entry)` - Ajoute une entrée
- `getHistory()` - Récupère tout l'historique
- `getLastEntry()` - Récupère la dernière entrée

## 🔄 Flow du jeu

```
1. Initialisation
   └─> GameEngine.initialize(scenario, stats, profile)
       ├─> Initialise StatsManager
       ├─> Initialise ProfileManager
       ├─> Charge sauvegarde (SaveManager)
       └─> Charge le stage actuel

2. Affichage d'un stage
   └─> GameEngine.getCurrentStage()
       └─> Filtre les choix disponibles (ConditionEvaluator)

3. Choix du joueur
   └─> GameEngine.handleChoice(choice)
       ├─> ChoiceProcessor.applyChanges(choice.changes)
       │   ├─> StatsManager.applyChanges(stats)
       │   ├─> ProfileManager.applyTraitChanges(traits)
       │   ├─> ProfileManager.applyInterestChanges(interests)
       │   └─> ProfileManager.applyGoalChanges(goals)
       ├─> HistoryManager.addEntry(...)
       ├─> Charge le stage suivant
       ├─> SaveManager.save(...) (auto-save)
       └─> Émet les événements (stateChanged, statsChanged, etc.)

4. Fin du jeu
   └─> Stage.isEnd = true
       ├─> SaveManager.clear()
       └─> Émet gameCompleted
```

## 📊 Événements

Le GameEngine émet les événements suivants:

- `stateChanged` - L'état du jeu a changé
- `statsChanged` - Les statistiques ont changé
- `profileChanged` - Le profil a changé
- `choiceMade` - Un choix a été effectué
- `stageChanged` - Le stage actuel a changé
- `gameCompleted` - Le jeu est terminé

## 🎯 Avantages de cette architecture

1. **Séparation des préoccupations** - La logique métier est séparée de React
2. **Testabilité** - Facile à tester sans composants React
3. **Réutilisabilité** - Peut être utilisé dans différents contextes (React, Node.js, etc.)
4. **Performance** - Les singletons évitent les re-créations inutiles
5. **Maintenabilité** - Code organisé et facile à comprendre
6. **Type-safety** - TypeScript avec types stricts

## 🔧 Migration depuis GameProvider

Pour migrer depuis l'ancien `GameProvider` React:

```typescript
// Avant
const { gameState, handleChoice, availableChoices } = useGameContext();

// Après
const { stats, profile, handleChoice, availableChoices } = useGameEngine();
```

Le hook `useGameEngine` offre une interface similaire mais utilise le GameEngine en arrière-plan.

## 📝 Notes

- Tous les managers sont des singletons - utilisez `.getInstance()`
- Le GameEngine gère automatiquement la sauvegarde après chaque choix
- Les événements permettent une réactivité fine sans dépendre de React
- Les méthodes `compute*` permettent de prévisualiser les changements sans les appliquer
