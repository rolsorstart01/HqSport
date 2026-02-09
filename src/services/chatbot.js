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
        standardRate: 1500,
        currency: 'INR',
        details: 'Flat rate applicable for all operational hours.'
    },
    contact: {
        instagram: '@hq.sportslab',
        email: 'hqsports.41@gmail.com',
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
        response: `Our court rates are structured for your convenience. The standard rate is ₹${facilityInfo.pricing.standardRate} per hour (${facilityInfo.pricing.currency}). Would you like to proceed with a booking?`
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
    },
    // --- ATMOSPHERE & EXPERIENCE ---
    {
        id: 'vibe_check',
        keywords: ['view', 'rooftop', 'sunset', 'atmosphere', 'vibe', 'scenery', 'photo', 'instagram'],
        weight: 4,
        response: "The HQ experience is as much about the views as the game. Being on the rooftop of Kanak Building, we offer a stunning 360-degree view of the Kolkata skyline. **Golden Hour (5:00 PM - 6:30 PM)** is a favorite for players who enjoy a breathtaking sunset backdrop for their matches."
    },

    // --- THE "NEWBIE" JOURNEY (Empathy Layer) ---
    {
        id: 'first_timer',
        keywords: ['never played', 'first time', 'newbie', 'hard', 'difficult', 'age', 'kids', 'senior'],
        weight: 5,
        response: "Pickleball is incredibly intuitive! If you've played any racket sport, you'll pick it up in 10 minutes. If not, you’ll be rallying within 30. It’s low-impact and perfect for all ages—from kids to seniors. We recommend booking a **'Discovery Session'** if it's your first time so our staff can give you a quick 5-minute rundown of the rules."
    },

    // --- TECHNICAL & GEAR ADVICE ---
    {
        id: 'gear_advice',
        keywords: ['shoes', 'wear', 'clothes', 'outfit', 'non-marking', 'sneakers'],
        weight: 4,
        response: "For your safety and the court's longevity, **non-marking sports shoes are mandatory.** We recommend breathable athletic wear. If you’re coming straight from the office, don't worry—we have premium changing rooms and showers so you can refresh after your session."
    },

    // --- COMPETITIVE EDGE ---
    {
        id: 'competitive_play',
        keywords: ['tournament', 'level', 'rating', 'dupr', 'professional', 'advanced', 'league'],
        weight: 5,
        response: "HQ Sport is the hub for competitive play in West Bengal. We host **DUPR-rated matches** and quarterly tournaments. If you're looking for high-level games, ask about our **'Elite 16' sessions** or our ladder leagues to test your skills against the city's best."
    },

    // --- BOOKING LOGIC & PEAK TIMES ---
    {
        id: 'best_time_to_book',
        keywords: ['busy', 'quiet', 'available', 'best time', 'slot', 'peak'],
        weight: 4,
        response: "Our weekend slots (Friday-Sunday) tend to book out 3-4 days in advance. For a quieter, more focused practice, we recommend the **weekday 8 AM - 11 AM window**. You can view live availability in real-time on our booking portal."
    },

    // --- HEALTH & SAFETY ---
    {
        id: 'safety_health',
        keywords: ['injury', 'water', 'medical', 'first aid', 'safe', 'emergency'],
        weight: 3,
        response: "Your well-being is paramount. We provide chilled hydration stations at every court. The facility is equipped with a first-aid kit specifically for sports injuries, and our surface is designed with 'give' to reduce strain on your knees compared to standard concrete."
    },

    // --- THE "WHY HQ?" (Sales Pitch) ---
    {
        id: 'why_hq',
        keywords: ['better', 'different', 'why here', 'compare', 'tennis', 'club'],
        weight: 5,
        response: "HQ Sport isn't just a court; it's a lifestyle destination. Unlike public parks or cramped clubs, we offer a **curated rooftop environment**, professional-grade lighting that eliminates shadows, and a community of like-minded enthusiasts. It's Kolkata's only 'Sky-Court' experience."
    },
    {
        id: 'rules_deep_dive',
        keywords: ['rules', 'how to play', 'scoring', 'double bounce', 'kitchen rule', 'fault'],
        weight: 6,
        response: "Pickleball has a few unique rules that keep the game fair and exciting:\n\n" +
                  "• **The Kitchen (NVZ):** You cannot volley (hit the ball in the air) while standing inside the 7ft non-volley zone.\n" +
                  "• **Double Bounce Rule:** Following a serve, each side must let the ball bounce once before any volleys can occur.\n" +
                  "• **Scoring:** You only win points on your own serve. Games are usually played to 11, win by 2.\n\n" +
                  "Need a quick 1-minute demo when you arrive? Our floor staff is happy to show you the ropes!"
    },

    // --- COURT ETIQUETTE & CULTURE ---
    {
        id: 'etiquette',
        keywords: ['etiquette', 'manners', 'paddle tap', 'rules of conduct', 'behave', 'sportsmanship'],
        weight: 5,
        response: "At HQ Sport, we pride ourselves on a sophisticated community. Standard etiquette includes:\n\n" +
                  "• **The Paddle Tap:** We tap paddle handles at the net after every match as a sign of respect.\n" +
                  "• **Call the Score:** The server should always call the score loudly before serving.\n" +
                  "• **Ball on Court:** If a ball rolls onto your court from elsewhere, stop play immediately for safety (call 'Ball on Court!') and replay the point."
    },

    // --- PRO-STRATEGY (For Intermediate/Advanced Players) ---
    {
        id: 'strategy_tips',
        keywords: ['better', 'improve', 'win', 'strategy', 'dink', 'third shot drop', 'banger', 'advanced tips'],
        weight: 5,
        response: "Want to level up? Focus on the **'Soft Game'**. \n\n" +
                  "1. **Master the Dink:** Force your opponents into a patient rally rather than slamming the ball.\n" +
                  "2. **The Third Shot Drop:** Instead of driving the ball hard, drop it softly into the kitchen to allow you and your partner to get to the net.\n" +
                  "3. **Target the Feet:** It's the hardest place for an opponent to return from. \n\n" +
                  "Ask about our **Private Coaching** if you're looking to refine these specific techniques."
    },

    // --- HEALTH, NUTRITION & RECOVERY ---
    {
        id: 'health_nutrition',
        keywords: ['food', 'eat', 'drink', 'water', 'energy', 'cramp', 'sore', 'stretch', 'health'],
        weight: 4,
        response: "Pickleball is high-energy! To stay at peak performance:\n\n" +
                  "• **Pre-Game:** Have a light, carb-rich snack (like a banana) 30-60 mins before playing.\n" +
                  "• **Hydration:** Don't just drink water; we recommend electrolytes to prevent cramping under the Kolkata sun.\n" +
                  "• **Recovery:** Focus on dynamic stretching before play and static stretching after. Our rooftop cafe offers high-protein snacks perfect for post-match muscle recovery."
    },

    // --- COMPETITIVE TERMINOLOGY ---
    {
        id: 'slang_terms',
        keywords: ['what is a dink', 'erne', 'atp', 'pickled', 'stacking', 'terminology', 'slang'],
        weight: 4,
        response: "Ready to talk like a pro? \n\n" +
                  "• **Pickled:** Losing a game 11-0 (don't worry, it happens to the best of us!).\n" +
                  "• **Erne:** A high-level move where you jump outside the kitchen to hit a volley.\n" +
                  "• **ATP (Around the Post):** A rare shot where the ball goes around the net post rather than over the net.\n" +
                  "• **Dink:** A controlled, soft shot that drops into the opponent's kitchen."
    },

    // --- MISINFORMATION CORRECTION (The "Smarter" Logic) ---
    {
        id: 'tennis_vs_pickleball',
        keywords: ['tennis ball', 'tennis racket', 'harder than tennis', 'same as tennis'],
        weight: 5,
        response: "While similar to tennis, Pickleball uses a **perforated plastic ball** (like a wiffle ball) and **solid paddles** (not strings). The court is much smaller, which means less running but much faster reaction times. It's often called 'Chess at 100mph'!"
    },
    {
        id: 'value_proposition',
        keywords: ['expensive', 'cheaper', 'discount', 'student', 'off-peak', 'pricey'],
        weight: 6,
        response: "We offer a premium experience, but we also value our community. If you are looking for better rates, our **Morning Serenity slots (6 AM - 1 PM)** are significantly discounted at ₹800. Additionally, our **Bulk Hour Packages** allow frequent players to lock in lower rates. It’s the best value for a professional-grade rooftop court in Kolkata."
    },

    // --- THE "SOLO PLAYER" SOLUTION ---
    {
        id: 'no_partner',
        keywords: ['alone', 'solo', 'no friends', 'partner', 'find players', 'matchmaking', 'play with'],
        weight: 6,
        response: "Pickleball is the most social sport on the planet. If you don't have a partner, join our **WhatsApp Community Group** where players of all levels coordinate matches daily. We also host **'Social Mixers'** every weekend—just show up, and we'll put you in a rotation. You'll have a new circle of friends in no time."
    },

    // --- WEATHER REALISM (Smart Logic) ---
    {
        id: 'weather_realtime',
        keywords: ['rain', 'monsoon', 'wet', 'clouds', 'weather today', 'forecast', 'outdoor'],
        weight: 5,
        response: "As we are a rooftop venue, we follow a strict **Playability Protocol**. If it rains, our staff assesses the surface safety. If your session is interrupted by weather, we issue an **automatic play-credit** to your account. Pro tip: The courts dry remarkably fast (approx. 20 mins) thanks to our professional drainage and acrylic surface."
    },

    // --- LOGISTICS: PARKING & ACCESS ---
    {
        id: 'parking_deep_dive',
        keywords: ['park', 'car', 'bike', 'garage', 'valet', 'security', 'traffic'],
        weight: 5,
        response: "Parking in Chowringhee can be tricky, which is why we offer **complimentary valet parking** for our guests at the Kanak Building main gate. Simply pull up, and our team will handle the rest while you head to the roof. Your vehicle's safety is managed by 24/7 building security."
    },

    // --- LIFESTYLE: SPECTATORS & PETS ---
    {
        id: 'spectators_pets',
        keywords: ['watch', 'friend', 'bring someone', 'dog', 'pet', 'family', 'kids'],
        weight: 4,
        response: "Non-playing guests are more than welcome! We have a **Luxury Viewing Lounge** and a rooftop cafe where friends can watch you play in comfort. Regarding pets: While we love animals, for safety and hygiene on the professional court surfaces, we only allow pets in the designated cafe seating area, not on the courts."
    },

    // --- THE "CORPORATE" PITCH (High Value) ---
    {
        id: 'corporate_outings',
        keywords: ['office', 'team', 'hr', 'company', 'workshop', 'retreat', 'branding', 'event'],
        weight: 6,
        response: "HQ Sport is Kolkata's premier venue for 'Active Networking.' We offer **Corporate Court Takeovers** including a dedicated tournament coordinator, catering from Glenburn Cafe, and branded digital scoreboards. It’s far more engaging than a standard office dinner—your team will actually thank you."
    },

    // --- SAFETY: AGE & PHYSICAL LIMITS ---
    {
        id: 'safety_limits',
        keywords: ['old', 'age limit', 'child', 'injury', 'knee', 'back pain', 'safe'],
        weight: 5,
        response: "One of the reasons Pickleball is exploding is its accessibility. The underhand serve is easy on the shoulders, and the smaller court means less sprinting than tennis. We have players from **age 6 to 75**. If you have knee concerns, our **cushioned acrylic surface** provides significantly more shock absorption than standard asphalt or concrete."
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
