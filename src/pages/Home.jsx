import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Users, Star, Zap, Trophy, Wifi, Coffee, Car, Sparkles, ChevronRight } from 'lucide-react';

const Home = () => {
    const features = [
        {
            icon: <Trophy className="w-7 h-7" />,
            title: "Professional Courts",
            description: "4 premium outdoor courts with tournament-grade surfaces and professional lighting"
        },
        {
            icon: <MapPin className="w-7 h-7" />,
            title: "Rooftop Location",
            description: "Stunning panoramic views of Kolkata's skyline from our iconic Chowringhee Road venue"
        },
        {
            icon: <Users className="w-7 h-7" />,
            title: "Community Hub",
            description: "Connect with fellow players, join events, and become part of an elite community"
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: "Easy Booking",
            description: "Book your court in seconds with our seamless online reservation system"
        }
    ];

    const amenities = [
        { icon: <Coffee className="w-6 h-6" />, name: "Glenburn Cafe", desc: "Premium refreshments" },
        { icon: <Wifi className="w-6 h-6" />, name: "Free WiFi", desc: "High-speed connectivity" },
        { icon: <Car className="w-6 h-6" />, name: "Valet Parking", desc: "Complimentary service" },
        { icon: <Star className="w-6 h-6" />, name: "Pro Equipment", desc: "Paddle rentals available" },
    ];

    return (
        <div className="min-h-screen overflow-hidden bg-[#020617]">

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#020617]/50 to-[#020617]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-[#020617]/20 to-[#020617]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8 animate-fade-in backdrop-blur-md">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-gold-gradient text-sm font-bold tracking-wide uppercase">Kolkata's Best Premium Pickleball Arena</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tighter animate-fade-in-up">
                        Elevate Your <br />
                        <span
                            className="drop-shadow-2xl"
                            style={{
                                background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            Game Style
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light tracking-wide animate-fade-in-up delay-100">
                        Experience the thrill of pickleball on India's most luxurious rooftop court.<br className="hidden md:block" />
                        Where passion meets prestige.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-200">
                        <Link to="/book" className="btn-primary w-full sm:w-auto px-10 py-5 text-lg group">
                            Book a Court
                        </Link>
                        <Link to="/about" className="btn-secondary w-full sm:w-auto px-10 py-5 text-lg backdrop-blur-md group">
                            <span className="relative z-10">About Us</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-[#020617]"></div>

                <div className="relative max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <span className="text-gold-gradient text-sm font-medium uppercase tracking-widest">Why Choose Us</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 tracking-tight">
                            The HQ <span className="text-gold-gradient">Advantage</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                            Every detail crafted for the perfect pickleball experience
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-10">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-10 md:p-14 group cursor-default flex items-start gap-6"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-900/10 border border-yellow-500/10">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gold-gradient transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed text-lg">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Venue Showcase */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]"></div>

                <div className="relative max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Content */}
                        <div className="order-2 lg:order-1">
                            <span className="text-gold-gradient text-sm font-medium uppercase tracking-widest">Our Venue</span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-8 tracking-tight">
                                Rooftop Courts with <br /><span className="text-gold-gradient">City Views</span>
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">
                                Located atop the iconic Kanak Building on Chowringhee Road, our premium
                                rooftop facility offers 4 professional courts with breathtaking panoramic
                                views of Kolkata's skyline.
                            </p>

                            {/* Amenities */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
                                {amenities.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/10">
                                            {item.icon}
                                        </div>
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to="/about" className="btn-secondary inline-flex px-8 py-4 text-lg">
                                <span>Explore Venue</span>
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Link>
                        </div>

                        {/* Image */}
                        <div className="relative order-1 lg:order-2">
                            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-blue-500/10 rounded-3xl blur-2xl animate-pulse-slow"></div>
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl skew-y-1 transform transition hover:skew-y-0 duration-500">
                                <img
                                    src="/a916fd8f-8849-48e9-a74d-ec4b3b56767a.png"
                                    alt="HQ Sport Courts"
                                    className="w-full hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-40 relative">
                <div className="absolute inset-0 bg-[#020617]"></div>

                <div className="relative max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-gold-gradient text-sm font-medium uppercase tracking-widest">Pricing</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6 tracking-tight">
                            Simple & <span className="text-gold-gradient">Transparent</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                            No hidden fees, no surprises. Just premium courts at fair prices.
                        </p>
                    </div>

                </div>

                <div className="h-16 md:h-20 lg:h-24"></div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto items-stretch">
                    {/* Morning */}
                    <div className="glass-card p-12 flex flex-col items-center text-center hover:bg-white/5 transition-colors h-full">
                        <div className="flex-1 flex flex-col items-center justify-center gap-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-800 text-slate-300 text-sm font-medium">
                                <Clock className="w-4 h-4" />
                                Morning
                            </div>
                            <div>
                                <div className="text-5xl font-bold text-white mb-2">₹800</div>
                                <div className="text-slate-500 text-lg">per hour</div>
                            </div>
                            <p className="text-slate-400 text-base">6:00 AM — 1:00 PM</p>
                        </div>
                        <Link to="/book" className="btn-secondary w-full justify-center py-4 mt-10">Book Now</Link>
                    </div>

                    {/* Evening - Featured */}
                    <div className="glass-card p-12 text-center flex flex-col items-center relative transform lg:-translate-y-6 border-yellow-500/30 bg-gradient-to-b from-yellow-500/5 to-transparent h-full overflow-visible">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-2 rounded-full bg-gold-gradient text-black text-sm font-bold shadow-lg shadow-yellow-500/20 uppercase tracking-wider z-20">
                            Most Popular
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-8 pt-6">
                            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium">
                                <Sparkles className="w-4 h-4" />
                                Evening
                            </div>
                            <div>
                                <div className="text-6xl font-bold text-gold-gradient mb-3">₹1200</div>
                                <div className="text-slate-500 text-lg">per hour</div>
                            </div>
                            <p className="text-slate-300 text-lg">1:00 PM — 12:00 AM</p>
                        </div>
                        <Link to="/book" className="btn-primary w-full justify-center py-4 text-lg shadow-xl shadow-yellow-500/20 mt-12">Book Now</Link>
                    </div>

                    {/* Paddle Rental */}
                    <div className="glass-card p-12 flex flex-col items-center text-center hover:bg-white/5 transition-colors h-full">
                        <div className="flex-1 flex flex-col items-center justify-center gap-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
                                <Trophy className="w-4 h-4" />
                                Equipment
                            </div>
                            <div>
                                <div className="text-5xl font-bold text-white mb-2">₹250</div>
                                <div className="text-slate-500 text-lg">per hour</div>
                            </div>
                            <p className="text-slate-400 text-base">Pro Paddle Rental
                                <br />
                                (Available on site.)</p>
                        </div>
                        <Link to="/book" className="btn-secondary w-full justify-center py-4 mt-10">Book Now</Link>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#0f172a]"></div>

                <div className="relative max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="text-gold-gradient text-sm font-medium uppercase tracking-widest">Location</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 tracking-tight">Find Us</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Map */}
                        <div className="h-[450px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.4754789544715!2d88.34726931495957!3d22.56114798518292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277a2a3c6f6c3%3A0x5b8e0c6c4b1f8f0a!2s41%2C%20Chowringhee%20Rd%2C%20Kolkata%2C%20West%20Bengal%20700071!5e0!3m2!1sen!2sin!4v1703912800000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
                                allowFullScreen=""
                                loading="lazy"
                                className="relative z-0"
                            ></iframe>
                        </div>

                        {/* Info */}
                        <div className="glass-card p-8 md:p-10">
                            <h3 className="text-2xl font-bold text-white mb-8">Visit Our Venue</h3>

                            <div className="space-y-8 mb-12">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 flex-shrink-0 border border-yellow-500/10">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold mb-1">Address</p>
                                        <p className="text-slate-400 leading-relaxed">
                                            41 Chowringhee Road, Rooftop of Kanak Building<br />
                                            Near Glenburn Cafe, Kolkata — 700071
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 flex-shrink-0 border border-yellow-500/10">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold mb-1">Hours</p>
                                        <p className="text-slate-400">
                                            6:00 AM — 12:00 AM<br />
                                            <span className="text-gold-gradient font-medium">Open 7 days a week</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/book" className="btn-primary w-full justify-center py-4 text-lg">
                                <span>Book Now</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section >

            {/* Final CTA */}
            < section className="py-40 relative overflow-hidden" >
                <div className="absolute inset-0 bg-[#020617]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-[#020617]/50 to-[#020617]"></div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                        Ready to <span className="text-gold-gradient">Play</span>?
                    </h2>
                    <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-light">
                        Join our growing community of players.
                        Book your court today and elevate your game.
                    </p>
                    <Link to="/book" className="btn-primary inline-flex px-12 py-6 text-lg animate-pulse-glow shadow-2xl shadow-yellow-500/20">
                        <span>Book a Court</span>
                    </Link>
                </div>
            </section >

        </div >
    );
};

export default Home;
