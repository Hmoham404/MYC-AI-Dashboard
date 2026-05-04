import { useNavigate } from 'react-router-dom';
import { MoonStar, PlusCircle, SunMedium, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';
import { Button } from './ui/button';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: 'FR', name: 'Français' },
  { code: 'en', label: 'English', flag: 'EN', name: 'English' },
  { code: 'it', label: 'Italiano', flag: 'IT', name: 'Italiano' },
  { code: 'zh', label: '中文', flag: 'ZH', name: '中文' },
];

function TopBar({ isDark, onThemeToggle }) {
  const { language, setLanguage, t } = useI18n();
  const navigate = useNavigate();
  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-gradient-to-r from-card/95 to-card/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Logo + Brand */}
        <div className="flex items-center gap-4">
          {/* Logo Image */}
          <div className="group relative h-14 w-14 overflow-hidden rounded-2xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50">
            <img
              src="/logo-myc.png"
              alt="MYC AI Logo"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Glow overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 rounded-2xl" />
          </div>
          
          {/* Brand Text */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="font-display text-base font-bold leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MYC AI
              </p>
              <div className="hidden sm:block h-5 w-px bg-gradient-to-b from-blue-600 to-purple-600" />
              <p className="font-display text-base font-bold leading-none bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
                Dashboard
              </p>
            </div>
            <p className="text-xs text-foreground/60 font-medium">Analytics Studio</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="group transition-all duration-200 hover:bg-blue-500/10 hover:border-blue-400/50"
          >
            <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            {t('topbar.newUpload')}
          </Button>

          {/* Language Selector avec flags améliorés */}
          <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/40 px-2 py-1.5 shadow-sm backdrop-blur-sm transition-all hover:bg-muted/60 hover:border-border/80">
            {/* Current language badge */}
            <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2.5 py-1 border border-blue-300/30">
              <span className="font-bold text-xs uppercase text-blue-500">{currentLang?.flag}</span>
              <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
                {currentLang?.label}
              </span>
            </div>

            {/* Language flags grid */}
            <div className="flex items-center gap-0.5 rounded-lg bg-card/50 p-1 border border-border/40">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  title={item.name}
                  className={`
                    group/btn relative h-8 w-8 flex items-center justify-center rounded-md
                    transition-all duration-200 font-bold text-xs uppercase
                    ${language === item.code
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-md shadow-blue-500/40 scale-110 text-white'
                      : 'hover:bg-muted/80 border border-transparent hover:border-border text-foreground/70'
                    }
                  `}
                >
                  <span className={`transition-transform duration-200 leading-tight ${
                    language === item.code ? 'scale-125' : 'group-hover/btn:scale-115'
                  }`}>
                    {item.flag}
                  </span>
                  
                  {/* Tooltip */}
                  {language !== item.code && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-opacity text-xs bg-foreground text-card px-2 py-1 rounded whitespace-nowrap pointer-events-none font-normal z-10">
                      {item.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onThemeToggle} 
            aria-label={t('topbar.theme.toggle')}
            className="group transition-all duration-200 hover:bg-yellow-500/10 hover:border-yellow-400/50"
          >
            {isDark ? (
              <>
                <SunMedium className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                <span className="hidden sm:inline">{t('topbar.theme.light')}</span>
              </>
            ) : (
              <>
                <MoonStar className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                <span className="hidden sm:inline">{t('topbar.theme.dark')}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Gradient underline animation */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </header>
  );
}

export default TopBar;
