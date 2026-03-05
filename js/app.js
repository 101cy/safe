/**
 * Safe.101 — Shelters in the Republic of Cyprus
 * safe.101.cy
 *
 * Loads official shelter data, map, GPS location, and address/POI search.
 */

(function () {
  'use strict';

  const CYPRUS_CENTER = [34.6866, 33.0444];
  const CYPRUS_ZOOM = 9;
  const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
  const NEAREST_COUNT = 15;
  const USER_MARKER_ZOOM = 15;
  const STORAGE_LANG_KEY = 'safe101cy_lang';

  const TRANSLATIONS = {
    en: {
      'hero.title': 'Find your nearest shelter',
      'panic.title': 'Emergency',
      'panic.btn': 'Take me to nearest shelter',
      'action.gps.title': 'Use my location',
      'action.gps.desc': 'Share your GPS position to find the closest shelters.',
      'action.gps.btn': 'Share location',
      'action.gps.loading': 'Locating…',
      'action.search.title': 'Search by address or place',
      'action.search.desc': 'Enter an address, postal code, or point of interest in Cyprus.',
      'action.search.placeholder': 'e.g. Nicosia, Limassol, 1016',
      'action.search.btn': 'Search',
      'map.title': 'Map',
      'map.legend': 'Shelter',
      'results.title': 'Nearest shelters',
      'results.close': 'Close list',
      'results.navigate': 'Open in Maps — Navigate to nearest shelter',
      'nearest.title': 'Your nearest shelter',
      'nearest.navigate_google': 'Open in Google Maps',
      'nearest.navigate_apple': 'Open in Apple Maps',
      'official.title': 'Official sources & app',
      'official.intro': 'Shelter data is provided by the <strong>Cyprus Civil Defence</strong> under the Ministry of Interior. For the best experience on your phone, use the official app.',
      'official.link1': 'Civil Defence — Gov.cy',
      'official.link2': 'Civil Defence Department — Ministry of Interior',
      'official.link3': 'SafeCY Privacy Policy',
      'app.title': 'SafeCY — Official app',
      'app.desc': 'Find shelters by GPS, address or postal code. Available in Greek and English. Free on Android and iOS.',
      'app.ios': 'App Store',
      'app.android': 'Google Play',
      'contact.label': 'Emergency contact: Civil Defence',
      'footer.peace': 'We stand for peace.',
      'footer.tagline': '— Shelter finder for the Republic of Cyprus. Not an official government site.',
      'footer.privacy': 'This site does not use cookies and does not collect data.',
      'footer.updated': 'Shelter database last updated: March 2, 2026.',
      'location.geo_unsupported': 'Geolocation is not supported by your browser.',
      'location.found': 'Location found. Showing nearest shelters.',
      'location.error_denied': 'Could not get your location. Please allow location access and try again.',
      'location.error_unavailable': 'Could not get your location. Location is unavailable.',
      'location.error_timeout': 'Could not get your location. Request timed out.',
      'location.error_default': 'Could not get your location. Please try again.',
      'location.try_again': 'Try again',
      'location.fallback_search': 'Search by address',
      'search.prompt': 'Please enter an address or place name.',
      'search.no_results': 'No results found. Try a different address or place in Cyprus.',
      'search.no_suggestions': 'No suggestions.',
      'search.found': 'Location found. Showing nearest shelters.',
      'search.network_error': 'Network error. Please check your connection.',
      'search.timeout': 'Search took too long. Please try again.',
      'load.error': 'Could not load shelter data.',
      'ui.km': 'km',
      'ui.capacity': 'Capacity',
      'ui.km_away': 'km away',
      'ui.nearest': 'Nearest shelters',
      'ui.shelters_near': 'Shelters near you',
      'legend.title': 'Map legend',
      'legend.gps': 'GPS location',
      'legend.shelter': 'Shelter',
      'legend.nearest': 'Nearest shelter',
      'legend.search': 'Searched location',
      'about.title': 'About',
      'info.title': 'Info',
    },
    el: {
      'hero.title': 'Βρείτε το πλησιέστερο καταφύγιο',
      'panic.title': 'Έκτακτη ανάγκη',
      'panic.btn': 'Οδήγησέ με στο πλησιέστερο καταφύγιο',
      'action.gps.title': 'Χρήση της τοποθεσίας μου',
      'action.gps.desc': 'Μοιραστείτε τις συντεταγμένες GPS σας για να βρείτε τα πλησιέστερα καταφύγια.',
      'action.gps.btn': 'Κοινοποίηση τοποθεσίας',
      'action.gps.loading': 'Εντοπισμός…',
      'action.search.title': 'Αναζήτηση με διεύθυνση',
      'action.search.desc': 'Εισάγετε διεύθυνση, ταχυδρομικό κώδικα ή σημείο ενδιαφέροντος στην Κύπρο.',
      'action.search.placeholder': 'π.χ. Λευκωσία, Λεμεσός, 1016',
      'action.search.btn': 'Αναζήτηση',
      'map.title': 'Χάρτης',
      'map.legend': 'Καταφύγιο',
      'results.title': 'Πλησιέστερα καταφύγια',
      'results.close': 'Κλείσιμο λίστας',
      'results.navigate': 'Άνοιγμα σε Χάρτες — Οδήγηση στο πλησιέστερο καταφύγιο',
      'nearest.title': 'Το πλησιέστερο καταφύγιό σας',
      'nearest.navigate_google': 'Άνοιγμα στο Google Maps',
      'nearest.navigate_apple': 'Άνοιγμα στο Apple Maps',
      'official.title': 'Επίσημες πηγές και εφαρμογή',
      'official.intro': 'Τα δεδομένα παρέχονται από την Πολιτική Άμυνα Κύπρου υπό το Υπουργείο Εσωτερικών. Για την καλύτερη εμπειρία στο κινητό σας, χρησιμοποιήστε την επίσημη εφαρμογή.',
      'official.link1': 'Πολιτική Άμυνα — Gov.cy',
      'official.link2': 'Τμήμα Πολιτικής Άμυνας — Υπουργείο Εσωτερικών',
      'official.link3': 'Πολιτική Απορρήτου SafeCY',
      'app.title': 'SafeCY — Επίσημη εφαρμογή',
      'app.desc': 'Βρείτε καταφύγια με GPS, διεύθυνση ή ταχυδρομικό κώδικα. Διαθέσιμη στα ελληνικά και αγγλικά. Δωρεάν σε Android και iOS.',
      'app.ios': 'App Store',
      'app.android': 'Google Play',
      'contact.label': 'Τηλέφωνα επικοινωνίας: Πολιτική Άμυνα',
      'footer.peace': 'Για την ειρήνη.',
      'footer.tagline': '— Καταφύγια Πολιτικής Άμυνας της Κυπριακής Δημοκρατίας. Ανεπίσημη ιστοσελίδα.',
      'footer.privacy': 'Αυτή η τοποθεσία δεν χρησιμοποιεί cookies και δεν συλλέγει δεδομένα.',
      'footer.updated': 'Τελευταία ενημέρωση δεδομένων: 2 Μαρτίου 2026.',
      'location.geo_unsupported': 'Η γεωτοποθεσία δεν υποστηρίζεται από το πρόγραμμα περιήγησής σας.',
      'location.found': 'Βρέθηκε τοποθεσία. Εμφανίζονται τα πλησιέστερα καταφύγια.',
      'location.error_denied': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Παρακαλώ επιτρέψτε την πρόσβαση στην τοποθεσία.',
      'location.error_unavailable': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Η τοποθεσία δεν είναι διαθέσιμη.',
      'location.error_timeout': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Το αίτημα έληξε.',
      'location.error_default': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Παρακαλώ δοκιμάστε ξανά.',
      'location.try_again': 'Δοκιμάστε ξανά',
      'location.fallback_search': 'Αναζήτηση με διεύθυνση',
      'search.prompt': 'Παρακαλώ εισάγετε διεύθυνση ή όνομα τόπου.',
      'search.no_results': 'Δεν βρέθηκαν αποτελέσματα. Δοκιμάστε άλλη διεύθυνση.',
      'search.no_suggestions': 'Χωρίς προτάσεις.',
      'search.found': 'Βρέθηκε τοποθεσία. Εμφανίζονται τα πλησιέστερα καταφύγια.',
      'search.network_error': 'Σφάλμα δικτύου. Ελέγξτε τη σύνδεσή σας.',
      'search.timeout': 'Η αναζήτηση χρειάστηκε πολύ ώρα. Δοκιμάστε ξανά.',
      'load.error': 'Δεν ήταν δυνατή η φόρτωση των δεδομένων καταφυγών.',
      'ui.km': 'χλμ',
      'ui.capacity': 'Χωρητικότητα',
      'ui.km_away': 'χλμ μακριά',
      'ui.nearest': 'Πλησιέστερα καταφύγια',
      'ui.shelters_near': 'Καταφύγια κοντά σας',
      'legend.gps': 'Θέση GPS',
      'legend.shelter': 'Καταφύγιο',
      'legend.nearest': 'Πλησιέστερο καταφύγιο',
      'legend.search': 'Τοποθεσία αναζήτησης',
      'legend.title': 'Υπόμνημα χάρτη',
      'about.title': 'Σχετικά',
      'info.title': 'Πληροφορίες',
    },
    tr: {
      'hero.title': 'En yakın sığınağı bulun',
      'panic.title': 'Acil durum',
      'panic.btn': 'Beni en yakın sığınağa götür',
      'action.gps.title': 'Konumumu kullan',
      'action.gps.desc': 'En yakın sığınakları bulmak için GPS konumunuzu paylaşın.',
      'action.gps.btn': 'Konumu paylaş',
      'action.gps.loading': 'Konum bulunuyor…',
      'action.search.title': 'Adres veya yer ile ara',
      'action.search.desc': "Kıbrıs'ta bir adres, posta kodu veya ilgi noktası girin.",
      'action.search.placeholder': 'örn. Lefkoşa, Limasol, 1016',
      'action.search.btn': 'Ara',
      'map.title': 'Harita',
      'map.legend': 'Sığınak',
      'results.title': 'En yakın sığınaklar',
      'results.close': 'Listeyi kapat',
      'results.navigate': 'Haritalarda aç — En yakın sığınağa git',
      'nearest.title': 'En yakın sığınağınız',
      'nearest.navigate_google': 'Google Haritalar\'da aç',
      'nearest.navigate_apple': 'Apple Haritalar\'da aç',
      'official.title': 'Resmi kaynaklar ve uygulama',
      'official.intro': 'Sığınak verileri İçişleri Bakanlığı\'na bağlı <strong>Kıbrıs Sivil Savunma</strong> tarafından sağlanmaktadır. Telefonunuzda en iyi deneyim için resmi uygulamayı kullanın.',
      'official.link1': 'Sivil Savunma — Gov.cy',
      'official.link2': 'Sivil Savunma Dairesi — İçişleri Bakanlığı',
      'official.link3': 'SafeCY Gizlilik Politikası',
      'app.title': 'SafeCY — Resmi uygulama',
      'app.desc': 'GPS, adres veya posta kodu ile sığınakları bulun. Türkçe ve İngilizce mevcuttur. Android ve iOS\'ta ücretsiz.',
      'app.ios': 'App Store',
      'app.android': 'Google Play',
      'contact.label': 'Acil iletişim: Sivil Savunma',
      'footer.peace': 'Barışı destekliyoruz.',
      'footer.tagline': '— Kıbrıs Cumhuriyeti için sığınak bulucu. Resmi devlet sitesi değildir.',
      'footer.privacy': 'Bu site çerez kullanmaz ve veri toplamaz.',
      'footer.updated': 'Sığınak veritabanı son güncelleme: 2 Mart 2026.',
      'location.geo_unsupported': 'Tarayıcınız konum özelliğini desteklemiyor.',
      'location.found': 'Konum bulundu. En yakın sığınaklar gösteriliyor.',
      'location.error_denied': 'Konumunuz alınamadı. Lütfen konum erişimine izin verin.',
      'location.error_unavailable': 'Konumunuz alınamadı. Konum kullanılamıyor.',
      'location.error_timeout': 'Konumunuz alınamadı. İstek zaman aşımına uğradı.',
      'location.error_default': 'Konumunuz alınamadı. Lütfen tekrar deneyin.',
      'location.try_again': 'Tekrar dene',
      'location.fallback_search': 'Adresle ara',
      'search.prompt': 'Lütfen bir adres veya yer adı girin.',
      'search.no_results': 'Sonuç bulunamadı. Kıbrıs\'ta farklı bir adres veya yer deneyin.',
      'search.no_suggestions': 'Öneri yok.',
      'search.found': 'Konum bulundu. En yakın sığınaklar gösteriliyor.',
      'search.network_error': 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
      'search.timeout': 'Arama çok uzun sürdü. Lütfen tekrar deneyin.',
      'load.error': 'Sığınak verileri yüklenemedi.',
      'ui.km': 'km',
      'ui.capacity': 'Kapasite',
      'ui.km_away': 'km uzakta',
      'ui.nearest': 'En yakın sığınaklar',
      'ui.shelters_near': 'Yakınınızdaki sığınaklar',
      'legend.gps': 'GPS konumu',
      'legend.shelter': 'Sığınak',
      'legend.nearest': 'En yakın sığınak',
      'legend.search': 'Aranan konum',
      'legend.title': 'Harita açıklaması',
      'about.title': 'Hakkında',
      'info.title': 'Bilgi',
    }
  };

  function getBrowserLanguage() {
    const browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    if (browserLang === 'el') return 'el';
    if (browserLang === 'tr') return 'tr';
    return 'en';
  }

  let currentLang = getBrowserLanguage();
  let shelters = [];
  let map = null;
  let shelterLayer = null;
  let userMarker = null;
  let shelterMarkersById = {};   // keyed by "lat,lon" to avoid duplicate-ID collisions
  let gpsWatchId = null;
  let gpsFirstFix = false;
  const shelterCache = {};       // lazy-loaded shelter data keyed by lang
  let lastNearestLat = null;
  let lastNearestLon = null;
  let lastNearestTitle = null;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const btnLocate = $('#btn-locate');
  const locationStatus = $('#location-status');
  const searchInput = $('#search-input');
  const searchStatus = $('#search-status');
  const mapEl = $('#map');
  const resultsPanel = $('#results-panel');
  const resultsTitle = $('#results-title');
  const resultsList = $('#results-list');
  const resultsNearestBlock = $('#results-nearest-block');
  const nearestShelterAddress = $('#nearest-shelter-address');
  const nearestShelterMeta = $('#nearest-shelter-meta');
  const resultsNavigateLink = $('#results-navigate-link');
  const resultsErrorState = $('#results-error-state');
  const resultsErrorMessage = $('#results-error-message');
  const btnClosePanel = $('#btn-close-panel');
  const btnTryAgain = $('#btn-try-again');
  const btnSearchFallback = $('#btn-search-fallback');
  const btnPanic = $('#btn-panic');
  const searchSuggestions = $('#search-suggestions');
  const btnInfoToggle = $('#btn-info-toggle');
  const btnCloseInfo = $('#btn-close-info');
  const infoDrawer = $('#info-drawer');
  const infoOverlay = $('#info-overlay');
  const GOOGLE_MAPS_NAV_URL = 'https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=';
  const APPLE_MAPS_NAV_URL = 'https://maps.apple.com/?daddr=';
  const APPLE_MAPS_WALKING = '&dirflg=w';
  const AUTCOMPLETE_DEBOUNCE_MS = 350;

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  function getMapsNavUrl(lat, lon) {
    var dest = lat + ',' + lon;
    if (isIOS()) {
      return APPLE_MAPS_NAV_URL + encodeURIComponent(dest) + APPLE_MAPS_WALKING;
    }
    return GOOGLE_MAPS_NAV_URL + encodeURIComponent(dest);
  }
  const MIN_QUERY_LENGTH = 2;
  let autocompleteDebounceTimer = null;
  let lastSuggestionsQuery = '';

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
  }

  const SEO_META = {
    en: {
      title: 'SAFE.101.CY — Find Civil Defence Shelters in Cyprus | GPS & Map',
      description: 'Find your nearest civil defence shelter in the Republic of Cyprus. Use GPS or search by address. Interactive map with Civil Defence shelters. SafeCY app links.',
      ogTitle: 'SAFE.101.CY — Find Civil Defence Shelters in Cyprus',
      ogDescription: 'Find your nearest civil defence shelter in Cyprus. Use GPS or search by address.',
      twitterTitle: 'SAFE.101.CY — Find Civil Defence Shelters in Cyprus',
      twitterDescription: 'Find your nearest civil defence shelter in Cyprus. GPS, address search, interactive map.',
      ogLocale: 'en_CY',
    },
    el: {
      title: 'SAFE.101.CY — Καταφύγια Πολιτικής Άμυνας στην Κύπρο | GPS & Χάρτης',
      description: 'Βρείτε το πλησιέστερο καταφύγιο Πολιτικής Άμυνας στην Κυπριακή Δημοκρατία. Χρησιμοποιήστε GPS ή αναζητήστε με διεύθυνση. Διαδραστικός χάρτης με επίσημα καταφύγια.',
      ogTitle: 'SAFE.101.CY — Καταφύγια Πολιτικής Άμυνας στην Κύπρο',
      ogDescription: 'Βρείτε το πλησιέστερο καταφύγιο Πολιτικής Άμυνας. GPS ή αναζήτηση με διεύθυνση.',
      twitterTitle: 'SAFE.101.CY — Καταφύγια Πολιτικής Άμυνας στην Κύπρο',
      twitterDescription: 'Βρείτε καταφύγια Πολιτικής Άμυνας στην Κύπρο. GPS, αναζήτηση διεύθυνσης, διαδραστικός χάρτης.',
      ogLocale: 'el_CY',
    },
    tr: {
      title: 'SAFE.101.CY — Kıbrıs\'ta Sivil Savunma Sığınakları | GPS & Harita',
      description: 'Kıbrıs Cumhuriyeti\'nde en yakın sivil savunma sığınağını bulun. GPS veya adres araması ile. Resmi sığınak haritası.',
      ogTitle: 'SAFE.101.CY — Kıbrıs\'ta Sivil Savunma Sığınakları',
      ogDescription: 'En yakın sivil savunma sığınağını bulun. GPS veya adres ile arayın.',
      twitterTitle: 'SAFE.101.CY — Kıbrıs\'ta Sivil Savunma Sığınakları',
      twitterDescription: 'Kıbrıs\'ta sığınak bulun. GPS, adres araması, etkileşimli harita.',
      ogLocale: 'tr_CY',
    }
  };

  function applyTranslations() {
    document.documentElement.lang = currentLang === 'el' ? 'el' : currentLang === 'tr' ? 'tr' : 'en';
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (!key || !val) return;
      if (key === 'official.intro') { el.innerHTML = val; return; }
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.textContent = val;
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      const val = t(el.getAttribute('data-i18n-placeholder'));
      if (val) el.placeholder = val;
    });
    $$('[data-i18n-aria-label]').forEach(el => {
      const val = t(el.getAttribute('data-i18n-aria-label'));
      if (val) el.setAttribute('aria-label', val);
    });
    const contactLabel = document.querySelector('.contact-note [data-i18n="contact.label"]');
    if (contactLabel) contactLabel.textContent = t('contact.label');

    const meta = SEO_META[currentLang] || SEO_META.en;
    const titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);
    const ogTitleEl = document.getElementById('og-title');
    if (ogTitleEl) ogTitleEl.setAttribute('content', meta.ogTitle);
    const ogDescEl = document.getElementById('og-description');
    if (ogDescEl) ogDescEl.setAttribute('content', meta.ogDescription);
    const ogLocaleEl = document.getElementById('og-locale');
    if (ogLocaleEl) ogLocaleEl.setAttribute('content', meta.ogLocale);
    const twTitleEl = document.getElementById('twitter-title');
    if (twTitleEl) twTitleEl.setAttribute('content', meta.twitterTitle);
    const twDescEl = document.getElementById('twitter-description');
    if (twDescEl) twDescEl.setAttribute('content', meta.twitterDescription);
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'el' && lang !== 'tr') return;
    currentLang = lang;
    applyTranslations();
    $$('.lang-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
    // Lazy-load shelter data for this language, then update marker refs and panel text
    loadShelters(lang).then(() => {
      updateMarkerShelterRefs();
      refreshResultsPanel();
    });
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function sortByDistance(lat, lon) {
    return shelters
      .map(s => ({
        ...s,
        distance: haversineKm(lat, lon, s.lat, s.lon)
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  function getNearest(lat, lon, n = NEAREST_COUNT) {
    return sortByDistance(lat, lon).slice(0, n);
  }

  function loadShelters(lang) {
    const l = lang || currentLang;
    if (shelterCache[l]) {
      shelters = shelterCache[l];
      return Promise.resolve(shelters);
    }
    const file = l === 'el' ? 'shelters_full_el.json' : 'shelters_full_en.json';
    return fetch(file)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load shelter data');
        return r.json();
      })
      .then(data => {
        shelterCache[l] = (data && data.shelters) ? data.shelters : [];
        shelters = shelterCache[l];
        return shelters;
      });
  }

  // Update each marker's shelter reference to match the current language data
  function updateMarkerShelterRefs() {
    const byCoord = {};
    shelters.forEach(s => { byCoord[`${s.lat},${s.lon}`] = s; });
    Object.entries(shelterMarkersById).forEach(([key, m]) => {
      if (byCoord[key]) m.shelter = byCoord[key];
    });
  }

  // Re-render results panel text for the last known location without touching the map
  function refreshResultsPanel() {
    if (lastNearestLat !== null && resultsPanel.classList.contains('is-open')) {
      const nearest = getNearest(lastNearestLat, lastNearestLon);
      if (nearest.length > 0) {
        const first = nearest[0];
        if (nearestShelterAddress) nearestShelterAddress.textContent = first.address || first.id;
        if (nearestShelterMeta) nearestShelterMeta.textContent = first.distance.toFixed(1) + ' ' + t('ui.km_away') + ' · ' + t('ui.capacity') + ' ' + (first.capacity || '—');
      }
      const nearestLat = nearest.length > 0 ? nearest[0].lat : null;
      const nearestLon = nearest.length > 0 ? nearest[0].lon : null;
      resultsList.innerHTML = nearest.slice(1).filter(s => !(s.lat === nearestLat && s.lon === nearestLon)).map(s => `
        <li class="result-item" data-lat="${s.lat}" data-lon="${s.lon}">
          <div class="result-address">${escapeHtml(s.address || s.id)}</div>
          <div class="result-meta">${s.distance.toFixed(1)} ${t('ui.km')} · ${t('ui.capacity')} ${escapeHtml(String(s.capacity))} · ${escapeHtml(s.district || '')}</div>
        </li>
      `).join('');
      // Re-attach click handlers to new list items
      $$('.result-item', resultsList).forEach(el => {
        el.addEventListener('click', () => {
          const lat = parseFloat(el.dataset.lat);
          const lon = parseFloat(el.dataset.lon);
          const zoom = 17;
          if (window.innerWidth < 769 && resultsPanel.classList.contains('is-open')) {
            const topbarEl = document.querySelector('.topbar');
            const topPad = topbarEl ? topbarEl.getBoundingClientRect().bottom : 60;
            const btmPad = resultsPanel.getBoundingClientRect().height;
            const LL = L.latLng(lat, lon);
            map.fitBounds(L.latLngBounds([LL, LL]), { paddingTopLeft: [0, topPad], paddingBottomRight: [0, btmPad], maxZoom: zoom, animate: true });
          } else {
            map.setView([lat, lon], zoom);
          }
          const marker = shelterMarkersById[`${lat},${lon}`];
          if (marker && marker.bindPopup) marker.bindPopup(popupContent(marker.shelter), { autoPan: false }).openPopup();
        });
      });
    }
  }

  function initMap() {
    if (!mapEl || map) return;
    map = L.map('map', {
      center: CYPRUS_CENTER,
      zoom: CYPRUS_ZOOM,
      scrollWheelZoom: true
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    shelterLayer = L.layerGroup().addTo(map);
  }


  function clearUserMarker() {
    if (userMarker && map) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
  }

  function clearAllSheltersLayer() {
    if (shelterLayer) shelterLayer.clearLayers();
  }

  function viewAllShelters() {
    stopGpsWatch();
    clearUserMarker();
    clearAllSheltersLayer();
    shelterMarkersById = {};
    const bounds = [];
    shelters.forEach(s => {
      const m = L.circleMarker([s.lat, s.lon], {
        radius: 7,
        fillColor: '#2d5a4a',
        color: '#fff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.75
      });
      m.shelter = s;
      m.on('click', () => m.bindPopup(popupContent(s)).openPopup());
      m.addTo(shelterLayer);
      shelterMarkersById[`${s.lat},${s.lon}`] = m;
      bounds.push([s.lat, s.lon]);
    });
    if (bounds.length > 0) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 11 });
    resultsPanel.classList.remove('is-open');
  }

  function addUserMarker(lat, lon, isSearchLocation = false) {
    clearUserMarker();
    const markerClass = isSearchLocation ? 'search-location-marker' : 'user-location-marker';
    const markerHtml = isSearchLocation 
      ? '<svg width="28" height="40" viewBox="0 0 28 40" fill="none"><path d="M14 2C8.5 2 4 6.5 4 12c0 3.5 2 7 5 9l5 14 5-14c3-2 5-5.5 5-9 0-5.5-4.5-10-10-10z" fill="white" stroke="#2d5a4a" stroke-width="2"/><circle cx="14" cy="12" r="3.5" fill="#2d5a4a"/></svg>'
      : '<span class="user-dot"></span>';
    userMarker = L.marker([lat, lon], {
      icon: L.divIcon({
        className: markerClass,
        html: markerHtml,
        iconSize: isSearchLocation ? [28, 40] : [20, 20],
        iconAnchor: isSearchLocation ? [14, 40] : [10, 10]
      })
    }).addTo(map);
  }

  function popupContent(s) {
    const dist = s.distance != null ? `<br><small>${s.distance.toFixed(1)} ${t('ui.km_away')}</small>` : '';
    return `
      <strong>${escapeHtml(s.address || s.id)}</strong>
      <br>${t('ui.capacity')}: ${escapeHtml(String(s.capacity))} · ${escapeHtml(s.district || '')}
      ${dist}
    `;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showNearest(lat, lon, title) {
    lastNearestLat = lat;
    lastNearestLon = lon;
    lastNearestTitle = title;
    const nearest = getNearest(lat, lon);
    if (resultsErrorState) resultsErrorState.style.display = 'none';
    resultsTitle.textContent = title || t('ui.nearest');
    // Determine if this is a search result (not GPS) by checking if title contains "results.title"
    const isSearchLocation = title && title.includes(t('results.title'));
    if (nearest.length > 0) {
      const first = nearest[0];
      
      // Reset all shelter markers to normal style
      Object.values(shelterMarkersById).forEach(m => {
        m.setStyle({
          radius: 7,
          fillColor: '#2d5a4a',
          weight: 1.5,
          fillOpacity: 0.75
        });
        if (m.getElement()) {
          m.getElement().classList.remove('nearest-shelter-pulse');
        }
      });
      
      // Highlight nearest shelter: CSS class controls the red color (overrides Leaflet's SVG fill
      // attribute on every redraw); setStyle only changes the size.
      const nearestMarker = shelterMarkersById[`${first.lat},${first.lon}`];
      if (nearestMarker) {
        nearestMarker.setStyle({ radius: 11, weight: 2, fillOpacity: 0.95 });
        if (nearestMarker.getElement()) {
          nearestMarker.getElement().classList.add('nearest-shelter-pulse');
        }
      }
      
      if (resultsNearestBlock && nearestShelterAddress && nearestShelterMeta) {
        nearestShelterAddress.textContent = first.address || first.id;
        nearestShelterMeta.textContent = first.distance.toFixed(1) + ' ' + t('ui.km_away') + ' · ' + t('ui.capacity') + ' ' + (first.capacity || '—');
        resultsNearestBlock.dataset.lat = first.lat;
        resultsNearestBlock.dataset.lon = first.lon;
        resultsNearestBlock.style.display = 'block';
      }
      if (resultsNavigateLink) {
        resultsNavigateLink.href = getMapsNavUrl(first.lat, first.lon);
        const navKey = isIOS() ? 'nearest.navigate_apple' : 'nearest.navigate_google';
        resultsNavigateLink.textContent = t(navKey);
      }
    } else if (resultsNearestBlock) {
      resultsNearestBlock.style.display = 'none';
    }
    const nearestLat = nearest.length > 0 ? nearest[0].lat : null;
    const nearestLon = nearest.length > 0 ? nearest[0].lon : null;
    resultsList.innerHTML = nearest.slice(1).filter(s => !(s.lat === nearestLat && s.lon === nearestLon)).map(s => `
      <li class="result-item" data-lat="${s.lat}" data-lon="${s.lon}">
        <div class="result-address">${escapeHtml(s.address || s.id)}</div>
        <div class="result-meta">${s.distance.toFixed(1)} ${t('ui.km')} · ${t('ui.capacity')} ${escapeHtml(String(s.capacity))} · ${escapeHtml(s.district || '')}</div>
      </li>
    `).join('');

    $$('.result-item', resultsList).forEach(el => {
      el.addEventListener('click', () => {
        const lat = parseFloat(el.dataset.lat);
        const lon = parseFloat(el.dataset.lon);
        const zoom = 17;

        if (window.innerWidth < 769 && resultsPanel.classList.contains('is-open')) {
          // Use fitBounds with padding so Leaflet natively accounts for the topbar and
          // the results panel — single atomic call, no autopan interference.
          const topbarEl = document.querySelector('.topbar');
          const topPad = topbarEl ? topbarEl.getBoundingClientRect().bottom : 60;
          const btmPad = resultsPanel.getBoundingClientRect().height;
          const LL = L.latLng(lat, lon);
          map.fitBounds(L.latLngBounds([LL, LL]), {
            paddingTopLeft:     [0, topPad],
            paddingBottomRight: [0, btmPad],
            maxZoom: zoom,
            animate: true
          });
        } else {
          map.setView([lat, lon], zoom);
        }

        const marker = shelterMarkersById[`${lat},${lon}`];
        // autoPan: false prevents Leaflet from re-panning after we set the view
        if (marker && marker.bindPopup) marker.bindPopup(popupContent(marker.shelter), { autoPan: false }).openPopup();
      });
    });

    if (resultsNearestBlock) {
      resultsNearestBlock.onclick = e => {
        if (e.target.closest('a')) return; // let the navigate link open normally
        const nLat = parseFloat(resultsNearestBlock.dataset.lat);
        const nLon = parseFloat(resultsNearestBlock.dataset.lon);
        const zoom = 17;
        if (window.innerWidth < 769 && resultsPanel.classList.contains('is-open')) {
          const topbarEl = document.querySelector('.topbar');
          const topPad = topbarEl ? topbarEl.getBoundingClientRect().bottom : 60;
          const btmPad = resultsPanel.getBoundingClientRect().height;
          const LL = L.latLng(nLat, nLon);
          map.fitBounds(L.latLngBounds([LL, LL]), {
            paddingTopLeft:     [0, topPad],
            paddingBottomRight: [0, btmPad],
            maxZoom: zoom,
            animate: true
          });
        } else {
          map.setView([nLat, nLon], zoom);
        }
        const nearMarker = shelterMarkersById[`${nLat},${nLon}`];
        if (nearMarker && nearMarker.bindPopup) nearMarker.bindPopup(popupContent(nearMarker.shelter), { autoPan: false }).openPopup();
      };
    }

    resultsPanel.classList.add('is-open');
    addUserMarker(lat, lon, isSearchLocation);
    // For search: center on the searched location (GPS centering is handled by useLocation)
    if (isSearchLocation) {
      map.setView([lat, lon], USER_MARKER_ZOOM);
    }
  }

  function setLocationLoading(loading) {
    if (!btnLocate) return;
    btnLocate.disabled = loading;
    btnLocate.classList.toggle('is-loading', loading);
  }

  function setSearchLoading(loading) {
    const btnSearch = $('#btn-search');
    if (!btnSearch) return;
    btnSearch.disabled = loading;
  }

  function showLocationErrorInPanel(message) {
    if (resultsNearestBlock) resultsNearestBlock.style.display = 'none';
    resultsList.innerHTML = '';
    if (resultsErrorMessage) resultsErrorMessage.textContent = message;
    if (resultsTitle) resultsTitle.textContent = t('results.title');
    if (resultsErrorState) resultsErrorState.style.display = 'block';
    resultsPanel.classList.add('is-open');
  }

  function openInfoDrawer() {
    if (infoDrawer) infoDrawer.classList.add('is-open');
    if (infoOverlay) {
      infoOverlay.classList.add('is-visible');
      infoOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  function closeInfoDrawer() {
    if (infoDrawer) infoDrawer.classList.remove('is-open');
    if (infoOverlay) {
      infoOverlay.classList.remove('is-visible');
      infoOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  function useLocation() {
    if (!navigator.geolocation) {
      const msg = t('location.geo_unsupported');
      if (locationStatus) locationStatus.textContent = msg;
      showLocationErrorInPanel(msg);
      return;
    }
    if (locationStatus) locationStatus.textContent = '';
    setLocationLoading(true);

    // Start watching position (live GPS tracking)
    gpsFirstFix = true;
    gpsWatchId = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const isFirst = gpsFirstFix;
        gpsFirstFix = false;
        showNearest(latitude, longitude, t('ui.shelters_near'));
        if (locationStatus) locationStatus.textContent = t('location.found');
        setLocationLoading(false);
        // Add pulsing animation to indicate active tracking
        if (btnLocate) btnLocate.classList.add('is-loading');

        // On first fix: fit map to show both user location and nearest shelter
        if (isFirst) {
          const nearest = getNearest(latitude, longitude);
          if (nearest.length > 0) {
            const userLL = L.latLng(latitude, longitude);
            const shelterLL = L.latLng(nearest[0].lat, nearest[0].lon);
            const topbarEl = document.querySelector('.topbar');
            const topPad = topbarEl ? topbarEl.getBoundingClientRect().bottom : 60;
            const btmPad = window.innerWidth < 769 && resultsPanel
              ? resultsPanel.getBoundingClientRect().height
              : 0;
            map.fitBounds(L.latLngBounds([userLL, shelterLL]), {
              paddingTopLeft:     [40, topPad + 40],
              paddingBottomRight: [40, btmPad + 40],
              maxZoom: 16,
              animate: true
            });
          } else {
            map.setView([latitude, longitude], USER_MARKER_ZOOM);
          }
        }
      },
      err => {
        let msg;
        switch (err.code) {
          case err.PERMISSION_DENIED: msg = t('location.error_denied'); break;
          case err.POSITION_UNAVAILABLE: msg = t('location.error_unavailable'); break;
          case err.TIMEOUT: msg = t('location.error_timeout'); break;
          default: msg = t('location.error_default');
        }
        if (locationStatus) locationStatus.textContent = msg;
        setLocationLoading(false);
        showLocationErrorInPanel(msg);
        stopGpsWatch();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  function stopGpsWatch() {
    if (gpsWatchId !== null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
      if (btnLocate) btnLocate.classList.remove('is-loading');
    }
    gpsFirstFix = false;
  }

  function geocode(query) {
    const params = new URLSearchParams({
      q: query + ', Cyprus',
      format: 'json',
      limit: '1',
      countrycodes: 'cy'
    });
    return fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'Accept': 'application/json' }
    }).then(r => r.json());
  }

  function geocodeSuggestions(query) {
    // Photon (komoot) supports prefix/partial matching, unlike Nominatim.
    // We restrict to the Cyprus bounding box and return up to 8 suggestions.
    const params = new URLSearchParams({
      q: query,
      limit: '8',
      lang: currentLang === 'tr' ? 'tr' : currentLang === 'el' ? 'el' : 'en',
      bbox: '32.27,34.58,34.60,35.18', // Cyprus: minLon,minLat,maxLon,maxLat
    });
    return fetch(`https://photon.komoot.io/api/?${params}`, {
      headers: { 'Accept': 'application/json' }
    }).then(r => r.json()).then(data => {
      // Normalise GeoJSON features to { display_name, lat, lon }
      return (data.features || []).map(f => {
        const p = f.properties || {};
        const parts = [p.name, p.city || p.town || p.village, p.county || p.state].filter(Boolean);
        // Deduplicate consecutive identical parts (e.g. name === city)
        const label = parts.filter((v, i) => i === 0 || v !== parts[i - 1]).join(', ');
        const [lon, lat] = f.geometry.coordinates;
        return { display_name: label, lat, lon };
      }).filter(r => r.display_name);
    });
  }

  function hideSuggestions() {
    if (searchSuggestions) {
      searchSuggestions.classList.remove('is-open');
      searchSuggestions.innerHTML = '';
      if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
    }
  }

  // Show a non-selectable status/message row in the suggestions dropdown
  function positionSuggestions() {
    if (!searchInput || !searchSuggestions) return;
    const rect = searchInput.getBoundingClientRect();
    searchSuggestions.style.top = `${rect.bottom + 3}px`;
  }

  function showSearchMessage(msg) {
    if (!searchSuggestions) return;
    searchSuggestions.innerHTML = `<li class="search-suggestion-item search-suggestion-empty" role="status" tabindex="-1" aria-disabled="true">${escapeHtml(msg)}</li>`;
    searchSuggestions.classList.add('is-open');
    positionSuggestions();
    if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
  }

  function showSuggestions(results) {
    if (!searchSuggestions) return;
    searchSuggestions.innerHTML = results.slice(0, 8).map((r) => {
      const name = escapeHtml(r.display_name || '');
      return `<li class="search-suggestion-item" role="option" data-lat="${r.lat}" data-lon="${r.lon}" tabindex="-1">${name}</li>`;
    }).join('');
    searchSuggestions.classList.add('is-open');
    positionSuggestions();
    if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
    $$('.search-suggestion-item', searchSuggestions).forEach((el) => {
      el.addEventListener('click', () => {
        const lat = parseFloat(el.dataset.lat);
        const lon = parseFloat(el.dataset.lon);
        hideSuggestions();
        if (searchInput) searchInput.value = el.textContent;
        showNearest(lat, lon, `${t('results.title')} — ${el.textContent}`);
        if (searchStatus) searchStatus.textContent = t('search.found');
      });
    });
  }

  function onSearchInput() {
    const q = (searchInput && searchInput.value || '').trim();
    if (autocompleteDebounceTimer) clearTimeout(autocompleteDebounceTimer);
    if (q.length < MIN_QUERY_LENGTH) {
      hideSuggestions();
      return;
    }
    autocompleteDebounceTimer = setTimeout(() => {
      lastSuggestionsQuery = q;
      geocodeSuggestions(q).then(results => {
        if (lastSuggestionsQuery !== q) return;
        if (!results || results.length === 0) {
          showSearchMessage(t('search.no_suggestions'));
          return;
        }
        showSuggestions(results);
      }).catch(() => showSearchMessage(t('search.network_error')));
    }, AUTCOMPLETE_DEBOUNCE_MS);
  }

  function searchAddress() {
    stopGpsWatch();
    const q = (searchInput && searchInput.value || '').trim();
    if (!q) return;
    if (searchStatus) searchStatus.textContent = '';
    setSearchLoading(true);

    geocode(q).then(results => {
      setSearchLoading(false);
      if (!results || results.length === 0) {
        showSearchMessage(t('search.no_results'));
        if (searchStatus) searchStatus.textContent = t('search.no_results');
        return;
      }
      hideSuggestions();
      const { lat, lon } = results[0];
      showNearest(parseFloat(lat), parseFloat(lon), `${t('results.title')} «${q}»`);
      if (searchStatus) searchStatus.textContent = t('search.found');
    }).catch(err => {
      setSearchLoading(false);
      const msg = err && err.name === 'AbortError' ? t('search.timeout') : t('search.network_error');
      showSearchMessage(msg);
      if (searchStatus) searchStatus.textContent = msg;
    });
  }

  function closeResultsPanel() {
    resultsPanel.classList.remove('is-open');
    stopGpsWatch();
  }

  if (btnLocate) btnLocate.addEventListener('click', useLocation);
  if (btnPanic) btnPanic.addEventListener('click', useLocation);
  if (btnTryAgain) btnTryAgain.addEventListener('click', useLocation);
  if (btnSearchFallback) btnSearchFallback.addEventListener('click', () => {
    closeResultsPanel();
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  });
  if (btnInfoToggle) btnInfoToggle.addEventListener('click', openInfoDrawer);
  if (btnCloseInfo) btnCloseInfo.addEventListener('click', closeInfoDrawer);
  if (infoOverlay) infoOverlay.addEventListener('click', closeInfoDrawer);
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const firstReal = searchSuggestions && searchSuggestions.querySelector('.search-suggestion-item:not(.search-suggestion-empty)');
        if (firstReal) {
          firstReal.click();
        } else {
          hideSuggestions();
          searchAddress();
        }
      }
      if (e.key === 'Escape') hideSuggestions();
    });
    searchInput.addEventListener('input', onSearchInput);
    searchInput.addEventListener('focus', () => { if ((searchInput.value || '').trim().length >= MIN_QUERY_LENGTH && searchSuggestions.innerHTML) searchSuggestions.classList.add('is-open'); });
    searchInput.addEventListener('blur', () => { setTimeout(hideSuggestions, 200); });
  }
  if (btnClosePanel) btnClosePanel.addEventListener('click', closeResultsPanel);
  document.addEventListener('click', e => {
    if (searchSuggestions && searchSuggestions.classList.contains('is-open') && searchInput && !searchInput.contains(e.target) && !searchSuggestions.contains(e.target))
      hideSuggestions();
  });

  window.addEventListener('scroll', () => { if (searchSuggestions && searchSuggestions.classList.contains('is-open')) positionSuggestions(); });
  window.addEventListener('resize', () => { if (searchSuggestions && searchSuggestions.classList.contains('is-open')) positionSuggestions(); });

  $$('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });

  applyTranslations();
  loadShelters().then(() => {
    initMap();
    viewAllShelters();
  }).catch(err => {
    console.error(err);
    if (locationStatus) locationStatus.textContent = t('load.error');
    if (locationStatus) locationStatus.classList.add('error');
  });
})();
