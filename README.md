# 📦 Warehouse Management

Une application mobile intuitive pour simplifier la gestion des stocks en magasin.

## 📖 Description

Cette application permet aux magasiniers de gérer les stocks en temps réel via un scanner de code-barres ou une saisie manuelle, facilitant ainsi l'ajout, le retrait et le suivi des produits.

## ✨ Fonctionnalités

- **Authentification** : Accès sécurisé avec un code secret personnel.
- **Gestion des produits** :
  - Scanner de code-barres intégré (`expo-barcode-scanner`).
  - Saisie manuelle en cas de besoin.
  - Vérification automatique dans la base de données.
  - Ajout de nouveaux produits via un formulaire interactif.
- **Liste des produits** :
  - Affichage détaillé (nom, type, prix, quantité, état du stock).
  - Indicateurs visuels pour le réapprovisionnement.
- **Fonctionnalités avancées** :
  - Filtrage et recherche par nom, type, prix ou fournisseur.
  - Tri dynamique par prix, nom ou quantité.
- **Statistiques et résumé des stocks** :
  - Tableau de bord avec des indicateurs clés (total produits, villes, ruptures de stock, valeur totale, produits ajoutés/retirés récemment).
- **Sauvegarde et export des données** :
  - Exporter des rapports en PDF (`expo-print`).

## 🛠️ Configuration backend

1. Déplacez-vous vers le répertoire contenant `db.json`.
2. Installez `json-server` globalement : `npm i -g json-server`.
3. Démarrez le serveur avec : `npx json-server db.json`.

Pour plus d'informations, consultez [json-server sur npm](https://www.npmjs.com/package/json-server).

---

# Warehouse-Management
