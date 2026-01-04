// AI Chatbot Service - Advanced Rule-Based Engine
// Features: Keyword Scoring, Context Awareness, "Luxury Concierge" Persona

const facilityInfo = {
    location: {
        address: '41 Chowringhee Road, Kolkata - 700071',
        landmark: 'Rooftop of Kanak Building, Near Glenburn Cafe',
        directions: 'We are centrally located in the heart of Kolkata. Pro Tip: Enter via the main gate of Kanak Building and take the elevator to the rooftop.'
    },
    courts: {
        total: 4,
        type: 'Outdoor Premium',
        surface: 'Professional-grade synthetic acrylic surface (ITF Standard)',
        lighting: 'Broadcast-quality LED floodlights'
    },
    timing: {
        open: '6:00 AM',
        close: '12:00 AM (Midnight)',
        days: 'Open 7 days a week'
    },
    pricing: {
        morning: { time: '6 AM - 1 PM', price: 800 },
        evening: { time: '1 PM - 12 AM', price: 1200 },
        paddleRental: { price: 250, note: 'per hour/paddle' }
    },
    contact: {
        instagram: '@hq.sportslab',
        email: 'hello@hqsport.in',
        whatsapp: '+1 2066788644',
        phone: '2066788644'
    }
};

const knowledgeBase = [
    // --- GREETINGS & PERSONA ---
    {
        id: 'greeting',
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'start'],
        weight: 1,
        response: "Welcome to HQ Sport. I am your concierge. How may I assist you with your premium pickleball experience today? available services: Booking, Membership, or Facility details."
    },
    {
        id: 'status',
        keywords: ['how are you', 'who are you', 'bot', 'ai', 'real person'],
        weight: 2,
        response: "I am the HQ Sport Concierge AI, designed to ensure your experience is seamless. I'm functioning perfectly and ready to assist you."
    },

    // --- PRICING & RATES ---
    {
        id: 'pricing_general',
        keywords: ['price', 'cost', 'rate', 'charge', 'how much', 'fee', 'pricing', 'tariff'],
        weight: 5,
        response: `Our court rates are structured for your convenience:\n\n☀️ **Morning Session** (6 AM - 1 PM): **₹${facilityInfo.pricing.morning.price}/hour**\n🌙 **Evening Session** (1 PM - 12 AM): **₹${facilityInfo.pricing.evening.price}/hour**\n\nWould you like to proceed with a booking?`
    },
    {
        id: 'pricing_rental',
        keywords: ['rent', 'paddle', 'racket', 'gear', 'equipment', 'ball'],
        weight: 5,
        response: `Travel light? No problem. We offer professional-grade paddles for rent at **₹${facilityInfo.pricing.paddleRental.price}** per hour. Premium balls are included with every court booking.`
    },

    // --- BOOKING & PAYMENTS ---
    {
        id: 'how_to_book',
        keywords: ['book', 'reservation', 'slot', 'schedule', 'reserve', 'booking'],
        weight: 5,
        response: "Booking is effortless. Simply click the **'Book a Court'** button in the navigation menu, select your preferred date and time, and confirm. You can choose to pay the full amount or a 50% advance to secure your slot."
    },
    {
        id: 'payment_methods',
        keywords: ['pay', 'payment', 'upi', 'card', 'cash', 'cancel', 'refund'],
        weight: 4,
        response: "We accept all major digital payment methods via Razorpay (UPI, Credit/Debit Cards). \n\n**Cancellation Policy:** Full refunds are processed significantly for cancellations made 24+ hours in advance. Cancellations within 24 hours are non-refundable."
    },

    // --- LOCATION & FACILITY ---
    {
        id: 'location',
        keywords: ['where', 'location', 'address', 'map', 'directions', 'reach', 'landmark'],
        weight: 5,
        response: `We are located at the **Rooftop of Kanak Building**, detailed below:\n\n📍 **${facilityInfo.location.address}**\n(Near ${facilityInfo.location.landmark})\n\nValet parking is available for our guests.`
    },
    {
        id: 'timing',
        keywords: ['time', 'open', 'close', 'hours', 'available', 'working'],
        weight: 4,
        response: `We are open **${facilityInfo.timing.days}** from **${facilityInfo.timing.open} to ${facilityInfo.timing.close}**. \n\nThe stunning evening lights make night games particularly special.`
    },
    {
        id: 'amenities',
        keywords: ['amenity', 'shower', 'change', 'locker', 'food', 'cafe', 'wifi', 'parking'],
        weight: 4,
        response: "HQ Sport is designed for luxury. Enjoy our:\n\n• Premium Lounge & Cafe\n• Changing Rooms & Lockers\n• Valet Parking\n• Pro Shop\n• High-speed WiFi\n\nEverything you need for a world-class experience."
    },

    // --- SPORT SPECIFIC ---
    {
        id: 'about_pickleball',
        keywords: ['what is pickleball', 'rules', 'how to play', 'beginner'],
        weight: 3,
        response: "Pickleball is the world's fastest-growing sport—a perfect blend of tennis, badminton, and ping-pong. It's easy to learn but challenging to master. We welcome players of all levels, and our community is very beginner-friendly."
    },

    {
        id: 'coaching',
        keywords: ['coach', 'learn', 'training', 'train', 'class', 'lesson', 'event', 'tournament'],
        weight: 3,
        response: "We host regular clinics, community mixers, and tournaments. Check our **'Community'** page for upcoming events, or inquire at the desk for private coaching sessions."
    },
    {
        id: 'legal',
        keywords: ['privacy', 'terms', 'policy', 'condition', 'legal', 'refund policy'],
        weight: 3,
        response: "Transparency is key. You can find our Privacy Policy and Terms of Service linked at the bottom of the page. For refunds: Cancellations 24 hours prior get a full credit; same-day cancellations are non-refundable."
    },
    {
        id: 'contact_direct',
        keywords: ['contact', 'call', 'whatsapp', 'reach out', 'talk to human', 'support'],
        weight: 5,
        response: `Need human assistance? You can reach us via WhatsApp at **${facilityInfo.contact.whatsapp}** or call us at **${facilityInfo.contact.phone}**. You can also email us at **${facilityInfo.contact.email}**.`
    }
];

/**
 * Calculates a match score based on keyword presence and weighting.
 * @param {string} input - User input
 * @param {object} entry - Knowledge base entry
 * @returns {number} - Calculated score
 */
const calculateScore = (input, entry) => {
    let score = 0;
    const lowerInput = input.toLowerCase();

    // Check for exact phrases or token matches
    entry.keywords.forEach(keyword => {
        if (lowerInput.includes(keyword)) {
            score += entry.weight * 10; // Base match value

            // Boost for exact word matches (avoids accidental partial matches)
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(lowerInput)) {
                score += 5;
            }
        }
    });

    return score;
};

/**
 * Determines the best response for the user's message.
 * @param {string} message 
 * @returns {string}
 */
export const getChatbotResponse = (message) => {
    if (!message) return "";

    let bestMatch = null;
    let highestScore = 0;

    // 1. Score all entries
    knowledgeBase.forEach(entry => {
        const score = calculateScore(message, entry);
        if (score > highestScore) {
            highestScore = score;
            bestMatch = entry;
        }
    });

    // 2. Threshold check (avoid random answers for irrelevant gibberish)
    if (highestScore < 5) {
        return "I apologize, I didn't quite catch that. Could you please rephrase? You can ask me about Pricing, Location, Booking, or our Amenities.";
    }

    // 3. Return best match
    return bestMatch.response;
};

export const chatbotQuickReplies = [
    "Court Pricing 💰",
    "Book a Slot 📅",
    "Location 📍",
    "Operating Hours 🕐",
    "Amenities ✨"
];
