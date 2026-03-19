import { useEffect, useState } from "react";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    const dismissed = sessionStorage.getItem("installDismissed");

    if (isStandalone || dismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [sessionStorage.getItem("installDismissed")]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstall(false);
    } else {
      // User cancelled → hide for this session only
      sessionStorage.setItem("installDismissed", "true");
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <>
      {showInstall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Install Early Wages
            </h2>

            <p className="text-gray-600 mb-6">
              Install this app for faster access and better experience.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  sessionStorage.setItem("installDismissed", "true");
                  setShowInstall(false);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={()=> {handleInstall(), setShowInstall(false)}}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
