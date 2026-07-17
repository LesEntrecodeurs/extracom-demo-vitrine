# Contact

## Informations generales
- **Nom** : Contact
- **Route** : /contact
- **Type** : editorial
- **Indexation** : index

## Objectifs
- Fournir les coordonnees Wedis
- Permettre aux clients connectes d ouvrir un ticket support
- Orienter l anonyme vers la connexion

## Structure
1. Coordonnees : adresse, telephone, email, horaires
2. Formulaire ticket (si connecte) / Invitation connexion (si anonyme)
3. FAQ

## Composants
- ContactForm (ticket support, connecte uniquement)
- AuthGate (si anonyme)
- JsonLd (ContactPage)
