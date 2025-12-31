import { Link } from 'react-router-dom';
import { Instagram, MapPin, Clock, Mail, MessageCircle } from 'lucide-react';
// cleaned up unused import

const Footer = () => {
    return (
        <footer className="bg-[#020617] border-t border-slate-800/50">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div>
                        <Link to="/" className="inline-block mb-6">
                            <img src="logo.png" alt="HQ Sport" className="h-12" />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Kolkata's premier rooftop pickleball destination. Experience world-class courts and stunning city views.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com/hq.sportslab"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 hover:bg-pink-500/20 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <Link
                                to="https://wa.me/12066788644"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white transition-all transform hover:scale-110"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Book a Court', path: '/book' },
                                { name: 'Community', path: '/community' },
                                { name: 'Gallery', path: '/gallery' },
                                { name: 'About Us', path: '/about' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-slate-400 hover:text-yellow-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Court Rates</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="text-slate-400">
                                <span className="text-yellow-400 font-medium">₹800</span> / hour
                                <span className="block text-slate-500 text-xs mt-0.5">Morning (6 AM – 1 PM)</span>
                            </li>
                            <li className="text-slate-400">
                                <span className="text-yellow-400 font-medium">₹1200</span> / hour
                                <span className="block text-slate-500 text-xs mt-0.5">Evening (1 PM – 12 AM)</span>
                            </li>
                            <li className="text-slate-400">
                                <span className="text-yellow-400 font-medium">₹250</span> / hour
                                <span className="block text-slate-500 text-xs mt-0.5">Paddle Rental</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3 text-slate-400">
                                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <span>41 Chowringhee Road, Rooftop of Kanak Building, Kolkata — 700071</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-400">
                                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                <span>6 AM — 12 AM Daily</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-slate-800/50">
                <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6 md:pr-24 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} HQ Sport. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/refund" className="hover:text-white transition-colors">Refunds</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
