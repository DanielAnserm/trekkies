# Trekkie - Jeu de simulation de parcours professionnel

Une application interactive de simulation de parcours professionnel pour guider les jeunes vers leur "Summit".

## 🎮 Fonctionnalités

- 🎯 **Système de profils** : Deux profils de joueurs distincts (Jeune migrant, Bénéficiaire CSR)
- 📝 **Scénarios interactifs** : Choix multiples avec conséquences sur les statistiques
- 🏆 **Système de progression** : 4 catégories (Orientation, Validation, Renforcement, Sélection)
- 📊 **Statistiques du joueur** : Character, Skills, Context, Experience
- 🎖️ **Trophées et badges** : Système de déblocage progressif
- 📱 **Scanner QR** : Accès aux scénarios via codes QR
- 🌐 **Internationalisation** : Support i18next (actuellement en français)
- 👥 **Classement** : Leaderboard avec scores et statistiques
- 💾 **Sauvegarde** : Persistance de la progression du joueur

## 🚀 Démarrage rapide

### Installation

Installer les dépendances :

```bash
npm install
```

### Développement

Lancer le serveur de développement :

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`.

### Build de production

Créer un build de production :

```bash
npm run build
```

## 🏗️ Architecture

```
Trekkie/
├── app/                          # Code source de l'application
│   ├── domain/                   # Logique métier
│   │   ├── entities/             # Entités du domaine
│   │   └── valueObjects/         # Value objects
│   ├── infrastructure/           # Couche infrastructure
│   │   ├── repositories/         # Repositories (Firebase, localStorage)
│   │   └── utils/                # Utilitaires
│   ├── application/              # Couche application
│   │   └── gameEngine/           # Moteur de jeu
│   ├── presentation/             # Composants UI
│   ├── i18n/                     # Configuration i18next
│   └── locales/                  # Fichiers de traduction
├── public/
│   └── api/                      # Fichiers JSON de configuration
│       ├── scenarios/            # scenarios.json
│       ├── category/             # categories.json
│       └── profiles/             # profiles.json
└── README.md
```

## 🛠️ Technologies

### Frontend
- **React 19** : Bibliothèque UI
- **React Router 7** : Routage et SSR
- **TypeScript** : Typage statique
- **TailwindCSS 4** : Styling
- **Framer Motion** : Animations
- **HeroUI** : Composants UI
- **Heroicons** : Icônes

### Backend & Services
- **Firebase** : Base de données (Firestore, Realtime DB), authentification, storage et hosting
- **Vite** : Build tool et dev server

### Internationalisation & Data
- **i18next** : Gestion des traductions
- **React Markdown** : Affichage de contenu markdown
- **React QR Scanner** : Lecture de codes QR

### Testing
- **Vitest** : Framework de tests
- **Testing Library** : Tests de composants React

---

## ⚙️ Configuration des variables d'environnement

### 📋 Variables requises

L'application utilise les variables d'environnement suivantes (préfixées par `VITE_` pour être accessibles côté client) :

#### Firebase Configuration
- `VITE_FIREBASE_API_KEY` : Clé API Firebase (SECRET)
- `VITE_FIREBASE_AUTH_DOMAIN` : Domaine d'authentification Firebase
- `VITE_FIREBASE_PROJECT_ID` : ID du projet Firebase
- `VITE_FIREBASE_STORAGE_BUCKET` : Bucket de stockage Firebase
- `VITE_FIREBASE_MESSAGING_SENDER_ID` : ID d'envoi de messages Firebase
- `VITE_FIREBASE_DATABASE_URL` : URL de la base de données Firebase Realtime

#### Application Configuration
- `VITE_APP_VERSION` : Version de l'application (générée automatiquement par GitVersion en CI/CD)
- `VITE_SCENARIO_API_PATH` : Chemin vers le fichier scenarios.json (défaut: `/api/scenarios/scenarios.json`)
- `VITE_CATEGORIES_API_PATH` : Chemin vers le fichier categories.json (défaut: `/api/category/categories.json`)
- `VITE_PROFILES_API_PATH` : Chemin vers le fichier profiles.json (défaut: `/api/profiles/profiles.json`)
- `VITE_ENDGAME_REDIRECTTO` : URL de redirection en fin de jeu
- `VITE_JOBTREKURI` : URI du site Jobtrek

### 🔧 Setup en développement local

1. **Créer un fichier `.env`** à la racine du projet :

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Application Configuration
VITE_APP_VERSION=dev
VITE_SCENARIO_API_PATH=/api/scenarios/scenarios.json
VITE_CATEGORIES_API_PATH=/api/category/categories.json
VITE_PROFILES_API_PATH=/api/profiles/profiles.json
VITE_ENDGAME_REDIRECTTO=https://jk-sphere.vercel.app/?trajectory=J0145
VITE_JOBTREKURI=https://jobtrek.ch/
```

2. **Obtenir les credentials Firebase** :
   - Se connecter à la [Console Firebase](https://console.firebase.google.com/)
   - Sélectionner le projet Trekkie
   - Aller dans **Paramètres du projet** > **Général**
   - Copier les valeurs de configuration

3. **Démarrer l'application** :

```bash
npm run dev
```

### 🚀 Setup pour les pipelines CI/CD (GitHub Actions)

#### Secrets GitHub (valeurs sensibles)

Configurer dans **Settings** > **Secrets and variables** > **Actions** > **Secrets** :

- `FIREBASE_API_KEY` : Clé API Firebase
- `FIREBASE_SERVICE_ACCOUNT_KEY` : Clé de compte de service Firebase pour le déploiement

#### Variables GitHub (valeurs publiques)

Configurer dans **Settings** > **Secrets and variables** > **Actions** > **Variables** :

- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_DATABASE_URL`

#### Exemple d'utilisation dans un workflow

```yaml
- name: Build de l'application
  run: npm run build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ vars.FIREBASE_AUTH_DOMAIN }}
    VITE_FIREBASE_PROJECT_ID: ${{ vars.FIREBASE_PROJECT_ID }}
    VITE_FIREBASE_STORAGE_BUCKET: ${{ vars.FIREBASE_STORAGE_BUCKET }}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ vars.FIREBASE_MESSAGING_SENDER_ID }}
    VITE_FIREBASE_DATABASE_URL: ${{ vars.FIREBASE_DATABASE_URL }}
    VITE_APP_VERSION: ${{ env.GitVersion_FullSemVer }}
```

### 📝 Utilisation dans le code

Les variables d'environnement sont accessibles via `import.meta.env` :

```typescript
// Exemple dans firebase.ts
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // ...
};
```

### ⚠️ Sécurité

- ❌ **Ne jamais committer le fichier `.env`** (déjà dans `.gitignore`)
- ✅ Utiliser des **secrets GitHub** pour les valeurs sensibles
- ✅ Utiliser des **variables GitHub** pour les valeurs non-sensibles
- ✅ Préfixer toutes les variables par `VITE_` pour qu'elles soient exposées au client

---

## Configuration des fichiers JSON

### Vue d'ensemble

Trekkie utilise trois fichiers JSON principaux pour configurer le contenu du jeu :

- **scenarios.json** : Définit tous les scénarios interactifs du jeu
- **categories.json** : Organise les scénarios par catégories avec leurs prérequis
- **profiles.json** : Configure les profils de joueurs disponibles

### 📋 Structure des fichiers

#### 1. Scénarios (`public/api/scenarios/scenarios.json`)

Ce fichier contient tous les scénarios interactifs que les joueurs peuvent rencontrer.

**Structure d'un scénario :**

```json
{
  "scenarios": [
    {
      "id": "orientation_quiz_migrant",
      "title": "Quiz d'orientation - Jeune migrant",
      "description": "Description du scénario",
      "image": null,
      "traits": {},
      "showIntro": true,
      "interests": [],
      "goals": [
        {
          "name": "CFC Peintre",
          "conditions": {
            "minStats": {
              "peintre": 3
            }
          },
          "weight": 10
        }
      ],
      "stages": {
        "start": {
          "title": "Question 1",
          "description": "Description de l'étape",
          "choices": [
            {
              "text": "Texte du choix",
              "next": "q2",
              "changes": {
                "playerParameters": {
                  "peintre": {
                    "type": "add",
                    "value": 1
                  }
                }
              }
            }
          ]
        }
      }
    }
  ]
}
```

**Propriétés principales :**

- `id` (string) : Identifiant unique du scénario
- `title` (string) : Titre affiché au joueur
- `description` (string) : Description du scénario
- `image` (string|null) : Chemin vers l'image du scénario
- `traits` (object) : Traits de personnalité associés
- `showIntro` (boolean) : Afficher ou non l'introduction
- `interests` (array) : Liste des centres d'intérêt
- `goals` (array) : Objectifs professionnels possibles
  - `name` : Nom de l'objectif (ex: "CFC Peintre")
  - `conditions` : Conditions pour débloquer cet objectif
    - `minStats` : Statistiques minimales requises
  - `weight` : Poids pour la sélection aléatoire

**Stages (étapes du scénario) :**

Chaque scénario contient un objet `stages` avec différentes étapes :

- `title` : Titre de l'étape
- `description` : Texte affiché au joueur
- `choices` : Array de choix possibles
  - `text` : Texte du choix affiché
  - `next` : ID de la prochaine étape
  - `changes` : Modifications des stats/paramètres
    - `playerParameters` : Changements de paramètres
    - `stats` : Changements de statistiques (character, skills, context, experience)
    - `trophies` : Trophées débloqués

**Types de changements :**

```json
"changes": {
  "playerParameters": {
    "nom_parametre": {
      "type": "add",      // Opération : "add", "set", "subtract"
      "value": 1          // Valeur à appliquer
    }
  },
  "stats": {
    "character": 2,       // Modification directe
    "skills": 1
  },
  "trophies": ["validation"]  // Trophées à débloquer
}
```

#### 2. Catégories (`public/api/category/categories.json`)

Organise les scénarios en catégories avec leurs prérequis.

**Structure :**

```json
{
  "categories": {
    "orientation": {
      "prerequisites": {
        "condition": "",
        "trophies": []
      },
      "scenarios": [
        {
          "key": "orientation_quiz_migrant",
          "version": "1.0",
          "condition": "$profileId == migrant"
        }
      ]
    }
  }
}
```

**Propriétés :**

- `prerequisites` : Prérequis pour accéder à la catégorie
  - `condition` : Expression conditionnelle (peut être vide)
  - `trophies` : Array de trophées requis
- `scenarios` : Liste des scénarios dans cette catégorie
  - `key` : ID du scénario (doit correspondre à un ID dans scenarios.json)
  - `version` : Version du scénario
  - `condition` : Expression conditionnelle pour afficher ce scénario

**Catégories disponibles :**

- `orientation` : Quiz d'orientation initial
- `validation` : Stages de validation
- `renforcement` : Stages de perfectionnement
- `selection` : Étape de sélection finale

**Expressions conditionnelles :**

Les conditions utilisent une syntaxe d'expression simple :

```
$profileId == migrant                    // Égalité
_validationStep > 1                      // Comparaison numérique
_validationStep < 5 && $profileId == migrant  // ET logique
(_validationStep == 4 && $profileId == beneficiaire_CSR) || (_validationStep == 5)  // OU logique
```

Variables disponibles :
- `$profileId` : ID du profil du joueur
- `_validationStep` : Étape de validation actuelle
- `_validationUnlock` : État de déverrouillage
- `_goal` : Objectif professionnel choisi
- `_reorientationDone` : Réorientation effectuée
- `context` : Statistique de contexte

#### 3. Profils (`public/api/profiles/profiles.json`)

Définit les profils de joueurs disponibles.

**Structure :**

```json
{
  "profiles": [
    {
      "id": "migrant",
      "name": "Jeune migrant",
      "weight": 50,
      "initialStats": {
        "context": 1,
        "character": 0,
        "skills": 0,
        "experience": 0
      },
      "randomDistribution": {
        "remaining": 3,
        "stats": ["character", "skills"]
      },
      "description": {
        "title": "Ton profil : Jeune migrant",
        "content": "Description du profil...",
        "continueButton": "Commencer l'aventure"
      }
    }
  ]
}
```

**Propriétés :**

- `id` (string) : Identifiant unique du profil
- `name` (string) : Nom affiché du profil
- `weight` (number) : Poids pour la sélection aléatoire (plus élevé = plus de chances)
- `initialStats` : Statistiques initiales du joueur
  - `character` : Caractère (personnalité, réactions)
  - `skills` : Compétences (aptitudes acquises)
  - `context` : Contexte (environnement, situation)
  - `experience` : Expérience (apprentissage terrain)
- `randomDistribution` : Distribution aléatoire de points
  - `remaining` : Nombre de points à distribuer
  - `stats` : Array des stats qui peuvent recevoir ces points
- `description` : Texte de présentation du profil
  - `title` : Titre de la description
  - `content` : Contenu détaillé (supporte \n pour retours à la ligne)
  - `continueButton` : Texte du bouton de continuation

**Statistiques du joueur :**

Les 4 statistiques principales :

1. **Character (Caractère)** : Personnalité, réactions, adaptabilité
2. **Skills (Compétences)** : Aptitudes sociales, émotionnelles, techniques
3. **Context (Contexte)** : Environnement familial, situation personnelle
4. **Experience** : Apprentissage sur le terrain, stages

---

## Traductions i18next

### Configuration

L'application utilise [i18next](https://www.i18next.com/) pour gérer les traductions.

**Configuration principale** (`app/i18n/i18n.ts`) :

```typescript
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "~/locales/fr";

i18next.use(initReactI18next).init({
    fallbackLng: "fr",           // Langue par défaut
    resources: {
        fr                        // Ressources de traduction
    },
    defaultNS: "common",          // Namespace par défaut
    debug: import.meta.env.DEV,  // Mode debug en développement
    interpolation: {
        escapeValue: false,       // React échappe déjà les valeurs
    },
});
```

### Structure des fichiers de traduction

**Emplacement** : `app/locales/fr/common.json`

**Organisation par namespace :**

```json
{
  "home": {
    "title": "Bienvenue {{pseudo}} !",
    "description": "Scanne un code QR...",
    "scanButton": "Scanner un QR Code"
  },
  "profile": {
    "title": "👤 {{pseudo}}",
    "statistics": {
      "character": "Caractère",
      "skills": "Compétences"
    }
  }
}
```

### Utilisation dans le code

**Import et utilisation :**

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("home.title", { pseudo: "Joueur" })}</h1>
      <p>{t("home.description")}</p>
    </div>
  );
}
```

**Avec interpolation de variables :**

```typescript
// Dans common.json:
{
  "welcome": "Bienvenue {{name}} !"
}

// Dans le composant:
t("welcome", { name: "Marie" })  // → "Bienvenue Marie !"
```

**Pluralisation :**

```json
{
  "interests_one": "💡 Centre d'intérêt",
  "interests_other": "💡 Centres d'intérêt",
  "redirectionCountdown_zero": "Redirection en cours",
  "redirectionCountdown_one": "Redirection dans {{count}} seconde",
  "redirectionCountdown_other": "Redirection dans {{count}} secondes"
}
```

```typescript
t("interests", { count: 1 })  // → "💡 Centre d'intérêt"
t("interests", { count: 3 })  // → "💡 Centres d'intérêt"
```

### Namespaces disponibles

**common** : Traductions communes à toute l'application

Sections principales :
- `home` : Page d'accueil
- `login` / `firstLogin` : Connexion
- `profile` : Profil joueur
- `scenario` : Scénarios
- `qr` : Scanner QR
- `leaderboard` : Classement
- `trophy` : Trophées et badges
- `caracteristiques_joueur` : Caractéristiques
- `endGame` : Fin de jeu
- `common` : Éléments réutilisables

### Ajouter une nouvelle traduction

1. **Ajouter la clé dans `app/locales/fr/common.json`** :

```json
{
  "newSection": {
    "title": "Mon nouveau titre",
    "description": "Ma nouvelle description"
  }
}
```

2. **Utiliser dans un composant** :

```typescript
const { t } = useTranslation();

<h1>{t("newSection.title")}</h1>
<p>{t("newSection.description")}</p>
```

### Bonnes pratiques

1. **Organisation hiérarchique** : Grouper les traductions par feature/page
2. **Clés descriptives** : Utiliser des clés explicites (`home.scanButton` plutôt que `btn1`)
3. **Interpolation** : Utiliser `{{variable}}` pour les valeurs dynamiques
4. **Pluralisation** : Suffixer avec `_one`, `_other`, `_zero` pour les pluriels
5. **Markdown** : Les descriptions supportent `\n` pour les retours à la ligne et markdown dans certains contextes

### Ajouter une nouvelle langue

1. Créer un nouveau dossier : `app/locales/en/`
2. Créer `common.json` avec les mêmes clés que `fr/common.json`
3. Créer un fichier d'index : `app/locales/en/index.ts`

```typescript
import common from "./common.json";

export default {
  common
};
```

4. Importer dans `app/i18n/i18n.ts` :

```typescript
import fr from "~/locales/fr";
import en from "~/locales/en";

i18next.use(initReactI18next).init({
    fallbackLng: "fr",
    resources: {
        fr,
        en  // Nouvelle langue
    },
    // ...
});
```

---

## 📝 Contribution

Pour contribuer au projet :

1. Créer une nouvelle branche pour votre feature
2. Modifier les fichiers nécessaires
3. Tester vos modifications
4. Créer une pull request avec une description claire

## 📄 Licence

Ce projet est développé pour Jobtrek.

---

**Trekkie** - Guidez les jeunes vers leur Summit professionnel 🏔️
