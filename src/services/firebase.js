import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../config/firebase.config';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey &&
        firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
        firebaseConfig.projectId &&
        firebaseConfig.projectId !== 'YOUR_PROJECT_ID';
};

// Initialize Firebase only if configured
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
    }
} else {
    console.warn('Firebase not configured. Running in demo mode.');
}

// Demo mode flag
const isDemoMode = !isFirebaseConfigured();

// Auth Functions
export const signInWithGoogle = async () => {
    if (isDemoMode) {
        return { user: null, error: 'Firebase not configured. Please add your Firebase credentials to .env file.' };
    }
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

export const signInWithEmail = async (email, password) => {
    if (isDemoMode) {
        return { user: null, error: 'Firebase not configured. Please add your Firebase credentials to .env file.' };
    }
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

export const signUpWithEmail = async (email, password, displayName) => {
    if (isDemoMode) {
        return { user: null, error: 'Firebase not configured. Please add your Firebase credentials to .env file.' };
    }
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Update Auth Profile
        await updateProfile(result.user, { displayName });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
            email,
            displayName,
            createdAt: serverTimestamp(),
            role: 'user',
            hoursPlayed: 0,
            totalBookings: 0,
            profileComplete: false
        });
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

export const logOut = async () => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

// Phone Auth
export const setupRecaptcha = (containerId) => {
    if (isDemoMode) return null;
    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => { }
    });
    return recaptchaVerifier;
};

export const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
    if (isDemoMode) {
        return { confirmationResult: null, error: 'Firebase not configured.' };
    }
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        return { confirmationResult, error: null };
    } catch (error) {
        return { confirmationResult: null, error: error.message };
    }
};

// User Functions
export const getUserData = async (userId) => {
    if (isDemoMode) {
        return { data: null, error: 'Demo mode' };
    }
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return { data: userDoc.data(), error: null };
        }
        return { data: null, error: 'User not found' };
    } catch (error) {
        return { data: null, error: error.message };
    }
};

export const updateUserData = async (userId, data) => {
    if (isDemoMode) {
        return { error: 'Demo mode' };
    }
    try {
        await updateDoc(doc(db, 'users', userId), data);
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

export const createUserProfile = async (userId, data) => {
    if (isDemoMode) {
        return { error: 'Demo mode' };
    }
    try {
        await setDoc(doc(db, 'users', userId), {
            ...data,
            createdAt: serverTimestamp(),
            role: 'user',
            hoursPlayed: 0,
            totalBookings: 0
        });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

// Booking Functions
export const createBooking = async (bookingData) => {
    if (isDemoMode) {
        // Return mock booking ID for demo
        return { id: 'demo-' + Date.now(), error: null };
    }
    try {
        const docRef = await addDoc(collection(db, 'bookings'), {
            ...bookingData,
            createdAt: serverTimestamp(),
            status: 'booked'
        });

        // Update user stats if userId exists and isn't 'admin-created'
        if (bookingData.userId && bookingData.userId !== 'admin-created') {
            const userRef = doc(db, 'users', bookingData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const currentData = userSnap.data();
                await updateDoc(userRef, {
                    totalBookings: (currentData.totalBookings || 0) + 1,
                    hoursPlayed: (currentData.hoursPlayed || 0) + (bookingData.slots?.length || 1)
                });
            }
        }

        return { id: docRef.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
};

export const getUserBookings = async (userId, userEmail) => {
    if (isDemoMode) {
        return { bookings: [], error: null };
    }
    try {
        let bookings = [];

        // Query by userId
        const q1 = query(
            collection(db, 'bookings'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot1 = await getDocs(q1);
        bookings = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Query by userEmail if provided and add unique ones
        if (userEmail) {
            const q2 = query(
                collection(db, 'bookings'),
                where('userEmail', '==', userEmail),
                orderBy('createdAt', 'desc')
            );
            const snapshot2 = await getDocs(q2);
            snapshot2.docs.forEach(doc => {
                const data = { id: doc.id, ...doc.data() };
                if (!bookings.some(b => b.id === data.id)) {
                    bookings.push(data);
                }
            });

            // Re-sort if we added more
            bookings.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });
        }

        return { bookings, error: null };
    } catch (error) {
        return { bookings: [], error: error.message };
    }
};

export const getBookingsForDate = async (date) => {
    if (isDemoMode) {
        return { bookings: [], error: null };
    }
    try {
        const q = query(
            collection(db, 'bookings'),
            where('date', '==', date)
        );
        const snapshot = await getDocs(q);
        const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { bookings, error: null };
    } catch (error) {
        return { bookings: [], error: error.message };
    }
};

export const updateBookingStatus = async (bookingId, status) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await updateDoc(doc(db, 'bookings', bookingId), { status });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

export const getAllBookings = async () => {
    if (isDemoMode) {
        return { bookings: [], error: null };
    }
    try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { bookings, error: null };
    } catch (error) {
        return { bookings: [], error: error.message };
    }
};

// Admin Functions
export const getAllUsers = async () => {
    if (isDemoMode) {
        return { users: [], error: null };
    }
    try {
        const snapshot = await getDocs(collection(db, 'users'));
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { users, error: null };
    } catch (error) {
        return { users: [], error: error.message };
    }
};

export const setUserRole = async (userId, role) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await updateDoc(doc(db, 'users', userId), { role });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

export const banUser = async (userId) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await updateDoc(doc(db, 'users', userId), {
            banned: true,
            bannedAt: serverTimestamp()
        });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

export const unbanUser = async (userId) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await updateDoc(doc(db, 'users', userId), {
            banned: false,
            bannedAt: null
        });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};


// Chat Functions (using Firestore instead of Realtime DB to avoid additional errors)
export const sendChatMessage = async (roomId, message) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await addDoc(collection(db, 'chats', roomId, 'messages'), {
            ...message,
            timestamp: serverTimestamp()
        });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

export const subscribeToChatRoom = (roomId, callback) => {
    if (isDemoMode) {
        callback([]);
        return () => { };
    }
    try {
        const messagesRef = collection(db, 'chats', roomId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(messages);
        });
        return unsubscribe;
    } catch (error) {
        console.error('Chat subscription error:', error);
        callback([]);
        return () => { };
    }
};

// Gallery Functions
export const getGalleryImages = async () => {
    if (isDemoMode) {
        return { images: [], error: null };
    }
    try {
        const snapshot = await getDocs(collection(db, 'gallery'));
        const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { images, error: null };
    } catch (error) {
        return { images: [], error: error.message };
    }
};

export const addGalleryImage = async (imageData) => {
    if (isDemoMode) {
        return { id: 'demo-' + Date.now(), error: null };
    }
    try {
        const docRef = await addDoc(collection(db, 'gallery'), {
            ...imageData,
            createdAt: serverTimestamp()
        });
        return { id: docRef.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
};

export const deleteGalleryImage = async (imageId) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await deleteDoc(doc(db, 'gallery', imageId));
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

// Broadcast Functions
export const sendBroadcast = async (message) => {
    if (isDemoMode) {
        return { id: 'demo-' + Date.now(), error: null };
    }
    try {
        const docRef = await addDoc(collection(db, 'broadcasts'), {
            message,
            createdAt: serverTimestamp(),
            read: []
        });
        return { id: docRef.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
};

export const getBroadcasts = async () => {
    if (isDemoMode) {
        return { broadcasts: [], error: null };
    }
    try {
        const q = query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const broadcasts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { broadcasts, error: null };
    } catch (error) {
        return { broadcasts: [], error: error.message };
    }
};

// Discount Functions
export const createDiscount = async (discountData) => {
    if (isDemoMode) {
        return { id: 'demo-' + Date.now(), error: null };
    }
    try {
        const docRef = await addDoc(collection(db, 'discounts'), {
            ...discountData,
            createdAt: serverTimestamp(),
            active: true
        });
        return { id: docRef.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
};

export const getDiscounts = async () => {
    if (isDemoMode) {
        return { discounts: [], error: null };
    }
    try {
        const q = query(collection(db, 'discounts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const discounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return { discounts, error: null };
    } catch (error) {
        return { discounts: [], error: error.message };
    }
};

export const deleteDiscount = async (discountId) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await deleteDoc(doc(db, 'discounts', discountId));
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

// Booking Management
export const cancelBooking = async (bookingId) => {
    if (isDemoMode) {
        return { error: null };
    }
    try {
        await updateDoc(doc(db, 'bookings', bookingId), {
            status: 'cancelled',
            cancelledAt: serverTimestamp()
        });
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

// Real-Time Listeners for Admin Panel
export const subscribeToBookings = (callback) => {
    if (isDemoMode || !db) {
        callback([]);
        return () => { };
    }
    try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(bookings);
        });
    } catch (error) {
        console.error('Error subscribing to bookings:', error);
        return () => { };
    }
};

export const subscribeToUsers = (callback) => {
    if (isDemoMode || !db) {
        callback([]);
        return () => { };
    }
    try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(users);
        });
    } catch (error) {
        console.error('Error subscribing to users:', error);
        return () => { };
    }
};

export const subscribeToDiscounts = (callback) => {
    if (isDemoMode || !db) {
        callback([]);
        return () => { };
    }
    try {
        const q = query(collection(db, 'discounts'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const discounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(discounts);
        });
    } catch (error) {
        console.error('Error subscribing to discounts:', error);
        return () => { };
    }
};


export const subscribeToBroadcasts = (callback) => {
    if (isDemoMode || !db) {
        callback([]);
        return () => { };
    }
    try {
        const q = query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const broadcasts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(broadcasts);
        });
    } catch (error) {
        console.error('Error subscribing to broadcasts:', error);
        return () => { };
    }
};

export const subscribeToGallery = (callback) => {
    if (isDemoMode || !db) {
        callback([]);
        return () => { };
    }
    try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(images);
        });
    } catch (error) {
        console.error('Error subscribing to gallery:', error);
        return () => { };
    }
};

const onAuthStateChangedWrapper = (authInstance, callback) => {
    if (isDemoMode || !authInstance) {
        // In demo mode, immediately call with null user
        setTimeout(() => callback(null), 100);
        return () => { };
    }
    return onAuthStateChanged(authInstance, callback);
};

export { auth, db, onAuthStateChangedWrapper as onAuthStateChanged, isDemoMode };
