import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Calendar, Shield, ChevronDown, User, Instagram } from 'lucide-react';
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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Book', path: '/book' },
        { name: 'Community', path: '/community' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            {/* Main Navbar Bar */}
            <div className={`relative z-50 transition-all duration-300 ${scrolled
                ? 'py-3 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50'
                : 'py-5 bg-gradient-to-b from-[#020617]/90 to-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative flex items-center h-20">

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="xl:hidden p-2 relative rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors z-50"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Logo - Perfectly Centered */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shrink-0">
                        <Link to="/" className="flex items-center">
                            <img
                                src="logo.png"
                                alt="HQ Sport"
                                className="h-12 md:h-16 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop Nav - Left Side (All links) */}
                    <div className="hidden xl:flex items-center gap-6 z-40 flex-1 order-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${location.pathname === link.path
                                    ? 'text-yellow-400 bg-yellow-400/5'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Nav - Right Side (Actions + Socials) */}
                    <div className="hidden xl:flex items-center gap-4 flex-1 justify-end z-40 order-3">
                        {/* Social Buttons */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://wa.me/12066788644"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/10"
                                title="WhatsApp Us"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.554 4.197 1.608 6.042L0 24l6.117-1.605a11.782 11.782 0 005.925 1.599h.005c6.633 0 12.043-5.408 12.048-12.046a11.803 11.803 0 00-3.693-8.527z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/hq.sportslab"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center text-pink-400 hover:from-pink-500/20 hover:to-purple-500/20 transition-colors border border-pink-500/10"
                                title="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>

                        <div className="w-px h-6 bg-slate-800 mx-1"></div>

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
                                    <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden animate-fade-in-up origin-top-right z-50">
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
                                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={onSignupClick}
                                    className="btn-primary text-xs py-2 px-5 shadow-lg shadow-yellow-500/10 whitespace-nowrap"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-[#020617]/95 backdrop-blur-xl z-[40] transition-all duration-300 xl:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="flex flex-col h-[100dvh] pt-32 px-6 pb-10 overflow-y-auto">
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
