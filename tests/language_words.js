// Word-level test across languages. Run:
//   CASELIB="$PWD/src/CaseLib.gs" osascript -l JavaScript tests/language_words.js
ObjC.import('Foundation');
function read(p) { return $.NSString.stringWithContentsOfFileEncodingError(p, 4, null).js; }
eval(read($.NSProcessInfo.processInfo.environment.objectForKey('CASELIB').js));
var C = CaseLib.convert, fails = [], count = 0, shown = {};
function fail(cat, msg) { count++; if (!shown[cat]) shown[cat] = 0; if (shown[cat]++ < 8) fails.push('[' + cat + '] ' + msg); }
function ok() { count++; }
var LETTER = /\p{L}/u;
function firstLetterIdx(w) { for (var i = 0; i < w.length; i++) if (LETTER.test(w[i])) return i; return -1; }
function upc(ch, lang) { if (lang === 'tr' && ch === 'i') return 'İ'; var u = ch.toUpperCase(); return u.length === 1 ? u : ch; }
var SMALL_EN = CaseLib.PRESETS.en.split(' ');
function loc(ch) { var l = ch.toLowerCase(); return l.length === 1 ? l : ch; }

// ---------- 1. Every English dictionary word ----------
var dict = read('/usr/share/dict/words').split('\n').filter(function (w) { return w && /^[A-Za-z]+$/.test(w); });
var t0 = Date.now();
dict.forEach(function (w) {
  var lw = w.toLowerCase(), uw = w.toUpperCase();
  var up = C(w, 'upper'), lo = C(w, 'lower'), ti = C(lw, 'title'), se = C(lw, 'sentence'), ca = C(lw, 'capitalize'), inv = C(w, 'inverse'), alt = C(lw, 'alternating');
  if (up !== uw) fail('dict-upper', w + ' -> ' + up); else ok();
  if (lo !== lw) fail('dict-lower', w + ' -> ' + lo); else ok();
  var expectCap = lw.charAt(0).toUpperCase() + lw.slice(1);
  if (ti !== expectCap) fail('dict-title', lw + ' -> ' + ti); else ok();       // single word: always capitalised
  if (se !== (lw === 'i' ? 'I' : expectCap)) fail('dict-sentence', lw + ' -> ' + se); else ok();
  if (ca !== expectCap) fail('dict-capitalize', lw + ' -> ' + ca); else ok();
  if (C(inv, 'inverse') !== w) fail('dict-inverse', w + ' -> ' + inv); else ok();
  if (alt.length !== lw.length || alt.toLowerCase() !== lw) fail('dict-alternating', lw + ' -> ' + alt); else ok();
  // acronym rule: an all-caps dictionary word of 2..6 letters is kept by Sentence case when alone
  if (uw.length >= 2 && uw.length <= 6) { var kept = C('the ' + uw + ' item', 'sentence'); if (kept !== 'The ' + uw + ' item') fail('dict-acronym-kept', uw + ' -> ' + kept); else ok(); }
  else if (uw.length > 6) { var fixed = C('the ' + uw + ' item', 'sentence'); if (fixed !== 'The ' + lw + ' item') fail('dict-longcaps-fixed', uw + ' -> ' + fixed); else ok(); }
});
var dictMs = Date.now() - t0;

// ---------- 2. Bahasa Malaysia and Bahasa Indonesia ----------
var MS = ('saya awak kami kita mereka dia beliau ini itu sini sana mana siapa apa bila kenapa bagaimana berapa boleh tidak bukan belum sudah sedang akan telah pernah selalu kadang jarang sering ' +
 'makan minum tidur bangun pergi datang balik pulang masuk keluar duduk berdiri berjalan berlari bercakap bertanya menjawab membaca menulis mengira melihat mendengar memandu membeli menjual ' +
 'rumah sekolah pejabat pasar kedai hospital klinik universiti masjid gereja kuil taman padang jalan lorong lebuhraya jambatan stesen lapangan terbang ' +
 'kereta motosikal basikal bas teksi keretapi kapal bot pesawat lori van ' +
 'nasi lemak roti canai teh tarik kopi air susu gula garam lada cili bawang sayur buah ikan ayam daging telur ' +
 'satu dua tiga empat lima enam tujuh lapan sembilan sepuluh seratus seribu sejuta ' +
 'isnin selasa rabu khamis jumaat sabtu ahad januari februari mac april mei jun julai ogos september oktober november disember ' +
 'merah biru hijau kuning hitam putih ungu jingga kelabu coklat ' +
 'besar kecil panjang pendek tinggi rendah cantik hodoh baik jahat pandai bodoh cepat lambat panas sejuk hangat dingin baru lama ' +
 'kementerian kesihatan pendidikan kewangan pertahanan perdagangan pelancongan pertanian kerajaan negeri persekutuan jabatan agensi bahagian unit ' +
 'pengarah pegawai pekerja kakitangan pengurus jurutera doktor jururawat guru pensyarah pelajar murid peguam hakim polis askar ' +
 'laporan tahunan mesyuarat bengkel seminar persidangan cadangan keputusan tindakan pelaksanaan pemantauan penilaian ' +
 'terima kasih selamat pagi tengah hari petang malam tinggal jalan datang maaf tolong sila jangan boleh minta ' +
 'kuala lumpur selangor johor pulau pinang perak kedah kelantan terengganu pahang melaka sabah sarawak putrajaya labuan malaysia ' +
 'dan atau di ke dari pada untuk yang dengan oleh bagi serta tentang demi').split(/\s+/);
var ID = ('saya kamu anda kami kita mereka dia beliau ini itu sini sana mana siapa apa kapan mengapa bagaimana berapa bisa tidak bukan belum sudah sedang akan telah pernah selalu kadang jarang sering ' +
 'makan minum tidur bangun pergi datang kembali pulang masuk keluar duduk berdiri berjalan berlari berbicara bertanya menjawab membaca menulis menghitung melihat mendengar mengemudi membeli menjual ' +
 'rumah sekolah kantor pasar toko rumah sakit klinik universitas masjid gereja pura taman lapangan jalan gang tol jembatan stasiun bandara ' +
 'mobil sepeda motor sepeda bus taksi kereta kapal perahu pesawat truk ' +
 'nasi goreng roti teh kopi air susu gula garam merica cabai bawang sayur buah ikan ayam daging telur ' +
 'satu dua tiga empat lima enam tujuh delapan sembilan sepuluh seratus seribu sejuta ' +
 'senin selasa rabu kamis jumat sabtu minggu januari februari maret april mei juni juli agustus september oktober november desember ' +
 'merah biru hijau kuning hitam putih ungu jingga abu coklat ' +
 'besar kecil panjang pendek tinggi rendah cantik jelek baik jahat pintar bodoh cepat lambat panas dingin hangat sejuk baru lama ' +
 'kementerian kesehatan pendidikan keuangan pertahanan perdagangan pariwisata pertanian pemerintah provinsi kabupaten kota departemen badan bagian unit ' +
 'direktur pejabat pegawai karyawan manajer insinyur dokter perawat guru dosen mahasiswa siswa pengacara hakim polisi tentara ' +
 'laporan tahunan rapat lokakarya seminar konferensi usulan keputusan tindakan pelaksanaan pemantauan evaluasi ' +
 'terima kasih selamat pagi siang sore malam tinggal jalan datang maaf tolong silakan jangan bisa minta ' +
 'jakarta bandung surabaya medan semarang makassar yogyakarta bali sumatra jawa kalimantan sulawesi papua indonesia ' +
 'dan atau di ke dari pada untuk yang dengan oleh bagi serta tentang demi').split(/\s+/);
var SMALL = 'dan atau di ke dari pada untuk yang dengan oleh bagi serta tentang demi'.split(' ');
function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
[['ms', MS], ['id', ID]].forEach(function (pair) {
  var lang = pair[0], words = pair[1], opt = { language: lang };
  words.forEach(function (w) {
    var isSmall = SMALL.indexOf(w) >= 0;
    // mid-title: small words stay lowercase under the preset, others get a capital
    var mid = C('buku ' + w + ' pena', 'title', opt);
    var want = 'Buku ' + (isSmall ? w : cap(w)) + ' Pena';
    if (mid !== want) fail(lang + '-title-mid', mid + ' (want ' + want + ')'); else ok();
    // first and last position: always capitalised, even small words
    if (C(w + ' pena', 'title', opt) !== cap(w) + ' Pena') fail(lang + '-title-first', w); else ok();
    if (C('buku ' + w, 'title', opt) !== 'Buku ' + cap(w)) fail(lang + '-title-last', w); else ok();
    // under the English preset the same word is capitalised mid-title (unless it is also English-small)
    var enMid = C('buku ' + w + ' pena', 'title', { language: 'en' });
    var enSmall = ['a','an','and','as','at','but','by','en','for','if','in','nor','of','on','or','per','the','to','v','vs','via'].indexOf(w) >= 0;
    if (enMid !== 'Buku ' + (enSmall ? w : cap(w)) + ' Pena') fail(lang + '-en-preset', enMid); else ok();
    // sentence case, upper, lower and round trips
    if (C(w + ' itu bagus. ya', 'sentence', opt) !== cap(w) + ' itu bagus. Ya') fail(lang + '-sentence', w + ' -> ' + C(w + ' itu bagus. ya', 'sentence', opt)); else ok();
    if (C(w, 'upper') !== w.toUpperCase() || C(w.toUpperCase(), 'lower') !== w) fail(lang + '-case', w); else ok();
    if (C(C(w, 'inverse'), 'inverse') !== w) fail(lang + '-inverse', w); else ok();
  });
});
// Real titles and sentences
var samples = [
  ['ms', 'kementerian kesihatan dan kebajikan di malaysia', 'title', 'Kementerian Kesihatan dan Kebajikan di Malaysia'],
  ['ms', 'laporan tahunan bagi tahun 2026 oleh jabatan pendidikan', 'title', 'Laporan Tahunan bagi Tahun 2026 oleh Jabatan Pendidikan'],
  ['ms', 'dari kuala lumpur ke pulau pinang dengan keretapi', 'title', 'Dari Kuala Lumpur ke Pulau Pinang dengan Keretapi'],
  ['ms', 'MESYUARAT AGUNG TAHUNAN: cadangan dan keputusan', 'title', 'Mesyuarat Agung Tahunan: Cadangan dan Keputusan'],
  ['ms', 'selamat pagi. terima kasih kerana datang! sila duduk', 'sentence', 'Selamat pagi. Terima kasih kerana datang! Sila duduk'],
  ['ms', 'pegawai DBP dan UMNO hadir di PWTC', 'sentence', 'Pegawai DBP dan UMNO hadir di PWTC'],
  ['id', 'kementerian kesehatan dan pendidikan di indonesia', 'title', 'Kementerian Kesehatan dan Pendidikan di Indonesia'],
  ['id', 'dari jakarta ke bandung dengan kereta api', 'title', 'Dari Jakarta ke Bandung dengan Kereta Api'],
  ['id', 'laporan untuk direktur tentang evaluasi tahunan', 'title', 'Laporan untuk Direktur tentang Evaluasi Tahunan'],
  ['id', 'selamat pagi. terima kasih sudah datang! silakan duduk', 'sentence', 'Selamat pagi. Terima kasih sudah datang! Silakan duduk'],
  ['en', 'kementerian kesihatan dan kebajikan', 'title', 'Kementerian Kesihatan Dan Kebajikan'],
  ['ms', 'DAN ATAU DI KE', 'lower', 'dan atau di ke'],
  ['ms', 'dan atau di ke', 'upper', 'DAN ATAU DI KE']
];
samples.forEach(function (s) { var got = C(s[1], s[2], { language: s[0] }); if (got !== s[3]) fail('sample-' + s[0], got + ' (want ' + s[3] + ')'); else ok(); });

// ---------- 3. Accented and non-English Latin words ----------
var ACC = ('café résumé naïve façade élève être déjà français garçon hôtel château ' +
 'niño señor mañana año jalapeño corazón acción canción ' +
 'straße größe müller schön über bäcker mädchen ' +
 'coração ação não português são joão avô ' +
 'việt nam hà nội đường phở hồ chí minh ' +
 'øst æble kød smørrebrød ' +
 'istanbul ışık şeker çocuk ğ ' +
 'żółw łódź gdańsk kraków ' +
 'ελλάδα αθήνα ' + 'москва санкт-петербург россия ' + 'київ україна').split(/\s+/);
ACC.forEach(function (w) {
  var up = C(w, 'upper'), lo = C(up, 'lower');
  // every letter must be uppercased wherever a single-character uppercase exists
  for (var i = 0; i < w.length; i++) { var ch = w[i]; if (LETTER.test(ch) && upc(ch) !== up[i]) { fail('accent-upper', w + ' at ' + i + ': ' + up[i]); break; } }
  if (up.length !== w.length || lo.length !== w.length) fail('accent-length', w); else ok();
  var fi = firstLetterIdx(w);
  var ti = C(w, 'title');
  if (fi >= 0 && ti[fi] !== upc(w[fi])) fail('accent-title', w + ' -> ' + ti); else ok();
  if (fi >= 0 && C(w, 'sentence')[fi] !== upc(w[fi])) fail('accent-sentence', w); else ok();
});
// Known tricky mappings
var tricky = [
  ['straße', 'upper', 'STRAßE'], ['ǆ', 'upper', 'Ǆ'], ['ﬁ', 'upper', 'ﬁ'], ['İstanbul', 'lower', 'istanbul'],
  ['ISTANBUL', 'lower', 'istanbul'], ['ΣΟΦΊΑ', 'lower', 'σοφία'], ['σοφία', 'upper', 'ΣΟΦΊΑ'], ['москва', 'title', 'Москва'], ['école', 'sentence', 'École'], ['ÉCOLE alone stays', 'sentence', 'ÉCOLE alone stays'], ['élève', 'capitalize', 'Élève'],
  ['phở bò', 'title', 'Phở Bò'], ['đường', 'upper', 'ĐƯỜNG']
];
// ---------- 4. 1.3 language presets: a real title per language ----------
var TITLES = [
  ['es', 'cien años de soledad y el amor en los tiempos del cólera', 'Cien Años de Soledad y el Amor en los Tiempos del Cólera'],
  ['fr', 'à la recherche du temps perdu et les misérables', 'À la Recherche du Temps Perdu et les Misérables'],
  ['de', 'die verwandlung und der prozess von franz kafka', 'Die Verwandlung und der Prozess von Franz Kafka'],
  ['pt', 'memórias póstumas de brás cubas e o cortiço', 'Memórias Póstumas de Brás Cubas e o Cortiço'],
  ['it', 'il nome della rosa e la divina commedia', 'Il Nome della Rosa e la Divina Commedia'],
  ['nl', 'het diner en de ontdekking van de hemel', 'Het Diner en de Ontdekking van de Hemel'],
  ['tl', 'noli me tangere at el filibusterismo ni rizal', 'Noli Me Tangere at El Filibusterismo ni Rizal'],
  ['tr', 'benim adım kırmızı ve kar için istanbul', 'Benim Adım Kırmızı ve Kar için İstanbul'],
  ['el', 'το τρίτο στεφάνι και η φόνισσα του παπαδιαμάντη', 'Το Τρίτο Στεφάνι και η Φόνισσα του Παπαδιαμάντη'],
  ['ms', 'salina dan ranjau sepanjang jalan oleh shahnon ahmad', 'Salina dan Ranjau Sepanjang Jalan oleh Shahnon Ahmad'],
  ['id', 'laskar pelangi dan bumi manusia oleh pramoedya', 'Laskar Pelangi dan Bumi Manusia oleh Pramoedya'],
  ['en', 'of mice and men and the grapes of wrath', 'Of Mice and Men and the Grapes of Wrath']
];
TITLES.forEach(function (t) { var got = C(t[1], 'title', {language: t[0]}); if (got !== t[2]) fail('title-' + t[0], JSON.stringify(got) + ' want ' + JSON.stringify(t[2])); else ok(); });
// every preset word, alone and in the middle of a title, in every language
Object.keys(CaseLib.PRESETS).forEach(function (lang) {
  CaseLib.PRESETS[lang].split(' ').forEach(function (w) {
    var mid = C('alpha ' + w + ' omega', 'title', {language: lang});
    if (mid !== 'Alpha ' + w + ' Omega') fail('preset-mid-' + lang, w + ' -> ' + mid); else ok();
    var alone = C(w, 'title', {language: lang}), fi = firstLetterIdx(w);
    if (fi >= 0 && alone[fi] !== upc(w[fi], lang)) fail('preset-alone-' + lang, w + ' -> ' + alone); else ok();
    var other = C('alpha ' + w + ' omega', 'title', {language: 'xx'});
    if (SMALL_EN.indexOf(w) < 0 && fi >= 0 && other[6 + fi] !== upc(w[fi])) fail('preset-not-en-' + lang, w + ' -> ' + other); else ok();
  });
});
tricky.forEach(function (t) { var got = C(t[0], t[1]); if (got !== t[2]) fail('tricky', t[0] + ' ' + t[1] + ' -> ' + JSON.stringify(got) + ' want ' + JSON.stringify(t[2])); else ok(); });

'dictionary words: ' + dict.length + ' (' + dictMs + ' ms), MS: ' + MS.length + ', ID: ' + ID.length + ', accented: ' + ACC.length + '\nchecks: ' + count + ', failures: ' + fails.length + (fails.length ? '\n' + fails.join('\n') : '');
