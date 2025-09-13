# LinkedScraper - Alternative Simple à Phantombuster

🚀 **Extraction de profils LinkedIn + Enrichissement d'emails en un clic**

## 🎯 Fonctionnalités

- ✅ Extraction de profils LinkedIn depuis une URL de recherche
- ✅ Enrichissement automatique des emails via Hunter.io
- ✅ Export CSV en un clic
- ✅ Interface simple et moderne
- ✅ Plans tarifaires transparents (pas de crédits complexes)
- ✅ Limites mensuelles claires

## 📦 Stack Technique

- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: Supabase
- **Scraping**: Puppeteer
- **Enrichissement**: Hunter.io API
- **Paiements**: Stripe
- **Déploiement**: Vercel

## 🚀 Installation Rapide

### 1. Cloner le projet

```bash
git clone [votre-repo]
cd linkedscraper
npm install
```

### 2. Configuration Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans SQL Editor et exécutez le script `database-schema.sql`
4. Récupérez vos clés API dans Settings > API

### 3. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service

# Hunter.io (pour l'enrichissement d'emails)
HUNTER_API_KEY=votre_cle_hunter

# Stripe (pour les paiements)
STRIPE_SECRET_KEY=votre_cle_secrete_stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre_cle_publique_stripe
STRIPE_WEBHOOK_SECRET=votre_webhook_secret

# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generer_une_cle_secrete_aleatoire
```

### 4. Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 💰 Plans Tarifaires

| Plan | Prix | Extractions/mois | Emails/mois |
|------|------|------------------|-------------|
| **Starter** | 19€/mois | 1,000 profils | 100 emails |
| **Pro** | 49€/mois | 5,000 profils | 500 emails |
| **Agency** | 99€/mois | 20,000 profils | 2,000 emails |

## 🛠️ Structure du Projet

```
src/
├── pages/
│   ├── api/
│   │   ├── scrape.js       # API de scraping LinkedIn
│   │   ├── enrich.js       # API d'enrichissement emails
│   │   ├── export.js       # API d'export CSV
│   │   ├── usage.js        # API de suivi d'usage
│   │   └── webhook.js      # Webhook Stripe
│   ├── index.js            # Dashboard principal
│   ├── landing.js          # Page d'accueil
│   ├── login.js            # Page de connexion
│   └── pricing.js          # Page de tarification
├── components/
│   ├── ScrapingForm.js     # Formulaire d'extraction
│   ├── ResultsTable.js     # Tableau des résultats
│   ├── ExportButton.js     # Bouton d'export
│   └── UsageStats.js       # Statistiques d'usage
└── lib/
    ├── scraper.js          # Logique de scraping
    ├── enricher.js         # Logique d'enrichissement
    └── supabase.js         # Configuration Supabase
```

## 📝 Utilisation

1. **Connexion**: Créez un compte ou connectez-vous
2. **Coller l'URL**: Collez une URL de recherche LinkedIn
3. **Extraction**: Cliquez sur "Extraire les Profils"
4. **Enrichissement** (optionnel): Cliquez sur "Enrichir les emails"
5. **Export**: Téléchargez les résultats en CSV

## 🚀 Déploiement sur Vercel

1. Connectez votre repo GitHub à Vercel
2. Ajoutez les variables d'environnement
3. Déployez en un clic

```bash
vercel --prod
```

## 🔒 Sécurité

- ✅ Authentification via Supabase Auth
- ✅ Row Level Security (RLS) activé
- ✅ API sécurisées avec tokens JWT
- ✅ Limites de taux pour éviter les abus
- ✅ Headers réalistes pour éviter la détection

## 📈 Roadmap

### Phase 1 (Semaines 1-2) ✅
- [x] MVP fonctionnel
- [x] Scraping LinkedIn basique
- [x] Enrichissement emails
- [x] Export CSV
- [x] 3 plans tarifaires

### Phase 2 (Semaines 3-4)
- [ ] Extension Chrome
- [ ] Templates de recherche
- [ ] Export formats multiples (Excel, JSON)
- [ ] Webhook pour intégrations

### Phase 3 (Mois 2)
- [ ] Intégration CRM (HubSpot, Pipedrive)
- [ ] Analytics dashboard
- [ ] API publique
- [ ] Bulk operations

### Phase 4 (Mois 3)
- [ ] IA pour scoring de leads
- [ ] Outreach automatisé
- [ ] Séquences d'emails
- [ ] A/B testing

## 🤝 Support

- Email: support@linkedscraper.com
- Documentation: [docs.linkedscraper.com](https://docs.linkedscraper.com)
- Discord: [Rejoindre la communauté](https://discord.gg/linkedscraper)

## 📄 Licence

MIT License - Utilisez librement pour vos projets

---

**LinkedScraper** - L'alternative simple et efficace à Phantombuster 🚀
# Google Maps Places Scraper

Une application web moderne pour extraire des données d'établissements (restaurants, hôtels, supermarchés, etc.) avec export CSV/JSON.

## 🚀 Fonctionnalités

- **Recherche d'établissements** : Restaurants, supermarchés, hôtels, pharmacies, etc.
- **Recherche par ville** : Paris, Lyon, Marseille, Nice, et plus
- **Export des données** : CSV et JSON
- **Interface moderne** : Design responsive avec Tailwind CSS
- **Authentification** : Système de connexion avec Supabase
- **Limites d'utilisation** : Gestion des quotas mensuels

## 📋 Prérequis

- Node.js 18+
- Compte Supabase (gratuit)
- NPM ou Yarn

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone https://github.com/kapeupro/scrap.git
cd scrap
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**

Copier le fichier `.env.example` en `.env.local` :
```bash
cp .env.example .env.local
```

Puis remplir les variables avec vos clés Supabase :
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique anonyme
- `SUPABASE_SERVICE_ROLE_KEY` : Clé de service (privée)

4. **Configurer la base de données Supabase**

Exécuter le script SQL `database-schema-simple.sql` dans l'éditeur SQL de Supabase.

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 🎯 Utilisation

1. **Créer un compte** : Inscription via email/mot de passe
2. **Se connecter** : Connexion avec vos identifiants
3. **Rechercher** : Entrer un type d'établissement et une ville
4. **Exporter** : Télécharger les résultats en CSV ou JSON

## 🏗️ Technologies utilisées

- **Frontend** : Next.js 14, React, Tailwind CSS
- **Backend** : API Routes Next.js
- **Base de données** : Supabase (PostgreSQL)
- **API de données** : OpenStreetMap Overpass API
- **Authentification** : Supabase Auth

## 📝 Structure du projet

```
scrap/
├── components/          # Composants React
├── lib/                # Utilitaires et API
├── pages/              # Pages Next.js
│   ├── api/           # API Routes
│   └── index.js       # Page principale
├── styles/            # Styles CSS
└── database-schema-simple.sql  # Schéma de base de données
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 👨‍💻 Auteur

Développé avec ❤️ par [kapeupro](https://github.com/kapeupro)
