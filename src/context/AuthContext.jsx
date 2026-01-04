import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, getUserData, logOut } from '../services/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Fetch additional user data from Firestore
                const { data } = await getUserData(firebaseUser.uid);
                if (data?.banned) {
                    await logOut();
                    setUser(null);
                    setUserData(null);
                    setLoading(false);
                    return;
                }
                setUserData(data);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshUserData = async () => {
        if (user) {
            const { data } = await getUserData(user.uid);
            setUserData(data);
        }
    };

    const handleLogout = async () => {
        await logOut();
        setUser(null);
        setUserData(null);
    };

    const value = {
        user,
        userData,
        loading,
        isAuthenticated: !!user,
        isAdmin: userData?.role === 'admin' || userData?.role === 'superadmin',
        isSuperAdmin: userData?.role === 'superadmin',
        refreshUserData,
        logout: handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
