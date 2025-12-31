import { useState, useEffect } from 'react';

const InstallApp = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Check if the device is iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(isIosDevice);

    // 2. Logic for Android/Chrome
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsVisible(true);
    };

    // 3. Logic for iOS (Show instructions if not already installed/standalone)
    if (isIosDevice && !isStandalone) {
      setIsVisible(true);
    }

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleAndroidInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
      <div className="bg-white text-black p-4 rounded-2xl shadow-2xl border border-gray-200 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
            HQ
          </div>
          <div>
            <h3 className="font-bold text-lg">Install HQ Sport</h3>
            <p className="text-sm text-gray-600">Access your court bookings faster!</p>
          </div>
        </div>

        {isIOS ? (
          /* iOS Instructions */
          <div className="bg-gray-50 p-3 rounded-lg text-sm border border-dashed border-gray-300">
            <p className="flex items-center gap-2">
              1. Tap the <span className="text-blue-500 font-bold">Share</span> icon (square with arrow)
            </p>
            <p className="flex items-center gap-2">
              2. Scroll down and tap <span className="font-bold">"Add to Home Screen"</span>
            </p>
          </div>
        ) : (
          /* Android/Chrome Button */
          <button
            onClick={handleAndroidInstall}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Install Now
          </button>
        )}
        
        <button 
          onClick={() => setIsVisible(false)}
          className="text-xs text-gray-400 text-center uppercase tracking-widest mt-1"
        >
          Not now
        </button>
      </div>
    </div>
  );
};

export default InstallApp;