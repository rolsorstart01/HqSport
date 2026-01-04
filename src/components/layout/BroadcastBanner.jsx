import { useState, useEffect } from 'react';
import { Megaphone, X } from 'lucide-react';
import { subscribeToBroadcasts } from '../../services/firebase';

const BroadcastBanner = () => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [currentBroadcast, setCurrentBroadcast] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToBroadcasts((data) => {
            if (data && data.length > 0) {
                // Get the most recent broadcast
                const latest = data[0];

                // Check if this broadcast was already dismissed (using localStorage)
                const dismissedId = localStorage.getItem('dismissed_broadcast_id');

                if (dismissedId !== latest.id) {
                    setCurrentBroadcast(latest);
                    setIsVisible(true);
                }
            } else {
                setIsVisible(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDismiss = () => {
        if (currentBroadcast) {
            localStorage.setItem('dismissed_broadcast_id', currentBroadcast.id);
        }
        setIsVisible(false);
    };

    if (!isVisible || !currentBroadcast) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-fade-in-up">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                        <Megaphone className="w-4 h-4" />
                    </div>
                    <p className="font-medium text-sm md:text-base">{currentBroadcast.message}</p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default BroadcastBanner;
