import json
import os
import sys
from models import db, Destination, Adventure

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))

DESTINATIONS = [
    {
        "slug": "andhra-pradesh", "name": "Andhra Pradesh", "emoji": "🕉️",
        "tagline": "The spiritual heart of balance and nature.",
        "hero_image": "images/destinations/andhra-pradesh.jpg",
        "highlight": "Tirupati, Araku Valley",
        "spots": [
            {"name": "Tirupati Balaji Temple", "desc": "One of the world's most visited temples", "time": "Sep–Feb", "image": "images/destinations/spots/tirupati.jpg"},
            {"name": "Araku Valley", "desc": "Hill station with coffee plantations and tribal culture", "time": "Oct–Mar", "image": "images/destinations/spots/araku-valley.jpg"},
            {"name": "Borra Caves", "desc": "Ancient limestone caves with stalactites", "time": "Oct–Mar", "image": "images/destinations/spots/borra-caves.jpg"},
            {"name": "Vizag Beach", "desc": "Coastal city with beaches and submarine museum", "time": "Oct–Feb", "image": "images/destinations/spots/vizag-beach.jpg"}
        ]
    },
    {
        "slug": "arunachal-pradesh", "name": "Arunachal Pradesh", "emoji": "🏔️",
        "tagline": "The land of the rising sun.",
        "hero_image": "images/destinations/arunachal-pradesh.jpg",
        "highlight": "Tawang Monastery",
        "spots": [
            {"name": "Tawang Monastery", "desc": "India's largest Buddhist monastery at 10,000 ft", "time": "Mar–Oct", "image": "images/destinations/spots/tawang-monastery.jpg"},
            {"name": "Ziro Valley", "desc": "UNESCO tentative heritage with Apatani tribal villages", "time": "Mar–Oct", "image": "images/destinations/spots/ziro-valley.jpg"},
            {"name": "Namdapha National Park", "desc": "One of India's largest national parks", "time": "Oct–Apr", "image": "images/destinations/spots/namdapha.jpg"}
        ]
    },
    {
        "slug": "assam", "name": "Assam", "emoji": "🐅",
        "tagline": "The gateway to the Northeast.",
        "hero_image": "images/destinations/assam.jpg",
        "highlight": "Kaziranga National Park",
        "spots": [
            {"name": "Kaziranga National Park", "desc": "UNESCO site, home to 2/3 of world's one-horned rhinos", "time": "Nov–Apr", "image": "images/destinations/spots/kaziranga.jpg"},
            {"name": "Majuli Island", "desc": "World's largest river island", "time": "Oct–Mar", "image": "images/destinations/spots/majuli-island.jpg"},
            {"name": "Kamakhya Temple", "desc": "Famous Shakti temple atop Nilachal Hill", "time": "Oct–Apr", "image": "images/destinations/spots/kamakhya-temple.jpg"}
        ]
    },
    {
        "slug": "bihar", "name": "Bihar", "emoji": "🏰",
        "tagline": "The land of enlightenment.",
        "hero_image": "images/destinations/bihar.jpg",
        "highlight": "Nalanda University Ruins",
        "spots": [
            {"name": "Bodh Gaya", "desc": "Where Gautama Buddha attained enlightenment", "time": "Oct–Mar", "image": "images/destinations/spots/bodh-gaya.jpg"},
            {"name": "Nalanda", "desc": "Ruins of the ancient world's greatest university", "time": "Oct–Mar", "image": "images/destinations/spots/nalanda.jpg"},
            {"name": "Rajgir", "desc": "Ancient city with hot springs and Vishwa Shanti Stupa", "time": "Oct–Mar", "image": "images/destinations/spots/nalanda.jpg"}
        ]
    },
    {
        "slug": "chhattisgarh", "name": "Chhattisgarh", "emoji": "🌧️",
        "tagline": "The heartbeat of tribal India.",
        "hero_image": "images/destinations/chhattisgarh.jpg",
        "highlight": "Chitrakote Falls",
        "spots": [
            {"name": "Chitrakote Falls", "desc": "India's widest waterfall, the Niagara of India", "time": "Jul–Oct", "image": "images/destinations/spots/chitrakoot-falls.jpg"},
            {"name": "Bastar", "desc": "Tribal heartland with dense forests and Gondi culture", "time": "Oct–Mar", "image": "images/destinations/spots/bastar.jpg"},
            {"name": "Sirpur", "desc": "Ancient town with Buddhist and Hindu temples", "time": "Nov–Feb", "image": "images/destinations/spots/sirpur.jpg"}
        ]
    },
    {
        "slug": "goa", "name": "Goa", "emoji": "🏖️",
        "tagline": "Sun, sand, and soul.",
        "hero_image": "images/destinations/goa.jpg",
        "highlight": "Beaches & Portuguese Heritage",
        "spots": [
            {"name": "Baga Beach", "desc": "North Goa's most popular beach with water sports", "time": "Nov–Feb", "image": "images/destinations/spots/baga-beach.jpg"},
            {"name": "Basilica of Bom Jesus", "desc": "UNESCO Heritage 16th-century church", "time": "Nov–Mar", "image": "images/destinations/spots/basilica-bom-jesus.jpg"},
            {"name": "Dudhsagar Falls", "desc": "Majestic 4-tiered waterfall on Goa-Karnataka border", "time": "Jul–Dec", "image": "images/destinations/spots/dudhsagar-falls.jpg"},
            {"name": "Palolem Beach", "desc": "Crescent-shaped serene beach in South Goa", "time": "Nov–Mar", "image": "images/destinations/spots/palolem-beach.jpg"}
        ]
    },
    {
        "slug": "gujarat", "name": "Gujarat", "emoji": "🦁",
        "tagline": "The land of colors and lions.",
        "hero_image": "images/destinations/gujarat.jpg",
        "highlight": "Rann of Kutch, Gir Forest",
        "spots": [
            {"name": "Rann of Kutch", "desc": "Vast white salt desert, magical under the full moon", "time": "Nov–Feb", "image": "images/destinations/spots/rann-of-kutch.jpg"},
            {"name": "Gir National Park", "desc": "Only home of the Asiatic Lion in the wild", "time": "Dec–Mar", "image": "images/destinations/spots/gir-forest.jpg"},
            {"name": "Somnath Temple", "desc": "One of India's 12 Jyotirlingas by the Arabian Sea", "time": "Oct–Mar", "image": "images/destinations/spots/somnath-temple.jpg"},
            {"name": "Dwarka", "desc": "Ancient city and one of the Char Dham pilgrimage sites", "time": "Oct–Mar", "image": "images/destinations/spots/dwarka.jpg"}
        ]
    },
    {
        "slug": "haryana", "name": "Haryana", "emoji": "🦆",
        "tagline": "Where culture meets history.",
        "hero_image": "images/destinations/haryana.jpg",
        "highlight": "Sultanpur Bird Sanctuary",
        "spots": [
            {"name": "Sultanpur Bird Sanctuary", "desc": "Home to 250+ bird species", "time": "Oct–Mar", "image": "images/destinations/spots/sultanpur-sanctuary.jpg"},
            {"name": "Kurukshetra", "desc": "Sacred city where the Mahabharata war was fought", "time": "Oct–Mar", "image": "images/destinations/spots/kurukshetra.jpg"}
        ]
    },
    {
        "slug": "himachal-pradesh", "name": "Himachal Pradesh", "emoji": "🏔️",
        "tagline": "A rendezvous with the Himalayas.",
        "hero_image": "images/destinations/himachal-pradesh.jpg",
        "highlight": "Shimla, Manali",
        "spots": [
            {"name": "Manali", "desc": "Adventure hub with snowy peaks and Solang Valley", "time": "Oct–Jun", "image": "images/destinations/spots/manali.jpg"},
            {"name": "Shimla", "desc": "Queen of Hills with the famous Mall Road", "time": "Mar–Jun, Dec", "image": "images/destinations/spots/shimla.jpg"},
            {"name": "Spiti Valley", "desc": "Cold desert valley with ancient monasteries", "time": "May–Oct", "image": "images/destinations/spots/spiti-valley.jpg"},
            {"name": "Dharamshala", "desc": "Home of the Dalai Lama and Tibetan culture", "time": "Mar–Jun", "image": "images/destinations/spots/dharamshala.jpg"}
        ]
    },
    {
        "slug": "jharkhand", "name": "Jharkhand", "emoji": "🌧️",
        "tagline": "The land of forests and waterfalls.",
        "hero_image": "images/destinations/jharkhand.jpg",
        "highlight": "Hundru Falls",
        "spots": [
            {"name": "Hundru Falls", "desc": "98m high waterfall on the Subarnarekha river", "time": "Aug–Nov", "image": "images/destinations/spots/hundru-falls.jpg"},
            {"name": "Betla National Park", "desc": "Home to tigers, elephants, and leopards", "time": "Nov–May", "image": "images/destinations/spots/betla-park.jpg"}
        ]
    },
    {
        "slug": "karnataka", "name": "Karnataka", "emoji": "🏰",
        "tagline": "The state of many worlds.",
        "hero_image": "images/destinations/karnataka.jpg",
        "highlight": "Hampi, Coorg",
        "spots": [
            {"name": "Hampi", "desc": "UNESCO Heritage ruins of the Vijayanagara Empire", "time": "Oct–Feb", "image": "images/destinations/spots/hampi.jpg"},
            {"name": "Coorg", "desc": "Scotland of India with coffee estates and misty hills", "time": "Oct–Mar", "image": "images/destinations/spots/coorg.jpg"},
            {"name": "Mysore Palace", "desc": "Grand illuminated palace of the Wadiyar dynasty", "time": "Oct–Feb", "image": "images/destinations/spots/mysore-palace.jpg"},
            {"name": "Gokarna", "desc": "Pristine beaches and the ancient Mahabaleshwar Temple", "time": "Oct–Mar", "image": "images/destinations/spots/gokarna.jpg"}
        ]
    },
    {
        "slug": "kerala", "name": "Kerala", "emoji": "🚤",
        "tagline": "God's own country.",
        "hero_image": "images/destinations/kerala.jpg",
        "highlight": "Backwaters, Munnar",
        "spots": [
            {"name": "Alleppey Backwaters", "desc": "Houseboat cruises through serene coconut-lined canals", "time": "Aug–Mar", "image": "images/destinations/spots/alleppey.jpg"},
            {"name": "Munnar", "desc": "Rolling tea gardens and misty peaks", "time": "Sep–Mar", "image": "images/destinations/spots/munnar.jpg"},
            {"name": "Thekkady", "desc": "Spice plantations and Periyar wildlife sanctuary", "time": "Sep–Mar", "image": "images/destinations/spots/thekkady.jpg"},
            {"name": "Kovalam Beach", "desc": "Crescent beach with lighthouse and Ayurvedic resorts", "time": "Sep–Mar", "image": "images/destinations/spots/kovalam-beach.jpg"}
        ]
    },
    {
        "slug": "madhya-pradesh", "name": "Madhya Pradesh", "emoji": "🏰",
        "tagline": "The heart of incredible India.",
        "hero_image": "images/destinations/madhya-pradesh.jpg",
        "highlight": "Khajuraho, Pachmarhi",
        "spots": [
            {"name": "Khajuraho", "desc": "UNESCO Heritage temples with exquisite sculptures", "time": "Oct–Mar", "image": "images/destinations/spots/khajuraho.jpg"},
            {"name": "Bandhavgarh", "desc": "Highest density of Bengal tigers in India", "time": "Oct–Jun", "image": "images/destinations/spots/bandhavgarh.jpg"},
            {"name": "Orchha", "desc": "Medieval fort city with cenotaphs on the Betwa river", "time": "Oct–Mar", "image": "images/destinations/spots/orchha.jpg"},
            {"name": "Mandu", "desc": "Ruined city with Afghan architecture", "time": "Oct–Mar", "image": "images/destinations/spots/mandu.jpg"}
        ]
    },
    {
        "slug": "maharashtra", "name": "Maharashtra", "emoji": "🏢",
        "tagline": "Gateway to the majestic West.",
        "hero_image": "images/destinations/maharashtra.jpg",
        "highlight": "Mumbai, Ajanta Caves",
        "spots": [
            {"name": "Gateway of India", "desc": "India's financial capital with Marine Drive", "time": "Nov–Feb", "image": "images/destinations/spots/mumbai-gateway.jpg"},
            {"name": "Ajanta & Ellora Caves", "desc": "UNESCO Heritage rock-cut cave temples", "time": "Oct–Mar", "image": "images/destinations/spots/ajanta-ellora.jpg"},
            {"name": "Lonavala", "desc": "Hill station with scenic valleys and waterfalls", "time": "Jun–Sep", "image": "images/destinations/spots/lonavala.jpg"}
        ]
    },
    {
        "slug": "manipur", "name": "Manipur", "emoji": "🛶",
        "tagline": "The jewel state of India.",
        "hero_image": "images/destinations/manipur.jpg",
        "highlight": "Loktak Lake",
        "spots": [
            {"name": "Loktak Lake", "desc": "World's only floating lake with phumdis", "time": "Oct–Mar", "image": "images/destinations/spots/loktak-lake.jpg"},
            {"name": "Keibul Lamjao National Park", "desc": "World's only floating national park", "time": "Oct–Mar", "image": "images/destinations/spots/keibul-park.jpg"}
        ]
    },
    {
        "slug": "meghalaya", "name": "Meghalaya", "emoji": "🌿",
        "tagline": "Above the clouds.",
        "hero_image": "images/destinations/meghalaya.jpg",
        "highlight": "Living Root Bridges",
        "spots": [
            {"name": "Cherrapunji", "desc": "Wettest place on Earth with waterfalls and root bridges", "time": "Oct–May", "image": "images/destinations/spots/cherrapunji.jpg"},
            {"name": "Shillong", "desc": "Scotland of the East with lakes and colonial architecture", "time": "Oct–May", "image": "images/destinations/spots/shillong.jpg"},
            {"name": "Dawki River", "desc": "Crystal-clear river where boats appear to float on air", "time": "Nov–Apr", "image": "images/destinations/spots/dawki-river.jpg"},
            {"name": "Living Root Bridge", "desc": "Ancient natural bridges made of living tree roots", "time": "Oct–May", "image": "images/destinations/spots/root-bridge.jpg"}
        ]
    },
    {
        "slug": "mizoram", "name": "Mizoram", "emoji": "🏔️",
        "tagline": "Land of the rolling hills.",
        "hero_image": "images/destinations/mizoram.jpg",
        "highlight": "Phawngpui Peak",
        "spots": [
            {"name": "Aizawl", "desc": "Dramatic hillside capital with Durtlang Hills views", "time": "Oct–Mar", "image": "images/destinations/spots/aizawl.jpg"},
            {"name": "Phawngpui Blue Mountain", "desc": "Highest peak in Mizoram with rare orchids", "time": "Oct–Apr", "image": "images/destinations/spots/phawngpui.jpg"}
        ]
    },
    {
        "slug": "nagaland", "name": "Nagaland", "emoji": "🌿",
        "tagline": "Land of festivals and warriors.",
        "hero_image": "images/destinations/nagaland.jpg",
        "highlight": "Dzukou Valley",
        "spots": [
            {"name": "Kohima", "desc": "WW2 battlefield town with the moving War Cemetery", "time": "Oct–May", "image": "images/destinations/spots/kohima.jpg"},
            {"name": "Hornbill Festival Venue", "desc": "Cultural hub where all Naga tribes gather", "time": "December", "image": "images/destinations/spots/hornbill-festival.jpg"}
        ]
    },
    {
        "slug": "odisha", "name": "Odisha", "emoji": "🕉️",
        "tagline": "The soul of Incredible India.",
        "hero_image": "images/destinations/odisha.jpg",
        "highlight": "Konark Sun Temple",
        "spots": [
            {"name": "Konark Sun Temple", "desc": "UNESCO Heritage 13th-century stone chariot temple", "time": "Oct–Feb", "image": "images/destinations/spots/konark-temple.jpg"},
            {"name": "Puri Beach", "desc": "Jagannath Temple and famous Rath Yatra festival", "time": "Oct–Mar", "image": "images/destinations/spots/puri-beach.jpg"},
            {"name": "Chilika Lake", "desc": "Asia's largest coastal lagoon with Irrawaddy dolphins", "time": "Nov–Feb", "image": "images/destinations/spots/chilika-lake.jpg"}
        ]
    },
    {
        "slug": "punjab", "name": "Punjab", "emoji": "🕉️",
        "tagline": "The land of five rivers and golden fields.",
        "hero_image": "images/destinations/punjab.jpg",
        "highlight": "Golden Temple",
        "spots": [
            {"name": "Golden Temple, Amritsar", "desc": "Holiest Sikh shrine glowing in gold", "time": "Oct–Mar", "image": "images/destinations/spots/golden-temple.jpg"},
            {"name": "Wagah Border", "desc": "Evening flag-lowering ceremony at India-Pakistan border", "time": "Oct–Mar", "image": "images/destinations/spots/wagah-border.jpg"},
            {"name": "Anandpur Sahib", "desc": "Birthplace of Khalsa with grand Gurudwaras", "time": "Oct–Mar", "image": "images/destinations/spots/anandpur-sahib.jpg"}
        ]
    },
    {
        "slug": "rajasthan", "name": "Rajasthan", "emoji": "🏰",
        "tagline": "The desert majesty.",
        "hero_image": "images/destinations/rajasthan.jpg",
        "highlight": "Jaipur, Udaipur, Jaisalmer",
        "spots": [
            {"name": "Jaipur — Amber Fort", "desc": "Pink City with Hawa Mahal and City Palace", "time": "Oct–Mar", "image": "images/destinations/spots/jaipur-amber-fort.jpg"},
            {"name": "Udaipur — Lake Pichola", "desc": "Romantic city of lakes with island palaces", "time": "Oct–Mar", "image": "images/destinations/spots/udaipur-lake.jpg"},
            {"name": "Jaisalmer Fort", "desc": "The Golden City in the Thar Desert", "time": "Oct–Mar", "image": "images/destinations/spots/jaisalmer-fort.jpg"},
            {"name": "Ranthambore", "desc": "Famous tiger reserve with a fort backdrop", "time": "Oct–Jun", "image": "images/destinations/spots/ranthambore.jpg"},
            {"name": "Pushkar Lake", "desc": "Sacred lake town with the only Brahma temple in the world", "time": "Oct–Mar", "image": "images/destinations/spots/pushkar.jpg"}
        ]
    },
    {
        "slug": "sikkim", "name": "Sikkim", "emoji": "🏔️",
        "tagline": "Pristine mountain vistas.",
        "hero_image": "images/destinations/sikkim.jpg",
        "highlight": "Gangtok, Nathula Pass",
        "spots": [
            {"name": "Gangtok", "desc": "Capital city with Kangchenjunga views and Rumtek Monastery", "time": "Mar–May, Oct–Dec", "image": "images/destinations/spots/gangtok.jpg"},
            {"name": "Nathula Pass", "desc": "High-altitude Indo-China border pass at 14,140 ft", "time": "May–Oct", "image": "images/destinations/spots/nathula-pass.jpg"},
            {"name": "Yumthang Valley", "desc": "Valley of Flowers of Sikkim with rhododendrons", "time": "Apr–Jun", "image": "images/destinations/spots/yumthang-valley.jpg"}
        ]
    },
    {
        "slug": "tamil-nadu", "name": "Tamil Nadu", "emoji": "🏰",
        "tagline": "Enchanting temples and hill retreats.",
        "hero_image": "images/destinations/tamil-nadu.jpg",
        "highlight": "Mahabalipuram, Ooty",
        "spots": [
            {"name": "Mahabalipuram", "desc": "UNESCO Heritage coastal town with rock-cut temples", "time": "Oct–Mar", "image": "images/destinations/spots/mahabalipuram.jpg"},
            {"name": "Ooty", "desc": "Queen of hill stations with Nilgiri Mountain Railway", "time": "Apr–Jun, Sep–Nov", "image": "images/destinations/spots/ooty.jpg"},
            {"name": "Madurai", "desc": "Temple city with the stunning Meenakshi Amman Temple", "time": "Oct–Mar", "image": "images/destinations/spots/madurai-temple.jpg"},
            {"name": "Rameswaram", "desc": "Sacred island pilgrimage site with Pamban Bridge", "time": "Oct–Apr", "image": "images/destinations/spots/rameswaram.jpg"}
        ]
    },
    {
        "slug": "telangana", "name": "Telangana", "emoji": "🕌",
        "tagline": "The confluence of heritage and tech.",
        "hero_image": "images/destinations/telangana.jpg",
        "highlight": "Hyderabad, Warangal Fort",
        "spots": [
            {"name": "Hyderabad — Charminar", "desc": "City of Nizams with famous biryani", "time": "Oct–Feb", "image": "images/destinations/spots/hyderabad-charminar.jpg"},
            {"name": "Golconda Fort", "desc": "12th-century fort with acoustic wonders", "time": "Oct–Feb", "image": "images/destinations/spots/golconda-fort.jpg"},
            {"name": "Nagarjuna Sagar", "desc": "One of the world's largest masonry dams", "time": "Oct–Mar", "image": "images/destinations/spots/nagarjuna-sagar.jpg"}
        ]
    },
    {
        "slug": "tripura", "name": "Tripura", "emoji": "🏰",
        "tagline": "Kingdom of royal history.",
        "hero_image": "images/destinations/tripura.jpg",
        "highlight": "Ujjayanta Palace",
        "spots": [
            {"name": "Ujjayanta Palace", "desc": "Beautiful royal palace-turned-museum in Agartala", "time": "Oct–Mar", "image": "images/destinations/spots/ujjayanta-palace.jpg"},
            {"name": "Neermahal", "desc": "India's largest water palace in Rudrasagar Lake", "time": "Oct–Mar", "image": "images/destinations/spots/neermahal.jpg"}
        ]
    },
    {
        "slug": "uttar-pradesh", "name": "Uttar Pradesh", "emoji": "🕌",
        "tagline": "The essence of spiritual India.",
        "hero_image": "images/destinations/uttar-pradesh.jpg",
        "highlight": "Taj Mahal, Varanasi",
        "spots": [
            {"name": "Taj Mahal, Agra", "desc": "One of the Seven Wonders of the World", "time": "Oct–Mar", "image": "images/destinations/spots/taj-mahal.jpg"},
            {"name": "Varanasi Ghats", "desc": "World's oldest living city with Ganga Aarti", "time": "Oct–Mar", "image": "images/destinations/spots/varanasi-ghats.jpg"},
            {"name": "Mathura & Vrindavan", "desc": "Birthplace of Lord Krishna", "time": "Oct–Mar", "image": "images/destinations/spots/mathura-vrindavan.jpg"},
            {"name": "Lucknow — Bara Imambara", "desc": "City of Nawabs with Awadhi cuisine", "time": "Oct–Mar", "image": "images/destinations/spots/lucknow-imambara.jpg"}
        ]
    },
    {
        "slug": "uttarakhand", "name": "Uttarakhand", "emoji": "🏔️",
        "tagline": "Devbhoomi — Land of the gods.",
        "hero_image": "images/destinations/uttarakhand.jpg",
        "highlight": "Rishikesh, Valley of Flowers",
        "spots": [
            {"name": "Rishikesh", "desc": "Yoga capital of the world with river rafting", "time": "Sep–Jun", "image": "images/destinations/spots/rishikesh.jpg"},
            {"name": "Valley of Flowers", "desc": "UNESCO Heritage alpine meadow with wildflowers", "time": "Jul–Sep", "image": "images/destinations/spots/valley-of-flowers.jpg"},
            {"name": "Kedarnath", "desc": "Sacred Shiva temple at 3,583m", "time": "May–Jun, Sep–Oct", "image": "images/destinations/spots/kedarnath.jpg"},
            {"name": "Jim Corbett", "desc": "India's oldest national park famous for Bengal tigers", "time": "Nov–Jun", "image": "images/destinations/spots/jim-corbett.jpg"}
        ]
    },
    {
        "slug": "west-bengal", "name": "West Bengal", "emoji": "🐅",
        "tagline": "The cultural melting pot of the East.",
        "hero_image": "images/destinations/west-bengal.jpg",
        "highlight": "Darjeeling, Sundarbans",
        "spots": [
            {"name": "Darjeeling", "desc": "Queen of the Hills with Himalayan views and the Toy Train", "time": "Mar–May, Oct–Dec", "image": "images/destinations/spots/konark-temple.jpg"},
            {"name": "Sundarbans", "desc": "World's largest mangrove forest and home of the Royal Bengal Tiger", "time": "Nov–Feb", "image": "images/destinations/spots/dudhsagar-falls.jpg"},
            {"name": "Kolkata", "desc": "The cultural capital with Victoria Memorial and Howrah Bridge", "time": "Oct–Feb", "image": "images/destinations/spots/dawki-river.jpg"}
        ]
    }
]

ADVENTURES = [
    {
        "slug": "andhra-pradesh", "name": "Andhra Pradesh", "emoji": "🏔️",
        "tagline": "Ride the waves and trek the valleys.",
        "hero_image": "images/adventure/andhra-pradesh.jpg",
        "highlight": "Araku Valley Trekking",
        "spots": [
            {"name": "Araku Valley Trekking", "desc": "Scenic trails through tribal forests and coffee estates", "time": "Oct–Mar", "image": "images/adventure/spots/araku-trek.jpg", "difficulty": "easy"},
            {"name": "Gandikota Canyoning", "desc": "Explore the 'Grand Canyon of India' with rock climbing and rappelling", "time": "Sep–Feb", "image": "images/adventure/spots/netarhat-climbing.jpg", "difficulty": "moderate"},
            {"name": "Vizag Scuba Diving", "desc": "Discover the vibrant marine life of the Bay of Bengal", "time": "Nov–Mar", "image": "images/adventure/spots/goa-scuba.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "arunachal-pradesh", "name": "Arunachal Pradesh", "emoji": "🧗",
        "tagline": "Pioneer the unexplored peaks.",
        "hero_image": "images/adventure/arunachal-pradesh.jpg",
        "highlight": "Tawang Trek",
        "spots": [
            {"name": "Tawang Trek", "desc": "High-altitude trek through snow-capped passes", "time": "Apr–Oct", "image": "images/adventure/spots/tawang-trek.jpg", "difficulty": "tough"},
            {"name": "Siang River Rafting", "desc": "Grade IV and V rapids on the powerful Brahmaputra tributary", "time": "Nov–Mar", "image": "images/adventure/spots/brahmaputra-rafting.jpg", "difficulty": "tough"},
            {"name": "Ziro Valley Cycling", "desc": "Cycle through paddy fields and Apatani tribal villages", "time": "Aug–Oct", "image": "images/adventure/spots/kiratpur-cycling.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "assam", "name": "Assam", "emoji": "🚣",
        "tagline": "Tame the mighty Brahmaputra.",
        "hero_image": "images/adventure/assam.jpg",
        "highlight": "River Rafting, Brahmaputra",
        "spots": [
            {"name": "Brahmaputra River Rafting", "desc": "Thrilling white-water rafting on Asia's mightiest river", "time": "Oct–Mar", "image": "images/adventure/spots/brahmaputra-rafting.jpg", "difficulty": "moderate"},
            {"name": "Kaziranga Elephant Safari", "desc": "Get up close with the One-Horned Rhino in tall elephant grass", "time": "Nov–Apr", "image": "images/adventure/spots/chilika-birdwatch.jpg", "difficulty": "easy"},
            {"name": "Manas Tiger Tracking", "desc": "Guided treks through the dense foliage of Manas National Park", "time": "Oct–Mar", "image": "images/adventure/spots/wayanad-trek.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "bihar", "name": "Bihar", "emoji": "🧗",
        "tagline": "Climb the ancient rocks.",
        "hero_image": "images/adventure/bihar.jpg",
        "highlight": "Rock Climbing, Rajgir",
        "spots": [
            {"name": "Rock Climbing, Rajgir", "desc": "Challenging rocky terrain for all skill levels", "time": "Oct–Mar", "image": "images/adventure/spots/rajgir-rockclimbing.jpg", "difficulty": "moderate"},
            {"name": "Ganges Kayaking", "desc": "A unique perspective of river culture near Patna and Munger", "time": "Nov–Feb", "image": "images/adventure/spots/ganga-rafting.jpg", "difficulty": "easy"},
            {"name": "Valmiki Wildlife Trek", "desc": "Explore the tiger reserve on the Indo-Nepal border", "time": "Dec–Mar", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "chhattisgarh", "name": "Chhattisgarh", "emoji": "🔦",
        "tagline": "Delve into the subterranean world.",
        "hero_image": "images/adventure/chhattisgarh.jpg",
        "highlight": "Kanger Valley Caving",
        "spots": [
            {"name": "Kanger Valley Caving", "desc": "Explore ancient limestone caves with stunning formations", "time": "Oct–Mar", "image": "images/adventure/spots/kanger-caving.jpg", "difficulty": "easy"},
            {"name": "Tirathgarh Rappelling", "desc": "Descend the 300ft Tirathgarh waterfalls", "time": "Aug–Nov", "image": "images/adventure/spots/dandeli-rafting.jpg", "difficulty": "tough"},
            {"name": "Bastar Tribal Trail", "desc": "Multi-day cycling or trekking through Gond tribal lands", "time": "Nov–Feb", "image": "images/adventure/spots/coorg-trek.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "goa", "name": "Goa", "emoji": "🏄",
        "tagline": "Underwater wonders and beach thrills.",
        "hero_image": "images/adventure/goa.jpg",
        "highlight": "Water Sports, Beaches",
        "spots": [
            {"name": "Water Sports", "desc": "Parasailing, jet skiing, and banana boat rides", "time": "Nov–Feb", "image": "images/adventure/spots/goa-watersports.jpg", "difficulty": "easy"},
            {"name": "Scuba Diving", "desc": "Explore underwater coral reefs and shipwrecks", "time": "Nov–Feb", "image": "images/adventure/spots/goa-scuba.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "gujarat", "name": "Gujarat", "emoji": "🏜️",
        "tagline": "Safari through the salt desert.",
        "hero_image": "images/adventure/gujarat.jpg",
        "highlight": "Rann of Kutch Desert Safari",
        "spots": [
            {"name": "Rann of Kutch Desert Safari", "desc": "Jeep safari across the vast white salt desert", "time": "Nov–Feb", "image": "images/adventure/spots/kutch-safari.jpg", "difficulty": "easy"},
            {"name": "Saputara Paragliding", "desc": "Sail over the scenic Sahyadri range", "time": "Oct–Dec", "image": "images/adventure/spots/ananthagiri-paragliding.jpg", "difficulty": "moderate"},
            {"name": "Gir Lion Safari", "desc": "Spot an Asiatic Lion in the dry deciduous forest", "time": "Dec–Mar", "image": "images/adventure/spots/kutch-safari.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "haryana", "name": "Haryana", "emoji": "🪂",
        "tagline": "Soar above the Shivaliks.",
        "hero_image": "images/adventure/haryana.jpg",
        "highlight": "Parasailing, Morni Hills",
        "spots": [
            {"name": "Parasailing, Morni Hills", "desc": "Best parasailing spot with panoramic Shivalik views", "time": "Oct–Mar", "image": "images/adventure/spots/morni-parasailing.jpg", "difficulty": "easy"},
            {"name": "Tikkar Taal Paramotoring", "desc": "Motorized paragliding over beautiful lakeside terrain", "time": "Oct–Feb", "image": "images/adventure/spots/morni-parasailing.jpg", "difficulty": "moderate"},
            {"name": "Damdama Lake Zip-lining", "desc": "High-speed aerial descent over the waters of Damdama", "time": "Year-round", "image": "images/adventure/spots/hot-air-balloon.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "himachal-pradesh", "name": "Himachal Pradesh", "emoji": "⛷️",
        "tagline": "Snow peaks and white water delights.",
        "hero_image": "images/adventure/himachal-pradesh.jpg",
        "highlight": "Manali Trekking & Skiing",
        "spots": [
            {"name": "Manali Skiing, Solang Valley", "desc": "World-class skiing on Himalayan slopes", "time": "Dec–Feb", "image": "images/adventure/spots/manali-skiing.jpg", "difficulty": "moderate"},
            {"name": "Rohtang Pass Biking", "desc": "Legendary mountain pass bike ride at 13,050 ft", "time": "May–Oct", "image": "images/adventure/spots/rohtang-pass.jpg", "difficulty": "tough"},
            {"name": "Beas River Rafting", "desc": "Exciting white-water rafting through Kullu Valley", "time": "May–Jul", "image": "images/adventure/spots/beas-rafting.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "jharkhand", "name": "Jharkhand", "emoji": "🧗",
        "tagline": "Scale the rocky plateaus.",
        "hero_image": "images/adventure/jharkhand.jpg",
        "highlight": "Rock Climbing, Netarhat",
        "spots": [
            {"name": "Rock Climbing, Netarhat", "desc": "Dramatic rocky plateaus and scenic sunrise climbs", "time": "Oct–Mar", "image": "images/adventure/spots/netarhat-climbing.jpg", "difficulty": "moderate"},
            {"name": "Dimna Lake Jet Skiing", "desc": "High-octane water sports on the lake near Jamshedpur", "time": "Year-round", "image": "images/adventure/spots/goa-watersports.jpg", "difficulty": "easy"},
            {"name": "Parasnath Hill Trek", "desc": "A spiritual trek to the highest peak in Jharkhand", "time": "Oct–Mar", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "karnataka", "name": "Karnataka", "emoji": "☕",
        "tagline": "Trek the spices and ride the rapids.",
        "hero_image": "images/adventure/karnataka.jpg",
        "highlight": "Coorg Coffee Trail Trek",
        "spots": [
            {"name": "Coorg Coffee Trail Trek", "desc": "Trek through fragrant coffee and spice plantations", "time": "Oct–Mar", "image": "images/adventure/spots/coorg-trek.jpg", "difficulty": "easy"},
            {"name": "Dandeli River Rafting", "desc": "Thrilling rafting on the Kali river through forest", "time": "Oct–Mar", "image": "images/adventure/spots/dandeli-rafting.jpg", "difficulty": "moderate"},
            {"name": "Gokarna Beach Trekking", "desc": "Hike across rugged cliffs linking pristine beaches", "time": "Nov–Feb", "image": "images/adventure/spots/wayanad-trek.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "kerala", "name": "Kerala", "emoji": "🛶",
        "tagline": "Adventure in God's own jungle.",
        "hero_image": "images/adventure/kerala.jpg",
        "highlight": "Backwater Kayaking",
        "spots": [
            {"name": "Periyar River Rafting", "desc": "Rafting through dense jungle and wildlife corridors", "time": "Sep–Mar", "image": "images/adventure/spots/kerala-rafting.jpg", "difficulty": "moderate"},
            {"name": "Wayanad Trekking", "desc": "Trek through misty forests and tribal villages", "time": "Sep–Mar", "image": "images/adventure/spots/wayanad-trek.jpg", "difficulty": "easy"},
            {"name": "Varkala Cliff Surfing", "desc": "Catch North Indian Ocean swells under dramatic red cliffs", "time": "Dec–Mar", "image": "images/adventure/spots/goa-watersports.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "madhya-pradesh", "name": "Madhya Pradesh", "emoji": "🦁",
        "tagline": "Track tigers in the heart of India.",
        "hero_image": "images/adventure/madhya-pradesh.jpg",
        "highlight": "Tiger Safari, Bandhavgarh",
        "spots": [
            {"name": "Bandhavgarh Tiger Safari", "desc": "Highest density of Bengal tigers in the Maikal Range", "time": "Nov–Jun", "image": "images/adventure/spots/kutch-safari.jpg", "difficulty": "easy"},
            {"name": "Bhedaghat Marble Rocks Boating", "desc": "Navigate moonlit marble canyons of the Narmada River", "time": "Oct–Apr", "image": "images/adventure/spots/dawki-boating.jpg", "difficulty": "easy"},
            {"name": "Pachmarhi Caving", "desc": "Explore the ancient Pandav Caves and Reechgarh formations", "time": "Sep–May", "image": "images/adventure/spots/kanger-caving.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "maharashtra", "name": "Maharashtra", "emoji": "🧗",
        "tagline": "Conquer the Sahyadris and white water.",
        "hero_image": "images/adventure/maharashtra.jpg",
        "highlight": "Sahyadri Range Trekking",
        "spots": [
            {"name": "Kalsubai Peak Trek", "desc": "Ascend the highest peak of the Sahyadris at 5,400 ft", "time": "Aug–Dec", "image": "images/adventure/spots/wayanad-trek.jpg", "difficulty": "moderate"},
            {"name": "Kolad River Rafting", "desc": "Year-round white-water rafting on the Kundalika River", "time": "Monsoon", "image": "images/adventure/spots/brahmaputra-rafting.jpg", "difficulty": "moderate"},
            {"name": "Pawana Lake Camping", "desc": "Stargazing and lakeside adventure near Lonavala", "time": "Nov–Mar", "image": "images/adventure/spots/rohtang-pass.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "manipur", "name": "Manipur", "emoji": "🏔️",
        "tagline": "Kayaking through the phumdis.",
        "hero_image": "images/adventure/manipur.jpg",
        "highlight": "Dzuko Valley Trek",
        "spots": [
            {"name": "Loktak Lake Kayaking", "desc": "Kayak through the world's only floating lake", "time": "Oct–Mar", "image": "images/adventure/spots/loktak-kayak.jpg", "difficulty": "easy"},
            {"name": "Dzuko Valley Trek", "desc": "Cross the 'Valley of Flowers' of the East", "time": "May–Aug", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "moderate"},
            {"name": "Shirui Peak Trek", "desc": "A floral adventure to find the rare Shirui Lily", "time": "May–Jun", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "meghalaya", "name": "Meghalaya", "emoji": "🌿",
        "tagline": "Glide the clear waters and crawl the caves.",
        "hero_image": "images/adventure/meghalaya.jpg",
        "highlight": "Living Root Bridge Trek",
        "spots": [
            {"name": "Dawki River Boating", "desc": "Glide over crystal-clear Umngot river", "time": "Nov–Apr", "image": "images/adventure/spots/dawki-boating.jpg", "difficulty": "easy"},
            {"name": "Cave Trekking", "desc": "Explore some of Asia's longest cave systems", "time": "Oct–Apr", "image": "images/adventure/spots/caving-meghalaya.jpg", "difficulty": "moderate"},
            {"name": "Dawki River Cliff Jumping", "desc": "The ultimate leap into the crystal clear Umngot River", "time": "Nov–Apr", "image": "images/adventure/spots/goa-watersports.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "mizoram", "name": "Mizoram", "emoji": "🏔️",
        "tagline": "Trek the ridge lines of the east.",
        "hero_image": "images/adventure/mizoram.jpg",
        "highlight": "Phawngpui Peak Trek",
        "spots": [
            {"name": "Phawngpui Blue Mountain Trek", "desc": "Conquer Mizoram's highest peak with unique flora and fauna", "time": "Oct–Apr", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "moderate"},
            {"name": "Reiek Tlang Hike", "desc": "Walk along knife-edge ridges near Aizawl", "time": "Oct–Mar", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "easy"},
            {"name": "Vantawng Falls Trek", "desc": "Hike through dense greenery to the state's highest fall", "time": "Sep–Jan", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "nagaland", "name": "Nagaland", "emoji": "🏔️",
        "tagline": "Trek the valley of flowers.",
        "hero_image": "images/adventure/nagaland.jpg",
        "highlight": "Dzukou Valley Trek",
        "spots": [
            {"name": "Dzukou Valley Trek", "desc": "Trek through Northeast India's most beautiful flower valley", "time": "Jun–Sep", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "moderate"},
            {"name": "Mount Saramati Trek", "desc": "High-altitude expedition to the snow-capped Naga mountains", "time": "Nov–Mar", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "tough"},
            {"name": "Khonoma Village Walking", "desc": "Explore Asia's first green village via ancient stone steps", "time": "Year-round", "image": "images/adventure/spots/dzukou-trek.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "odisha", "name": "Odisha", "emoji": "🔭",
        "tagline": "Birdwatching in the giant lagoon.",
        "hero_image": "images/adventure/odisha.jpg",
        "highlight": "Chilika Lake Birdwatching",
        "spots": [
            {"name": "Chilika Lake Birdwatching", "desc": "Spot rare dolphins and 160+ migratory bird species", "time": "Nov–Feb", "image": "images/adventure/spots/chilika-birdwatch.jpg", "difficulty": "easy"},
            {"name": "Bhitarkanika Mangrove Safari", "desc": "A prehistoric adventure among giant saltwater crocodiles", "time": "Oct–Mar", "image": "images/adventure/spots/chilika-birdwatch.jpg", "difficulty": "moderate"},
            {"name": "Puri Surf Festival", "desc": "Ride the Bay of Bengal waves at India's premier surf event", "time": "November", "image": "images/adventure/spots/goa-watersports.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "punjab", "name": "Punjab", "emoji": "🚴",
        "tagline": "Thrills in the five-river heartland.",
        "hero_image": "images/adventure/punjab.jpg",
        "highlight": "Adventure Sports, Kiratpur",
        "spots": [
            {"name": "Adventure Sports, Kiratpur", "desc": "River crossing, cycling, and rappelling", "time": "Oct–Mar", "image": "images/adventure/spots/kiratpur-cycling.jpg", "difficulty": "moderate"},
            {"name": "Harike Wetland Birding", "desc": "Boat-based bird watching for thousands of migratory species", "time": "Nov–Feb", "image": "images/adventure/spots/chilika-birdwatch.jpg", "difficulty": "easy"},
            {"name": "Amritsar Farm Stay Cycling", "desc": "Village cycling trails through yellow sarson fields", "time": "Winter", "image": "images/adventure/spots/kiratpur-cycling.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "rajasthan", "name": "Rajasthan", "emoji": "🐫",
        "tagline": "Desert safaris and balloon flights.",
        "hero_image": "images/adventure/rajasthan.jpg",
        "highlight": "Desert Camel Safari",
        "spots": [
            {"name": "Desert Camel Safari, Jaisalmer", "desc": "Overnight camel ride into the Thar Desert", "time": "Oct–Mar", "image": "images/adventure/spots/jaisalmer-camel.jpg", "difficulty": "easy"},
            {"name": "Hot Air Balloon, Jaipur", "desc": "Float over Jaipur's pink forts at sunrise", "time": "Oct–Mar", "image": "images/adventure/spots/hot-air-balloon.jpg", "difficulty": "easy"},
            {"name": "Udaipur Speed Boating", "desc": "High-speed turns on the royal waters of Fateh Sagar Lake", "time": "Year-round", "image": "images/adventure/spots/dawki-boating.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "sikkim", "name": "Sikkim", "emoji": "🏔️",
        "tagline": "Himalayan paragliding and base camp treks.",
        "hero_image": "images/adventure/sikkim.jpg",
        "highlight": "Kanchenjunga Base Trek",
        "spots": [
            {"name": "Kanchenjunga Base Camp Trek", "desc": "One of India's most challenging Himalayan treks", "time": "Apr–May, Sep–Oct", "image": "images/adventure/spots/kanchenjunga-trek.jpg", "difficulty": "tough"},
            {"name": "Paragliding, Sikkim", "desc": "Soar over Himalayan valleys and misty peaks", "time": "Mar–May, Oct–Dec", "image": "images/adventure/spots/ananthagiri-paragliding.jpg", "difficulty": "easy"},
            {"name": "Teesta River Rafting", "desc": "Tame the turbulent Teesta rapids near Melli", "time": "Mar–May", "image": "images/adventure/spots/brahmaputra-rafting.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "tamil-nadu", "name": "Tamil Nadu", "emoji": "🚂",
        "tagline": "Trekking through the misty Nilgiris.",
        "hero_image": "images/adventure/tamil-nadu.jpg",
        "highlight": "Nilgiri Mountain Railway",
        "spots": [
            {"name": "Nilgiri Mountain Railway", "desc": "UNESCO Heritage toy train through misty hills", "time": "Apr–Jun, Sep–Nov", "image": "images/adventure/spots/nilgiri-train.jpg", "difficulty": "easy"},
            {"name": "Kodaikanal Trekking", "desc": "Trek through pine forests and misty hill paths", "time": "Apr–Jun, Sep–Nov", "image": "images/adventure/spots/kodaikanal-trek.jpg", "difficulty": "easy"},
            {"name": "Mudumalai Jungle Safari", "desc": "Safari through the Nilgiri Biosphere Reserve", "time": "Oct–May", "image": "images/adventure/spots/kutch-safari.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "telangana", "name": "Telangana", "emoji": "🪂",
        "tagline": "Soar over the Ananthagiri hills.",
        "hero_image": "images/adventure/telangana.jpg",
        "highlight": "Paragliding, Ananthagiri",
        "spots": [
            {"name": "Paragliding, Ananthagiri", "desc": "Soar over lush green hills in Vikarabad district", "time": "Oct–Feb", "image": "images/adventure/spots/ananthagiri-paragliding.jpg", "difficulty": "easy"},
            {"name": "Nagarjuna Sagar Boating", "desc": "Cruise the massive reservoir to reach the island museum", "time": "Aug–Oct", "image": "images/adventure/spots/dawki-boating.jpg", "difficulty": "easy"},
            {"name": "Hyderabad Rock Climbing", "desc": "Conquer the ancient granite boulders of the Deccan plateau", "time": "Oct–Feb", "image": "images/adventure/spots/rajgir-rockclimbing.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "tripura", "name": "Tripura", "emoji": "🏔️",
        "tagline": "Trek the orange orchard hills.",
        "hero_image": "images/adventure/tripura.jpg",
        "highlight": "Jampui Hills Trek",
        "spots": [
            {"name": "Jampui Hills Trek", "desc": "Trek through orange orchards on the Indo-Bangladesh border", "time": "Oct–Mar", "image": "images/adventure/spots/jampui-trek.jpg", "difficulty": "moderate"},
            {"name": "Unakoti Hill Climbing", "desc": "Archaeology plus climbing to see giant rock carvings", "time": "Oct–Mar", "image": "images/adventure/spots/rajgir-rockclimbing.jpg", "difficulty": "easy"},
            {"name": "Gumti Wildlife Exploration", "desc": "Boat explorations through the marshy Gumti reservoir", "time": "Nov–Feb", "image": "images/adventure/spots/chilika-birdwatch.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "uttar-pradesh", "name": "Uttar Pradesh", "emoji": "🚣",
        "tagline": "Ride the grade-5 rapids.",
        "hero_image": "images/adventure/uttar-pradesh.jpg",
        "highlight": "River Rafting, Rishikesh",
        "spots": [
            {"name": "River Rafting, Rishikesh", "desc": "White-water rafting on the Ganga through grade 3–5 rapids", "time": "Sep–Jun", "image": "images/adventure/spots/ganga-rafting.jpg", "difficulty": "moderate"},
            {"name": "Pilibhit Tiger Safari", "desc": "Explore the Terai forests on the trail of the big cat", "time": "Nov–Jun", "image": "images/adventure/spots/kutch-safari.jpg", "difficulty": "easy"},
            {"name": "Katarniaghat Wildlife Cruise", "desc": "Spot crocodiles and dolphins on the Girwa River", "time": "Oct–Mar", "image": "images/adventure/spots/dawki-boating.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "uttarakhand", "name": "Uttarakhand", "emoji": "🌸",
        "tagline": "Skiing and bungee jumping in the hills.",
        "hero_image": "images/adventure/uttarakhand.jpg",
        "highlight": "Valley of Flowers Trek",
        "spots": [
            {"name": "Valley of Flowers Trek", "desc": "UNESCO Heritage alpine meadow trek with wildflowers", "time": "Jul–Sep", "image": "images/adventure/spots/valley-flowers-trek.jpg", "difficulty": "moderate"},
            {"name": "Auli Skiing", "desc": "Best skiing destination in India with Nanda Devi views", "time": "Dec–Mar", "image": "images/adventure/spots/auli-skiing.jpg", "difficulty": "moderate"},
            {"name": "Bungee Jumping, Rishikesh", "desc": "India's highest bungee jump at 83 meters", "time": "Sep–Jun", "image": "images/adventure/spots/rishikesh-bungee.jpg", "difficulty": "easy"}
        ]
    },
    {
        "slug": "west-bengal", "name": "West Bengal", "emoji": "🏔️",
        "tagline": "Highest treks and dense tea garden trails.",
        "hero_image": "images/adventure/west-bengal.jpg",
        "highlight": "Darjeeling Himalayan Trek",
        "spots": [
            {"name": "Sandakphu Trek", "desc": "Highest point in West Bengal with views of 4 of world's tallest peaks", "time": "Apr–May, Oct–Nov", "image": "images/adventure/spots/sandakphu-trek.jpg", "difficulty": "tough"},
            {"name": "Darjeeling Himalayan Trek", "desc": "Trek through tea gardens and dense Himalayan forests", "time": "Mar–May, Oct–Dec", "image": "images/adventure/spots/darjeeling-trek.jpg", "difficulty": "moderate"},
            {"name": "Sundarbans Boat Exploration", "desc": "Search for the swimming tigers in the mangrove maze", "time": "Nov–Feb", "image": "images/adventure/spots/dawki-boating.jpg", "difficulty": "moderate"}
        ]
    },
    {
        "slug": "ladakh", "name": "Ladakh", "emoji": "🏔️",
        "tagline": "Conquer the highest motorable roads.",
        "hero_image": "images/adventure/spots/ladakh-biking.jpg",
        "highlight": "Ladakh Bike Ride",
        "spots": [
            {"name": "Ladakh Bike Ride", "desc": "Epic ride on the world's highest motorable roads", "time": "Jun–Sep", "image": "images/adventure/spots/ladakh-biking.jpg", "difficulty": "tough"},
            {"name": "Pangong Lake Camping", "desc": "Camp by the surreal blue-green lake at 14,270 ft", "time": "Jun–Sep", "image": "images/adventure/spots/pangong-lake.jpg", "difficulty": "moderate"},
            {"name": "Khardung La Pass", "desc": "World's highest motorable road at 18,380 ft", "time": "Jun–Sep", "image": "images/adventure/spots/khardung-la.jpg", "difficulty": "tough"}
        ]
    }
]


def seed():
    for d in DESTINATIONS:
        existing = Destination.query.filter_by(slug=d['slug']).first()
        spots_json = json.dumps(d.pop('spots'))
        if existing:
            for k, v in d.items():
                setattr(existing, k, v)
            existing.spots = spots_json
        else:
            db.session.add(Destination(**d, spots=spots_json))

    for a in ADVENTURES:
        existing = Adventure.query.filter_by(slug=a['slug']).first()
        spots_json = json.dumps(a.pop('spots'))
        if existing:
            for k, v in a.items():
                setattr(existing, k, v)
            existing.spots = spots_json
        else:
            db.session.add(Adventure(**a, spots=spots_json))

    db.session.commit()
    print(f"Seeded {len(DESTINATIONS)} destinations and {len(ADVENTURES)} adventures.")


def run():
    sys.path.insert(0, os.path.dirname(__file__))
    from app import app
    with app.app_context():
        db.create_all()
        if Destination.query.count() == 0 and Adventure.query.count() == 0:
            seed()
        else:
            print("Content tables already populated. Skipping seed.")


if __name__ == '__main__':
    run()