// Client-Side Database & API client (optimized for static hosting like Neocities)

// SEED DATA BUNDLED FOR CLIENT-SIDE STORAGE
const BUNDLED_LESSONS = [
  { id: 1, category: 'keys', title: 'Home Row Basics', text: 'asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;', ord: 1, finger_map: '{"a": "Left Pinky", "s": "Left Ring", "d": "Left Middle", "f": "Left Index", "j": "Right Index", "k": "Right Middle", "l": "Right Ring", ";": "Right Pinky", " ": "Thumb"}' },
  { id: 2, category: 'keys', title: 'Top Row Navigation', text: 'qwer uiop qwer uiop qwer uiop qwer uiop qwer uiop qwer uiop qwer uiop qwer uiop', ord: 2, finger_map: '{"q": "Left Pinky", "w": "Left Ring", "e": "Left Middle", "r": "Left Index", "u": "Right Index", "i": "Right Middle", "o": "Right Ring", "p": "Right Pinky", " ": "Thumb"}' },
  { id: 3, category: 'keys', title: 'Bottom Row Action', text: 'zxcv m,./ zxcv m,./ zxcv m,./ zxcv m,./ zxcv m,./ zxcv m,./ zxcv m,./ zxcv m,./', ord: 3, finger_map: '{"z": "Left Pinky", "x": "Left Ring", "c": "Left Middle", "v": "Left Index", "m": "Right Index", ",": "Right Middle", ".": "Right Ring", "/": "Right Pinky", " ": "Thumb"}' },
  { id: 4, category: 'keys', title: 'Numbers and Digits', text: '1234 5678 90 1234 5678 90 1234 5678 90 1234 5678 90 1234 5678 90 1234 5678 90', ord: 4, finger_map: '{"1": "Left Pinky", "2": "Left Ring", "3": "Left Middle", "4": "Left Index", "5": "Left Index", "6": "Right Index", "7": "Right Index", "8": "Right Middle", "9": "Right Ring", "0": "Right Pinky", " ": "Thumb"}' },
  { id: 5, category: 'keys', title: 'Punctuation and Symbols', text: 'foo. bar, baz? "hello" (world) [ok] {test} + - = * / % & | ! # $ @', ord: 5, finger_map: '{"." : "Right Ring", ",": "Right Middle", "?": "Right Pinky (with Shift)", "\\"": "Right Pinky (with Shift)", "(": "Right Ring (with Shift)", ")": "Right Pinky (with Shift)", "[": "Right Pinky", "]": "Right Pinky", "{": "Right Pinky (with Shift)", "}": "Right Pinky (with Shift)", "+": "Right Pinky (with Shift)", "-": "Right Pinky", "=": "Right Pinky", "*": "Right Index (with Shift)", "/": "Right Pinky", "%": "Left Index (with Shift)", "&": "Right Index (with Shift)", "|": "Right Pinky (with Shift)", "!": "Left Pinky (with Shift)", "#": "Left Middle (with Shift)", "$": "Left Index (with Shift)", "@": "Left Ring (with Shift)"}' },
  { id: 6, category: 'speed', title: 'Common Words', text: 'the quick brown fox jumps over the lazy dog and she said he was going to the store with them to buy some fresh bread', ord: 6, finger_map: '{}' },
  { id: 7, category: 'speed', title: 'Bigrams and Trigrams', text: 'th he an in er on re ed nd ha ent ion tio wit for othe res th he an in er on re ed nd ha ent ion tio wit for othe res', ord: 7, finger_map: '{}' },
  { id: 8, category: 'speed', title: 'Capitalization Drill', text: 'London Paris New York Tokyo Rome Cairo Sydney Beijing Moscow Berlin Toronto Brazil Tokyo Cairo London Rome', ord: 8, finger_map: '{}' },
  { id: 9, category: 'speed', title: 'Punctuation Combos', text: 'Wait! Did you say, "The price is $50.00"? Yes, it includes tax (15%) and shipping!', ord: 9, finger_map: '{}' },
  { id: 10, category: 'coding', title: 'HTML & CSS Syntax', text: '<div class="card" id="main-card">\n  <h1 style="color: #2FA8E0;">Hello World</h1>\n  <p class="text-muted">Welcome to TypeWise.</p>\n</div>', ord: 10, finger_map: '{}' },
  { id: 11, category: 'coding', title: 'JavaScript Code Blocks', text: 'function calculateWpm(chars, seconds) {\n  const words = chars / 5;\n  const minutes = seconds / 60;\n  return Math.round(words / minutes);\n}', ord: 11, finger_map: '{}' },
  { id: 12, category: 'coding', title: 'Bracket Matcher', text: 'const config = { options: [ { name: "Ocean", colors: ["#2FA8E0", "#ffffff"] } ], active: true };', ord: 12, finger_map: '{}' }
];

const BUNDLED_PASSAGES = [
  // Science
  { id: 1, category: 'science', difficulty: 'medium', text: 'Light from the Sun takes approximately eight minutes and twenty seconds to reach the Earth. Traveling at a speed of about one hundred and eighty-six thousand miles per second, solar photons traverse the ninety-three million miles of vacuum in space before hitting our atmosphere.', fact_summary: 'Sunlight takes about 8 minutes and 20 seconds to travel 93 million miles to Earth.', word_count: 45 },
  { id: 2, category: 'science', difficulty: 'easy', text: 'Water is the only natural substance on Earth that is commonly found in three physical states. It exists naturally as a solid in ice, as a liquid in lakes and oceans, and as a gas in water vapor in the atmosphere.', fact_summary: 'Water is the only natural substance found as a solid, liquid, and gas naturally on Earth.', word_count: 40 },
  { id: 3, category: 'science', difficulty: 'hard', text: 'Mitochondria are double-membraned organelles found in most eukaryotic organisms. Often described as the cellular powerhouses, they generate adenosine triphosphate, which cells utilize as a source of chemical energy, while also containing their own independent genome that is inherited maternally.', fact_summary: 'Mitochondria produce ATP (energy) and have their own distinct genome inherited from the mother.', word_count: 40 },
  { id: 4, category: 'science', difficulty: 'medium', text: 'The blue whale is the largest animal known to have ever lived on Earth, reaching lengths of up to one hundred feet and weights of nearly two hundred tons. Their tongue alone can weigh as much as an entire adult elephant, and their heart is the size of a small car.', fact_summary: 'Blue whales are the largest animals ever, with tongues weighing as much as an elephant.', word_count: 51 },
  { id: 5, category: 'science', difficulty: 'medium', text: 'Venus is the hottest planet in our solar system, with a surface temperature exceeding four hundred and sixty degrees Celsius. This extreme heat is caused by a runaway greenhouse effect triggered by a dense atmosphere composed mostly of carbon dioxide and thick clouds of sulfuric acid.', fact_summary: 'Venus is the hottest planet due to a dense carbon dioxide greenhouse atmosphere.', word_count: 47 },
  { id: 6, category: 'science', difficulty: 'easy', text: 'Octopuses have three hearts and blue blood. Two of the hearts pump blood to the gills, while the third pumps it to the rest of the body. Their blood is blue because it uses a copper-rich protein called hemocyanin to carry oxygen.', fact_summary: 'Octopuses have three hearts and copper-rich blue blood.', word_count: 44 },
  { id: 7, category: 'science', difficulty: 'hard', text: 'Quantum entanglement is a physical phenomenon that occurs when pairs or groups of particles are generated, interact, or share spatial proximity in ways such that the quantum state of each particle cannot be described independently of the state of the others, even when separated by large distances.', fact_summary: 'Quantum entanglement links particles so the state of one instantly defines the state of the other.', word_count: 47 },
  { id: 8, category: 'science', difficulty: 'medium', text: 'A single lightning bolt can reach temperatures of thirty thousand Kelvin, which is about five times hotter than the surface of the Sun. This intense heat causes the surrounding air to rapidly expand and vibrate, creating the loud shockwave we hear as thunder.', fact_summary: 'Lightning is five times hotter than the Sun surface, causing thunder via expanding air.', word_count: 45 },
  { id: 9, category: 'science', difficulty: 'easy', text: 'Bananas are radioactive because they contain high levels of potassium. Specifically, they contain potassium-forty, a radioactive isotope. However, the radiation is so small that you would need to eat ten million bananas at once to die of radiation poisoning.', fact_summary: 'Bananas contain potassium-40, making them slightly radioactive but completely safe.', word_count: 40 },
  { id: 10, category: 'science', difficulty: 'hard', text: 'The tardigrade, or water bear, is an microscopic invertebrate famous for surviving extreme conditions. Through a process called cryptobiosis, they expel almost all water from their bodies, surviving temperatures near absolute zero, the vacuum of space, and intense radiation levels that would kill humans.', fact_summary: 'Tardigrades survive outer space and absolute zero by entering a dehydrated cryptobiotic state.', word_count: 46 },
  
  // History
  { id: 11, category: 'history', difficulty: 'easy', text: 'The Great Pyramid of Giza was built as a tomb for the Egyptian Pharaoh Khufu around twenty-five hundred BC. It stood as the tallest man-made structure in the world for over three thousand eight hundred years, until the Lincoln Cathedral in England surpassed it.', fact_summary: 'The Great Pyramid was the tallest man-made structure for over 3,800 years.', word_count: 45 },
  { id: 12, category: 'history', difficulty: 'medium', text: 'In 1912, the Titanic sank on its maiden voyage from Southampton to New York City. Despite being labeled unsinkable, the ocean liner struck an iceberg in the North Atlantic at eleven-forty PM on April fourteenth, sinking two hours and forty minutes later, resulting in over fifteen hundred deaths.', fact_summary: 'The Titanic struck an iceberg at 11:40 PM on April 14, 1912, and sank in under three hours.', word_count: 48 },
  { id: 13, category: 'history', difficulty: 'hard', text: 'The Magna Carta, meaning Great Charter, was drafted by the Archbishop of Canterbury and signed by King John of England at Runnymede in 1215. It established the principle that everyone, including the monarch, is subject to the law, guaranteeing rights to individuals and inspiring modern constitutional democracies.', fact_summary: 'Magna Carta was signed in 1215, establishing the rule of law over the absolute power of kings.', word_count: 48 },
  { id: 14, category: 'history', difficulty: 'medium', text: 'The Library of Alexandria, founded in Egypt around three hundred BC, was one of the largest and most significant libraries of the ancient world. It housed hundreds of thousands of papyrus scrolls containing works of philosophy, science, and literature before its gradual destruction by fires and conquests.', fact_summary: 'The Library of Alexandria was the ancient world capital of knowledge, holding thousands of scrolls.', word_count: 48 },
  { id: 15, category: 'history', difficulty: 'easy', text: 'Apollo Eleven was the spaceflight that first landed humans on the Moon on July twentieth, 1969. Commander Neil Armstrong and Lunar Module Pilot Buzz Aldrin walked on the lunar surface for over two hours while Michael Collins orbited above in the command module.', fact_summary: 'Apollo 11 landed Neil Armstrong and Buzz Aldrin on the Moon in July 1969.', word_count: 44 },
  { id: 16, category: 'history', difficulty: 'medium', text: 'The Black Death was a devastating global bubonic plague pandemic that peaked in Europe between 1347 and 1351. Carried by fleas on rats, the plague killed an estimated seventy-five to two hundred million people, wiping out nearly half of the European population and transforming medieval society.', fact_summary: 'The Black Death plague in the 14th century wiped out up to 60% of Europe population.', word_count: 47 },
  { id: 17, category: 'history', difficulty: 'hard', text: 'The Gutenberg press, invented by German blacksmith Johannes Gutenberg around 1440, introduced movable type printing to Europe. This technological leap democratized access to books, accelerated the spread of literacy, fueled the Renaissance, and laid the foundations for the Scientific Revolution and the Age of Enlightenment.', fact_summary: 'Gutenberg printing press (c. 1440) revolutionized literacy, fueling the Renaissance and Enlightenment.', word_count: 48 },
  { id: 18, category: 'history', difficulty: 'easy', text: 'Julius Caesar was assassinated by a group of rebellious Roman senators on the Ides of March, which is March fifteenth, forty-four BC. The conspiracy, led by Marcus Junius Brutus, aimed to restore the Roman Republic, but instead triggered civil wars that led to the Roman Empire.', fact_summary: 'Julius Caesar was assassinated on March 15, 44 BC, leading to the rise of the Roman Empire.', word_count: 46 },
  { id: 19, category: 'history', difficulty: 'medium', text: 'The Wright brothers, Orville and Wilbur, made the first controlled, sustained flight of a powered, heavier-than-air aircraft on December seventeenth, 1903. The flight took place in Kitty Hawk, North Carolina, with the aircraft flying one hundred and twenty feet in twelve seconds.', fact_summary: 'The Wright brothers achieved the first powered airplane flight in 1903 in Kitty Hawk.', word_count: 43 },
  { id: 20, category: 'history', difficulty: 'hard', text: 'The Rosetta Stone, discovered by French soldiers in Egypt in 1799, is a granodiorite stele inscribed with three versions of a decree issued at Memphis in 196 BC. Because the text was written in Ancient Egyptian hieroglyphs, Demotic script, and Ancient Greek, it became the key to deciphering hieroglyphic writing.', fact_summary: 'The Rosetta Stone was the key to unlocking Ancient Egyptian hieroglyphs because it had parallel Greek translation.', word_count: 51 },

  // Geography
  { id: 21, category: 'geography', difficulty: 'easy', text: 'Mount Everest is the highest mountain in the world above sea level, located in the Himalayas on the border between Nepal and China. It stands at eight thousand eight hundred and forty-eight meters, attracting climbers from all over the world despite severe cold and thin air.', fact_summary: 'Mount Everest is the highest peak in the world, standing at 8,848 meters on the Nepal-China border.', word_count: 48 },
  { id: 22, category: 'geography', difficulty: 'medium', text: 'The Nile River is traditionally considered the longest river in the world, flowing northwards for over six thousand six hundred kilometers through eleven African countries before emptying into the Mediterranean Sea. It was crucial to the development and agricultural success of ancient Egyptian civilizations.', fact_summary: 'The Nile flows over 6,600 km through 11 African countries and nurtured ancient Egypt.', word_count: 48 },
  { id: 23, category: 'geography', difficulty: 'hard', text: 'La Paz, the administrative capital of Bolivia, is the highest administrative capital city in the world, sitting at an elevation of roughly three thousand six hundred and forty meters above sea level. It resides inside a canyon, creating a unique bowl-shaped topography surrounded by snowy peaks.', fact_summary: 'Bolivia administrative capital, La Paz, is the highest capital city in the world (3,640m).', word_count: 47 },
  { id: 24, category: 'geography', difficulty: 'easy', text: 'Canada has more lakes than the rest of the world combined. Roughly nine percent of the country total area is covered by freshwater, containing over two million lakes, of which more than thirty thousand are larger than three square kilometers.', fact_summary: 'Canada contains 9% of the world freshwater and has over two million lakes.', word_count: 42 },
  { id: 25, category: 'geography', difficulty: 'medium', text: 'The Sahara Desert, spanning across eleven countries in North Africa, is the largest hot desert in the world, covering an area of nine million square kilometers. However, the Antarctic and Arctic deserts are technically larger, as deserts are defined solely by extremely low annual precipitation rates.', fact_summary: 'Sahara is the largest hot desert, though cold polar deserts are geographically larger.', word_count: 48 },
  { id: 26, category: 'geography', difficulty: 'medium', text: 'Iceland is known as the Land of Fire and Ice because of its unique geological combination of active volcanoes and massive glaciers. Located on the Mid-Atlantic Ridge where tectonic plates diverge, Iceland harnesses geothermal energy from underground hot springs to power almost the entire island.', fact_summary: 'Iceland uses abundant geothermal energy caused by tectonic plate boundaries.', word_count: 47 },
  { id: 27, category: 'geography', difficulty: 'hard', text: 'The Mariana Trench, situated in the western Pacific Ocean, contains the deepest point on Earth, known as the Challenger Deep, which plunges nearly eleven thousand meters down. The pressure at this depth is over one thousand times the standard atmospheric pressure at sea level, yet specialized life survives.', fact_summary: 'Challenger Deep is the lowest point on Earth, plunging 11km into the Mariana Trench.', word_count: 49 },
  { id: 28, category: 'geography', difficulty: 'easy', text: 'Australia is both a country and the smallest continent in the world. It is surrounded by the Indian and Pacific oceans and is famous for its unique wildlife, including kangaroos and koalas, which evolved in isolation over millions of years.', fact_summary: 'Australia is the only country that occupies an entire continent.', word_count: 42 },
  { id: 29, category: 'geography', difficulty: 'medium', text: 'The Amazon Rainforest produces roughly twenty percent of the oxygen in the Earth atmosphere, earned it the nickname the Lungs of the Planet. It is home to an unparalleled biodiversity, containing one in ten of all known species on Earth.', fact_summary: 'The Amazon produces about 20% of Earth oxygen and houses massive biodiversity.', word_count: 42 },
  { id: 30, category: 'geography', difficulty: 'hard', text: 'The Bosphorus Strait in Turkey is a natural waterway of strategic importance that divides Europe from Asia. Flowing through the city of Istanbul, it connects the Black Sea to the Sea of Marmara, serving as a historic and modern boundary between eastern and western civilizational zones.', fact_summary: 'The Bosphorus Strait in Istanbul is the physical boundary separating Europe and Asia.', word_count: 46 },

  // General
  { id: 31, category: 'general', difficulty: 'easy', text: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over three thousand years old and are still perfectly edible. The low moisture content and high acidity of honey make it impossible for bacteria to grow.', fact_summary: 'Honey has zero expiration date because its low moisture prevents bacterial growth.', word_count: 44 },
  { id: 32, category: 'general', difficulty: 'medium', text: 'A day on Venus is longer than a year on Venus. It takes Venus two hundred and forty-three Earth days to rotate once on its axis, but only two hundred and twenty-five Earth days to complete one orbit around the Sun, due to its slow backward rotation.', fact_summary: 'Venus rotates so slowly that its day is longer than its orbital year.', word_count: 49 },
  { id: 33, category: 'general', difficulty: 'hard', text: 'The term sandbox in computer security refers to a mechanism for separating running programs, preventing malicious code from modifying critical system resources. Similarly, the concept is used in gaming to describe environments where players have complete freedom to build, explore, and shape the game world without linear goals.', fact_summary: 'Sandboxes isolate code in cybersecurity and represent free-form play in video games.', word_count: 49 },
  { id: 34, category: 'general', difficulty: 'easy', text: 'The electric chair was invented by a dentist named Alfred Southwick in 1881. After witnessing a drunk man die quickly after touching a live generator, he realized electricity could be used for execution and developed the concept using dental chairs.', fact_summary: 'A dentist invented the electric chair in 1881, inspired by an accidental electrocution.', word_count: 42 },
  { id: 35, category: 'general', difficulty: 'medium', text: 'The first computer bug was an actual insect. In 1947, computer scientist Grace Hopper found a moth trapped between relay contacts in the Harvard Mark Two computer. She removed the moth and taped it to her logbook, coining the term debugging.', fact_summary: 'Grace Hopper coined "debugging" after finding a real moth inside a Harvard computer.', word_count: 43 },
  { id: 36, category: 'general', difficulty: 'hard', text: 'The Michelin Star rating system, which defines culinary excellence today, was created in 1900 by the Michelin tire company. They published a free travel guide containing maps, hotels, and restaurants to encourage people to drive more, wear out tires, and purchase replacements.', fact_summary: 'Michelin Star ratings were invented by a tire company to boost automobile travel.', word_count: 43 },
  { id: 37, category: 'general', difficulty: 'easy', text: 'Wombat feces are cube-shaped, which stops the droppings from rolling away. Wombats use their droppings to mark territories, depositing them on rocks and logs. The unique shape is formed by the uneven elasticity of the animal intestines.', fact_summary: 'Wombats produce cube-shaped poop to mark territories on logs without it rolling away.', word_count: 39 },
  { id: 38, category: 'general', difficulty: 'medium', text: 'The total weight of all the ants on Earth is roughly equal to the total weight of all humans. There are estimated to be twenty quadrillion individual ants alive at any given time, meaning there are about 2.5 million ants for every single human.', fact_summary: 'There are 20 quadrillion ants on Earth, weighing collectively as much as humanity.', word_count: 46 },
  { id: 39, category: 'general', difficulty: 'hard', text: 'The concept of Daylight Saving Time was first proposed by New Zealand entomologist George Hudson in 1895. He wanted more daylight hours after his shift work to collect insects, though popular myth attributes the idea to Benjamin Franklin who merely suggested saving candle wax in a satirical essay.', fact_summary: 'Daylight Saving Time was proposed in 1895 so an entomologist could catch bugs after work.', word_count: 49 },
  { id: 40, category: 'general', difficulty: 'medium', text: 'An standard chess game has more possible variations than there are atoms in the observable universe. This number is known as the Shannon Number, estimated to be ten to the power of one hundred and twenty, compared to only ten to the power of eighty atoms in existence.', fact_summary: 'The number of possible chess games (Shannon Number) exceeds the atoms in the universe.', word_count: 49 },

  // Language
  { id: 41, category: 'language', difficulty: 'easy', text: 'The word alphabet comes from the first two letters of the Greek alphabet, alpha and beta. These letters were borrowed from the Phoenician letters aleph and bet, which originally meant ox and house in ancient Semitic languages.', fill: 'ox and house', fact_summary: 'Alphabet is named after Greek "alpha" (A) and "beta" (B).', word_count: 39 },
  { id: 42, category: 'language', difficulty: 'medium', text: 'The dot on the lowercase letters i and j is called a tittle. It derived from the Latin word titulus, meaning inscription. Over centuries of writing, the dot was added to distinguish the letters from neighboring vertical strokes in medieval gothic scripts.', fact_summary: 'The small dot on top of a lowercase "i" or "j" is formally called a "tittle".', word_count: 45 },
  { id: 43, category: 'language', difficulty: 'hard', text: 'A pangram is a sentence that contains every letter of the alphabet at least once. The most famous English pangram is: the quick brown fox jumps over the lazy dog. Writing these sentences is a common method for testing typing speeds, keyboard configurations, and font designs.', fact_summary: 'A pangram contains every alphabet letter, like "the quick brown fox jumps over the lazy dog".', word_count: 47 },
  { id: 44, category: 'language', difficulty: 'easy', text: 'The hashtag symbol, commonly used on social media, is officially called an octothorpe. The name was invented by telephone engineers in the 1960s, combining octo for its eight points and thorpe, possibly referencing athlete Jim Thorpe.', fact_summary: 'The hashtag (#) is technically called an "octothorpe", coined by phone engineers.', word_count: 38 },
  { id: 45, category: 'language', difficulty: 'medium', text: 'The word quarantine comes from the Italian words quaranta giorni, which means forty days. During the Black Death in the fourteenth century, ships arriving in Venice were forced to anchor offshore for forty days before landing to ensure no crew members carried plague.', fact_summary: 'Quarantine comes from Venice 40-day isolation rule (quaranta giorni) during plagues.', word_count: 45 },
  { id: 46, category: 'language', difficulty: 'hard', text: 'Portmanteau words are formed by blending the sounds and meanings of two distinct words. Examples include smog, combining smoke and fog, or motel, merging motor and hotel. The term was coined by Lewis Carroll in his book Alice Through the Looking-Glass to describe packing meanings into one word.', fact_summary: 'Portmanteaus blend two words together, a term coined by Alice in Wonderland author.', word_count: 49 },
  { id: 47, category: 'language', difficulty: 'easy', text: 'The phrase rule of thumb did not come from an old law allowing husbands to beat wives with a stick no wider than a thumb. It actually refers to farmers and tradesmen using their thumbs for rough measurements of length, depth, and temperature.', fact_summary: 'Rule of thumb refers to using thumbs for rough measurements, not domestic violence laws.', word_count: 47 },
  { id: 48, category: 'language', difficulty: 'medium', text: 'The English language contains contronyms, which are words that are their own opposites. For example, cleave can mean to split apart or to stick together closely. Similarly, dust can mean to remove dust or to sprinkle with a fine powder.', fact_summary: 'Contronyms are words like "cleave" or "dust" that have opposite meanings depending on context.', word_count: 41 },
  { id: 49, category: 'language', difficulty: 'hard', text: 'Sarcasm comes from the Greek word sarkazein, which literally means to tear flesh. Over time, the meaning evolved from physically tearing flesh to speaking bitterly or sneering, representing how sarcastic remarks can cut deeply and cause emotional pain to the listener.', fact_summary: 'Sarcasm is derived from the Greek "sarkazein", meaning "to tear flesh".', word_count: 43 },
  { id: 50, category: 'language', difficulty: 'medium', text: 'The word clue originally referred to a ball of thread, spelled clew in Old English. The modern spelling and meaning evolved from the Greek myth of Theseus, who used a ball of thread given by Ariadne to navigate his way out of the Minotaur labyrinth.', fact_summary: 'Clue comes from Ariadne thread (clew) used to navigate the Minotaur labyrinth.', word_count: 47 }
];

const BUNDLED_ACHIEVEMENTS = [
  { id: 1, code: 'WPM_30', title: 'Speed Starter', description: 'Reach 30 Words Per Minute (WPM)', icon: 'zap' },
  { id: 2, code: 'WPM_50', title: 'Cruising Velocity', description: 'Reach 50 Words Per Minute (WPM)', icon: 'gauge' },
  { id: 3, code: 'WPM_80', title: 'Key Master', description: 'Reach 80 Words Per Minute (WPM)', icon: 'flame' },
  { id: 4, code: 'ACC_95', title: 'Sharpshooter', description: 'Complete a session with at least 95% accuracy', icon: 'target' },
  { id: 5, code: 'ACC_100', title: 'Perfectionist', description: 'Complete a session with 100% accuracy', icon: 'award' },
  { id: 6, code: 'SESS_10', title: 'Typing Enthusiast', description: 'Complete 10 typing sessions', icon: 'keyboard' },
  { id: 7, code: 'SESS_50', title: 'Key Whisperer', description: 'Complete 50 typing sessions', icon: 'award' },
  { id: 8, code: 'FACT_10', title: 'Fact Finder', description: 'Complete 10 fact-based lessons/tests', icon: 'book-open' },
  { id: 9, code: 'FACT_30', title: 'Encyclopedia', description: 'Complete 30 fact-based lessons/tests', icon: 'crown' }
];

// CLIENT-SIDE LOCAL STORAGE CONTROLLER
function dbGet(key, defaultVal = []) {
  const data = localStorage.getItem(`tw_static_${key}`);
  if (!data) return defaultVal;
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultVal;
  }
}

function dbSet(key, val) {
  localStorage.setItem(`tw_static_${key}`, JSON.stringify(val));
}

// XP & Level calculations
function clientCalculateLevelDetails(xp) {
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  const xpForCurrent = (level - 1) * (level - 1) * 50;
  const xpForNext = level * level * 50;
  const xpInCurrent = xp - xpForCurrent;
  const xpNeededForNext = xpForNext - xpForCurrent;
  const percent = Math.min(100, Math.round((xpInCurrent / xpNeededForNext) * 100));

  let stage = 'Seedling';
  let mascotSvg = 'seedling';
  if (level >= 30) {
    stage = 'Forest Guardian';
    mascotSvg = 'forest-guardian';
  } else if (level >= 21) {
    stage = 'Flowering Tree';
    mascotSvg = 'flowering-tree';
  } else if (level >= 15) {
    stage = 'Young Tree';
    mascotSvg = 'young-tree';
  } else if (level >= 10) {
    stage = 'Budding Plant';
    mascotSvg = 'budding-plant';
  } else if (level >= 6) {
    stage = 'Sapling';
    mascotSvg = 'sapling';
  } else if (level >= 3) {
    stage = 'Sprout';
    mascotSvg = 'sprout';
  }

  return { level, xp, xpForCurrent, xpForNext, xpNeededForNext, xpInCurrent, percent, stage, mascotSvg };
}

// API Methods
const API = {
  login: async (email, password) => {
    const users = dbGet('users', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password credentials.');
    }
    dbSet('active_user_id', user.id);
    localStorage.setItem('typewise_token', `mock-jwt-token-for-${user.id}`);
    return user;
  },

  signup: async (name, email, password, startingGoal) => {
    const users = dbGet('users', []);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Account email already registered.');
    }

    let dailyGoal = 10;
    if (startingGoal === 'improve speed') dailyGoal = 20;
    if (startingGoal === 'exam prep') dailyGoal = 30;

    const id = users.length + 1;
    const newUser = {
      id,
      name,
      email,
      password,
      avatar_level: 1,
      xp: 0,
      daily_goal_minutes: dailyGoal,
      theme_pref: 'ocean',
      layout_pref: 'QWERTY',
      font_size_pref: 'medium',
      sound_pref: 1,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    dbSet('users', users);
    dbSet('active_user_id', id);
    localStorage.setItem('typewise_token', `mock-jwt-token-for-${id}`);
    return newUser;
  },

  logout: () => {
    localStorage.removeItem('typewise_token');
    dbSet('active_user_id', null);
    window.location.href = 'index.html';
  },

  getCurrentUser: async () => {
    const activeId = dbGet('active_user_id', null);
    const users = dbGet('users', []);
    const user = users.find(u => u.id === activeId);
    if (!user) {
      localStorage.removeItem('typewise_token');
      throw new Error('User not found or unauthenticated.');
    }
    return user;
  },

  updateUserProfile: async (updates) => {
    const activeId = dbGet('active_user_id', null);
    const users = dbGet('users', []);
    const userIndex = users.findIndex(u => u.id === activeId);
    if (userIndex === -1) throw new Error('Unauthenticated user.');

    Object.assign(users[userIndex], updates);
    dbSet('users', users);
    return users[userIndex];
  },

  getPassages: async (category, difficulty) => {
    return BUNDLED_PASSAGES.filter(p => {
      const catMatch = !category || category === 'all' || p.category === category;
      const diffMatch = !difficulty || difficulty === 'all' || p.difficulty === difficulty;
      return catMatch && diffMatch;
    });
  },

  getRandomPassage: async (category, difficulty) => {
    const list = BUNDLED_PASSAGES.filter(p => {
      const catMatch = !category || category === 'all' || p.category === category;
      const diffMatch = !difficulty || difficulty === 'all' || p.difficulty === difficulty;
      return catMatch && diffMatch;
    });
    if (list.length === 0) throw new Error('No matching facts found.');
    return list[Math.floor(Math.random() * list.length)];
  },

  getLessons: async () => {
    const activeId = dbGet('active_user_id', null);
    const progress = dbGet(`progress_user_${activeId}`, {});
    
    return BUNDLED_LESSONS.map(l => ({
      ...l,
      finger_map: JSON.parse(l.finger_map),
      percent_complete: progress[l.id] || 0
    }));
  },

  getLessonById: async (id) => {
    const l = BUNDLED_LESSONS.find(les => les.id === Number(id));
    if (!l) throw new Error('Lesson not found.');
    return {
      ...l,
      finger_map: JSON.parse(l.finger_map)
    };
  },

  submitLessonProgress: async (id, percent) => {
    const activeId = dbGet('active_user_id', null);
    const progress = dbGet(`progress_user_${activeId}`, {});
    progress[id] = Math.max(progress[id] || 0, percent);
    dbSet(`progress_user_${activeId}`, progress);
    return { success: true };
  },

  submitSession: async (sessionDetails) => {
    const activeId = dbGet('active_user_id', null);
    const sessions = dbGet(`sessions_user_${activeId}`, []);
    
    const id = sessions.length + 1;
    const newSession = {
      id,
      user_id: activeId,
      type: sessionDetails.type,
      reference_id: sessionDetails.referenceId,
      wpm: sessionDetails.wpm,
      accuracy: sessionDetails.accuracy,
      duration: sessionDetails.duration,
      errors: sessionDetails.errors,
      heatmap: JSON.stringify(sessionDetails.heatmap || {}),
      created_at: new Date().toISOString()
    };
    
    sessions.push(newSession);
    dbSet(`sessions_user_${activeId}`, sessions);

    // Calculate XP earned: min 5 XP
    const wordEstimate = Math.max(5, Math.round((sessionDetails.duration / 60) * sessionDetails.wpm));
    const xpEarned = Math.max(5, Math.round(wordEstimate * (sessionDetails.accuracy / 100)));

    // Update user stats
    const users = dbGet('users', []);
    const uIndex = users.findIndex(u => u.id === activeId);
    const user = users[uIndex];
    
    const oldXp = user.xp;
    const newXp = oldXp + xpEarned;
    const oldLevel = clientCalculateLevelDetails(oldXp).level;
    const newLevelDetails = clientCalculateLevelDetails(newXp);
    
    user.xp = newXp;
    user.avatar_level = newLevelDetails.level;
    dbSet('users', users);

    // Check achievements
    const newlyUnlocked = [];
    const earnedAchs = dbGet(`achievements_user_${activeId}`, []);
    
    const evaluations = [
      { code: 'WPM_30', check: () => sessionDetails.wpm >= 30 },
      { code: 'WPM_50', check: () => sessionDetails.wpm >= 50 },
      { code: 'WPM_80', check: () => sessionDetails.wpm >= 80 },
      { code: 'ACC_95', check: () => sessionDetails.accuracy >= 95 },
      { code: 'ACC_100', check: () => sessionDetails.accuracy >= 100 && sessionDetails.errors === 0 },
      { code: 'SESS_10', check: () => sessions.length >= 10 },
      { code: 'SESS_50', check: () => sessions.length >= 50 },
      {
        code: 'FACT_10',
        check: () => sessions.filter(s => s.type === 'test' || (s.type === 'lesson' && s.reference_id)).length >= 10
      },
      {
        code: 'FACT_30',
        check: () => sessions.filter(s => s.type === 'test' || (s.type === 'lesson' && s.reference_id)).length >= 30
      }
    ];

    for (const ev of evaluations) {
      if (!earnedAchs.includes(ev.code) && ev.check()) {
        earnedAchs.push(ev.code);
        newlyUnlocked.push(ev.code);
      }
    }
    dbSet(`achievements_user_${activeId}`, earnedAchs);

    return {
      sessionId: id,
      xpEarned,
      xpTotal: newXp,
      levelUp: newLevelDetails.level > oldLevel,
      currentLevel: newLevelDetails.level,
      mascotStage: newLevelDetails.stage,
      newlyUnlocked
    };
  },

  getDashboardStats: async () => {
    const activeId = dbGet('active_user_id', null);
    const users = dbGet('users', []);
    const user = users.find(u => u.id === activeId);

    const sessions = dbGet(`sessions_user_${activeId}`, []);
    const earnedAchs = dbGet(`achievements_user_${activeId}`, []);

    let avgWpm = 0;
    let avgAccuracy = 0;
    let totalTime = 0;

    if (sessions.length > 0) {
      avgWpm = Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length);
      avgAccuracy = Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length);
      totalTime = sessions.reduce((acc, s) => acc + s.duration, 0);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const todaySessions = sessions.filter(s => new Date(s.created_at) >= startOfToday);
    const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.duration / 60), 0);

    const levelDetails = clientCalculateLevelDetails(user.xp);

    // Map list of recent badges
    const matchedRecent = BUNDLED_ACHIEVEMENTS.filter(a => earnedAchs.includes(a.code)).slice(0, 4);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        daily_goal_minutes: user.daily_goal_minutes
      },
      stats: {
        avgWpm,
        avgAccuracy,
        totalTime,
        todayMinutes: Math.round(todayMinutes * 10) / 10,
        goalProgress: Math.min(100, Math.round((todayMinutes / user.daily_goal_minutes) * 100))
      },
      mascot: levelDetails,
      achievements: matchedRecent
    };
  },

  getStatsHistory: async () => {
    const activeId = dbGet('active_user_id', null);
    const sessions = dbGet(`sessions_user_${activeId}`, []);
    
    // Sort oldest to newest, return last 20
    return sessions.slice(-20).map(s => ({
      date: new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      wpm: s.wpm,
      accuracy: s.accuracy,
      type: s.type
    }));
  },

  getStatsHeatmap: async () => {
    const activeId = dbGet('active_user_id', null);
    const sessions = dbGet(`sessions_user_${activeId}`, []);

    const keyErrors = {};
    const calendar = {};

    sessions.forEach(s => {
      // Key Errors mapping
      try {
        const errors = JSON.parse(s.heatmap);
        for (const [key, count] of Object.entries(errors)) {
          keyErrors[key] = (keyErrors[key] || 0) + count;
        }
      } catch (e) {}

      // Date mapping
      const dateStr = s.created_at.substring(0, 10);
      calendar[dateStr] = (calendar[dateStr] || 0) + 1;
    });

    return { keyErrors, calendar };
  },

  getAchievements: async () => {
    const activeId = dbGet('active_user_id', null);
    const earnedAchs = dbGet(`achievements_user_${activeId}`, []);

    return BUNDLED_ACHIEVEMENTS.map(a => ({
      ...a,
      earned: earnedAchs.includes(a.code),
      earned_at: new Date().toISOString()
    }));
  },

  showToast
};

// Global authentication check
function checkAuth() {
  const token = localStorage.getItem('typewise_token');
  const path = window.location.pathname;
  const isAuthPage = path.includes('index.html') || path.includes('auth.html') || path === '/' || path.endsWith('/');

  if (!token && !isAuthPage) {
    window.location.href = 'index.html';
  } else if (token && isAuthPage) {
    window.location.href = 'dashboard.html';
  }
}

// Auto-run auth verification
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
