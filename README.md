# Tantor Déc — version propre cahier des charges

Cette version repart de zéro côté interface en gardant le schéma Supabase/Prisma du projet.

Objectif : reproduire uniquement les écrans et parcours du cahier des charges :

- Page d’accueil
- Connexion, inscription, mot de passe oublié, OTP
- Tableau de bord client
- Mes Entreprises
- Comptabilité & FEC
- Mes Déclarations
- Documents fiscaux et anomalies
- Paiement, factures, mon compte, aide
- Prévisionnel
- Espace administrateur
- Déclarations, entreprises, utilisateurs, paiements, assistance, CGV

Les modules hors cahier des charges ont été retirés de l’interface : Requêtes LOC, page dictionnaire TDFC brute, Mes fichiers techniques.

## Lancer en local

```bash
npm install
npm run dev
```

Comptes de démonstration :

- user@tantordec.fr / User123!
- admin@tantordec.fr / Admin123!
- partenaire@tantordec.fr / Partenaire123!

L’interface fonctionne en mode démonstration afin d’éviter les erreurs liées aux variables Supabase pendant la validation visuelle. Le fichier `prisma/schema.prisma` est conservé pour garder la structure Supabase.
