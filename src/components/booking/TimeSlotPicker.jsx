import { useState } from 'react';
import { Clock, Check } from 'lucide-react';
import { isToday } from 'date-fns';

const TimeSlotPicker = ({ selectedSlots, onSlotSelect, bookedSlots = [], selectedDate }) => {
    // Generate time slots from 6 AM to 12 AM (midnight)
    const generateTimeSlots = () => {
        const slots = [];
        const currentHour = new Date().getHours();
        const isBookingToday = selectedDate && isToday(selectedDate);

        for (let hour = 6; hour <= 23; hour++) {
            const startHour = hour;
            const endHour = hour + 1;
            const startTime = `${startHour.toString().padStart(2, '0')}:00`;
            const endTime = endHour === 24 ? '00:00' : `${endHour.toString().padStart(2, '0')}:00`;

            // Price tier: ₹800 for 6 AM - 1 PM, ₹1200 for 1 PM - 12 AM
            const price = 1500;
            const tier = 'standard';

            // Check if slot is in the past (only for same-day bookings)
            const isPast = isBookingToday && hour <= currentHour;

            slots.push({
                id: `slot-${hour}`,
                startHour,
                startTime,
                endTime,
                label: `${formatTime(hour)} - ${formatTime(endHour === 24 ? 0 : endHour)}`,
                price,
                tier,
                isPast
            });
        }
        return slots;
    };

    const formatTime = (hour) => {
        if (hour === 0 || hour === 24) return '12:00 AM';
        if (hour === 12) return '12:00 PM';
        if (hour > 12) return `${hour - 12}:00 PM`;
        return `${hour}:00 AM`;
    };

    const slots = generateTimeSlots();

    const handleSlotClick = (slot) => {
        // Prevent booking past slots or already booked slots
        if (bookedSlots.includes(slot.id) || slot.isPast) return;

        if (selectedSlots.includes(slot.id)) {
            onSlotSelect(selectedSlots.filter(id => id !== slot.id));
        } else {
            onSlotSelect([...selectedSlots, slot.id]);
        }
    };

    const calculateTotal = () => {
        return slots
            .filter(slot => selectedSlots.includes(slot.id))
            .reduce((total, slot) => total + slot.price, 0);
    };

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white font-display">Select Time Slots</h3>
                {selectedSlots.length > 0 && (
                    <div className="text-right">
                        <p className="text-sm text-gray-400">{selectedSlots.length} slot(s) selected</p>
                        <p className="text-lg font-semibold text-gold-gradient">₹{calculateTotal().toLocaleString()}</p>
                    </div>
                )}
            </div>

            {/* Pricing legend */}
            <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-400">Standard Rate (₹1,500)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm text-gray-400">Unavailable</span>
                </div>
            </div>

            {/* Time slots grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {slots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot.id);
                    const isSelected = selectedSlots.includes(slot.id);
                    const isMorning = slot.tier === 'morning';
                    const isPast = slot.isPast;
                    const isDisabled = isBooked || isPast;

                    return (
                        <button
                            key={slot.id}
                            onClick={() => handleSlotClick(slot)}
                            disabled={isDisabled}
                            className={`
                                relative p-4 rounded-xl border transition-all duration-200
                                ${isDisabled
                                    ? 'bg-gray-500/10 border-gray-500/30 cursor-not-allowed opacity-50'
                                    : isSelected
                                        ? 'bg-yellow-500/20 border-yellow-500 shadow-lg shadow-yellow-500/10'
                                        : 'bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 hover:bg-yellow-500/5'
                                }
                            `}
                        >
                            {/* Selection check */}
                            {isSelected && !isBooked && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-black" />
                                </div>
                            )}

                            {/* Time */}
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className={`w-4 h-4 ${isBooked ? 'text-red-400' : isSelected ? 'text-yellow-400' : 'text-gray-500'}`} />
                                <span className={`text-sm font-medium ${isBooked ? 'text-red-400' : isSelected ? 'text-yellow-400' : 'text-white'}`}>
                                    {slot.label}
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <span className={`text-lg font-bold ${isBooked
                                    ? 'text-red-400 line-through'
                                    : isSelected
                                        ? 'text-yellow-400'
                                        : isMorning
                                            ? 'text-emerald-400'
                                            : 'text-yellow-400'
                                    }`}>
                                    ₹{slot.price}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${isBooked
                                    ? 'bg-red-500/20 text-red-400'
                                    : isMorning
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {isBooked ? 'Booked' : 'Available'}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Multi-select tip */}
            {selectedSlots.length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-6">
                    💡 Tip: Select multiple consecutive slots for longer playing sessions
                </p>
            )}
        </div>
    );
};

export default TimeSlotPicker;
