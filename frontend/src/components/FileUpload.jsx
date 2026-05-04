import { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useI18n } from '../i18n';

const ACCEPTED_TYPES = '.csv,.xlsx,.xls';

function FileUpload({ onUpload, uploadProgress, uploading, error }) {
  const { t } = useI18n();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    setSelectedFile(file);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  }

  async function handleSubmit() {
    if (!selectedFile) return;
    await onUpload(selectedFile);
  }

  return (
    <Card className="mx-auto w-full max-w-3xl animate-rise">
      <CardHeader>
        <CardTitle className="text-2xl">{t('upload.title')}</CardTitle>
        <p className="text-sm text-foreground/70">{t('upload.subtitle')}</p>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${
            dragActive ? 'border-accent bg-muted' : 'border-border bg-card'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <UploadCloud className="h-7 w-7" />
          </div>

          <p className="font-display text-lg font-semibold">{t('upload.drop')}</p>
          <p className="mt-1 text-sm text-foreground/70">{t('upload.supported')}</p>

          <Button className="mt-6" variant="outline" onClick={() => inputRef.current?.click()}>
            {t('upload.choose')}
          </Button>

          {selectedFile && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              {selectedFile.name}
            </div>
          )}

          {uploading && (
            <div className="mx-auto mt-6 w-full max-w-md">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-accent transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-foreground/70">{t('upload.progress')}: {uploadProgress}%</p>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <Button className="mt-6" onClick={handleSubmit} disabled={!selectedFile || uploading}>
            {t('upload.start')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default FileUpload;
