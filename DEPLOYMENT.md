# Déploiement MYC AI Dashboard

## Architecture

L'application est divisée en deux parties:
- **Frontend**: React + Vite (déployé sur Vercel)
- **Backend**: FastAPI (déployé sur un service comme Render, Railway, ou Fly.io)

## Déploiement Frontend sur Vercel

### Prérequis
- Compte Vercel (https://vercel.com)
- Repository GitHub avec le code

### Étapes de déploiement

1. **Pousser le code sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/myc-ai-dashboard.git
git push -u origin main
```

2. **Connecter à Vercel**
   - Aller sur https://vercel.com/dashboard
   - Cliquer "Add New..." > "Project"
   - Importer le repository GitHub
   - Sélectionner "frontend" comme root directory

3. **Configurer les variables d'environnement**
   - Dans Vercel Dashboard > Settings > Environment Variables
   - Ajouter: `VITE_API_URL` = URL du backend (ex: https://myc-api.render.com)

4. **Configurer le Build**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Déployer**
   - Cliquer "Deploy"

## Déploiement Backend

### Option 1: Render (Recommandé)

1. Créer un repository séparé pour le backend ou utiliser le même
2. Aller sur https://render.com
3. Créer un nouveau "Web Service"
4. Connecter le repository GitHub
5. Configurer:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Environment: Python 3.11
   - Add Environment Variables (OPENAI_API_KEY, etc.)

### Option 2: Railway

1. Aller sur https://railway.app
2. Créer un nouveau projet
3. Connecter le repository GitHub
4. Railway détecte automatiquement l'app FastAPI
5. Configurer les variables d'environnement

### Option 3: Fly.io

1. Créer un compte sur https://fly.io
2. Installer Fly CLI
3. Créer Dockerfile dans backend/:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

4. Exécuter: `flyctl deploy`

## Créer requirements.txt pour le backend

Exécuter dans le dossier backend:
```bash
pip freeze > requirements.txt
```

Ou manuellement:
```
fastapi==0.115.5
uvicorn==0.46.0
pandas==2.2.3
numpy==2.1.3
scikit-learn==1.5.2
openai==1.54.4
reportlab==4.5.0
pillow==10.2.0
openpyxl==3.10.0
python-dotenv==1.0.1
```

## Configuration des URLs

- **Frontend**: `https://myc-ai-dashboard.vercel.app`
- **Backend**: `https://myc-api.render.com` (ou équivalent)

Ajouter dans le fichier `.env` du frontend (Vercel Dashboard):
```
VITE_API_URL=https://myc-api.render.com
```

## CORS Configuration

Assurez-vous que le backend FastAPI autorise les requêtes du frontend:

Dans `backend/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://myc-ai-dashboard.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Checklist avant le déploiement

- [ ] Créer requirements.txt pour le backend
- [ ] Configurer les variables d'environnement (OPENAI_API_KEY, etc.)
- [ ] Vérifier la configuration CORS
- [ ] Créer un .gitignore
- [ ] Pousser le code sur GitHub
- [ ] Déployer le backend d'abord
- [ ] Configurer VITE_API_URL sur Vercel
- [ ] Déployer le frontend
- [ ] Tester l'application en production

## Troubleshooting

### CORS Error
Vérifier que le backend autorise l'origine du frontend dans la configuration CORS

### API URL incorrecte
Vérifier la variable `VITE_API_URL` dans Vercel Settings

### Build fails
Vérifier les logs Vercel > Deployments > Build Logs

### Python packages missing
S'assurer que tous les packages sont dans requirements.txt

---

Pour plus d'aide: https://vercel.com/docs et https://render.com/docs
