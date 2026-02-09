import { MapPin, Clock, Coffee, Star, Instagram, Trophy, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const features = [
        {
            icon: <Star className="w-8 h-8" />,
            title: "Premium Courts",
            description: "4 world-class outdoor courts with professional-grade surfaces designed for optimal play"
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            title: "Stunning Location",
            description: "Rooftop venue with panoramic views of Kolkata's iconic skyline"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Extended Hours",
            description: "Play from early morning to midnight, 7 days a week"
        },
        {
            icon: <Coffee className="w-8 h-8" />,
            title: "Premium Amenities",
            description: "Lounge, refreshments, and the famous Glenburn Cafe nearby"
        }
    ];

    const amenities = [
        { name: "Premium Lounge", desc: "Comfortable seating", icon: "🛋️" },
        { name: "Pro Lighting", desc: "Night games", icon: "💡" },
        { name: "Changing Rooms", desc: "Clean & modern", icon: "🚿" },
        { name: "Refreshments", desc: "Cafe & drinks", icon: "☕" }
    ];

    return (
        <div className="min-h-screen pt-48 pb-20 bg-[#020617] overflow-x-hidden w-full">

            {/* Hero Section */}
            <section className="relative py-16 md:py-24">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-6 relative text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Kolkata's Premier Destination</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                        About <span className="text-yellow-gradient">HQ Sport</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        More than just courts. HQ Sport is where passion meets luxury—a premium rooftop
                        pickleball experience in the heart of Kolkata.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 md:py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">

                        {/* Text Content */}
                        <div className="order-2 lg:order-1 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                                The <span className="text-yellow-gradient">Story</span>
                            </h2>
                            <div className="space-y-6 text-slate-400 text-base md:text-lg leading-relaxed">
                                <p>
                                    HQ Sport was born from a simple vision: to create a world-class pickleball
                                    experience that rivals the best facilities globally, right here in Kolkata.
                                </p>
                                <p>
                                    Perched on the rooftop of the historic Kanak Building on Chowringhee Road,
                                    our venue offers something truly unique—the thrill of the game combined
                                    with breathtaking views of the city we love.
                                </p>
                                <p>
                                    Whether you're a seasoned player or picking up a paddle for the first time,
                                    HQ Sport welcomes you to experience pickleball like never before.
                                </p>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 order-1 lg:order-2">
                            {features.map((feature, index) => (
                                <div key={index} className="glass-card p-8 h-full border border-slate-800 hover:border-yellow-500/30 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-6 shadow-lg shadow-yellow-500/5">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-400 text-base leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-20 md:py-32 bg-[#0f172a] relative">
                <div className="absolute inset-0 grid-bg opacity-30"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Find <span className="text-yellow-gradient">Us</span>
                        </h2>
                        <p className="text-slate-400 text-lg">Located in the heart of Kolkata</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                        <div className="h-[350px] md:h-[500px] rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.4754789544715!2d88.34726931495957!3d22.56114798518292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277a2a3c6f6c3%3A0x5b8e0c6c4b1f8f0a!2s41%2C%20Chowringhee%20Rd%2C%20Kolkata%2C%20West%20Bengal%20700071!5e0!3m2!1sen!2sin!4v1703912800000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.8)' }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>

                        <div className="glass-card p-8 md:p-12 flex flex-col justify-center border border-slate-700/50">
                            <h3 className="text-2xl font-bold text-white mb-8">Visit Our Venue</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold mb-2">Address</p>
                                        <p className="text-slate-400 leading-relaxed">
                                            41 Chowringhee Road<br />
                                            Rooftop of Kanak Building<br />
                                            Kolkata — 700071
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 flex-shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold mb-2">Hours</p>
                                        <p className="text-slate-400">
                                            6:00 AM — 12:00 AM<br />
                                            <span className="text-yellow-400 font-medium">Open 7 days a week</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/book" className="btn-primary w-full mt-12 text-center justify-center py-4 text-lg shadow-xl shadow-yellow-500/20">
                                Book a Court
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities Grid */}
            <section className="py-20 md:py-32">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Premium <span className="text-yellow-gradient">Amenities</span>
                        </h2>
                        <p className="text-slate-400 text-lg">Everything you need for the perfect game</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {amenities.map((item, index) => (
                            <div key={index} className="glass-card p-8 flex items-center gap-6 hover:border-yellow-500/30 transition-all hover:-translate-y-1 h-full">
                                <span className="text-5xl">{item.icon}</span>
                                <div className="min-w-0">
                                    <h3 className="text-white font-bold text-xl mb-2 truncate">{item.name}</h3>
                                    <p className="text-slate-500 text-base truncate">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
