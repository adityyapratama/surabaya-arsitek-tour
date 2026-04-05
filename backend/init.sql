-- ========================================================
-- SECTION 1: DESTINATIONS
-- ========================================================
CREATE TABLE destinations (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    tag VARCHAR(100),
    type VARCHAR(50),
    emoji VARCHAR(20),
    addr VARCHAR(255),
    price VARCHAR(50),
    price_num INT,
    hours VARCHAR(100),
    rating VARCHAR(50),
    description TEXT
);

INSERT INTO destinations (id, name, tag, type, emoji, addr, price, price_num, hours, rating, description) VALUES
(1, 'Hotel Majapahit', 'Art Deco', 'art deco', '🏛️', 'Jl. Tunjungan No.65, Genteng', 'Rp 35.000', 35000, '08.00–20.00 WIB', '4.9 ★', 'Salah satu landmark kolonial paling ikonik di Surabaya. Dibangun 1910 dengan gaya art deco Belanda, hotel ini menjadi saksi insiden perobekan bendera 1945 dalam sejarah kemerdekaan Indonesia.'),
(2, 'House of Sampoerna', 'Kolonial', 'colonial', '🏭', 'Jl. Taman Sampoerna No.6, Krembangan', 'Gratis', 0, '09.00–22.00 WIB', '4.8 ★', 'Kompleks bangunan kolonial Belanda yang terawat indah sejak 1862. Kini menjadi museum, pusat budaya, dan kafe yang mendokumentasikan sejarah Surabaya lewat lensa merek tembakau paling ikonik Indonesia.'),
(3, 'Balai Kota Surabaya', 'Pemerintahan', 'government', '🏛️', 'Jl. Walikota Mustajab No.1, Genteng', 'Gratis', 0, '08.00–16.00 (hari kerja)', '4.6 ★', 'Dibangun 1923, Balai Kota adalah contoh arsitektur kolonial Belanda dengan kolom neoklasik yang megah. Mencerminkan ambisi perencanaan kota era kolonial yang masih terawat hingga kini.'),
(4, 'Masjid Cheng Hoo', 'Religi', 'religious', '🕌', 'Jl. Gading No.2, Ketabang', 'Gratis', 0, 'Buka 24 jam', '4.7 ★', 'Masjid unik yang memadukan arsitektur pagoda China dengan elemen Islam, dibangun 2002 sebagai simbol harmoni multikultural. Dinamai dari laksamana Muslim China legendaris, Zheng He.'),
(5, 'Gedung Internatio', 'Kolonial', 'colonial', '🏢', 'Jl. Rajawali No.3, Krembangan', 'Rp 15.000', 15000, '09.00–17.00 WIB', '4.5 ★', 'Dibangun 1925, Gedung Internatio adalah bangunan neoklasik kolonial yang megah — dulu sebagai rumah dagang besar. Kolom-kolomnya dan ornamen plasterwork menjadikannya salah satu contoh arsitektur komersial terbaik di Jawa Timur.'),
(6, 'Gereja Kepanjen', 'Religi', 'religious', '⛪', 'Jl. Kepanjen No.4, Krembangan', 'Gratis', 0, '06.00–19.00 WIB', '4.6 ★', 'Salah satu gereja Katolik tertua di Indonesia (1899). Fasad neo-Gotik, jendela mawar, dan menara kembarnya menjadikannya karya arsitektur gerejawi Eropa yang luar biasa di tengah Surabaya.');

-- ========================================================
-- SECTION 2: DESTINATION TRANSPORT OPTIONS
-- ========================================================
CREATE TABLE destination_transport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT,
    transport_option VARCHAR(255),
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

INSERT INTO destination_transport (destination_id, transport_option) VALUES
(1, 'Angkot Line C2 — stop Tunjungan'),
(1, 'Trans Semanggi — halte Balai Kota (~5 menit)'),
(1, 'Grab / Gojek — direkomendasikan'),
(2, 'Angkot Line B — stop Pasar Atom'),
(2, 'Trans Semanggi — halte Rajawali'),
(2, 'Heritage Walk dari Jembatan Merah (~10 menit)'),
(3, 'Trans Semanggi — halte Balai Kota (langsung)'),
(3, 'Angkot Line A & D'),
(3, 'Parkir tersedia di lokasi'),
(4, 'Angkot Line F — stop Genteng'),
(4, 'Grab/Gojek dari pusat kota (~10 menit)'),
(4, 'Parkir tersedia'),
(5, 'Trans Semanggi — halte Rajawali (langsung)'),
(5, 'Angkot Line B'),
(5, '5 menit jalan dari House of Sampoerna'),
(6, 'Angkot Line C — stop Kepanjen'),
(6, 'Jarak jalan dari Alun-Alun Surabaya'),
(6, 'Grab/Gojek — turun di Jl. Kepanjen');

-- ========================================================
-- SECTION 3: DESTINATION REVIEWS
-- ========================================================
CREATE TABLE destination_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT,
    user_name VARCHAR(100),
    rating_stars VARCHAR(20),
    review_text TEXT,
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

INSERT INTO destination_reviews (destination_id, user_name, rating_stars, review_text) VALUES
(1, 'Sinta R.', '★★★★★', 'Fasad art deco-nya luar biasa indah. Wajib dikunjungi!'),
(1, 'Bimo A.', '★★★★☆', 'Lobbynya megah and penuh sejarah. Sangat berkesan.'),
(2, 'Dian P.', '★★★★★', 'Museum sangat terawat. Arsitektur pabrik tuanya autentik.'),
(2, 'Arif W.', '★★★★☆', 'Kafenya enak, pemandangan ke bangunan kunonya bagus.'),
(3, 'Maya S.', '★★★★☆', 'Bangunannya megah. Area sekitarnya nyaman untuk jalan kaki.'),
(3, 'Hendra T.', '★★★★★', 'Wajib untuk pecinta arsitektur kolonial!'),
(4, 'Rina K.', '★★★★★', 'Perpaduan arsitektur China dan Islam yang sangat indah.'),
(4, 'Fajar L.', '★★★★☆', 'Bersih, tenang, dan sangat fotogenik.'),
(5, 'Laras M.', '★★★★★', 'Kolom-kolomnya megah. Saksi bisu sejarah perdagangan Surabaya.'),
(5, 'Doni S.', '★★★★☆', 'Interior menarik, ada pameran sejarah di dalamnya.'),
(6, 'Clara Archer', '★★★★★', 'Sangat indah, seperti di Eropa. Bangunan tuanya sangat terawat.');


-- ========================================================
-- SECTION 4: TOUR PACKAGES
-- ========================================================
CREATE TABLE tour_packages (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255),
    emoji VARCHAR(20),
    description TEXT,
    price INT,
    price_label VARCHAR(50),
    unit VARCHAR(100),
    featured BOOLEAN,
    badge VARCHAR(50)
);

INSERT INTO tour_packages (id, name, emoji, description, price, price_label, unit, featured, badge) VALUES
('t1', 'Tur Kota Lama Surabaya', '🚶', 'Jelajahi kawasan Kota Lama bersama guide sejarah berpengalaman. Kunjungi 4 bangunan ikonik dalam 3 jam dengan penjelasan mendalam tentang arsitektur dan sejarahnya.', 150000, 'Rp 150.000', 'per orang', FALSE, NULL),
('t2', 'Tur Malam Kolonial Premium', '🌙', 'Rasakan keindahan bangunan kolonial Surabaya di bawah cahaya malam. Tur eksklusif dengan pencahayaan dramatis dan sesi foto profesional.', 250000, 'Rp 250.000', 'per orang', TRUE, 'Terpopuler'),
('t3', 'Paket Keluarga Arsitektur', '👨‍👩‍👧‍👦', 'Paket tur ramah keluarga dengan aktivitas edukatif untuk anak-anak. Termasuk buku mewarnai arsitektur, kuis sejarah, dan sertifikat Penjelajah Muda Surabaya.', 120000, 'Rp 120.000', 'per keluarga (maks. 5 orang)', FALSE, NULL);

-- ========================================================
-- SECTION 5: TOUR FEATURES
-- ========================================================
CREATE TABLE tour_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id VARCHAR(10),
    feature VARCHAR(255),
    FOREIGN KEY (tour_id) REFERENCES tour_packages(id)
);

INSERT INTO tour_features (tour_id, feature) VALUES
('t1', '3 jam walking tour berpemandu'),
('t1', 'Kunjungi 4 bangunan bersejarah'),
('t1', 'Akses area eksklusif'),
('t1', 'Snack & minuman disediakan'),
('t1', 'Maks. 10 orang per sesi'),
('t2', '3,5 jam night walking tour'),
('t2', 'Fotografer profesional ikut serta'),
('t2', 'Kunjungi 5 spot ikonik malam hari'),
('t2', 'Welcome drink & snack premium'),
('t2', 'Grup privat — maks. 8 orang'),
('t3', '2 jam tur keluarga berpemandu'),
('t3', 'Kit aktivitas anak (buku mewarnai, kuis)'),
('t3', 'Sertifikat penjelajah untuk anak'),
('t3', 'Kunjungi 3 destinasi utama'),
('t3', 'Cocok untuk anak 6–14 tahun');


-- ========================================================
-- SECTION 6: EVENTS
-- ========================================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_status ENUM('ongoing', 'upcoming'),
    day VARCHAR(10),
    month VARCHAR(10),
    name VARCHAR(255),
    venue VARCHAR(255),
    detail TEXT,
    price_label VARCHAR(100),
    price_num INT NULL
);

INSERT INTO events (event_status, day, month, name, venue, detail, price_label, price_num) VALUES
('ongoing', '28', 'MAR', 'Pameran Foto Arsitektur Kota Lama', 'Gedung Internatio, Rajawali', 'Pameran fotografi bangunan cagar budaya kolonial', 'Rp 25.000', 25000),
('ongoing', '01', 'APR', 'Festival Heritage Walk Surabaya', 'Kawasan Kota Lama', 'Tur jalan kaki berpemandu — setiap akhir pekan, 07.00 WIB', 'Rp 50.000', 50000),
('upcoming', '10', 'APR', 'Surabaya Architecture Week 2025', 'Balai Kota & sekitarnya', 'Festival arsitektur tahunan: talks, pameran & tur', 'Gratis – Rp 100.000', NULL),
('upcoming', '20', 'APR', 'Night Tour: Kolonial Surabaya', 'Jl. Tunjungan & Jl. Rajawali', 'Tur malam bangunan kolonial berlampu', 'Rp 75.000', NULL),
('upcoming', '05', 'MAY', 'Workshop Sketching Bangunan Tua', 'House of Sampoerna', 'Urban sketching workshop untuk pecinta arsitektur', 'Rp 150.000', NULL);