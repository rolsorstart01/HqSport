import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const CourtSelector = ({ selectedCourt, onCourtSelect, bookedCourts = [] }) => {
    const courts = [
        { id: 1, name: 'Court 1', type: 'outdoor', features: ['Premium Surface', 'Night Lights'] },
        { id: 2, name: 'Court 2', type: 'outdoor', features: ['Premium Surface', 'Night Lights'] },
        { id: 3, name: 'Court 3', type: 'outdoor', features: ['Premium Surface', 'City View'] },
        { id: 4, name: 'Court 4', type: 'outdoor', features: ['Premium Surface', 'City View'] },
    ];

    const PaddleIcon = () => (
        <svg viewBox="0 0 40 50" className="w-8 h-8" fill="currentColor">
            <ellipse cx="20" cy="18" rx="14" ry="16" className="text-current" />
            <rect x="16" y="32" width="8" height="12" rx="2" className="text-current" />
            {/* Holes */}
            <circle cx="14" cy="14" r="2" className="text-zinc-900" />
            <circle cx="20" cy="10" r="2" className="text-zinc-900" />
            <circle cx="26" cy="14" r="2" className="text-zinc-900" />
            <circle cx="12" cy="20" r="2" className="text-zinc-900" />
            <circle cx="20" cy="20" r="2" className="text-zinc-900" />
            <circle cx="28" cy="20" r="2" className="text-zinc-900" />
            <circle cx="14" cy="26" r="2" className="text-zinc-900" />
            <circle cx="20" cy="26" r="2" className="text-zinc-900" />
            <circle cx="26" cy="26" r="2" className="text-zinc-900" />
        </svg>
    );

    return (
        <div className="card p-6">
            <h3 className="text-xl font-semibold text-white font-display mb-6">Select a Court</h3>

            <div className="grid grid-cols-2 gap-4">
                {courts.map((court) => {
                    const isBooked = bookedCourts.includes(court.id);
                    const isSelected = selectedCourt === court.id;

                    return (
                        <button
                            key={court.id}
                            onClick={() => !isBooked && onCourtSelect(court.id)}
                            disabled={isBooked}
                            className={`
                                relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                                ${isBooked
                                    ? 'bg-zinc-900 border-zinc-800 opacity-50 cursor-not-allowed'
                                    : isSelected
                                        ? 'bg-yellow-500/10 border-yellow-500 shadow-lg shadow-yellow-500/10'
                                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-black" />
                                </div>
                            )}

                            <div className={`mb-4 ${isSelected ? 'text-yellow-400' : isBooked ? 'text-gray-600' : 'text-gray-400'}`}>
                                <PaddleIcon />
                            </div>

                            <h4 className={`text-lg font-semibold mb-1 ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                                {court.name}
                            </h4>

                            <p className="text-sm text-gray-500 capitalize mb-3">{court.type}</p>

                            <div className="flex flex-wrap gap-2">
                                {court.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className={`text-xs px-2 py-1 rounded-md ${isSelected
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-zinc-800 text-gray-400'
                                            }`}
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            {isBooked && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                                    <span className="text-red-400 font-medium text-sm">Booked</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Court layout visualization - Updated to straight line */}
            <div className="mt-8 pt-6 border-t border-zinc-800">
                <p className="text-sm text-gray-500 mb-4">Court Layout</p>
                <div className="flex flex-row justify-between gap-2 overflow-x-auto pb-2">
                    {courts.map((court) => {
                        const isBooked = bookedCourts.includes(court.id);
                        const isSelected = selectedCourt === court.id;

                        return (
                            <div
                                key={court.id}
                                className={`
                                    relative flex-1 min-w-[60px] aspect-[2/3] rounded-md border-2 flex items-center justify-center text-sm font-medium transition-colors
                                    ${isBooked
                                        ? 'bg-red-500/10 border-red-500/30 text-red-400 opacity-40'
                                        : isSelected
                                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                                            : 'bg-zinc-900 border-zinc-700 text-gray-500'
                                    }
                                `}
                            >
                                {/* Visual Net Line */}
                                <div className={`absolute w-full h-[1px] top-1/2 left-0 ${isSelected ? 'bg-yellow-500/40' : 'bg-zinc-700'}`} />

                                <span className="relative z-10">{court.id}</span>
                            </div>
                        );
                    })}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600 text-center mt-4">
                    View from rooftop entrance
                </p>
            </div>
        </div>
    );
};

export default CourtSelector;