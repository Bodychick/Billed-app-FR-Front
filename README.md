## L'architecture du projet :

Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

## Organiser son espace de travail :

Pour une bonne organization, vous pouvez créer un dossier bill-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Clonez le projet backend dans le dossier bill-app :

```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

```
bill-app/
   - Billed-app-FR-Back
```

Clonez le projet frontend dans le dossier bill-app :

```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
```

```
bill-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Front
```

## Comment lancer l'application en local ?

### étape 1 - Lancer le backend :

Suivez les indications dans le README du projet backend.

### étape 2 - Lancer le frontend :

Allez au repo cloné :

```
$ cd Billed-app-FR-Front
```

Installez les packages npm (décrits dans `package.json`) :

```
$ npm install
```

Installez live-server pour lancer un serveur local :

```
$ npm install -g live-server
```

Lancez l'application :

```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`

## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur :

```
utilisateur : admin@test.tld
mot de passe : admin
```

### employé :

```
utilisateur : employee@test.tld
mot de passe : employee
```

🎯 Débugger une application web

📦Livrable : Lien vers la codebase à jour sur un repo GitHub public avec bugs corrigés.
❒ Les tests unitaires du parcours employé passent sans erreur.
❒ Les 4 bugs identifiés dans le kanban ont été corrigés.
❒ Le code ajouté respecte l’architecture src/views pour l’UI, src/containers pour les handlers et les fetch de données.

🎯 Écrire des tests unitaires avec JavaScript

📦Livrables :
Un screenshot avec le rapport de tests Jest sur l’ensemble des fichiers d’UI (src/views) et des fichiers d’UX (src/containers).
Un screenshot du rapport de couverture Jest.
❒ Tout le code est testé (en dehors des appels au back-end) et le taux global de couverture est de 80 % minimum (regarder le détail dbu rapport de couverture Jest pour s’en assurer).
❒ Les tests n’ont pas de dépendance avec d’autres unités.
❒ Tous les tests passent sans erreurs.
❒ Les tests sont dans le dossier **tests** .
❒ Les tests sont structurés de la manière suivante :
❒ nom du composant ;
❒ condition ou expression testée et écrite de manière à ce qu’elle soit compréhensible par un product owner ;
❒ description du comportement attendu.

🎯 Écrire des tests d’intégration avec JavaScript

📦Livrables :
Un screenshot avec le rapport de tests Jest sur l’ensemble des fichiers d’UI (src/views) et des fichiers d’UX (src/containers).
Un screenshot du rapport de couverture Jest.
❒ Il y a un test d’intégration sur la route POST pour ajouter une nouvelle note de frais.
❒ Il y a un mock de l’appel API POST.
❒ Il y a un mock des erreurs 404 et 500.
❒ Tous les tests passent sans erreur.
❒ Les mocks sont dans le dossier **mocks**.
❒ Les mocks sont importés dans les fichiers de test du composant testé.

🎯 Rédiger un plan de test E2E manuel

📦Livrable : Un document au format PDF du plan E2E pour le parcours employé.
❒ Tous les scénarios de navigation du parcours employé sont décrits : voici une liste des scénarios que l’étudiant devra décrire. Il est attendu au moins 10 de ces 15 scénarios.
❒ Il permet de tester manuellement le fonctionnement de l’appel API get bills .
❒ Il permet de tester manuellement le fonctionnement de l’appel API post new bill .
❒ Il reprend la même forme que le document E2E du parcours administrateur (Scénario n°i, instructions “Given”, “When” et “Then”).
