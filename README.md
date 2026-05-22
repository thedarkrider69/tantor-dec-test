# Tantor Déc — MVP local

Cette version est une version complète locale de démonstration.

Elle contient maintenant :

- création de compte et connexion ;
- base Prisma + SQLite ;
- gestion des entreprises ;
- gestion des exercices comptables ;
- saisie plus complète de liasse fiscale : 2050, 2051, 2052 ;
- contrôles d'anomalies ;
- génération d'un fichier `.edi` local de test ;
- envoi simulé ;
- paiement simulé et factures ;
- espace admin.

## Important

Le fichier EDI généré est un fichier local de test. Il n'est pas homologué DGFiP et ne doit pas être envoyé en production. Pour une vraie transmission, il faudra brancher Tantor Déc à un partenaire EDI habilité ou implémenter le cahier des charges officiel EDI-TDFC.

## Installation

Dans le dossier du projet :

```bash
npm install
```

Si `npm` n'est pas reconnu sur Windows, utilise :

```cmd
"C:\Program Files\nodejs\npm.cmd" install
```

## Initialiser la base

```bash
npx prisma@5.22.0 generate
npx prisma@5.22.0 db push
npm run setup
```

Sur Windows si `npm` n'est pas reconnu :

```cmd
npx prisma@5.22.0 generate
npx prisma@5.22.0 db push
"C:\Program Files\nodejs\npm.cmd" run setup
```

## Lancer le site

```bash
npm run dev
```

Ou sur Windows :

```cmd
"C:\Program Files\nodejs\npm.cmd" run dev
```

Ouvre ensuite :

```txt
http://localhost:3000
```

## Comptes de test

Utilisateur :

```txt
user@tantordec.fr
User123!
```

Admin :

```txt
admin@tantordec.fr
Admin123!
```

## Parcours de test pour les liasses

1. Connecte-toi avec `user@tantordec.fr`.
2. Va dans **Mes déclarations**.
3. Ouvre une déclaration ou crée-en une nouvelle.
4. Clique sur **Modifier la liasse**.
5. Remplis les formulaires 2050, 2051 et 2052.
6. Clique sur **Sauvegarder + contrôler**.
7. Retourne sur la déclaration.
8. Clique sur **Tester les anomalies**.
9. Si aucune anomalie n'est affichée, clique sur **Générer EDI local**.
10. Télécharge le fichier `.edi`.
11. Clique sur **Envoi simulé** puis continue vers le paiement simulé.

## Dossiers utilisateur locaux

Cette version crée maintenant un dossier physique par utilisateur dans :

```txt
storage/users/<email>_<id>/
```

Chaque dossier contient :

```txt
01-profil
02-entreprises
03-exercices
04-declarations
05-edi
06-factures
07-recus
08-support
```

Les fichiers EDI sont sauvegardés à deux endroits :

```txt
storage/users/<user>/05-edi/<fichier>.edi
storage/users/<user>/04-declarations/<entreprise>/<declaration>/edi/<fichier>.edi
```

Tu peux aussi les voir depuis l'application :

```txt
http://localhost:3000/app/fichiers
```

Pour déplacer le stockage ailleurs, ajoute cette variable dans `.env` :

```env
TANTOR_STORAGE_DIR="C:/TantorData"
```

## Module EDI-TDFC 2025

Cette version ajoute un module de génération **INFENT DF EDI-TDFC 2025 de test** :

- page catalogue : `/app/tdfc-2025`
- prévisualisation d’une déclaration : `/app/declarations/[id]/tdfc-2025`
- bouton “Générer INFENT DF 2025” sur la fiche déclaration
- fichier `.edi` téléchargeable depuis la fiche déclaration

Le générateur produit une structure de test avec :

- `UNB` accord d’interchange `PED-DGI-IN-TD2501`
- `UNG/UNH` version `FD2501`
- `BGM` document `IDF`
- `F-IDENTIF` : SIREN, ROF, période, EUR
- groupes `SEQ/IND` et segments `MOA` pour les formulaires 2050, 2051, 2052

Important : le fichier généré n’est pas homologué DGFiP. Pour la production, il faut un partenaire EDI habilité, une attestation de conformité valide, AUTACK réel et les tests DGFiP.

## Module EDI-TDFC 2025 enrichi

Cette version intègre le dictionnaire éditeurs TDFC 2024-2025 V2025.7 et les fichiers de structure `tdfc25d.edi` / `tdfc25f.edi`.

Pages ajoutées :

- `/app/tdfc-2025` : catalogue de génération INFENT DF de test.
- `/app/tdfc-2025/dictionnaire` : recherche dans le dictionnaire officiel intégré.

Le fichier généré reste un fichier de test non homologué. La transmission réelle DGFiP nécessite un partenaire EDI habilité, une attestation de conformité et la sécurisation AUTACK.
