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
      'search.prompt': 'Please enter an address or place name.',
      'search.no_results': 'No results found. Try a different address or place in Cyprus.',
      'search.found': 'Location found. Showing nearest shelters.',
      'search.failed': 'Search failed. Please try again.',
      'load.error': 'Could not load shelter data.',
      'ui.km': 'km',
      'ui.capacity': 'Capacity',
      'ui.km_away': 'km away',
      'ui.nearest': 'Nearest shelters',
      'ui.shelters_near': 'Shelters near you',
    },
    el: {
      'hero.title': 'Βρείτε το πλησιέστερο καταφύγιο',
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
      'official.title': 'Επίσημες πηγές και εφαρμογή',
      'official.intro': 'Τα δεδομένα καταφυγών παρέχονται από την Πολιτική Άμυνα Κύπρου υπό το Υπουργείο Εσωτερικών. Για την καλύτερη εμπειρία στο κινητό σας, χρησιμοποιήστε την επίσημη εφαρμογή.',
      'official.link1': 'Πολιτική Άμυνα — Gov.cy',
      'official.link2': 'Τμήμα Πολιτικής Άμυνας — Υπουργείο Εσωτερικών',
      'official.link3': 'Πολιτική Απορρήτου SafeCY',
      'app.title': 'SafeCY — Επίσημη εφαρμογή',
      'app.desc': 'Βρείτε καταφύγια με GPS, διεύθυνση ή ταχυδρομικό κώδικα. Διαθέσιμη στα ελληνικά και αγγλικά. Δωρεάν σε Android και iOS.',
      'app.ios': 'App Store',
      'app.android': 'Google Play',
      'contact.label': 'Τηλέφωνα επικοινωνίας: Πολιτική Άμυνα',
      'footer.peace': 'Για την ειρήνη.',
      'footer.tagline': '— Χάρτης καταφυγίων της Κυπριακής Δημοκρατίας. Ανεπίσημη ιστοσελίδα.',
      'footer.privacy': 'Αυτή η τοποθεσία δεν χρησιμοποιεί cookies και δεν συλλέγει δεδομένα.',
      'footer.updated': 'Τελευταία ενημέρωση βάσης καταφυγών: 2 Μαρτίου 2026.',
      'location.geo_unsupported': 'Η γεωτοποθεσία δεν υποστηρίζεται από το πρόγραμμα περιήγησής σας.',
      'location.found': 'Βρέθηκε τοποθεσία. Εμφανίζονται τα πλησιέστερα καταφύγια.',
      'location.error_denied': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Παρακαλώ επιτρέψτε την πρόσβαση στην τοποθεσία.',
      'location.error_unavailable': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Η τοποθεσία δεν είναι διαθέσιμη.',
      'location.error_timeout': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Το αίτημα έληξε.',
      'location.error_default': 'Δεν ήταν δυνατή η εύρεση της τοποθεσίας σας. Παρακαλώ δοκιμάστε ξανά.',
      'search.prompt': 'Παρακαλώ εισάγετε διεύθυνση ή όνομα τόπου.',
      'search.no_results': 'Δεν βρέθηκαν αποτελέσματα. Δοκιμάστε άλλη διεύθυνση.',
      'search.found': 'Βρέθηκε τοποθεσία. Εμφανίζονται τα πλησιέστερα καταφύγια.',
      'search.failed': 'Η αναζήτηση απέτυχε. Παρακαλώ δοκιμάστε ξανά.',
      'load.error': 'Δεν ήταν δυνατή η φόρτωση των δεδομένων καταφυγών.',
      'ui.km': 'χλμ',
      'ui.capacity': 'Χωρητικότητα',
      'ui.km_away': 'χλμ μακριά',
      'ui.nearest': 'Πλησιέστερα καταφύγια',
      'ui.shelters_near': 'Καταφύγια κοντά σας',
    },
    tr: {
      'hero.title': 'En yakın sığınağı bulun',
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
      'search.prompt': 'Lütfen bir adres veya yer adı girin.',
      'search.no_results': 'Sonuç bulunamadı. Kıbrıs\'ta farklı bir adres veya yer deneyin.',
      'search.found': 'Konum bulundu. En yakın sığınaklar gösteriliyor.',
      'search.failed': 'Arama başarısız. Lütfen tekrar deneyin.',
      'load.error': 'Sığınak verileri yüklenemedi.',
      'ui.km': 'km',
      'ui.capacity': 'Kapasite',
      'ui.km_away': 'km uzakta',
      'ui.nearest': 'En yakın sığınaklar',
      'ui.shelters_near': 'Yakınınızdaki sığınaklar',
    }
  };

  let currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_LANG_KEY)) || 'en';
  let shelters = [];
  let map = null;
  let shelterLayer = null;
  let userMarker = null;
  let shelterMarkersById = {};

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const btnUseLocation = $('#btn-use-location');
  const locationStatus = $('#location-status');
  const searchInput = $('#search-input');
  const btnSearch = $('#btn-search');
  const searchStatus = $('#search-status');
  const mapEl = $('#map');
  const resultsPanel = $('#results-panel');
  const resultsTitle = $('#results-title');
  const resultsList = $('#results-list');
  const btnClosePanel = $('#btn-close-panel');
  const searchSuggestions = $('#search-suggestions');
  const AUTCOMPLETE_DEBOUNCE_MS = 350;
  const MIN_QUERY_LENGTH = 2;
  let autocompleteDebounceTimer = null;
  let lastSuggestionsQuery = '';

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
  }

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
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const titles = { en: 'SAFE.101.CY — Shelters in Cyprus', el: 'SAFE.101.CY — Καταφύγια στην Κύπρο', tr: 'SAFE.101.CY — Kıbrıs\'ta sığınaklar' };
      titleEl.textContent = titles[currentLang] || titles.en;
    }
  }

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'el' && lang !== 'tr') return;
    currentLang = lang;
    try { localStorage.setItem(STORAGE_LANG_KEY, lang); } catch (e) {}
    applyTranslations();
    $$('.lang-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
    loadShelters(lang).then(() => {
      if (map && shelterLayer) viewAllShelters();
    }).catch(() => {});
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
    const file = l === 'el' ? 'shelters_full_el.json' : 'shelters_full_en.json';
    return fetch(file)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load shelter data');
        return r.json();
      })
      .then(data => {
        shelters = (data && data.shelters) ? data.shelters : [];
        return shelters;
      });
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
      shelterMarkersById[s.id] = m;
      bounds.push([s.lat, s.lon]);
    });
    if (bounds.length > 0) map.fitBounds(bounds, { padding: [24, 24], maxZoom: 11 });
    resultsPanel.classList.remove('is-open');
  }

  function addUserMarker(lat, lon) {
    clearUserMarker();
    userMarker = L.marker([lat, lon], {
      icon: L.divIcon({
        className: 'user-location-marker',
        html: '<span class="user-dot"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
    }).addTo(map);
    map.setView([lat, lon], USER_MARKER_ZOOM);
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
    const nearest = getNearest(lat, lon);
    resultsTitle.textContent = title || t('ui.nearest');
    resultsList.innerHTML = nearest.map(s => `
      <li class="result-item" data-lat="${s.lat}" data-lon="${s.lon}">
        <div class="result-address">${escapeHtml(s.address || s.id)}</div>
        <div class="result-meta">${s.distance.toFixed(1)} ${t('ui.km')} · ${t('ui.capacity')} ${escapeHtml(String(s.capacity))} · ${escapeHtml(s.district || '')}</div>
      </li>
    `).join('');

    $$('.result-item', resultsList).forEach(el => {
      el.addEventListener('click', () => {
        const lat = parseFloat(el.dataset.lat);
        const lon = parseFloat(el.dataset.lon);
        map.setView([lat, lon], 17);
        const s = nearest.find(x => x.lat === lat && x.lon === lon);
        if (s) {
          const marker = shelterMarkersById[s.id];
          if (marker && marker.bindPopup) marker.bindPopup(popupContent(s)).openPopup();
        }
      });
    });

    resultsPanel.classList.add('is-open');
    addUserMarker(lat, lon);
  }

  function setLocationLoading(loading) {
    if (!btnUseLocation) return;
    btnUseLocation.disabled = loading;
    btnUseLocation.classList.toggle('is-loading', loading);
  }

  function setSearchLoading(loading) {
    if (!btnSearch) return;
    btnSearch.disabled = loading;
  }

  function useLocation() {
    if (!navigator.geolocation) {
      locationStatus.textContent = t('location.geo_unsupported');
      locationStatus.classList.add('error');
      return;
    }
    locationStatus.textContent = '';
    locationStatus.classList.remove('success', 'error');
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        showNearest(latitude, longitude, t('ui.shelters_near'));
        locationStatus.textContent = t('location.found');
        locationStatus.classList.add('success');
        setLocationLoading(false);
      },
      err => {
        let msg;
        switch (err.code) {
          case err.PERMISSION_DENIED: msg = t('location.error_denied'); break;
          case err.POSITION_UNAVAILABLE: msg = t('location.error_unavailable'); break;
          case err.TIMEOUT: msg = t('location.error_timeout'); break;
          default: msg = t('location.error_default');
        }
        locationStatus.textContent = msg;
        locationStatus.classList.add('error');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
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
    const params = new URLSearchParams({
      q: query + ', Cyprus',
      format: 'json',
      limit: '8',
      countrycodes: 'cy'
    });
    return fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'Accept': 'application/json' }
    }).then(r => r.json());
  }

  function hideSuggestions() {
    if (searchSuggestions) {
      searchSuggestions.classList.remove('is-open');
      searchSuggestions.innerHTML = '';
      if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
    }
  }

  function showSuggestions(results) {
    if (!searchSuggestions) return;
    searchSuggestions.innerHTML = results.slice(0, 8).map((r) => {
      const name = escapeHtml(r.display_name || '');
      return `<li class="search-suggestion-item" role="option" data-lat="${r.lat}" data-lon="${r.lon}" tabindex="-1">${name}</li>`;
    }).join('');
    searchSuggestions.classList.add('is-open');
    if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
    $$('.search-suggestion-item', searchSuggestions).forEach((el, i) => {
      el.addEventListener('click', () => {
        const lat = parseFloat(el.dataset.lat);
        const lon = parseFloat(el.dataset.lon);
        hideSuggestions();
        if (searchInput) searchInput.value = el.textContent;
        showNearest(lat, lon, `${t('results.title')} — ${el.textContent}`);
        searchStatus.textContent = t('search.found');
        searchStatus.classList.remove('error');
        searchStatus.classList.add('success');
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
          hideSuggestions();
          return;
        }
        showSuggestions(results);
      }).catch(() => hideSuggestions());
    }, AUTCOMPLETE_DEBOUNCE_MS);
  }

  function searchAddress() {
    const q = (searchInput && searchInput.value || '').trim();
    if (!q) {
      searchStatus.textContent = t('search.prompt');
      searchStatus.classList.add('error');
      return;
    }
    searchStatus.textContent = '';
    searchStatus.classList.remove('success', 'error');
    setSearchLoading(true);

    geocode(q).then(results => {
      setSearchLoading(false);
      if (!results || results.length === 0) {
        searchStatus.textContent = t('search.no_results');
        searchStatus.classList.add('error');
        return;
      }
      const { lat, lon } = results[0];
      const latN = parseFloat(lat);
      const lonN = parseFloat(lon);
      showNearest(latN, lonN, `${t('results.title')} «${q}»`);
      searchStatus.textContent = t('search.found');
      searchStatus.classList.add('success');
    }).catch(() => {
      setSearchLoading(false);
      searchStatus.textContent = t('search.failed');
      searchStatus.classList.add('error');
    });
  }

  function closeResultsPanel() {
    resultsPanel.classList.remove('is-open');
  }

  if (btnUseLocation) btnUseLocation.addEventListener('click', useLocation);
  if (btnSearch) btnSearch.addEventListener('click', searchAddress);
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (searchSuggestions && searchSuggestions.classList.contains('is-open') && searchSuggestions.querySelector('.search-suggestion-item')) {
          searchSuggestions.querySelector('.search-suggestion-item').click();
        } else {
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
