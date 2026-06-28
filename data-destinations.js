/**
 * DATA-DESTINATIONS.JS
 * This file acts as a local database for all travel destinations in India.
 * It is attached to the global 'window' object so that it can be accessed 
 * by any other script on the page (like app.js or specific page controllers).
 */

/* 'destinationsData' is a master object containing keys for various Indian states.
   Each state key maps to an object containing:
   - emoji: A visual representative icon for the state.
   - spots: An array of specific tourist attractions/destinations.
*/
window.destinationsData = {
    /* Andhra Pradesh Section: Represents the southeastern coastal state. */
    "Andhra Pradesh": {
        "emoji": "🕉️", /* The emoji represents the spiritual significance of the state. */
        "spots": [
            {
                /* Each spot object contains:
                   - name: The specific title of the destination.
                   - desc: A short narrative describing its importance.
                   - time: The recommended months to visit for optimal weather.
                   - image: A dynamic Unsplash URL for visual representation.
                */
                "name": "Tirupati Balaji Temple",
                "desc": "One of the world's most visited religious sites, home to Lord Venkateswara.",
                "time": "September–February",
                "image": "images/destinations/spots/tirupati.jpg"
            },
            {
                "name": "Araku Valley",
                "desc": "A stunning hill station with coffee plantations and tribal culture.",
                "time": "October–March",
                "image": "images/destinations/spots/araku-valley.jpg"
            },
            {
                "name": "Borra Caves",
                "desc": "Ancient limestone caves with stalactites and stalagmites.",
                "time": "October–March",
                "image": "images/destinations/spots/borra-caves.jpg"
            },
            {
                "name": "Vizag (Visakhapatnam)",
                "desc": "Coastal city with beaches, submarine museum and the Eastern Ghats.",
                "time": "October–February",
                "image": "images/destinations/spots/vizag-beach.jpg"
            }
        ]
    },
    /* Arunachal Pradesh: The land of the rising sun in Northeast India. */
    "Arunachal Pradesh": {
        "emoji": "🏔️", /* Mountain emoji for the Himalayan terrain. */
        "spots": [
            {
                "name": "Tawang Monastery",
                "desc": "India's largest Buddhist monastery perched at 10,000 ft.",
                "time": "March–October",
                "image": "images/destinations/spots/tawang-monastery.jpg"
            },
            {
                "name": "Ziro Valley",
                "desc": "UNESCO tentative heritage site with Apatani tribal villages and rice fields.",
                "time": "March–October",
                "image": "images/destinations/spots/ziro-valley.jpg"
            },
            {
                "name": "Namdapha National Park",
                "desc": "One of India's largest national parks with clouded leopards.",
                "time": "October–April",
                "image": "images/destinations/spots/namdapha.jpg"
            }
        ]
    },
    /* Assam: Famous for its tea and the Brahmaputra river. */
    "Assam": {
        "emoji": "🐅", /* Tiger/Wildlife emoji for Kaziranga prominence. */
        "spots": [
            {
                "name": "Kaziranga National Park",
                "desc": "UNESCO World Heritage site, home to 2/3 of the world's one-horned rhinos.",
                "time": "November–April",
                "image": "images/destinations/spots/kaziranga.jpg"
            },
            {
                "name": "Majuli Island",
                "desc": "World's largest river island and seat of Vaishnavite culture.",
                "time": "October–March",
                "image": "images/destinations/spots/majuli-island.jpg"
            },
            {
                "name": "Kamakhya Temple",
                "desc": "Famous Shakti temple atop Nilachal Hill in Guwahati.",
                "time": "October–April",
                "image": "images/destinations/spots/kamakhya-temple.jpg"
            }
        ]
    },
    /* Bihar: Center of ancient history and learning. */
    "Bihar": {
        "emoji": "🏰", /* Palace emoji for ancient history. */
        "spots": [
            {
                "name": "Bodh Gaya",
                "desc": "Where Gautama Buddha attained enlightenment under the Bodhi Tree.",
                "time": "October–March",
                "image": "images/destinations/spots/bodh-gaya.jpg"
            },
            {
                "name": "Nalanda",
                "desc": "Ruins of the ancient world's greatest university (5th–12th century).",
                "time": "October–March",
                "image": "images/destinations/spots/nalanda.jpg"
            },
            {
                "name": "Rajgir",
                "desc": "Ancient city with hot springs and Vishwa Shanti Stupa.",
                "time": "October–March",
                "image": "images/destinations/spots/nalanda.jpg"
            }
        ]
    },
    /* Chhattisgarh: The land of 36 forts and dense forests. */
    "Chhattisgarh": {
        "emoji": "🌧️", /* Rain emoji for the monsoon-fed waterfalls. */
        "spots": [
            {
                "name": "Chitrakote Falls",
                "desc": "India's widest waterfall, often called the 'Niagara of India'.",
                "time": "July–October",
                "image": "images/destinations/spots/chitrakoot-falls.jpg"
            },
            {
                "name": "Bastar",
                "desc": "Tribal heartland with dense forests and unique Gondi culture.",
                "time": "October–March",
                "image": "images/destinations/spots/bastar.jpg"
            },
            {
                "name": "Sirpur",
                "desc": "Ancient town with Buddhist and Hindu temples from the 5th–8th century.",
                "time": "November–February",
                "image": "images/destinations/spots/sirpur.jpg"
            }
        ]
    },
    /* Goa: The beach capital of India. */
    "Goa": {
        "emoji": "🏖️", /* Beach emoji is mandatory here. */
        "spots": [
            {
                "name": "Baga & Calangute Beach",
                "desc": "North Goa's most popular beaches, full of shacks, water sports and nightlife.",
                "time": "November–February",
                "image": "images/destinations/spots/baga-beach.jpg"
            },
            {
                "name": "Basilica of Bom Jesus",
                "desc": "UNESCO Heritage 16th-century church housing the remains of St. Francis Xavier.",
                "time": "November–March",
                "image": "images/destinations/spots/basilica-bom-jesus.jpg"
            },
            {
                "name": "Dudhsagar Falls",
                "desc": "Majestic 4-tiered waterfall on the Goa-Karnataka border.",
                "time": "July–December",
                "image": "images/destinations/spots/dudhsagar-falls.jpg"
            },
            {
                "name": "Palolem Beach",
                "desc": "Crescent-shaped serene beach in South Goa, perfect for relaxation.",
                "time": "November–March",
                "image": "images/destinations/spots/palolem-beach.jpg"
            }
        ]
    },
    /* Gujarat: Known for white deserts and the Gir lions. */
    "Gujarat": {
        "emoji": "🦁", /* Lion emoji for Gir forest. */
        "spots": [
            {
                "name": "Rann of Kutch",
                "desc": "Vast white salt desert, magical under the full moon during Rann Utsav festival.",
                "time": "November–February",
                "image": "images/destinations/spots/rann-of-kutch.jpg"
            },
            {
                "name": "Gir National Park",
                "desc": "The only home of the Asiatic Lion in the wild.",
                "time": "December–March",
                "image": "images/destinations/spots/gir-forest.jpg"
            },
            {
                "name": "Somnath Temple",
                "desc": "One of India's 12 Jyotirlingas, standing majestically by the Arabian Sea.",
                "time": "October–March",
                "image": "images/destinations/spots/somnath-temple.jpg"
            },
            {
                "name": "Dwarka",
                "desc": "Ancient city and one of the Char Dham pilgrimage sites.",
                "time": "October–March",
                "image": "images/destinations/spots/dwarka.jpg"
            }
        ]
    },
    /* Haryana: The land of agriculture and history. */
    "Haryana": {
        "emoji": "🦆", /* Bird emoji for Sultanpur sanctuary. */
        "spots": [
            {
                "name": "Sultanpur Bird Sanctuary",
                "desc": "Home to 250+ bird species including migratory Siberian cranes.",
                "time": "October–March",
                "image": "images/destinations/spots/sultanpur-sanctuary.jpg"
            },
            {
                "name": "Kurukshetra",
                "desc": "Sacred city where the Mahabharata war was fought, with the Brahma Sarovar lake.",
                "time": "October–March",
                "image": "images/destinations/spots/kurukshetra.jpg"
            }
        ]
    },
    /* Himachal Pradesh: High altitude mountains and adventure. */
    "Himachal Pradesh": {
        "emoji": "🏔️", /* Mountain emoji for the Himalayas. */
        "spots": [
            {
                "name": "Manali",
                "desc": "Adventure hub with snowy peaks, Rohtang Pass, and Solang Valley.",
                "time": "October–June",
                "image": "images/destinations/spots/manali.jpg"
            },
            {
                "name": "Shimla",
                "desc": "The 'Queen of Hills', colonial-era hill station with the famous Mall Road.",
                "time": "March–June, December",
                "image": "images/destinations/spots/shimla.jpg"
            },
            {
                "name": "Spiti Valley",
                "desc": "Cold desert mountain valley with ancient monasteries and surreal landscapes.",
                "time": "May–October",
                "image": "images/destinations/spots/spiti-valley.jpg"
            },
            {
                "name": "Dharamshala",
                "desc": "Home of the Dalai Lama and Tibetan government-in-exile.",
                "time": "March–June",
                "image": "images/destinations/spots/dharamshala.jpg"
            }
        ]
    },
    /* Jharkhand: The land of forests and tribal roots. */
    "Jharkhand": {
        "emoji": "🌧️", /* Rain emoji for the monsoon waterfalls. */
        "spots": [
            {
                "name": "Hundru Falls",
                "desc": "98m high waterfall on the Subarnarekha river, great for picnics.",
                "time": "August–November",
                "image": "images/destinations/spots/hundru-falls.jpg"
            },
            {
                "name": "Betla National Park",
                "desc": "Home to tigers, elephants, and leopards.",
                "time": "November–May",
                "image": "images/destinations/spots/betla-park.jpg"
            }
        ]
    },
    /* Karnataka: A mix of heritage, technology, and nature. */
    "Karnataka": {
        "emoji": "🏰", /* Palace emoji for Mysore and Hampi ruins. */
        "spots": [
            {
                "name": "Hampi",
                "desc": "UNESCO World Heritage ruins of the Vijayanagara Empire amid giant boulders.",
                "time": "October–February",
                "image": "images/destinations/spots/hampi.jpg"
            },
            {
                "name": "Coorg (Kodagu)",
                "desc": "The 'Scotland of India' with coffee estates, waterfalls, and misty hills.",
                "time": "October–March",
                "image": "images/destinations/spots/coorg.jpg"
            },
            {
                "name": "Mysuru Palace",
                "desc": "The grand illuminated palace of the Wadiyar dynasty, a national treasure.",
                "time": "October–February",
                "image": "images/destinations/spots/mysore-palace.jpg"
            },
            {
                "name": "Gokarna",
                "desc": "Pristine beaches and the ancient Mahabaleshwar Temple.",
                "time": "October–March",
                "image": "images/destinations/spots/gokarna.jpg"
            }
        ]
    },
    /* Kerala: God's Own Country. */
    "Kerala": {
        "emoji": "🌴", /* Palm tree emoji for backwaters. */
        "spots": [
            {
                "name": "Alleppey (Alappuzha) Backwaters",
                "desc": "Houseboat cruises through serene coconut-lined canals.",
                "time": "August–March",
                "image": "images/destinations/spots/alleppey.jpg"
            },
            {
                "name": "Munnar",
                "desc": "Rolling tea gardens and misty peaks in the Western Ghats.",
                "time": "September–March",
                "image": "images/destinations/spots/munnar.jpg"
            },
            {
                "name": "Thekkady (Periyar)",
                "desc": "Spice plantations and wildlife sanctuary with elephant sightings on the lake.",
                "time": "September–March",
                "image": "images/destinations/spots/thekkady.jpg"
            },
            {
                "name": "Kovalam Beach",
                "desc": "Crescent beach with lighthouse, Ayurvedic resorts, and calm waters.",
                "time": "September–March",
                "image": "images/destinations/spots/kovalam-beach.jpg"
            }
        ]
    },
    /* Madhya Pradesh: Heart of India, known for tigers and temples. */
    "Madhya Pradesh": {
        "emoji": "🐯", /* Tiger emoji for tiger state. */
        "spots": [
            {
                "name": "Khajuraho",
                "desc": "UNESCO Heritage temples famous for their exquisite erotic sculptures.",
                "time": "October–March",
                "image": "images/destinations/spots/khajuraho.jpg"
            },
            {
                "name": "Bandhavgarh National Park",
                "desc": "Highest density of Bengal tigers in India.",
                "time": "October–June",
                "image": "images/destinations/spots/bandhavgarh.jpg"
            },
            {
                "name": "Orchha",
                "desc": "Medieval fort city with cenotaphs and palaces on the Betwa river.",
                "time": "October–March",
                "image": "images/destinations/spots/orchha.jpg"
            },
            {
                "name": "Mandu",
                "desc": "Ruined city with Afghan architecture and the romantic story of Baz Bahadur and Roopmati.",
                "time": "October–March",
                "image": "images/destinations/spots/mandu.jpg"
            }
        ]
    },
    /* Maharashtra: Land of the Marathas and home to Mumbai. */
    "Maharashtra": {
        "emoji": "🏙️", /* Cityscape emoji for Mumbai. */
        "spots": [
            {
                "name": "Mumbai",
                "desc": "India's financial capital with the Gateway of India, Marine Drive, and Bollywood.",
                "time": "November–February",
                "image": "images/destinations/spots/mumbai-gateway.jpg"
            },
            {
                "name": "Ajanta & Ellora Caves",
                "desc": "UNESCO Heritage rock-cut Buddhist and Hindu cave temples.",
                "time": "October–March",
                "image": "images/destinations/spots/ajanta-ellora.jpg"
            },
            {
                "name": "Lonavala",
                "desc": "Hill station with scenic valleys, waterfalls, and the famous chikki sweets.",
                "time": "June–September",
                "image": "images/destinations/spots/lonavala.jpg"
            }
        ]
    },
    /* Manipur: The Jewel of India. */
    "Manipur": {
        "emoji": "🎭", /* Mask emoji for rich cultural performance. */
        "spots": [
            {
                "name": "Loktak Lake",
                "desc": "World's only floating lake with phumdis (floating biomass islands).",
                "time": "October–March",
                "image": "images/destinations/spots/loktak-lake.jpg"
            },
            {
                "name": "Keibul Lamjao National Park",
                "desc": "World's only floating national park, habitat of the sangai deer.",
                "time": "October–March",
                "image": "images/destinations/spots/keibul-park.jpg"
            }
        ]
    },
    /* Meghalaya: The Abode of Clouds. */
    "Meghalaya": {
        "emoji": "🌧️", /* Rain emoji for the wettest place. */
        "spots": [
            {
                "name": "Cherrapunji & Mawsynram",
                "desc": "Wettest places on Earth with living root bridges and stunning waterfalls.",
                "time": "October–May",
                "image": "images/destinations/spots/cherrapunji.jpg"
            },
            {
                "name": "Shillong",
                "desc": "Scotland of the East with beautiful lakes and colonial architecture.",
                "time": "October–May",
                "image": "images/destinations/spots/shillong.jpg"
            },
            {
                "name": "Dawki",
                "desc": "Crystal-clear Umngot river where boats appear to float on air.",
                "time": "November–April",
                "image": "images/destinations/spots/dawki-river.jpg"
            }
        ]
    },
    /* Mizoram: Land of the Hill People. */
    "Mizoram": {
        "emoji": "🌿", /* Herb emoji for the lush green hills. */
        "spots": [
            {
                "name": "Aizawl",
                "desc": "Dramatic hillside capital with Mizoram State Museum and Durtlang Hills.",
                "time": "October–March",
                "image": "images/destinations/spots/aizawl.jpg"
            },
            {
                "name": "Phawngpui (Blue Mountain)",
                "desc": "Highest peak in Mizoram with orchids and rare wildlife.",
                "time": "October–April",
                "image": "images/destinations/spots/phawngpui.jpg"
            }
        ]
    },
    /* Nagaland: Land of Festivals. */
    "Nagaland": {
        "emoji": "🥁", /* Drum emoji for tribal culture. */
        "spots": [
            {
                "name": "Kohima",
                "desc": "WW2 battlefield town with the moving War Cemetery.",
                "time": "October–May",
                "image": "images/destinations/spots/kohima.jpg"
            },
            {
                "name": "Hornbill Festival Venue (Kisama)",
                "desc": "Cultural hub where all Naga tribes gather every December.",
                "time": "December (festival) / October–May",
                "image": "images/destinations/spots/hornbill-festival.jpg"
            }
        ]
    },
    /* Odisha: Known for its temples and the Konark wheel. */
    "Odisha": {
        "emoji": "🕉️", /* Spiritual emoji for Puri and Konark. */
        "spots": [
            {
                "name": "Konark Sun Temple",
                "desc": "UNESCO Heritage 13th-century temple shaped like a giant stone chariot.",
                "time": "October–February",
                "image": "images/destinations/spots/konark-temple.jpg"
            },
            {
                "name": "Puri",
                "desc": "Jagannath Temple and the famous Rath Yatra chariot festival, plus Puri Beach.",
                "time": "October–March",
                "image": "images/destinations/spots/puri-beach.jpg"
            },
            {
                "name": "Chilika Lake",
                "desc": "Asia's largest coastal lagoon, famous for Irrawaddy dolphins and flamingos.",
                "time": "November–February",
                "image": "images/destinations/spots/chilika-lake.jpg"
            }
        ]
    },
    /* Punjab: The land of five rivers and bravery. */
    "Punjab": {
        "emoji": "🕉️", /* Spiritual emoji for the Golden Temple. */
        "spots": [
            {
                "name": "Golden Temple (Harmandir Sahib), Amritsar",
                "desc": "The holiest Sikh shrine, glowing in gold over the sacred lake.",
                "time": "October–March",
                "image": "images/destinations/spots/golden-temple.jpg"
            },
            {
                "name": "Wagah Border",
                "desc": "Evening flag-lowering ceremony at the India-Pakistan border, a patriotic spectacle.",
                "time": "October–March",
                "image": "images/destinations/spots/wagah-border.jpg"
            },
            {
                "name": "Anandpur Sahib",
                "desc": "Birthplace of Khalsa, with grand Gurudwaras and the Virasat-e-Khalsa museum.",
                "time": "October–March",
                "image": "images/destinations/spots/anandpur-sahib.jpg"
            }
        ]
    },
    /* Rajasthan: The Land of Kings. */
    "Rajasthan": {
        "emoji": "🏰", /* Palace emoji for forts and legacy. */
        "spots": [
            {
                "name": "Jaipur (Pink City)",
                "desc": "Amber Fort, Hawa Mahal, City Palace and colorful bazaars.",
                "time": "October–March",
                "image": "images/destinations/spots/jaipur-amber-fort.jpg"
            },
            {
                "name": "Udaipur (City of Lakes)",
                "desc": "Romantic city with Lake Pichola, City Palace, and island palaces.",
                "time": "October–March",
                "image": "images/destinations/spots/udaipur-lake.jpg"
            },
            {
                "name": "Jaisalmer",
                "desc": "The 'Golden City' in the Thar Desert with the magnificent sandstone fort.",
                "time": "October–March",
                "image": "images/destinations/spots/jaisalmer-fort.jpg"
            },
            {
                "name": "Ranthambore National Park",
                "desc": "Famous tiger reserve with a stunning fort backdrop.",
                "time": "October–June",
                "image": "images/destinations/spots/ranthambore.jpg"
            }
        ]
    },
    /* Sikkim: The organic state of India. */
    "Sikkim": {
        "emoji": "🏔️", /* Mountain emoji for Kangchenjunga. */
        "spots": [
            {
                "name": "Gangtok",
                "desc": "Capital city with views of Kangchenjunga, Rumtek Monastery, and MG Marg.",
                "time": "March–May, October–December",
                "image": "images/destinations/spots/gangtok.jpg"
            },
            {
                "name": "Nathula Pass",
                "desc": "High-altitude Indo-China border pass at 14,140 ft.",
                "time": "May–October",
                "image": "images/destinations/spots/nathula-pass.jpg"
            },
            {
                "name": "Yumthang Valley",
                "desc": "Valley of Flowers of Sikkim with hot springs and rhododendrons.",
                "time": "April–June",
                "image": "images/destinations/spots/yumthang-valley.jpg"
            }
        ]
    },
    /* Tamil Nadu: Known for Dravidian temples and culture. */
    "Tamil Nadu": {
        "emoji": "🏰", /* Temple/Palace emoji for architectural heritage. */
        "spots": [
            {
                "name": "Mahabalipuram",
                "desc": "UNESCO Heritage coastal town with ancient rock-cut temples and shore temples.",
                "time": "October–March",
                "image": "images/destinations/spots/mahabalipuram.jpg"
            },
            {
                "name": "Ooty (Udhagamandalam)",
                "desc": "Queen of hill stations with the Nilgiri Mountain Railway and Botanical Gardens.",
                "time": "April–June, September–November",
                "image": "images/destinations/spots/ooty.jpg"
            },
            {
                "name": "Madurai",
                "desc": "Temple city built around the stunning Meenakshi Amman Temple.",
                "time": "October–March",
                "image": "images/destinations/spots/madurai-temple.jpg"
            },
            {
                "name": "Rameswaram",
                "desc": "Sacred island pilgrimage site with the Ramanathaswamy Temple and Pamban Bridge.",
                "time": "October–April",
                "image": "images/destinations/spots/rameswaram.jpg"
            }
        ]
    },
    /* Telangana: The young state with old roots. */
    "Telangana": {
        "emoji": "🕌", /* Mosque emoji for Hyderabad's Charminar. */
        "spots": [
            {
                "name": "Hyderabad",
                "desc": "City of Nizams with Charminar, Golconda Fort, and famous biryani.",
                "time": "October–February",
                "image": "images/destinations/spots/hyderabad-charminar.jpg"
            },
            {
                "name": "Warangal Fort",
                "desc": "12th-century Kakatiya dynasty fort with ornate stone gateways.",
                "time": "October–February",
                "image": "images/destinations/spots/golconda-fort.jpg"
            },
            {
                "name": "Nagarjuna Sagar",
                "desc": "One of the world's largest masonry dams with a Buddhist island museum.",
                "time": "October–March",
                "image": "images/destinations/spots/nagarjuna-sagar.jpg"
            }
        ]
    },
    /* Tripura: A blend of tribal and royalty. */
    "Tripura": {
        "emoji": "🏰", /* Palace emoji for Ujjayanta and Neermahal. */
        "spots": [
            {
                "name": "Ujjayanta Palace",
                "desc": "Beautiful royal palace-turned-museum in Agartala.",
                "time": "October–March",
                "image": "images/destinations/spots/ujjayanta-palace.jpg"
            },
            {
                "name": "Neermahal",
                "desc": "India's largest water palace, built in the middle of Rudrasagar Lake.",
                "time": "October–March",
                "image": "images/destinations/spots/neermahal.jpg"
            }
        ]
    },
    /* Uttar Pradesh: Home to the Taj Mahal and Varanasi. */
    "Uttar Pradesh": {
        "emoji": "🕌", /* Spiritual emoji for temples and mosques. */
        "spots": [
            {
                "name": "Taj Mahal, Agra",
                "desc": "One of the Seven Wonders of the World, the eternal symbol of love.",
                "time": "October–March",
                "image": "images/destinations/spots/taj-mahal.jpg"
            },
            {
                "name": "Varanasi",
                "desc": "The world's oldest living city, with ghats on the sacred Ganges and Ganga Aarti.",
                "time": "October–March",
                "image": "images/destinations/spots/varanasi-ghats.jpg"
            },
            {
                "name": "Mathura & Vrindavan",
                "desc": "Birthplace of Lord Krishna, vibrant with temples and devotion.",
                "time": "October–March",
                "image": "images/destinations/spots/mathura-vrindavan.jpg"
            },
            {
                "name": "Lucknow",
                "desc": "City of Nawabs with Bara Imambara, Chota Imambara, and Awadhi cuisine.",
                "time": "October–March",
                "image": "images/destinations/spots/lucknow-imambara.jpg"
            }
        ]
    },
    /* Uttarakhand: The Land of Gods. */
    "Uttarakhand": {
        "emoji": "🏔️", /* Mountain emoji for the Himalayas. */
        "spots": [
            {
                "name": "Rishikesh",
                "desc": "Yoga capital of the world, with river rafting, ashrams, and the Laxman Jhula bridge.",
                "time": "September–June",
                "image": "images/destinations/spots/rishikesh.jpg"
            },
            {
                "name": "Valley of Flowers",
                "desc": "UNESCO Heritage alpine meadow blooming with rare Himalayan flowers.",
                "time": "July–September",
                "image": "images/destinations/spots/valley-of-flowers.jpg"
            },
            {
                "name": "Kedarnath",
                "desc": "Sacred Shiva temple at 3,583m, accessible by helicopter or trek.",
                "time": "May–June, September–October",
                "image": "images/destinations/spots/kedarnath.jpg"
            },
            {
                "name": "Jim Corbett National Park",
                "desc": "India's oldest national park, famous for Bengal tigers.",
                "time": "November–June",
                "image": "images/destinations/spots/jim-corbett.jpg"
            }
        ]
    },
    /* West Bengal: Known for its culture, tigers, and hills. */
    "West Bengal": {
        "emoji": "🐅", /* Tiger emoji for Sundarbans. */
        "spots": [
            {
                "name": "Darjeeling",
                "desc": "Queen of the Hills with Himalayan views, tea gardens, and the Toy Train.",
                "time": "March–May, October–December",
                "image": "images/destinations/spots/darjeeling.jpg"
            },
            {
                "name": "Sundarbans",
                "desc": "World's largest mangrove forest and home to the Royal Bengal Tiger.",
                "time": "November–February",
                "image": "images/destinations/spots/sundarbans.jpg"
            },
            {
                "name": "Kolkata",
                "desc": "The cultural capital of India with Victoria Memorial, Howrah Bridge, and street food.",
                "time": "October–February",
                "image": "images/destinations/spots/kolkata-victoria.jpg"
            }
        ]
    }
};

/**
 * ADVENTURE DATA
 * This object specifically stores adrenaline-pumping activities across the 28 Indian states.
 * It follows the same structure as destinationsData to allow the modal logic in app.js
 * to be reused seamlessly.
 */
window.adventureData = {
    "Andhra Pradesh": {
        "emoji": "🏔️",
        "spots": [
            { "name": "Araku Valley Trekking", "desc": "Trek through the lush coffee plantations and dense forests of the Eastern Ghats.", "time": "October–March", "image": "images/adventure/spots/araku-trek.jpg" },
            { "name": "Gandikota Canyoning", "desc": "Explore the 'Grand Canyon of India' with rock climbing and rappelling.", "time": "September–February", "image": "images/adventure/spots/netarhat-climbing.jpg" },
            { "name": "Vizag Scuba Diving", "desc": "Discover the vibrant marine life of the Bay of Bengal near Chintapalli.", "time": "November–March", "image": "images/adventure/spots/goa-scuba.jpg" }
        ]
    },
    "Arunachal Pradesh": {
        "emoji": "🧗",
        "spots": [
            { "name": "Tawang High Altitude Trek", "desc": "A challenging trek to the high passes and glacial lakes surrounding Tawang.", "time": "March–June", "image": "images/adventure/spots/tawang-trek.jpg" },
            { "name": "Siang River Rafting", "desc": "Experience Grade IV and V rapids on the powerful Brahmaputra tributary.", "time": "November–March", "image": "images/adventure/spots/brahmaputra-rafting.jpg" },
            { "name": "Ziro Valley Cycling", "desc": "Cycle through the picturesque paddy fields and Apatani tribal villages.", "time": "August–October", "image": "images/adventure/spots/kiratpur-cycling.jpg" }
        ]
    },
    "Assam": {
        "emoji": "🚣",
        "spots": [
            { "name": "Brahmaputra River Cruising", "desc": "An adventurous multi-day expedition down one of Asia's great rivers.", "time": "November–April", "image": "images/adventure/spots/brahmaputra-rafting.jpg" },
            { "name": "Kaziranga Elephant Safari", "desc": "Get up close with the One-Horned Rhino in the tall elephant grass.", "time": "November–April", "image": "images/adventure/spots/chilika-birdwatch.jpg" },
            { "name": "Manas Tiger Tracking", "desc": "Guided treks through the dense foliage of Manas National Park.", "time": "October–March", "image": "images/adventure/spots/wayanad-trek.jpg" }
        ]
    },
    "Bihar": {
        "emoji": "🧗",
        "spots": [
            { "name": "Rajgir Rock Climbing", "desc": "Scaling the rocky terrains and historic hills of ancient Rajgir.", "time": "October–March", "image": "images/adventure/spots/rajgir-rockclimbing.jpg" },
            { "name": "Ganges Kayaking", "desc": "A unique perspective of the river culture near Patna and Munger.", "time": "November–February", "image": "images/adventure/spots/ganga-rafting.jpg" },
            { "name": "Valmiki Wildlife Trek", "desc": "Exploration of the tiger reserve on the Indo-Nepal border.", "time": "December–March", "image": "images/adventure/spots/dzukou-trek.jpg" }
        ]
    },
    "Chhattisgarh": {
        "emoji": "🔦",
        "spots": [
            { "name": "Kanger Valley Caving", "desc": "Exploring the subterranean stalactite formations of Kutumsar Caves.", "time": "October–May", "image": "images/adventure/spots/kanger-caving.jpg" },
            { "name": "Tirathgarh Rappelling", "desc": "The ultimate thrill of descending the 300ft Tirathgarh waterfalls.", "time": "August–November", "image": "images/adventure/spots/dandeli-rafting.jpg" },
            { "name": "Bastar Tribal Trail", "desc": "Multi-day cycling or trekking through the heart of Gond tribal lands.", "time": "November–February", "image": "images/adventure/spots/coorg-trek.jpg" }
        ]
    },
    "Goa": {
        "emoji": "🏄",
        "spots": [
            { "name": "Grand Island Scuba Diving", "desc": "Exploring shipwrecks and coral reefs in the clear Arabian Sea.", "time": "October–May", "image": "images/adventure/spots/goa-scuba.jpg" },
            { "name": "Mandovi River Kayaking", "desc": "Navigating the dense mangrove forests of the Chorao Island.", "time": "November–April", "image": "images/adventure/spots/dawki-boating.jpg" },
            { "name": "Kite Surfing at Morjim", "desc": "Harnessing the winds of the North Goa coast for high-speed thrills.", "time": "December–March", "image": "images/adventure/spots/goa-watersports.jpg" }
        ]
    },
    "Gujarat": {
        "emoji": "🏜️",
        "spots": [
            { "name": "Rann Desert Safari", "desc": "Driving across the white salt flats in open 4x4 jeeps.", "time": "November–February", "image": "images/adventure/spots/kutch-safari.jpg" },
            { "name": "Saputara Paragliding", "desc": "Sailing over the scenic Sahyadri range in Gujarat's only hill station.", "time": "October–December", "image": "images/adventure/spots/ananthagiri-paragliding.jpg" },
            { "name": "Gir Lion Safari", "desc": "The adrenaline of spotting an Asiatic Lion in the dry deciduous forest.", "time": "December–March", "image": "images/adventure/spots/kutch-safari.jpg" }
        ]
    },
    "Haryana": {
        "emoji": "🪂",
        "spots": [
            { "name": "Morni Hills Trekking", "desc": "A moderate trek to the highest point of Haryana with panoramic views.", "time": "September–March", "image": "images/adventure/spots/morni-parasailing.jpg" },
            { "name": "Tikkar Taal Paramotoring", "desc": "Experience motorized paragliding over the beautiful lakeside terrain.", "time": "October–February", "image": "images/adventure/spots/morni-parasailing.jpg" },
            { "name": "Damdama Lake Zip-lining", "desc": "High-speed aerial descent over the waters of Damdama.", "time": "Year-round", "image": "images/adventure/spots/hot-air-balloon.jpg" }
        ]
    },
    "Himachal Pradesh": {
        "emoji": "⛷️",
        "spots": [
            { "name": "Solang Valley Skiing", "desc": "Carving through fresh powder on the slopes of the Pir Panjal range.", "time": "January–February", "image": "images/adventure/spots/manali-skiing.jpg" },
            { "name": "Bir Billing Paragliding", "desc": "Taking flight from the world's second-highest paragliding site.", "time": "March–June", "image": "images/adventure/spots/ananthagiri-paragliding.jpg" },
            { "name": "Beas River Rafting", "desc": "Tackling the icy rapids of the Beas near Kullu.", "time": "September–June", "image": "images/adventure/spots/beas-rafting.jpg" }
        ]
    },
    "Jharkhand": {
        "emoji": "🧗",
        "spots": [
            { "name": "Netarhat Rock Climbing", "desc": "Scaling the sharp peaks of the 'Queen of Chotanagpur'.", "time": "November–March", "image": "images/adventure/spots/netarhat-climbing.jpg" },
            { "name": "Dimna Lake Jet Skiing", "desc": "High-octane water sports on the sprawling lake near Jamshedpur.", "time": "Year-round", "image": "images/adventure/spots/goa-watersports.jpg" },
            { "name": "Parasnath Hill Trek", "desc": "A spiritual trek to the highest peak in Jharkhand.", "time": "October–March", "image": "images/adventure/spots/dzukou-trek.jpg" }
        ]
    },
    "Karnataka": {
        "emoji": "☕",
        "spots": [
            { "name": "Coorg River Rafting", "desc": "Whitewater rafting on the Barapole River's turbulent rapids.", "time": "July–September", "image": "images/adventure/spots/brahmaputra-rafting.jpg" },
            { "name": "Dandeli Wildlife Jungle Trek", "desc": "Guided nocturnal treks through the Kali Tiger Reserve.", "time": "October–April", "image": "images/adventure/spots/wayanad-trek.jpg" },
            { "name": "Gokarna Beach Trekking", "desc": "Hiking across the rugged cliffs connecting Half Moon and Paradise beaches.", "time": "November–February", "image": "images/adventure/spots/wayanad-trek.jpg" }
        ]
    },
    "Kerala": {
        "emoji": "🛶",
        "spots": [
            { "name": "Munnar Tea Garden Trek", "desc": "A high-altitude hike through the world's highest tea plantations.", "time": "August–March", "image": "images/adventure/spots/wayanad-trek.jpg" },
            { "name": "Varkala Cliff Surfing", "desc": "Catching North Indian Ocean swells under the dramatic red cliffs.", "time": "December–March", "image": "images/adventure/spots/goa-watersports.jpg" },
            { "name": "Periyar Night Jungle Trail", "desc": "A sensory adventure through the evergreen forests after dark.", "time": "September–March", "image": "images/adventure/spots/wayanad-trek.jpg" }
        ]
    },
    "Madhya Pradesh": {
        "emoji": "🦁",
        "spots": [
            { "name": "Kanha Tiger Tracking", "desc": "Intense tracking of the Royal Bengal Tiger in the Maikal Range.", "time": "November–June", "image": "images/adventure/spots/kutch-safari.jpg" },
            { "name": "Bhedaghat Marble Rocks Boat Ride", "desc": "Navigating the moonlit marble canyons of the Narmada River.", "time": "October–April", "image": "images/adventure/spots/dawki-boating.jpg" },
            { "name": "Pachmarhi Caving", "desc": "Exploring the ancient Pandav Caves and Reechgarh formations.", "time": "September–May", "image": "images/adventure/spots/kanger-caving.jpg" }
        ]
    },
    "Maharashtra": {
        "emoji": "🧗",
        "spots": [
            { "name": "Kalsubai Peak Trek", "desc": "Ascending the highest peak of the Sahyadris at 5,400 ft.", "time": "August–December", "image": "images/adventure/spots/wayanad-trek.jpg" },
            { "name": "Kolad River Rafting", "desc": "The only year-round whitewater rafting site on the Kundalika River.", "time": "Monsoon", "image": "images/adventure/spots/brahmaputra-rafting.jpg" },
            { "name": "Pawana Lake Camping", "desc": "Stargazing and lakeside adventure near Lonavala.", "time": "November–March", "image": "images/adventure/spots/rohtang-pass.jpg" }
        ]
    },
    "Manipur": {
        "emoji": "🏔️",
        "spots": [
            { "name": "Dzuko Valley Trek", "desc": "Crossing the border into the 'Valley of Flowers' of the East.", "time": "May–August", "image": "images/adventure/spots/dzukou-trek.jpg" },
            { "name": "Loktak Lake Kayaking", "desc": "Paddling through the phumdis of the world's only floating lake.", "time": "October–March", "image": "images/adventure/spots/loktak-kayak.jpg" },
            { "name": "Shirui Peak Trek", "desc": "A floral adventure to find the rare Shirui Lily.", "time": "May–June", "image": "images/adventure/spots/dzukou-trek.jpg" }
        ]
    },
    "Meghalaya": {
        "emoji": "🌿",
        "spots": [
            { "name": "Double Decker Root Bridge Trek", "desc": "A 3,500-step descent into the heart of the rainforest.", "time": "October–May", "image": "images/adventure/spots/dzukou-trek.jpg" },
            { "name": "Krem Liat Prah Caving", "desc": "Exploring one of the longest natural cave systems in India.", "time": "November–March", "image": "images/adventure/spots/caving-meghalaya.jpg" },
            { "name": "Dawki River Cliff Jumping", "desc": "The ultimate adrenaline leap into the crystal clear Umngot River.", "time": "November–April", "image": "images/adventure/spots/goa-watersports.jpg" }
        ]
    },
    "Mizoram": {
        "emoji": "🏔️",
        "spots": [
            { "name": "Phawngpui Blue Mountain Trek", "desc": "Conquering Mizoram's highest peak with unique flora and fauna.", "time": "October–April", "image": "images/adventure/spots/dzukou-trek.jpg" },
            { "name": "Reiek Tlang Hike", "desc": "Walking along the knife-edge ridges near Aizawl.", "time": "October–March", "image": "images/adventure/spots/dzukou-trek.jpg" },
            { "name": "Vantawng Falls Trek", "desc": "Hiking through the dense greenery surrounding the state's highest fall.", "time": "September–January", "image": "images/adventure/spots/dzukou-trek.jpg" }
        ]
    },
    "Nagaland": {
        "emoji": "🏔️",
        "spots": [
            { "name": "Dzukou Valley Trek", "desc": "Trekking through the surreal landscape of rolling green hills.", "time": "June–September", "image": "images/adventure/spots/dzukou-trek.jpg" },
            { "name": "Mount Saramati Trek", "desc": "A high-altitude expedition to the snow-capped Naga mountains.", "time": "November–March", "image": "images/adventure/spots/dzukou-trek.jpg" },
            { "name": "Khonoma Village Walking", "desc": "Exploring Asia's first green village via ancient stone steps.", "time": "Year-round", "image": "images/adventure/spots/dzukou-trek.jpg" }
        ]
    },
    "Odisha": {
        "emoji": "🔭",
        "spots": [
            { "name": "Chilika Lake Sailing", "desc": "Navigating the vast lagoon to spot rare Irrawaddy dolphins.", "time": "November–February", "image": "images/adventure/spots/dawki-boating.jpg" },
            { "name": "Bhitarkanika Mangrove Safari", "desc": "A prehistoric adventure among giant saltwater crocodiles.", "time": "October–March", "image": "images/adventure/spots/chilika-birdwatch.jpg" },
            { "name": "Puri Surf Festival", "desc": "Ride the Bay of Bengal waves during India's premier surf event.", "time": "November", "image": "images/adventure/spots/goa-watersports.jpg" }
        ]
    },
    "Punjab": {
        "emoji": "🚴",
        "spots": [
            { "name": "Kiratpur Sahib Adventure Sports", "desc": "Zip-lining, crossing rope bridges, and ATV rides on the Sutlej banks.", "time": "October–March", "image": "images/adventure/spots/kiratpur-cycling.jpg" },
            { "name": "Harike Wetland Birding", "desc": "Boat-based bird watching for thousands of migratory species.", "time": "November–February", "image": "images/adventure/spots/chilika-birdwatch.jpg" },
            { "name": "Amritsar Farm Stay Cycling", "desc": "Blowing off steam on village cycling trails through yellow sarson fields.", "time": "Winter", "image": "images/adventure/spots/kiratpur-cycling.jpg" }
        ]
    },
    "Rajasthan": {
        "emoji": "🐫",
        "spots": [
            { "name": "Thar Desert Camels Safari", "desc": "Overnight expeditions into the deep dunes of Jaisalmer.", "time": "November–February", "image": "images/adventure/spots/jaisalmer-camel.jpg" },
            { "name": "Jaipur Hot Air Ballooning", "desc": "Floating silently over the Amer Fort and Aravalli hills.", "time": "September–March", "image": "images/adventure/spots/hot-air-balloon.jpg" },
            { "name": "Udaipur Speed Boating", "desc": "High-speed turns on the royal waters of Fateh Sagar Lake.", "time": "Year-round", "image": "images/adventure/spots/dawki-boating.jpg" }
        ]
    },
    "Sikkim": {
        "emoji": "🏔️",
        "spots": [
            { "name": "Goechala Base Camp Trek", "desc": "The closest look at the mighty Kanchenjunga peak.", "time": "April–June, October–November", "image": "images/adventure/spots/kanchenjunga-trek.jpg" },
            { "name": "Teesta River Rafting", "desc": "Taming the turbulent Teesta rapids near Melli.", "time": "March–May", "image": "images/adventure/spots/brahmaputra-rafting.jpg" },
            { "name": "Rumtek Monastery Hike", "desc": "A spiritual and scenic trek through the mist-covered hills.", "time": "March–June", "image": "images/adventure/spots/dzukou-trek.jpg" }
        ]
    },
    "Tamil Nadu": {
        "emoji": "🚂",
        "spots": [
            { "name": "Ooty Mountain Railway Ride", "desc": "An iconic slow-motion journey through the Nilgiri tunnels and curves.", "time": "April–June", "image": "images/adventure/spots/nilgiri-train.jpg" },
            { "name": "Kodaikanal Forest Trekking", "desc": "Exploring the Pine Forests and Pillar Rocks on foot.", "time": "September–March", "image": "images/adventure/spots/kodaikanal-trek.jpg" },
            { "name": "Mudumalai Jungle Safari", "desc": "Safari through the heart of the Nilgiri Biosphere Reserve.", "time": "October–May", "image": "images/adventure/spots/kutch-safari.jpg" }
        ]
    },
    "Telangana": {
        "emoji": "🪂",
        "spots": [
            { "name": "Ananthagiri Hills Camping", "desc": "A quick escape for forest trekking and overnight camping.", "time": "Winter", "image": "images/adventure/spots/rohtang-pass.jpg" },
            { "name": "Nagarjuna Sagar Boating", "desc": "Cruising the massive reservoir to reach the island museum.", "time": "August–October", "image": "images/adventure/spots/dawki-boating.jpg" },
            { "name": "Hyderabad Rock Climbing", "desc": "Conquering the ancient granite boulders of the Deccan plateau.", "time": "October–February", "image": "images/adventure/spots/rajgir-rockclimbing.jpg" }
        ]
    },
    "Tripura": {
        "emoji": "🏔️",
        "spots": [
            { "name": "Jampui Hills Orange Trail Trek", "desc": "Trekking through the orange orchards with views of Bangladesh.", "time": "October–December", "image": "images/adventure/spots/jampui-trek.jpg" },
            { "name": "Unakoti Hill Climbing", "desc": "A mix of archaeology and climbing to see the giant rock carvings.", "time": "October–March", "image": "images/adventure/spots/rajgir-rockclimbing.jpg" },
            { "name": "Gumti Wildlife Exploration", "desc": "Boat explorations through the marshy habitats of Gumti reservoir.", "time": "November–February", "image": "images/adventure/spots/chilika-birdwatch.jpg" }
        ]
    },
    "Uttar Pradesh": {
        "emoji": "🚣",
        "spots": [
            { "name": "Rishikesh River Rafting", "desc": "Conquering the 'Wall' and 'Golf Course' rapids on the holy Ganges.", "time": "September–June", "image": "images/adventure/spots/ganga-rafting.jpg" },
            { "name": "Pilibhit Tiger Safari", "desc": "Exploring the Terai region forests on the trail of the big cat.", "time": "November–June", "image": "images/adventure/spots/kutch-safari.jpg" },
            { "name": "Katarniaghat Wildlife Cruise", "desc": "Spotting crocodiles and dolphins on the Girwa River.", "time": "October–March", "image": "images/adventure/spots/dawki-boating.jpg" }
        ]
    },
    "Uttarakhand": {
        "emoji": "🌸",
        "spots": [
            { "name": "Valley of Flowers Trek", "desc": "A legendary floral trek through the UNESCO World Heritage site.", "time": "July–August", "image": "images/adventure/spots/valley-flowers-trek.jpg" },
            { "name": "Auli Skiing Adventure", "desc": "Skiing on the slopes of India's premier winter sports destination.", "time": "January–March", "image": "images/adventure/spots/auli-skiing.jpg" },
            { "name": "Roopkund Skeletal Lake Trek", "desc": "A high-altitude mystery trek at 16,000 ft in the Himalayas.", "time": "May–June, September–October", "image": "images/adventure/spots/dzukou-trek.jpg" }
        ]
    },
    "West Bengal": {
        "emoji": "🏔️",
        "spots": [
            { "name": "Sandakphu Ridge Trek", "desc": "The only trek that offers views of 4 of the 5 highest peaks in the world.", "time": "October–May", "image": "images/adventure/spots/sandakphu-trek.jpg" },
            { "name": "Sundarbans Boat Exploration", "desc": "A tense search for the swimming tigers in the mangrove maze.", "time": "November–February", "image": "images/adventure/spots/dawki-boating.jpg" },
            { "name": "Teesta River Rafting", "desc": "Navigating the white waters where the Teesta and Rangit rivers meet.", "time": "March–May", "image": "images/adventure/spots/brahmaputra-rafting.jpg" }
        ]
    }
};
