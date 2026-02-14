import { useState, useEffect, useMemo } from 'react';
import { format, parseISO, isToday, isBefore, isAfter } from 'date-fns';
import {
    Shield, Users, Calendar, MessageSquare, Image, TrendingUp,
    ChevronRight, Send, Trash2, UserPlus, UserMinus, RefreshCw,
    AlertCircle, Check, X, Tag, Plus, User, CreditCard, Download, Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    getAllUsers, getAllBookings, setUserRole, sendBroadcast,
    getBroadcasts, getGalleryImages, addGalleryImage, deleteGalleryImage,
    cancelBooking, createDiscount, getDiscounts, deleteDiscount,
    createBooking, subscribeToBookings, subscribeToUsers, subscribeToDiscounts,
    subscribeToBroadcasts, subscribeToGallery, banUser, unbanUser
} from '../services/firebase';
import BookingCalendar from '../components/booking/BookingCalendar';
import { formatCurrency } from '../services/razorpay';
import { toast } from 'react-hot-toast';
import { sendBookingEmail, sendBookAgainEmail } from '../services/emailService';


const AdminPanel = () => {
    const { user, isAdmin, isSuperAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Data States
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [broadcasts, setBroadcasts] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');

    // Discount Form
    const [newDiscount, setNewDiscount] = useState({ code: '', percent: 10, maxUses: 100 });

    // Manual Booking Form
    const [manualBooking, setManualBooking] = useState({
        userEmail: '',
        userName: '',
        courtId: 1,
        date: format(new Date(), 'yyyy-MM-dd'),
        timeSlot: '07:00',
        amount: 800,
        paid: true
    });
    // Close Courts (Global) - use Date object for calendar
    const [closedDate, setClosedDate] = useState(new Date());
const [closeReason, setCloseReason] = useState('Holiday');
const [closingLoading, setClosingLoading] = useState(false);
// Court management states
const [managementMode, setManagementMode] = useState('close'); // 'close' or 'reopen'
const [managementDate, setManagementDate] = useState(new Date());
const [selectedCourts, setSelectedCourts] = useState([]);
const [closeStartTime, setCloseStartTime] = useState('06:00');
const [closeEndTime, setCloseEndTime] = useState('23:00');
const [selectedReopenCourts, setSelectedReopenCourts] = useState([]);
const [reopenLoading, setReopenLoading] = useState(false);
const [closedSlotsPreview, setClosedSlotsPreview] = useState([]); // For reopen preview
// Toggle court selection
const handleCourtToggle = (court, checked) => {
  setSelectedCourts(prev => 
    checked ? [...prev, court] : prev.filter(c => c !== court)
  );
};

const handleReopenCourtToggle = (court, checked) => {
  setSelectedReopenCourts(prev => 
    checked ? [...prev, court] : prev.filter(c => c !== court)
  );
};

// Preview closed slots when date/courts change (for reopen mode)
useEffect(() => {
  if (managementMode !== 'reopen') return;
  
  const dateStr = format(managementDate, 'yyyy-MM-dd');
  const filtered = bookings.filter(b => 
    b.date === dateStr && 
    isClosedCourtBooking(b) && 
    b.status !== 'cancelled' &&
    (selectedReopenCourts.length === 0 || selectedReopenCourts.includes(parseInt(b.courtId)))
  );
  setClosedSlotsPreview(filtered);
}, [managementDate, selectedReopenCourts, managementMode, bookings]);

// CLOSE SPECIFIC COURTS HANDLER
const handleCloseSpecificCourts = async () => {
  if (selectedCourts.length === 0) {
    toast.error("Select at least one court");
    return;
  }
  
  const startH = parseInt(closeStartTime.split(':')[0]);
  const endH = parseInt(closeEndTime.split(':')[0]);
  if (startH >= endH) {
    toast.error("Start time must be before end time");
    return;
  }

  try {
    setClosingLoading(true);
    const dateStr = format(managementDate, 'yyyy-MM-dd');
    const createdBookings = [];

    for (const court of selectedCourts) {
      for (let h = startH; h <= endH; h++) {
        const timeSlot = `${h.toString().padStart(2, '0')}:00`;
        const bookingData = {
          userId: 'admin-closed',
          userEmail: 'admin@hqsport.in',
          userName: `Closed - ${closeReason}`,
          courtId: court,
          date: dateStr,
          slot: timeSlot,
          slots: [`slot-${h}`],
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          status: 'booked',
          paymentId: `closed_${dateStr}_${closeReason}_${court}_${timeSlot}`
        };
        
        const result = await createBooking(bookingData);
        if (!result?.error) createdBookings.push(result);
      }
    }
    
    toast.success(`${createdBookings.length} slots marked as closed`);
    // Reset form
    setSelectedCourts([]);
    setCloseStartTime('06:00');
    setCloseEndTime('23:00');
  } catch (err) {
    console.error("Close courts error:", err);
    toast.error("Failed to close courts. Check console for details.");
  } finally {
    setClosingLoading(false);
  }
};

// REOPEN COURTS HANDLER
const handleReopenCourts = async () => {
  if (closedSlotsPreview.length === 0) {
    toast.error("No closed slots found for selected criteria");
    return;
  }

  if (!window.confirm(
    `This will reopen ${closedSlotsPreview.length} slot(s) on ${format(managementDate, 'MMM d, yyyy')}. ` +
    `This cannot be undone. Proceed?`
  )) return;

  try {
    setReopenLoading(true);
    let successCount = 0;
    
    // Cancel bookings in parallel with error handling
    await Promise.allSettled(
      closedSlotsPreview.map(async (booking) => {
        try {
          await cancelBooking(booking.id);
          successCount++;
        } catch (err) {
          console.error(`Failed to reopen slot ${booking.id}:`, err);
        }
      })
    );
    
    toast.success(`${successCount} slot(s) successfully reopened!`);
    setSelectedReopenCourts([]);
    setClosedSlotsPreview([]);
  } catch (err) {
    console.error("Reopen courts error:", err);
    toast.error("Partial failure during reopen operation. Check console.");
  } finally {
    setReopenLoading(false);
  }
};

// Helper to identify "Close All Courts" bookings
const isClosedCourtBooking = (booking) => {
  return booking?.userId === 'admin-closed';
};

// Filtered bookings for UI display (excludes closed-court markers)
const displayBookings = useMemo(() => {
  return bookings.filter(booking => !isClosedCourtBooking(booking));
}, [bookings]);


    useEffect(() => {
        setLoading(true);

        // Subscribe to real-time updates
        const unsubscribeBookings = subscribeToBookings((data) => {
            setBookings(data);
            setLoading(false);
        });

        const unsubscribeUsers = subscribeToUsers((data) => {
            setUsers(data);
        });

        const unsubscribeDiscounts = subscribeToDiscounts((data) => {
            setDiscounts(data);
        });

        const unsubscribeBroadcasts = subscribeToBroadcasts((data) => {
            setBroadcasts(data);
        });

        const unsubscribeGallery = subscribeToGallery((data) => {
            setGallery(data);
        });

        // Cleanup subscriptions on unmount
        return () => {
            unsubscribeBookings();
            unsubscribeUsers();
            unsubscribeDiscounts();
            unsubscribeBroadcasts();
            unsubscribeGallery();
        };
    }, []);

    const fetchData = async () => {
        // Keep this for manual refresh button
        setLoading(true);
        try {
            const [usersRes, bookingsRes, broadcastsRes, galleryRes, discountsRes] = await Promise.all([
                getAllUsers(),
                getAllBookings(),
                getBroadcasts(),
                getGalleryImages(),
                getDiscounts()
            ]);
            setUsers(usersRes.users || []);
            setBookings(bookingsRes.bookings || []);
            setBroadcasts(broadcastsRes.broadcasts || []);
            setGallery(galleryRes.images || []);
            setDiscounts(discountsRes.discounts || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load admin data");
        }
        setLoading(false);
    };
        const handleCloseCourtsForDay = async () => {
  if (!closedDate) {
    toast.error("Select a date");
    return;
  }

  try {
    setClosingLoading(true);
    const dateStr = format(closedDate, 'yyyy-MM-dd');

    // Create bookings for all 4 courts and all time slots (6 AM to 11 PM)
    for (let court = 1; court <= 4; court++) {
      for (let hour = 6; hour <= 23; hour++) {
        const slotId = `slot-${hour}`;
        const bookingData = {
          userId: 'admin-closed',
          userEmail: 'admin@hqsport.in',
          userName: `Closed - ${closeReason}`,
          courtId: court,
          date: dateStr,
          slot: `${hour.toString().padStart(2, '0')}:00`,
          slots: [slotId],
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          status: 'booked',
          paymentId: `closed_${dateStr}_${closeReason}`
        };

        await createBooking(bookingData);
      }
    }

    toast.success(`All courts marked as booked for ${dateStr} (${closeReason})`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to mark courts as booked");
  } finally {
    setClosingLoading(false);
  }
};


    // Actions
    const handleRoleChange = async (userId, newRole) => {
        await setUserRole(userId, newRole);
        toast.success(`User role updated to ${newRole}`);
        fetchData();
    };

    const handleBanUser = async (userId) => {
        if (!window.confirm("Are you sure you want to ban this user? They will not be able to access the platform.")) return;
        await banUser(userId);
        toast.success("User has been banned");
    };

    const handleUnbanUser = async (userId) => {
        await unbanUser(userId);
        toast.success("User has been unbanned");
    };

    const handleSendBroadcast = async () => {
        if (!broadcastMessage.trim()) return;
        await sendBroadcast(broadcastMessage);
        setBroadcastMessage('');
        toast.success("Broadcast sent!");
        fetchData();
    };

    const handleAddImage = async () => {
        if (!newImageUrl.trim()) return;
        await addGalleryImage({ url: newImageUrl, caption: '' });
        setNewImageUrl('');
        toast.success("Image added to gallery");
        fetchData();
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("Delete this image?")) return;
        await deleteGalleryImage(imageId);
        toast.success("Image deleted");
        fetchData();
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        setLoading(true);
        await cancelBooking(bookingId);
        toast.success("Booking cancelled");
        setLoading(false);
    };

    const handleCreateDiscount = async (e) => {
        e.preventDefault();
        if (!newDiscount.code) return;
        await createDiscount(newDiscount);
        setNewDiscount({ code: '', percent: 10, maxUses: 100 });
        toast.success("Discount code created");
        fetchData();
    };

    const handleDeleteDiscount = async (id) => {
        if (!window.confirm("Delete this discount code?")) return;
        await deleteDiscount(id);
        toast.success("Discount deleted");
        fetchData();
    };

    const handleManualBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if slot is already taken
            const { bookings: existingBookings } = await getBookingsForDate(manualBooking.date);
            const isTaken = existingBookings.some(b =>
                b.status !== 'cancelled' &&
                parseInt(b.courtId) === parseInt(manualBooking.courtId) &&
                (b.slot === manualBooking.timeSlot || (b.slots && b.slots.includes(`slot-${parseInt(manualBooking.timeSlot)}`)))
            );

            if (isTaken) {
                toast.error("This slot is already booked!");
                setLoading(false);
                return;
            }

            // Find user if exists
            const existingUser = users.find(u => u.email.toLowerCase() === manualBooking.userEmail.toLowerCase());

            const bookingData = {
                userId: existingUser ? existingUser.id : 'admin-created',
                userEmail: manualBooking.userEmail,
                userName: manualBooking.userName || (existingUser ? existingUser.displayName : 'Admin Booking'),
                courtId: parseInt(manualBooking.courtId),
                date: manualBooking.date,
                slot: manualBooking.timeSlot,
                slots: [`slot-${parseInt(manualBooking.timeSlot)}`],
                totalAmount: parseInt(manualBooking.amount),
                paidAmount: manualBooking.paid ? parseInt(manualBooking.amount) : 0,
                remainingAmount: manualBooking.paid ? 0 : parseInt(manualBooking.amount),
                status: 'booked',
                paymentId: manualBooking.paid ? 'manual_admin_entry' : null
            };

            const result = await createBooking(bookingData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Manual booking created successfully");

                // Send Email
                sendBookingEmail(bookingData);

                setManualBooking({
                    userEmail: '',
                    userName: '',
                    courtId: 1,
                    date: format(new Date(), 'yyyy-MM-dd'),
                    timeSlot: '07:00',
                    amount: 800,
                    paid: true
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to create booking");
        }
        setLoading(false);
    };

    const handleExportUsers = () => {
        // Filter users by city if you want, but here we export all (most are Calcutta)
        const calcuttaUsers = users.filter(u => u.city === 'Calcutta' || !u.city);

        const headers = ['Name', 'Email', 'Role', 'City', 'Bookings'];
        const rows = calcuttaUsers.map(u => [
            u.displayName || 'N/A',
            u.email,
            u.role || 'user',
            u.city || 'Calcutta',
            u.totalBookings || 0
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `hq_sport_users_calcutta_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("User list exported for Calcutta!");
    };
    const [reportRange, setReportRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
});

const handleExportCustomReport = () => {
  const startDate = parseISO(reportRange.start);
  const endDate = parseISO(reportRange.end);
  endDate.setHours(23, 59, 59, 999);
  
  // Filter out closed-court bookings AND cancelled bookings
  const filteredBookings = bookings.filter(b => {
    if (b.status === 'cancelled') return false;
    if (isClosedCourtBooking(b)) return false; // Critical fix
    const bookingDate = parseISO(b.date);
    return bookingDate >= startDate && bookingDate <= endDate;
  });

  if (filteredBookings.length === 0) {
    toast.error("No bookings found for this range");
    return;
  }

  const headers = ['Date', 'User Name', 'Email', 'Court', 'Time Slot', 'Amount Paid', 'Status'];
  const rows = filteredBookings.map(b => [
    b.date,
    b.userName || 'N/A',
    b.userEmail || 'N/A',
    `Court ${b.courtId}`,
    b.slot || 'N/A',
    b.paidAmount || 0,
    b.status
  ]);

  const totalRev = filteredBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  rows.push(['', '', '', '', 'TOTAL REVENUE', totalRev, '']);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob); // Fixed typo: "bl ob" → blob
  link.setAttribute('download', `report_${reportRange.start}_to_${reportRange.end}.csv`);
  link.click();
  toast.success("Report downloaded successfully");
};

// Stats (using filtered displayBookings to exclude closed-court markers)
const now = new Date();
const todayBookings = displayBookings.filter(b => 
  isToday(parseISO(b.date)) && b.status !== 'cancelled'
);
const upcomingBookings = displayBookings.filter(b => 
  isAfter(parseISO(b.date), now) && b.status !== 'cancelled'
);
const totalRevenue = displayBookings
  .filter(b => b.status !== 'cancelled')
  .reduce((sum, b) => sum + (b.paidAmount || 0), 0);

    const getBookingStatusColor = (booking) => {
        if (booking.status === 'cancelled') return 'bg-red-500';
        const bookingDate = parseISO(booking.date);
        if (isToday(bookingDate)) return 'bg-yellow-500';
        if (isBefore(bookingDate, now)) return 'bg-green-500';
        return 'bg-blue-500';
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'manual', label: 'New Booking', icon: Plus },
        { id: 'discounts', label: 'Discounts', icon: Tag },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'broadcast', label: 'Broadcast', icon: MessageSquare },
        { id: 'marketing', label: 'Marketing', icon: Megaphone },
    ];

    return (
        <div className="min-h-screen pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white font-display">Admin Panel</h1>
                        <p className="text-gray-400 text-sm">
                            {isSuperAdmin ? 'Super Admin Access' : 'Admin Access'}
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="ml-auto p-2 rounded-lg bg-zinc-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-zinc-900 text-gray-400 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading admin data...</p>
                    </div>
                ) : (
                    <>
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="card p-8 border-l-4 border-red-500">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
      <AlertCircle className="w-5 h-5" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">Manage Court Availability</h3>
      <p className="text-xs text-gray-400">Close specific courts/times or reopen slots</p>
    </div>
  </div>

  {/* Toggle between Close/Reopen modes */}
  <div className="flex mb-6 bg-zinc-900 rounded-lg p-1 w-fit">
    <button
      onClick={() => setManagementMode('close')}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        managementMode === 'close' 
          ? 'bg-red-600 text-white' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      Close Courts
    </button>
    <button
      onClick={() => setManagementMode('reopen')}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        managementMode === 'reopen' 
          ? 'bg-green-600 text-white' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      Reopen Courts
    </button>
  </div>

  {/* CALENDAR - COMMON FOR BOTH MODES */}
  <div className="mb-6">
    <BookingCalendar 
      selectedDate={managementDate} 
      onDateSelect={setManagementDate} 
    />
  </div>

  {managementMode === 'close' ? (
    // ===== CLOSE COURTS MODE =====
    <div className="space-y-4">
      {/* Court Selection */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Select Courts</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(court => (
            <label key={court} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCourts.includes(court)}
                onChange={e => handleCourtToggle(court, e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-white text-sm">Court {court}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-2">Start Time</label>
          <select
            value={closeStartTime}
            onChange={e => setCloseStartTime(e.target.value)}
            className="input-field w-full bg-zinc-900"
          >
            {Array.from({length: 18}, (_, i) => {
              const h = i + 6;
              return <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                {`${h.toString().padStart(2, '0')}:00`}
              </option>
            })}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2">End Time</label>
          <select
            value={closeEndTime}
            onChange={e => setCloseEndTime(e.target.value)}
            className="input-field w-full bg-zinc-900"
          >
            {Array.from({length: 18}, (_, i) => {
              const h = i + 6;
              return <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                {`${h.toString().padStart(2, '0')}:00`}
              </option>
            })}
          </select>
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Reason</label>
        <select
          value={closeReason}
          onChange={e => setCloseReason(e.target.value)}
          className="input-field w-full bg-zinc-900"
        >
          <option value="Holiday">Holiday</option>
          <option value="Renovation">Renovation</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Event">Special Event</option>
        </select>
      </div>

      <button
        onClick={handleCloseSpecificCourts}
        disabled={closingLoading || selectedCourts.length === 0}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium w-full transition-colors"
      >
        {closingLoading ? "Processing..." : `Mark ${selectedCourts.length} Court(s) Closed`}
      </button>
    </div>
  ) : (
    // ===== REOPEN COURTS MODE =====
    <div className="space-y-4">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
        <p className="text-yellow-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Only slots previously closed by admins will be reopened. User bookings remain unaffected.
        </p>
      </div>

      {/* Court Selection for Reopen */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Select Courts to Reopen (optional)</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(court => (
            <label key={court} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedReopenCourts.includes(court)}
                onChange={e => handleReopenCourtToggle(court, e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-white text-sm">Court {court}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Leave unselected to reopen ALL closed slots on this date
        </p>
      </div>

      <button
        onClick={handleReopenCourts}
        disabled={reopenLoading}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium w-full transition-colors flex items-center justify-center gap-2"
      >
        {reopenLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Reopen Selected Slots
          </>
        )}
      </button>
      
      {/* Preview of slots to reopen */}
      {closedSlotsPreview.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-sm font-medium text-white mb-2">Slots to reopen:</p>
          <div className="flex flex-wrap gap-2">
            {closedSlotsPreview.map(slot => (
              <span 
                key={slot.id} 
                className="px-2 py-1 bg-zinc-800 text-green-400 text-xs rounded"
              >
                Court {slot.courtId} • {slot.slot}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</div>

                                {/* Stats Grid - Smaller Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="card p-4 bg-zinc-900/40 border border-yellow-500/10 rounded-2xl">
                                        <p className="text-gray-400 text-xs mb-1">Total Users</p>
                                        <p className="text-2xl font-bold text-white">{users.length}</p>
                                    </div>
                                    <div className="card p-4 bg-zinc-900/40 border border-yellow-500/10 rounded-2xl">
                                        <p className="text-gray-400 text-xs mb-1">Active Bookings</p>
                                        <p className="text-2xl font-bold text-white">{displayBookings.length}</p>
                                    </div>
                                    <div className="card p-4 bg-zinc-900/40 border border-yellow-500/10 rounded-2xl">
                                        <p className="text-gray-400 text-xs mb-1">Today's Bookings</p>
                                        <p className="text-2xl font-bold text-yellow-400">{todayBookings.length}</p>
                                    </div>
                                    <div className="card p-4 bg-zinc-900/40 border border-yellow-500/10 rounded-2xl">
                                        <p className="text-gray-400 text-xs mb-1">Total Revenue</p>
                                        <p className="text-2xl font-bold text-green-400">{formatCurrency(totalRevenue)}</p>
                                    </div>
                                </div>
                                <div className="card p-6 border-l-4 border-yellow-500">
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
            <Calendar className="w-5 h-5" />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white">Generate Custom Reports</h3>
            <p className="text-gray-400 text-xs">Select dates to export booking data</p>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">From</label>
            <input 
                type="date" 
                value={reportRange.start}
                onChange={(e) => setReportRange({...reportRange, start: e.target.value})}
                className="input-field w-full"
            />
        </div>
        <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">To</label>
            <input 
                type="date" 
                value={reportRange.end}
                onChange={(e) => setReportRange({...reportRange, end: e.target.value})}
                className="input-field w-full"
            />
        </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
        <button 
            onClick={() => {
                const yearStart = format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd');
                const yearEnd = format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd');
                setReportRange({ start: yearStart, end: yearEnd });
            }}
            className="px-3 py-1.5 rounded-md bg-zinc-800 text-gray-300 text-xs hover:bg-zinc-700 transition-colors"
        >
            Select Current Year
        </button>
        <button 
            onClick={() => setReportRange({ 
                start: format(new Date(), 'yyyy-MM-dd'), 
                end: format(new Date(), 'yyyy-MM-dd') 
            })}
            className="px-3 py-1.5 rounded-md bg-zinc-800 text-gray-300 text-xs hover:bg-zinc-700 transition-colors"
        >
            Reset to Today
        </button>
    </div>

    <button 
        onClick={handleExportCustomReport}
        className="btn-gold w-full flex items-center justify-center gap-2"
    >
        <Download className="w-4 h-4" />
        Export CSV Report
    </button>
</div>

                                {/* Recent Bookings */}
                                <div className="card">
                                    <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>
                                    <div className="space-y-3">
                                        {displayBookings.slice(0, 5).map((booking) => (
                                            <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${getBookingStatusColor(booking)}`}></div>
                                                    <div>
                                                        <p className="text-white font-medium">{booking.userName || 'User'}</p>
                                                        <p className="text-gray-500 text-sm">Court {booking.courtId} • {format(parseISO(booking.date), 'MMM d')} • {booking.status}</p>
                                                    </div>
                                                </div>
                                                <span className="text-yellow-400 font-medium">{formatCurrency(booking.paidAmount || 0)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                        )}

                        {/* Bookings Tab */}
                        {activeTab === 'bookings' && (
                            <div className="animate-fade-in">
                                <div className="card overflow-x-auto">
                                
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-zinc-800">
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">User</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Details</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayBookings.map((booking) => (
                                                <tr key={booking.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                                                    <td className="py-3 px-4">
                                                        <div className={`w-3 h-3 rounded-full ${getBookingStatusColor(booking)}`} title={booking.status}></div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="text-white text-sm">{booking.userName || 'N/A'}</p>
                                                        <p className="text-gray-500 text-xs">{booking.userEmail}</p>
                                                    </td>
                                                    <td className="py-3 px-4 text-white text-sm">Court {booking.courtId} • {booking.slot}</td>
                                                    <td className="py-3 px-4 text-gray-300 text-sm">{format(parseISO(booking.date), 'MMM d, yyyy')}</td>
                                                    <td className="py-3 px-4 text-yellow-400 font-medium text-sm">{formatCurrency(booking.totalAmount || 0)}</td>
                                                    <td className="py-3 px-4">
                                                        {booking.status !== 'cancelled' && (
                                                            <button
                                                                onClick={() => handleCancelBooking(booking.id)}
                                                                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-500/10 border border-red-500/20"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                        {booking.status === 'cancelled' && (
                                                            <span className="text-gray-500 text-xs italic">Cancelled</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Manual Booking Tab */}
                        {activeTab === 'manual' && (
                            <div className="max-w-2xl mx-auto animate-fade-in">
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-white mb-6">Create Manual Booking</h3>
                                    <form onSubmit={handleManualBooking} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">User Email</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <input
                                                        type="email"
                                                        required
                                                        value={manualBooking.userEmail}
                                                        onChange={(e) => setManualBooking({ ...manualBooking, userEmail: e.target.value })}
                                                        className="input-field pl-10 w-full"
                                                        placeholder="player@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">User Name (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={manualBooking.userName}
                                                    onChange={(e) => setManualBooking({ ...manualBooking, userName: e.target.value })}
                                                    className="input-field w-full"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Court</label>
                                                <select
                                                    value={manualBooking.courtId}
                                                    onChange={(e) => setManualBooking({ ...manualBooking, courtId: e.target.value })}
                                                    className="input-field w-full appearance-none bg-zinc-900"
                                                >
                                                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>Court {n}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={manualBooking.date}
                                                    onChange={(e) => setManualBooking({ ...manualBooking, date: e.target.value })}
                                                    className="input-field w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Time Slot</label>
                                                <select
                                                    value={manualBooking.timeSlot}
                                                    onChange={(e) => setManualBooking({ ...manualBooking, timeSlot: e.target.value })}
                                                    className="input-field w-full appearance-none bg-zinc-900"
                                                >
                                                    {Array.from({ length: 18 }, (_, i) => {
                                                        const hour = i + 6;
                                                        const time = `${hour.toString().padStart(2, '0')}:00`;
                                                        return <option key={time} value={time}>{time}</option>;
                                                    })}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={manualBooking.amount}
                                                    onChange={(e) => setManualBooking({ ...manualBooking, amount: e.target.value })}
                                                    className="input-field w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="paid"
                                                checked={manualBooking.paid}
                                                onChange={(e) => setManualBooking({ ...manualBooking, paid: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-600 bg-zinc-900 text-yellow-500 focus:ring-yellow-500"
                                            />
                                            <label htmlFor="paid" className="text-gray-300 text-sm">Mark as fully paid</label>
                                        </div>

                                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
                                            <Plus className="w-5 h-5" />
                                            Create Admin Booking
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Discounts Tab */}
                        {activeTab === 'discounts' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Create Discount Code</h3>
                                    <form onSubmit={handleCreateDiscount} className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-400 mb-1">Code (uppercase)</label>
                                            <input
                                                type="text"
                                                required
                                                value={newDiscount.code}
                                                onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                                                className="input-field w-full font-mono uppercase"
                                                placeholder="WELCOME20"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <label className="block text-xs text-gray-400 mb-1">Discount %</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                max="100"
                                                value={newDiscount.percent}
                                                onChange={(e) => setNewDiscount({ ...newDiscount, percent: parseInt(e.target.value) })}
                                                className="input-field w-full"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <label className="block text-xs text-gray-400 mb-1">Max Uses</label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={newDiscount.maxUses}
                                                onChange={(e) => setNewDiscount({ ...newDiscount, maxUses: parseInt(e.target.value) })}
                                                className="input-field w-full"
                                            />
                                        </div>
                                        <button type="submit" className="btn-gold h-[46px]">
                                            Create Code
                                        </button>
                                    </form>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {discounts.map((discount) => (
                                        <div key={discount.id} className="card p-5 relative group border hover:border-yellow-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="px-3 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-mono font-bold tracking-wider">
                                                    {discount.code}
                                                </div>
                                                <span className="text-2xl font-bold text-white">{discount.percent}% OFF</span>
                                            </div>
                                            <div className="text-sm text-gray-400 mt-2">
                                                Limit: {discount.maxUses} uses
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDiscount(discount.id)}
                                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {discounts.length === 0 && (
                                        <p className="col-span-full text-center text-gray-500 py-8">No active discount codes.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="card overflow-hidden animate-fade-in">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-zinc-800">
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">User</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Email</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Role</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Bookings</th>
                                            {isAdmin && (
                                                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-medium">
                                                            {u.displayName?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                        <span className="text-white">{u.displayName || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-400">{u.email}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`badge text-xs ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                                        u.role === 'user' ? 'badge-gold' : 'bg-zinc-800 text-gray-400'
                                                        }`}>
                                                        {u.role || 'user'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {u.banned ? (
                                                        <span className="badge text-xs bg-red-500/20 text-red-400 border-red-500/30">
                                                            Banned
                                                        </span>
                                                    ) : (
                                                        <span className="badge text-xs bg-green-500/20 text-green-400 border-green-500/30">
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-gray-300">{u.totalBookings || 0}</td>
                                                {isAdmin && u.id !== user?.uid && (
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {u.role === 'admin' ? (
                                                                <button
                                                                    onClick={() => handleRoleChange(u.id, 'user')}
                                                                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-500/10 border border-red-500/20"
                                                                >
                                                                    <UserMinus className="w-3 h-3 inline mr-1" />
                                                                    Remove Admin
                                                                </button>
                                                            ) : u.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => handleRoleChange(u.id, 'admin')}
                                                                    className="text-yellow-400 hover:text-yellow-300 text-xs px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20"
                                                                >
                                                                    <UserPlus className="w-3 h-3 inline mr-1" />
                                                                    Make Admin
                                                                </button>
                                                            )}
                                                            {u.role !== 'admin' && (
                                                                u.banned ? (
                                                                    <button
                                                                        onClick={() => handleUnbanUser(u.id)}
                                                                        className="text-green-400 hover:text-green-300 text-xs px-2 py-1 rounded bg-green-500/10 border border-green-500/20"
                                                                    >
                                                                        Unban
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleBanUser(u.id)}
                                                                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-500/10 border border-red-500/20"
                                                                    >
                                                                        Ban User
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Broadcast Tab */}
                        {activeTab === 'broadcast' && (
                            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Send Broadcast Message</h3>
                                    <textarea
                                        value={broadcastMessage}
                                        onChange={(e) => setBroadcastMessage(e.target.value)}
                                        placeholder="Type your message to all users..."
                                        className="input-field w-full h-32 resize-none mb-4"
                                    />
                                    <button
                                        onClick={handleSendBroadcast}
                                        disabled={!broadcastMessage.trim()}
                                        className="btn-gold flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Broadcast
                                    </button>
                                </div>

                                <div className="card">
                                    <h3 className="text-lg font-semibold text-white mb-4">Previous Broadcasts</h3>
                                    {broadcasts.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No broadcasts sent yet</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {broadcasts.map((broadcast) => (
                                                <div key={broadcast.id} className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                                    <p className="text-white mb-2">{broadcast.message}</p>
                                                    <p className="text-gray-500 text-xs">
                                                        {broadcast.createdAt?.toDate ? format(broadcast.createdAt.toDate(), 'MMM d, yyyy h:mm a') : 'Unknown date'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Marketing Tab */}
                        {activeTab === 'marketing' && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Email Marketing Card */}
                                    <div className="card p-6 border-l-4 border-yellow-500">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                                                <Download className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">Target Calcutta Users</h3>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Download your user list as a CSV. You can upload this to free tools like
                                            <span className="text-yellow-400"> Brevo</span> or
                                            <span className="text-yellow-400"> MailerLite</span> to send marketing emails to your local audience for free.
                                        </p>
                                        <button
                                            onClick={handleExportUsers}
                                            className="btn-gold w-full flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Export .CSV (Calcutta Only)
                                        </button>
                                    </div>

                                    {/* Local SEO Card */}
                                    <div className="card p-6 border-l-4 border-green-500">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">Free Local Marketing Guide</h3>
                                        </div>
                                        <ul className="space-y-3 text-sm text-gray-400">
                                            <li className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                                <span>**Google Business Profile**: Essential for "Pickleball in Calcutta" searches.</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                                <span>**WhatsApp Status**: Share local discounts for morning slots.</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                                <span>**Instagram Collabs**: Tag local athletic influencers in Calcutta.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Marketing Tips */}
                                <div className="card bg-zinc-900/50 p-6 border border-zinc-800">
                                    <h4 className="text-white font-medium mb-4">Why use this list for free marketing?</h4>
                                    <div className="grid md:grid-cols-3 gap-6 text-xs text-gray-500">
                                        <div>
                                            <p className="font-bold text-gray-400 mb-1">Targeted</p>
                                            Every user in this list has already shown interest in HQ Sport.
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-400 mb-1">Cost Effective</p>
                                            Using CSV exports keeps your costs at exactly ₹0.
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-400 mb-1">Spam Protection</p>
                                            Tools like Brevo ensure your emails actually land in the "Inbox".
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
