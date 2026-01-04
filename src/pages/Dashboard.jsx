import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { Calendar, Clock, MapPin, TrendingUp, Plus, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/firebase';
import { formatCurrency } from '../services/razorpay';

const Dashboard = () => {
    const { user, userData } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchBookings = async () => {
            if (user) {
                const { bookings: userBookings } = await getUserBookings(user.uid, user.email);
                if (userBookings) setBookings(userBookings);
            }
            setLoading(false);
        };
        fetchBookings();
    }, [user]);

    const now = new Date();

    const upcomingBookings = bookings.filter(b => {
        const bookingDate = parseISO(b.date);
        return isAfter(bookingDate, now) || isToday(bookingDate);
    });

    const pastBookings = bookings.filter(b => {
        const bookingDate = parseISO(b.date);
        return isBefore(bookingDate, now) && !isToday(bookingDate);
    });

    const stats = [
        { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Hours Played', value: bookings.reduce((acc, b) => acc + (b.slots?.length || 0), 0), icon: Clock, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Upcoming', value: upcomingBookings.length, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="min-h-screen pt-40 pb-16 bg-[#020617]">
            <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome back, <span className="text-yellow-gradient">{userData?.displayName || 'Player'}</span>
                        </h1>
                        <p className="text-slate-400">Manage your court bookings and activity</p>
                    </div>
                    <Link to="/book" className="btn-primary mt-4 md:mt-0">
                        <Plus className="w-5 h-5" />
                        Book New Court
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="glass-card p-6 flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-6 border-b border-slate-800">
                    {['upcoming', 'past'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-2 font-medium transition-all relative capitalize ${activeTab === tab ? 'text-yellow-400' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab} Bookings
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-4" />
                            <p className="text-slate-400">Loading your bookings...</p>
                        </div>
                    ) : (activeTab === 'upcoming' ? upcomingBookings : pastBookings).length === 0 ? (
                        <div className="text-center py-16 glass-card border-dashed">
                            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-white font-medium mb-2">No {activeTab} bookings</h3>
                            <p className="text-slate-500 mb-6">
                                {activeTab === 'upcoming'
                                    ? "You don't have any upcoming reservations."
                                    : "You haven't made any bookings yet."}
                            </p>
                            {activeTab === 'upcoming' && (
                                <Link to="/book" className="btn-secondary">
                                    Book a Court
                                </Link>
                            )}
                        </div>
                    ) : (
                        (activeTab === 'upcoming' ? upcomingBookings : pastBookings).map((booking) => (
                            <div key={booking.id} className="glass-card p-6 group hover:border-yellow-500/30 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {booking.courtName || `Court ${booking.courtId}`}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-yellow-500" />
                                                    {format(parseISO(booking.date), 'EEE, MMM d, yyyy')}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4 text-yellow-500" />
                                                    {booking.slots?.length || 1} Hour(s)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-6 md:justify-end flex-1 border-t border-slate-800 md:border-0 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-0.5">Total Paid</p>
                                            <p className="text-xl font-bold text-yellow-400">
                                                {formatCurrency(booking.paidAmount || booking.totalAmount)}
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20">
                                            Confirmed
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
