# ✅ Checklist Déploiement Vercel

## Avant de déployer

### Frontend
- [x] `frontend/package.json` avec tous les scripts
- [x] `frontend/dist/` se compile sans erreur
- [x] `.gitignore` configuré
- [x] Variables d'environnement (VITE_API_URL)
- [x] Logo MYC intégré
- [x] Tous les composants testés
- [x] Mode clair/sombre fonctionne
- [x] Multi-langue configuré (FR, EN, IT, ZH)

### Backend
- [x] `backend/requirements.txt` à jour
- [x] `backend/main.py` avec CORS configuré
- [x] `backend/Dockerfile` créé
- [x] `backend/.dockerignore` créé
- [x] `backend/fly.toml` pour Fly.io (optionnel)
- [x] Health check endpoint (`/health`)
- [x] Variables d'environnement (.env.example)

### Repository
- [x] `.gitignore` complet
- [x] `README.md` mis à jour
- [x] `DEPLOYMENT.md` créé
- [x] `VERCEL_SETUP.md` créé
- [x] `vercel.json` configuré
- [x] Code testé localement

## Déploiement Étape par étape

### 1. Initialiser Git et pousser le code
```bash
cd c:\Users\DELL\Desktop\py
git init
git add .
git commit -m "MYC AI Dashboard - Production ready"
git remote add origin https://github.com/VOTRE_USERNAME/myc-ai-dashboard.git
git push -u origin main
```

### 2. Déployer le Backend (Render ou Fly.io)

**Render:**
1. [ ] Aller sur https://render.com
2. [ ] Créer un nouveau Web Service
3. [ ] Connecter le repository GitHub
4. [ ] Configurer avec `render.yaml`
5. [ ] Ajouter les variables d'environnement
6. [ ] Déployer

**Fly.io (Alternatif):**
1. [ ] Installer Fly CLI
2. [ ] Exécuter `flyctl launch`
3. [ ] Configurer avec `backend/fly.toml`
4. [ ] Exécuter `flyctl deploy`

### 3. Déployer le Frontend (Vercel)
1. [ ] Aller sur https://vercel.com
2. [ ] Importer le repository GitHub
3. [ ] Sélectionner `frontend` comme root directory
4. [ ] Configurer les variables d'environnement:
   - `VITE_API_URL=https://myc-api-XXXX.render.com`
5. [ ] Déployer

### 4. Vérifier les déploiements
1. [ ] Frontend accessible sur Vercel
2. [ ] Backend accessible sur Render
3. [ ] CORS fonctionne (pas d'erreurs de cross-origin)
4. [ ] Upload de fichier fonctionne
5. [ ] Analyse IA fonctionne
6. [ ] Graphiques se chargent
7. [ ] Multi-langue fonctionne

## URLs Finales

```
Frontend: https://myc-ai-dashboard.vercel.app
Backend:  https://myc-ai-api.render.com
API Docs: https://myc-ai-api.render.com/docs
```

## Commandes utiles

### Git
```bash
# Vérifier le statut
git status

# Ajouter tous les fichiers
git add .

# Commiter les changements
git commit -m "Message du commit"

# Pousser vers GitHub
git push origin main
```

### Docker (local)
```bash
# Tester le build Docker
cd backend
docker build -f Dockerfile -t myc-api .
docker run -p 8000:8000 myc-api
```

## Problèmes courants et solutions

### ❌ CORS Error: Access to XMLHttpRequest denied
**Cause**: Frontend et backend sur des domaines différents
**Solution**: 
1. Vérifier `VITE_API_URL` sur Vercel
2. Vérifier CORS dans `backend/main.py`
3. Redéployer le frontend

### ❌ 404 Not Found sur l'API
**Cause**: URL de l'API incorrecte
**Solution**:
1. Copier l'URL correcte du backend Render
2. Mettre à jour `VITE_API_URL` sur Vercel
3. Forcer un re-build sur Vercel

### ❌ Database errors
**Cause**: SQLite n'est pas persistant sur Render/Fly
**Solution**: Utiliser PostgreSQL au lieu de SQLite

### ❌ Environment variables not found
**Cause**: Variables pas définies dans Vercel/Render
**Solution**: Ajouter les variables dans les settings

## Fichiers créés pour le déploiement

```
vercel.json           # Config Vercel
render.yaml           # Config Render
backend/Dockerfile    # Docker config
backend/.dockerignore # Docker ignore
backend/fly.toml      # Fly.io config
.gitignore            # Git ignore
DEPLOYMENT.md         # Guide détaillé
VERCEL_SETUP.md       # Instruction Vercel
requirements.txt      # Dépendances Python
```

## Support et Ressources

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Fly.io Docs: https://fly.io/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev

---

**Statut**: ✅ Prêt pour la production
**Date**: Mai 2026
**Version**: 1.0.0
