import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import DashboardPage from './pages/Dashboard';
import { I18nProvider } from './i18n';

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'fr');
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('app_theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', isDark);
    localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <I18nProvider language={language} setLanguage={setLanguage}>
      <div className="min-h-screen bg-background text-foreground">
        <TopBar isDark={isDark} onThemeToggle={() => setIsDark((prev) => !prev)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/:fileId" element={<DashboardPage />} />
        </Routes>
      </div>
    </I18nProvider>
  );
}

export default App;
