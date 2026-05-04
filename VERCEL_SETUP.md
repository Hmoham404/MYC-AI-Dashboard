# 🚀 Déploiement sur Vercel

Ce guide couvre le déploiement de MYC AI Dashboard sur Vercel pour le frontend et Render pour le backend.

## 📋 Pré-déploiement - Checklist

- [x] `requirements.txt` créé
- [x] `.gitignore` configuré
- [x] `vercel.json` configuré
- [x] CORS configuré pour la production
- [x] `Dockerfile` créé pour le backend
- [x] Variables d'environnement définies

## 1️⃣ Préparer le repository GitHub

### Créer un repository GitHub

```bash
cd c:\Users\DELL\Desktop\py
git init
git add .
git commit -m "MYC AI Dashboard - Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/myc-ai-dashboard.git
git branch -M main
git push -u origin main
```

## 2️⃣ Déployer le Frontend sur Vercel

### Étape 1: Connecter Vercel

1. Aller sur https://vercel.com
2. Cliquer "Create Git Repository"
3. Choisir "GitHub" et connecter votre compte
4. Sélectionner le repository `myc-ai-dashboard`

### Étape 2: Configurer le projet

1. **Import Project**
   - Root Directory: Leave empty (or select `frontend`)
   - Framework Preset: `Vite`

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   - Ajouter: `VITE_API_URL` = `https://myc-api-VOTRE_NOM.render.com`

### Étape 3: Déployer

```
Cliquer "Deploy"
```

✅ Frontend disponible à: `https://myc-ai-dashboard.vercel.app`

## 3️⃣ Déployer le Backend sur Render

### Étape 1: Préparer le code

S'assurer que:
- `backend/requirements.txt` existe ✓
- `backend/Dockerfile` existe ✓
- Variables d'environnement configurées

### Étape 2: Créer un service Render

1. Aller sur https://render.com
2. Cliquer "Create New" > "Web Service"
3. Connecter votre repository GitHub

### Étape 3: Configurer le service

1. **Repository Settings**
   - Repository: `myc-ai-dashboard`
   - Branch: `main`

2. **Service Settings**
   - Name: `myc-ai-api`
   - Environment: `Docker`
   - Region: `Frankfurt (EU Central)`
   - Plan: `Free` (ou `Paid`)

3. **Build Command**
   ```
   docker build -f backend/Dockerfile -t myc-api .
   ```

4. **Start Command**
   ```
   cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
   ```

5. **Environment Variables**
   ```
   ENVIRONMENT=production
   OPENAI_API_KEY=sk-your-key-here
   FRONTEND_URL=https://myc-ai-dashboard.vercel.app
   ```

### Étape 4: Déployer

```
Cliquer "Create Web Service"
```

✅ Backend disponible à: `https://myc-ai-api.render.com`

## 4️⃣ Connecter Frontend et Backend

### Sur Vercel Dashboard

1. Aller à Project Settings > Environment Variables
2. Mettre à jour `VITE_API_URL` avec l'URL Render:
   ```
   VITE_API_URL=https://myc-ai-api.render.com
   ```
3. Redéployer le frontend

## 5️⃣ Tester l'application

1. Ouvrir https://myc-ai-dashboard.vercel.app
2. Uploader un fichier CSV/XLSX
3. Vérifier les analyses et graphiques
4. Tester les sélecteurs de langue

## 🔧 Troubleshooting

### Frontend ne se déploie pas
- Vérifier la logs Vercel
- S'assurer que `package.json` existe dans `frontend/`

### Backend CORS error
- Vérifier `VITE_API_URL` dans Vercel
- Vérifier la configuration CORS dans `backend/main.py`

### API calls fail
- Vérifier que le backend est en train de tourner sur Render
- Vérifier les logs Render

### Database issues
- Render utilise `/tmp` qui est réinitialisé
- Considérer une solution de base de données externe

## 📊 URLs Finales

- **Frontend**: https://myc-ai-dashboard.vercel.app
- **Backend API**: https://myc-ai-api.render.com
- **Swagger UI**: https://myc-ai-api.render.com/docs

## 💡 Optimisations supplémentaires

### 1. Ajouter une vraie base de données

Render offre PostgreSQL gratuitement (limite de ressources).

```bash
pip install psycopg2-binary sqlalchemy
```

### 2. Configurer un domaine personnalisé

Sur Vercel et Render, vous pouvez lier un domaine personnalisé.

### 3. Ajouter du monitoring

- Vercel Analytics
- Render Logs
- Sentry pour les erreurs

### 4. Optimiser les performances

- Compresser les images (frontend)
- Ajouter du caching (backend)
- Utiliser un CDN (Vercel intégré)

## 📝 Prochaines étapes

1. [ ] Pousser le code sur GitHub
2. [ ] Déployer le backend sur Render
3. [ ] Déployer le frontend sur Vercel
4. [ ] Configurer les variables d'environnement
5. [ ] Tester l'application complète
6. [ ] Ajouter un domaine personnalisé (optionnel)
7. [ ] Configurer le monitoring (optionnel)

---

**Questions?** Consultez:
- https://vercel.com/docs
- https://render.com/docs
