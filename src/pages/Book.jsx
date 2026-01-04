import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, Check, CreditCard, AlertCircle, Loader2, Shield, Clock, MapPin, Tag, X } from 'lucide-react';
import BookingCalendar from '../components/booking/BookingCalendar';
import CourtSelector from '../components/booking/CourtSelector';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import { useAuth } from '../context/AuthContext';
import { createBooking, getBookingsForDate, getDiscounts } from '../services/firebase';
import { createPayment, formatCurrency } from '../services/razorpay';
import { sendBookingEmail } from '../services/emailService';

const Book = ({ onLoginRequired }) => {
    const navigate = useNavigate();
    const { user, userData, isAuthenticated } = useAuth();

    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bookingComplete, setBookingComplete] = useState(false);
    const [bookingId, setBookingId] = useState(null);

    // Discount state
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountError, setDiscountError] = useState('');
    const [applyingDiscount, setApplyingDiscount] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            if (selectedDate && selectedCourt) {
                const dateStr = format(selectedDate, 'yyyy-MM-dd');
                const { bookings } = await getBookingsForDate(dateStr);
                const slotsForCourt = bookings
                    .filter(b => b.courtId === selectedCourt)
                    .flatMap(b => b.slots || []);
                setBookedSlots(slotsForCourt);
            }
        };
        fetchBookings();
    }, [selectedDate, selectedCourt]);

    const calculateTotal = () => {
        let total = 0;
        selectedSlots.forEach(slotId => {
            const hour = parseInt(slotId.replace('slot-', ''));
            total += hour < 13 ? 800 : 1200;
        });
        return total;
    };

    const baseAmount = calculateTotal();
    const discountAmount = appliedDiscount ? Math.round(baseAmount * appliedDiscount.percent / 100) : 0;
    const totalAmount = baseAmount - discountAmount;

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) return;

        setApplyingDiscount(true);
        setDiscountError('');

        try {
            const { discounts } = await getDiscounts();
            const discount = discounts.find(d => d.code.toUpperCase() === discountCode.toUpperCase());

            if (!discount) {
                setDiscountError('Invalid discount code');
            } else if (discount.usedCount >= discount.maxUses) {
                setDiscountError('This discount code has reached its usage limit');
            } else {
                setAppliedDiscount(discount);
                setDiscountError('');
            }
        } catch (err) {
            setDiscountError('Failed to validate discount code');
        }

        setApplyingDiscount(false);
    };

    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode('');
        setDiscountError('');
    };

    const steps = [
        { number: 1, title: 'Date', icon: '📅' },
        { number: 2, title: 'Court', icon: '🏸' },
        { number: 3, title: 'Time', icon: '⏰' },
        { number: 4, title: 'Pay', icon: '💳' },
    ];

    const canProceed = () => {
        switch (step) {
            case 1: return selectedDate !== null;
            case 2: return selectedCourt !== null;
            case 3: return selectedSlots.length > 0;
            case 4: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (step === 3 && !isAuthenticated) {
            onLoginRequired();
            return;
        }
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handlePayment = async () => {
        if (!isAuthenticated) {
            onLoginRequired();
            return;
        }

        setLoading(true);
        setError('');

        const bookingDetails = {
            courtId: selectedCourt,
            courtName: `Court ${selectedCourt}`,
            date: format(selectedDate, 'yyyy-MM-dd'),
            displayDate: format(selectedDate, 'EEEE, MMMM d, yyyy'),
            slots: selectedSlots
        };

        // Double check availability before payment
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const { bookings } = await getBookingsForDate(dateStr);
            const slotsForCourt = bookings
                .filter(b => b.status !== 'cancelled' && b.courtId === selectedCourt)
                .flatMap(b => b.slots || []);

            const isTaken = selectedSlots.some(slot => slotsForCourt.includes(slot));
            if (isTaken) {
                setError('One or more selected slots just became unavailable. Please choose another time.');
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error("Availability check failed:", err);
        }

        // Handle 100% discount (zero amount)
        if (totalAmount === 0) {
            const { id, error: bookingError } = await createBooking({
                userId: user.uid,
                userEmail: user.email,
                userName: userData?.displayName || user.email,
                ...bookingDetails,
                totalAmount: 0,
                paidAmount: 0,
                remainingAmount: 0,
                paymentType: 'full',
                paymentId: 'free_promo_code',
                status: 'booked'
            });

            if (bookingError) {
                setError('Booking failed. Please contact support.');
            } else {
                setBookingId(id);
                setBookingComplete(true);
            }
            setLoading(false);
            return;
        }

        createPayment({
            amount: totalAmount,
            bookingDetails,
            user: { ...user, displayName: userData?.displayName },
            onSuccess: async (paymentData) => {
                const { id, error: bookingError } = await createBooking({
                    userId: user.uid,
                    userEmail: user.email,
                    userName: userData?.displayName || user.email,
                    ...bookingDetails,
                    totalAmount,
                    paidAmount: paymentData.amount,
                    remainingAmount: 0,
                    paymentType: 'full',
                    paymentId: paymentData.paymentId,
                    status: 'booked'
                });

                if (bookingError) {
                    setError('Booking saved but confirmation failed. Please contact support.');
                } else {
                    setBookingId(id);
                    setBookingComplete(true);

                    // Send Email
                    sendBookingEmail({
                        userId: user.uid,
                        userEmail: user.email,
                        userName: userData?.displayName || user.email,
                        ...bookingDetails,
                        totalAmount,
                        paidAmount: paymentData.amount,
                        paymentId: paymentData.paymentId,
                        status: 'booked'
                    });
                }
                setLoading(false);
            },
            onError: (errorMessage) => {
                setError(errorMessage);
                setLoading(false);
            }
        });
    };

    // Success Screen
    if (bookingComplete) {
        return (
            <div className="min-h-screen pt-40 pb-16 flex items-center justify-center bg-[#020617]">
                <div className="max-w-md mx-auto px-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-fade-in">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h1>
                    <p className="text-slate-400 mb-8">Your court has been reserved. Check your email for details.</p>

                    <div className="glass-card p-6 mb-8 text-left">
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Court</span>
                                <span className="text-white">Court {selectedCourt}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date</span>
                                <span className="text-white">{format(selectedDate, 'EEE, MMM d')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Duration</span>
                                <span className="text-white">{selectedSlots.length} hour(s)</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-slate-700">
                                <span className="text-slate-500">Paid</span>
                                <span className="text-xl font-bold text-yellow-400">{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">
                            My Bookings
                        </button>
                        <button
                            onClick={() => {
                                setBookingComplete(false);
                                setStep(1);
                                setSelectedDate(null);
                                setSelectedCourt(null);
                                setSelectedSlots([]);
                            }}
                            className="btn-secondary flex-1"
                        >
                            Book Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-40 pb-16 bg-[#020617]">
            <div className="max-w-5xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-yellow-400 text-sm font-medium uppercase tracking-widest">Reservations</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
                        Book Your <span className="text-yellow-gradient">Court</span>
                    </h1>
                    <p className="text-slate-400">Reserve your spot in 4 easy steps</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center mb-12">
                    {steps.map((s, i) => (
                        <div key={s.number} className="flex items-center">
                            <div className={`flex flex-col items-center ${i > 0 ? 'ml-4' : ''}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${step > s.number
                                    ? 'bg-green-500'
                                    : step === s.number
                                        ? 'bg-yellow-400 text-black scale-110'
                                        : 'bg-slate-800'
                                    }`}>
                                    {step > s.number ? <Check className="w-5 h-5 text-white" /> : s.icon}
                                </div>
                                <span className={`text-xs mt-2 ${step >= s.number ? 'text-white' : 'text-slate-500'}`}>
                                    {s.title}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-12 h-0.5 mx-2 ${step > s.number ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="max-w-lg mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 animate-fade-in">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Step Content */}
                <div className="max-w-3xl mx-auto">
                    {step === 1 && (
                        <div className="max-w-md mx-auto animate-fade-in">
                            <BookingCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <CourtSelector selectedCourt={selectedCourt} onCourtSelect={setSelectedCourt} bookedCourts={[]} />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in">
                            <TimeSlotPicker
                                selectedSlots={selectedSlots}
                                onSlotSelect={setSelectedSlots}
                                bookedSlots={bookedSlots}
                                selectedDate={selectedDate}
                            />
                        </div>
                    )}

                    {step === 4 && (
                        <div className="max-w-md mx-auto animate-fade-in">
                            <div className="glass-card p-8">
                                <h3 className="text-xl font-semibold text-white mb-6">Booking Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between py-3 border-b border-slate-700">
                                        <span className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Date</span>
                                        <span className="text-white">{selectedDate && format(selectedDate, 'EEE, MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-700">
                                        <span className="text-slate-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Court</span>
                                        <span className="text-white">Court {selectedCourt}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-700">
                                        <span className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Time</span>
                                        <span className="text-white">
                                            {selectedSlots.length > 0 && (() => {
                                                const sortedSlots = [...selectedSlots].sort();
                                                const firstSlot = parseInt(sortedSlots[0].replace('slot-', ''));
                                                const lastSlot = parseInt(sortedSlots[sortedSlots.length - 1].replace('slot-', ''));
                                                const formatHour = (h) => {
                                                    if (h === 0 || h === 24) return '12:00 AM';
                                                    if (h === 12) return '12:00 PM';
                                                    if (h > 12) return `${h - 12}:00 PM`;
                                                    return `${h}:00 AM`;
                                                };
                                                return `${formatHour(firstSlot)} - ${formatHour(lastSlot + 1)}`;
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-700">
                                        <span className="text-slate-400">Duration</span>
                                        <span className="text-white">{selectedSlots.length} hour(s)</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b border-slate-700">
                                        <span className="text-slate-400">Subtotal</span>
                                        <span className="text-white">{formatCurrency(baseAmount)}</span>
                                    </div>

                                    {/* Discount Code Section */}
                                    {!appliedDiscount ? (
                                        <div className="pt-2">
                                            <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                                                <Tag className="w-4 h-4" />
                                                Have a discount code?
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={discountCode}
                                                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                                                    placeholder="Enter code"
                                                    className="flex-1 input-field py-2 px-4 text-sm uppercase"
                                                />
                                                <button
                                                    onClick={handleApplyDiscount}
                                                    disabled={!discountCode.trim() || applyingDiscount}
                                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {applyingDiscount ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                                </button>
                                            </div>
                                            {discountError && (
                                                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {discountError}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-green-400" />
                                                    <div>
                                                        <p className="text-green-400 font-mono font-bold text-sm">{appliedDiscount.code}</p>
                                                        <p className="text-green-400/70 text-xs">{appliedDiscount.percent}% discount applied</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleRemoveDiscount}
                                                    className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {appliedDiscount && (
                                        <div className="flex justify-between py-2 text-green-400">
                                            <span>Discount ({appliedDiscount.percent}%)</span>
                                            <span>-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between py-3 pt-4 border-t border-slate-600">
                                        <span className="text-slate-400 font-semibold">Total</span>
                                        <div className="text-right">
                                            {appliedDiscount && (
                                                <div className="text-slate-500 line-through text-sm mb-1">{formatCurrency(baseAmount)}</div>
                                            )}
                                            <span className="text-3xl font-bold text-yellow-400">{formatCurrency(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Paddle Rental Info */}
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 mb-4">
                                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-blue-400 text-sm font-medium mb-1">Paddle Rental Available</p>
                                        <p className="text-blue-300/80 text-xs">Paddles are available on-site for ₹250 per hour per paddle.</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-800/50 flex items-center gap-3 mb-6">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    <span className="text-slate-400 text-sm">Secure payment via Razorpay</span>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="btn-primary w-full py-4 text-lg"
                                >
                                    {loading ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                                    ) : (
                                        <><CreditCard className="w-5 h-5" /> Pay {formatCurrency(totalAmount)}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between max-w-3xl mx-auto mt-10">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors ${step === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>

                    {step < 4 && (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className={canProceed() ? 'btn-primary' : 'px-6 py-3 rounded-xl bg-slate-800 text-slate-500 cursor-not-allowed'}
                        >
                            {step === 3 && !isAuthenticated ? 'Sign In to Continue' : 'Continue'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Book;
