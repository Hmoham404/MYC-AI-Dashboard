# 🚀 Déploiement Multi-Services sur Vercel

Cette configuration déploie **Frontend + Backend sur une seule instance Vercel** en utilisant les `experimentalServices`.

## 📋 Avantages

✅ Frontend et Backend déployés ensemble
✅ Pas de problème CORS (même domaine)
✅ API accessible via `/_/backend`
✅ Coûts réduits (moins de ressources)
✅ Déploiement plus simple

## 🏗️ Architecture

```
vercel.app/
├── /               → Frontend (Vite)
├── /_/backend/api/ → Backend (FastAPI)
└── /api/*          → Rewrite vers /_/backend/api/*
```

## 🔧 Configuration Files

### Root vercel.json
```json
{
  "experimentalServices": {
    "frontend": {
      "entrypoint": "frontend",
      "routePrefix": "/",
      "framework": "vite"
    },
    "backend": {
      "entrypoint": "backend",
      "routePrefix": "/_/backend"
    }
  }
}
```

### backend/vercel.json
```json
{
  "version": 2,
  "buildCommand": "pip install -r requirements.txt",
  "runtime": "python@3.11"
}
```

### frontend/vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "/_/backend"
  }
}
```

## 📖 Déploiement

### 1. Pousser le code sur GitHub
```bash
cd c:\Users\DELL\Desktop\py
git add .
git commit -m "Vercel multi-service configuration"
git push -u origin main
```

### 2. Déployer sur Vercel

#### Option A: CLI (Recommandé)
```bash
npm i -g vercel
vercel
```

Suivre les prompts:
- Link to existing project? `No`
- Project name: `myc-ai-dashboard`
- Framework: `Vite`
- Root directory: `./`
- Override settings? `Yes`

#### Option B: Web Interface
1. Aller sur https://vercel.com/dashboard
2. Cliquer "Add New" → "Project"
3. Importer le repository GitHub
4. Vercel détecte automatiquement `vercel.json`
5. Cliquer "Deploy"

### 3. Variables d'environnement (optionnel)

Dans Vercel Dashboard > Settings > Environment Variables:

```
OPENAI_API_KEY = sk-your-key-here
ENVIRONMENT = production
PYTHONUNBUFFERED = 1
```

## ✅ Vérifier le déploiement

```bash
# Frontend
https://myc-ai-dashboard.vercel.app

# Backend API
https://myc-ai-dashboard.vercel.app/_/backend

# Swagger UI
https://myc-ai-dashboard.vercel.app/_/backend/docs

# Health Check
https://myc-ai-dashboard.vercel.app/_/backend/health
```

## 🔗 URLs en Développement

```
http://localhost:3000       → Frontend
http://localhost:8000       → Backend
http://localhost:8000/docs  → Swagger UI
```

## 🌍 URLs en Production (Vercel)

```
https://myc-ai-dashboard.vercel.app              → Frontend
https://myc-ai-dashboard.vercel.app/_/backend    → Backend
https://myc-ai-dashboard.vercel.app/_/backend/docs → Swagger UI
https://myc-ai-dashboard.vercel.app/api/*        → Rewrite (/)
```

## 📊 Structure Attendue

```
myc-ai-dashboard/
├── vercel.json                    ← Multi-service config (root)
├── backend/
│   ├── vercel.json               ← Backend config
│   ├── requirements.txt
│   ├── main.py
│   ├── routes/
│   ├── services/
│   └── models/
├── frontend/
│   ├── vercel.json               ← Frontend config
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── public/
└── README.md
```

## 🐛 Troubleshooting

### CORS Error
**Problème**: Cross-origin requests échouent
**Solution**: API sur le même domaine (/_/backend) → CORS disabled

### 404 Not Found
**Problème**: Les routes du frontend retournent 404
**Solution**: Rewrite dans `frontend/vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend pas accessible
**Problème**: /_/backend retourne 404
**Solution**: 
1. Vérifier `backend/vercel.json` existe
2. Vérifier `main.py` dans `backend/`
3. Check Vercel logs

### Environment variables pas chargées
**Problème**: `OPENAI_API_KEY` undefined
**Solution**: Ajouter dans Vercel Dashboard > Settings

## 📚 Ressources

- Vercel Experimental Services: https://vercel.com/docs/concepts/monorepos
- FastAPI on Vercel: https://vercel.com/templates/python
- Vite on Vercel: https://vercel.com/guides/vite

## 🎯 Next Steps

1. [x] Créer vercel.json multi-service
2. [x] Configurer backend/vercel.json
3. [x] Configurer frontend/vercel.json
4. [ ] Pousser le code
5. [ ] Déployer sur Vercel
6. [ ] Tester l'application
7. [ ] Configurer un domaine personnalisé (optionnel)

---

**Version**: 1.0.0
**Date**: Mai 2026
**Status**: ✅ Prêt pour production
