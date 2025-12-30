import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Calendar, Shield, ChevronDown, User } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onLoginClick, onSignupClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, userData, isAuthenticated, isAdmin, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setProfileOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Book', path: '/book' },
        { name: 'Community', path: '/community' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'py-3 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50'
            : 'py-5 bg-gradient-to-b from-[#020617]/90 to-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative flex items-center justify-between h-20">

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors z-50"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Logo - Centered Absolutely */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="HQ Sport"
                            className="h-12 md:h-16 w-auto"
                        />
                    </Link>
                </div>

                {/* Desktop Nav - Left Side */}
                <div className="hidden xl:flex items-center gap-8 z-40">
                    {navLinks.slice(0, 3).map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                                ? 'text-yellow-400 bg-yellow-400/5'
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Nav - Right Side (Remaining Links + Actions) */}
                <div className="hidden xl:flex items-center gap-8 z-40 ml-auto">
                    {navLinks.slice(3).map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location.pathname === link.path
                                ? 'text-yellow-400 bg-yellow-400/5'
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="w-px h-6 bg-slate-800 mx-2"></div>
                    {/* Social Buttons */}
                    <div className="flex items-center gap-2">
                        <a
                            href="https://wa.me/918100144901"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all group"
                        >
                            <span className="text-sm font-medium text-[#25D366] group-hover:text-[#4ade80] transition-colors">WhatsApp Us</span>
                        </a>
                        <a
                            href="https://instagram.com/hq.sportslab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center text-pink-400 hover:from-pink-500/20 hover:to-purple-500/20 transition-colors border border-pink-500/10"
                        >
                            <FaInstagram className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="w-px h-6 bg-slate-800"></div>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl border border-slate-700/50 hover:border-slate-600 bg-slate-800/30 transition-all"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                    <span className="text-black font-bold text-sm">
                                        {userData?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="text-left hidden 2xl:block">
                                    <p className="text-xs text-slate-400 leading-none">Hello,</p>
                                    <p className="text-sm text-white font-medium leading-none mt-1 max-w-[100px] truncate">
                                        {userData?.displayName?.split(' ')[0] || 'User'}
                                    </p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden animate-fade-in-up origin-top-right">
                                    <div className="p-5 border-b border-slate-700 bg-slate-800/30">
                                        <p className="text-white font-medium truncate text-lg">{userData?.displayName || 'User'}</p>
                                        <p className="text-slate-400 text-sm truncate mt-1">{user?.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            My Bookings
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                                            >
                                                <Shield className="w-4 h-4" />
                                                Admin Panel
                                            </Link>
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-slate-700">
                                        <button
                                            onClick={logout}
                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onLoginClick}
                                className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={onSignupClick}
                                className="btn-primary text-sm py-2 px-6 shadow-lg shadow-yellow-500/10"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>


            </div>


            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-[#020617]/95 backdrop-blur-xl z-40 transition-all duration-300 xl:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="flex flex-col h-full pt-24 px-6 pb-10 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`px-6 py-4 rounded-2xl text-lg font-medium transition-all ${location.pathname === link.path
                                    ? 'text-black bg-yellow-400 shadow-lg shadow-yellow-400/20'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-px bg-slate-800 my-6"></div>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-4"
                                >
                                    <Calendar className="w-5 h-5" />
                                    My Bookings
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-4"
                                >
                                    <User className="w-5 h-5" />
                                    My Profile
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-4 rounded-2xl text-yellow-400 hover:bg-yellow-400/10 flex items-center gap-4"
                                    >
                                        <Shield className="w-5 h-5" />
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={() => { logout(); setIsOpen(false); }}
                                    className="px-6 py-4 rounded-2xl text-red-400 hover:bg-red-400/10 flex items-center gap-4 text-left w-full mt-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <button
                                    onClick={() => { onLoginClick(); setIsOpen(false); }}
                                    className="px-6 py-4 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 text-center border border-slate-700"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => { onSignupClick(); setIsOpen(false); }}
                                    className="btn-primary w-full justify-center"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
