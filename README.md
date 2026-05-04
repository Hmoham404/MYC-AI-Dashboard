# 🎨 MYC AI Dashboard

Plateforme complète pour importer, analyser et visualiser des données avec l'IA. 
**Marque MYC** - *BEAUTY INNOVATION*

![Dashboard](frontend/public/logo-myc.png)

## ✨ Fonctionnalités

- Upload de fichiers `.csv`, `.xlsx`, `.xls`
- Analyse automatique:
  - typage de colonnes (numeric, categorical, date, text)
  - statistiques descriptives
  - valeurs manquantes
  - outliers (IQR)
  - correlations
  - suggestions de graphiques
  - insights IA (heuristiques ou OpenAI)
- Dashboard React responsive:
  - KPI cards
  - grille de graphiques interactifs (bar, line, pie, scatter, heatmap, histogram)
  - filtre par colonne et type de graphe
  - zoom graphique
  - telechargement individuel des graphiques (SVG)
  - tableau de donnees (tri + filtre)
  - mode clair/sombre
- Export backend du dashboard en PNG/PDF
- Historique des fichiers dans SQLite
- Swagger automatique FastAPI

## Architecture

- Backend: FastAPI + pandas + numpy + scikit-learn + SQLite
- Frontend: React + Tailwind CSS + composants style shadcn/ui + Recharts

## Arborescence

- `backend/` API Python
- `frontend/` application React

## Prerequis

- Python 3.10+
- Node.js 18+
- npm 9+

## Installation et execution

### 1) Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Create `backend/.env` and set your OpenAI key if you want AI-generated insights:

```env
OPENAI_API_KEY=sk-...
BACKEND_LANGUAGE=fr
```

API disponible sur:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2) Frontend

Ouvrez un second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible sur:

- http://localhost:5173

## Variables d'environnement

Backend (optionnel):

- `OPENAI_API_KEY` : active la generation d'insights via OpenAI, sinon mode heuristique local.
- `OPENAI_API_KEY` : active la generation d'insights via OpenAI, sinon mode heuristique local.
- `BACKEND_LANGUAGE` : langue par defaut pour les analyses et rapports (`fr`, `en`, `it`, `zh`).

Frontend (optionnel):

- `VITE_API_BASE_URL` : URL de l'API FastAPI (defaut: `http://localhost:8000`).

## Endpoints API

### `POST /upload`

Upload de fichier CSV/XLS/XLSX.

Reponse exemple:

```json
{
  "file_id": "uuid",
  "filename": "sales.xlsx",
  "message": "Fichier uploade avec succes (.xlsx)."
}
```

### `POST /analyze`

Body:

```json
{
  "file_id": "uuid"
}
```

Retourne KPI, types de colonnes, statistiques, correlations, suggestions de graphiques, extrait tabulaire, insights IA.

### `GET /charts/{file_id}`

Query params optionnels:

- `column`: filtre par colonne
- `chart_types`: filtre par types de graphes (repeatable)

### `GET /export/{file_id}?format=png|pdf`

Exporte un rapport visuel en PNG ou PDF.

## Performance et limites

- Concu pour des fichiers jusqu'a ~100 000 lignes (selon memoire machine et types de colonnes).
- Taille max upload: 25MB (modifiable dans `backend/services/file_parser.py`).
- Le tableau frontend affiche un extrait limite (300 lignes) pour garder une UI fluide.

## Gestion des erreurs

- Format invalide ou fichier trop grand
- Fichier vide/corrompu
- Analyse introuvable
- Erreurs de parsing ou export

Toutes les erreurs API sont retournees en JSON avec code HTTP approprie.

## Notes de dev

- SQLite est stocke dans `backend/data/history.db`
- Uploads dans `backend/data/uploads`
- Analyses JSON dans `backend/data/analyses`
- Exports dans `backend/data/exports`
"# MYC-AI-Dashboard" 
