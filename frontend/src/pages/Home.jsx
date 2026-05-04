import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { uploadFile } from '../services/api';
import { useI18n } from '../i18n';

function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  async function handleUpload(file) {
    try {
      setError('');
      setUploading(true);
      setUploadProgress(0);

      const data = await uploadFile(file, (event) => {
        if (!event.total) return;
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      });

      navigate(`/dashboard/${data.file_id}`);
    } catch (err) {
      setError(err?.response?.data?.detail || t('home.error.upload'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col justify-center px-4 py-10">
      <section className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-foreground/70">{t('home.tagline')}</p>
        <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">AI Dashboard Pro</h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-foreground/75 md:text-base">
          {t('home.description')}
        </p>
      </section>

      <FileUpload onUpload={handleUpload} uploadProgress={uploadProgress} uploading={uploading} error={error} />
    </main>
  );
}

export default Home;
