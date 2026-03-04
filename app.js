/**
 * English Football Central — app.js
 *
 * Aggregates free, publicly available RSS feeds and official YouTube channels.
 * All content credited to and linked from original sources.
 *
 * RSS parsing: rss2json.com (free tier — no API key required for basic usage).
 * YouTube: public RSS feed (no API key needed).
 */

'use strict';

/* ============================================================
   CONFIGURATION
   All source URLs and YouTube channel IDs are declared here.
   Update channel IDs if a channel changes its handle.
   YouTube channel IDs can be found at: youtube.com/@handle → view-source → "channelId"
   ============================================================ */
const CONFIG = {
    /* RSS → JSON proxy endpoint (free, no key needed for basic use) */
    rss2json: 'https://api.rss2json.com/v1/api.json',

    /* News RSS feeds — all English football, free to access */
    newsFeeds: [
        {
            id: 'bbc',
            name: 'BBC Sport',
            badgeClass: 'bbc',
            color: '#cc0000',
            url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
            credit: 'https://www.bbc.co.uk/sport/football',
        },
        {
            id: 'guardian',
            name: 'The Guardian',
            badgeClass: 'guardian',
            color: '#0056a0',
            url: 'https://www.theguardian.com/football/rss',
            credit: 'https://www.theguardian.com/football',
        },
        {
            id: 'sky',
            name: 'Sky Sports',
            badgeClass: 'sky',
            color: '#0b7fd4',
            url: 'https://www.skysports.com/rss/12040',
            credit: 'https://www.skysports.com/football',
        },
    ],

    /* YouTube channel RSS feeds — all official English football channels */
    youtubeChannels: [
        {
            id: 'pl',
            name: 'Premier League',
            badgeClass: 'badge-pl',
            channelId: 'UCqZQlzSHbVJrwrn5XvzrzcA',
            credit: 'https://www.youtube.com/@premierleague',
        },
        {
            id: 'sky',
            name: 'Sky Sports Football',
            badgeClass: 'badge-sky',
            channelId: 'UCNAf1k0yIjyGu3k9BwAg3lg',
            credit: 'https://www.youtube.com/@SkySportsFootball',
        },
        {
            id: 'bbc',
            name: 'BBC Sport',
            badgeClass: 'badge-bbc',
            channelId: 'UCIsmqWETpEBbCj5f_OoFR5g',
            credit: 'https://www.youtube.com/@BBCSport',
        },
        {
            id: 'efl',
            name: 'EFL',
            badgeClass: 'badge-efl',
            channelId: 'UCqoCRxwcPMaHJFy9IWUDYhA',
            credit: 'https://www.youtube.com/@EFL',
        },
        {
            id: 'fa',
            name: 'The FA',
            badgeClass: 'badge-fa',
            channelId: 'UCqoCRxwcPMaHJFy9IWUDYhA', /* update with correct FA channel ID */
            credit: 'https://www.youtube.com/@TheFA',
        },
    ],

    /* Free-to-air UK broadcaster info for the Live tab */
    broadcasters: [
        {
            name: 'BBC iPlayer',
            tagline: 'Free | No subscription',
            logo: '🎬',
            bgColor: '#1a0000',
            headerColor: '#cc0000',
            isFree: true,
            requiresReg: true,
            regNote: 'Free account required',
            coverage: 'FA Cup (selected rounds), England internationals, Match of the Day, MOTD2, Women\'s Super League, EFL highlights.',
            links: [
                { label: 'Watch Live', url: 'https://www.bbc.co.uk/iplayer/live/bbcone', primary: true },
                { label: 'BBC Sport', url: 'https://www.bbc.co.uk/sport/football' },
            ],
        },
        {
            name: 'ITVX',
            tagline: 'Free | No subscription',
            logo: '📡',
            bgColor: '#001a0a',
            headerColor: '#003d00',
            isFree: true,
            requiresReg: true,
            regNote: 'Free account required',
            coverage: 'England internationals, European Championship & World Cup matches, selected FA Cup ties.',
            links: [
                { label: 'Watch Live', url: 'https://www.itv.com/watch/live/itv1', primary: true },
                { label: 'ITVX Football', url: 'https://www.itv.com/sport/football' },
            ],
        },
        {
            name: 'Channel 4',
            tagline: 'Free | No subscription',
            logo: '4️⃣',
            bgColor: '#001a1a',
            headerColor: '#005f5f',
            isFree: true,
            requiresReg: false,
            coverage: 'Occasional England women\'s football, selected international tournaments. Check schedule.',
            links: [
                { label: 'Watch Live', url: 'https://www.channel4.com/now/c4', primary: true },
                { label: 'All 4 Sport', url: 'https://www.channel4.com/sport' },
            ],
        },
        {
            name: 'Sky Sports Mix',
            tagline: 'Free on Freeview / Freesat',
            logo: '📺',
            bgColor: '#00001a',
            headerColor: '#0b7fd4',
            isFree: true,
            requiresReg: false,
            coverage: 'Selected EFL Championship, League One and League Two matches. No subscription needed — free channel on Freeview ch.143, Freesat ch.403.',
            links: [
                { label: 'Sky Sports Mix', url: 'https://www.skysports.com/watch/sky-sports-mix', primary: true },
            ],
        },
        {
            name: 'Premier League on Amazon',
            tagline: 'Some matches free during broadcast window',
            logo: '🏆',
            bgColor: '#001122',
            headerColor: '#ff9900',
            isFree: false,
            requiresReg: true,
            regNote: 'Amazon account (free for broadcast window events)',
            coverage: 'Amazon Prime holds selected PL match rights. During those broadcast windows, Amazon occasionally opens streams without a Prime subscription. Check the PL fixture list.',
            links: [
                { label: 'Amazon PL Page', url: 'https://www.amazon.co.uk/gp/video/storefront/ref=atv_hm_hom_1_c_NJFjSM_brws_2_2?contentType=sports&contentId=sports', primary: true },
            ],
        },
        {
            name: 'YouTube — Official Channels',
            tagline: '100% free',
            logo: '▶️',
            bgColor: '#1a0000',
            headerColor: '#ff0000',
            isFree: true,
            requiresReg: false,
            coverage: 'Premier League, EFL and clubs occasionally stream live matches free on YouTube. Also: full highlight shows, press conferences, training footage.',
            links: [
                { label: 'Premier League', url: 'https://www.youtube.com/@premierleague', primary: true },
                { label: 'EFL', url: 'https://www.youtube.com/@EFL' },
                { label: 'The FA', url: 'https://www.youtube.com/@TheFA' },
            ],
        },
    ],

    /* Sample upcoming free-to-air fixtures (static – update as needed)
       Format: { date, day, month, teams, competition, time, broadcaster, isLive } */
    fixtures: [
        { date: '05', day: 'Fri', month: 'Mar', teams: 'England vs Albania', competition: 'World Cup Qualifier', time: '19:45', broadcaster: 'ITV / ITVX', isLive: false },
        { date: '08', day: 'Mon', month: 'Mar', teams: 'FA Cup 5th Round', competition: 'The FA Cup', time: 'TBC', broadcaster: 'BBC One / iPlayer', isLive: false },
        { date: '12', day: 'Fri', month: 'Mar', teams: 'England vs Latvia', competition: 'World Cup Qualifier', time: '19:45', broadcaster: 'ITV / ITVX', isLive: false },
        { date: '15', day: 'Mon', month: 'Mar', teams: 'Match of the Day', competition: 'Premier League Highlights', time: '22:30', broadcaster: 'BBC One / iPlayer', isLive: false },
        { date: '22', day: 'Sun', month: 'Mar', teams: 'FA Cup Quarter-Final', competition: 'The FA Cup', time: 'TBC', broadcaster: 'BBC One / iPlayer', isLive: false },
        { date: '29', day: 'Sun', month: 'Mar', teams: 'EFL Championship', competition: 'Sky Sports Mix', time: '12:30', broadcaster: 'Sky Sports Mix (Freeview 143)', isLive: false },
    ],

    /* How often to auto-refresh news (ms) */
    refreshInterval: 5 * 60 * 1000, /* 5 minutes */
};

/* ============================================================
   STATE
   ============================================================ */
const state = {
    newsItems: [],
    newsPage: 0,
    newsPageSize: 12,
    activeNewsFilter: 'all',

    hlItems: [],
    activeHlFilter: 'all',

    activeTab: 'news',
    hlLoaded: false,
};

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function timeAgo(dateStr) {
    try {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 2) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch {
        return '';
    }
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractYouTubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
}

/* Build rss2json API URL */
function rss2jsonUrl(feedUrl, count = 20) {
    return `${CONFIG.rss2json}?rss_url=${encodeURIComponent(feedUrl)}&count=${count}`;
}

/* Fetch with timeout */
async function fetchWithTimeout(url, timeoutMs = 10000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: ctrl.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

/* ============================================================
   TAB SWITCHING
   ============================================================ */
function initTabs() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab === state.activeTab) return;

            /* Update buttons */
            document.querySelectorAll('.nav-btn').forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
            });

            /* Update panes */
            document.querySelectorAll('.tab-pane').forEach(pane => {
                const isTarget = pane.id === `tab-${tab}`;
                pane.classList.toggle('active', isTarget);
                pane.hidden = !isTarget;
            });

            state.activeTab = tab;

            /* Lazy-load highlights on first visit */
            if (tab === 'highlights' && !state.hlLoaded) {
                loadHighlights();
            }
        });
    });
}

/* ============================================================
   NEWS
   ============================================================ */
async function loadNews(showSkeleton = true) {
    const grid = document.getElementById('news-grid');
    const updatedEl = document.getElementById('news-updated');
    const refreshBtn = document.getElementById('refresh-btn');

    if (showSkeleton) {
        grid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');
    }
    refreshBtn.classList.add('spinning');

    const results = await Promise.allSettled(
        CONFIG.newsFeeds.map(feed =>
            fetchWithTimeout(rss2jsonUrl(feed.url, 20))
                .then(data => ({ feed, items: data.items || [] }))
        )
    );

    state.newsItems = [];

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            const { feed, items } = result.value;
            items.forEach(item => {
                state.newsItems.push({
                    ...item,
                    _feedId: feed.id,
                    _feedName: feed.name,
                    _feedBadge: feed.badgeClass,
                    _feedCredit: feed.credit,
                    _feedColor: feed.color,
                });
            });
        }
    });

    /* Sort by date descending */
    state.newsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    /* Deduplicate by title */
    const seen = new Set();
    state.newsItems = state.newsItems.filter(item => {
        const key = item.title?.trim().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    refreshBtn.classList.remove('spinning');

    if (state.newsItems.length === 0) {
        grid.innerHTML = `
            <div class="error-state">
                <span class="error-state-icon">📡</span>
                <h3>Could not load news feeds</h3>
                <p>Check your connection or try again shortly. All sources may be temporarily unavailable.</p>
                <button class="retry-btn" onclick="loadNews()">Try again</button>
            </div>`;
        updatedEl.textContent = 'Failed to load';
        return;
    }

    const now = new Date();
    updatedEl.textContent = `Updated ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} · ${state.newsItems.length} stories from ${CONFIG.newsFeeds.length} sources`;

    /* Build source filter chips */
    buildNewsFilters();

    /* Render first page */
    state.newsPage = 0;
    renderNews();

    /* Update ticker */
    updateTicker(state.newsItems.slice(0, 10));
}

function buildNewsFilters() {
    const container = document.getElementById('news-filters');
    const existing = container.querySelectorAll('.filter-chip');
    existing.forEach(el => el.remove());

    const allChip = document.createElement('button');
    allChip.className = 'filter-chip active';
    allChip.dataset.filter = 'all';
    allChip.textContent = 'All';
    allChip.addEventListener('click', () => setNewsFilter('all'));
    container.appendChild(allChip);

    CONFIG.newsFeeds.forEach(feed => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip';
        chip.dataset.filter = feed.id;
        chip.textContent = feed.name;
        chip.addEventListener('click', () => setNewsFilter(feed.id));
        container.appendChild(chip);
    });
}

function setNewsFilter(filterId) {
    state.activeNewsFilter = filterId;
    state.newsPage = 0;

    document.querySelectorAll('#news-filters .filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === filterId);
    });

    renderNews();
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    const loadMoreBtn = document.getElementById('news-load-more');

    const filtered = state.activeNewsFilter === 'all'
        ? state.newsItems
        : state.newsItems.filter(item => item._feedId === state.activeNewsFilter);

    const start = state.newsPage * state.newsPageSize;
    const end = start + state.newsPageSize;
    const page = filtered.slice(start, end);

    if (state.newsPage === 0) {
        grid.innerHTML = '';
    }

    if (page.length === 0 && state.newsPage === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <span class="empty-state-icon">🔍</span>
                <h3>No stories found</h3>
                <p>Try a different source filter.</p>
            </div>`;
        loadMoreBtn.style.display = 'none';
        return;
    }

    page.forEach(item => {
        const card = buildNewsCard(item);
        grid.appendChild(card);
    });

    const hasMore = end < filtered.length;
    loadMoreBtn.style.display = hasMore ? 'inline-block' : 'none';
}

function buildNewsCard(item) {
    const article = document.createElement('article');
    article.className = 'news-card';

    const thumb = item.thumbnail || item.enclosure?.link;
    const snippet = stripHtml(item.description || item.content || '').slice(0, 160);
    const link = escHtml(item.link || item.guid || '#');
    const title = escHtml(item.title || 'Untitled');

    let thumbHtml;
    if (thumb && thumb.startsWith('http')) {
        thumbHtml = `<img class="news-thumb" src="${escHtml(thumb)}" alt="" loading="lazy" onerror="this.parentNode.innerHTML='<div class=\\'news-thumb-placeholder\\'>⚽</div>'">`;
    } else {
        thumbHtml = `<div class="news-thumb-placeholder">⚽</div>`;
    }

    article.innerHTML = `
        ${thumbHtml}
        <div class="news-body">
            <div class="news-source-row">
                <span class="source-badge ${item._feedBadge || 'default'}">${escHtml(item._feedName)}</span>
                <span class="news-date">${timeAgo(item.pubDate)}</span>
            </div>
            <h3 class="news-title">${title}</h3>
            ${snippet ? `<p class="news-snippet">${escHtml(snippet)}</p>` : ''}
            <a class="news-read-more" href="${link}" target="_blank" rel="noopener noreferrer">
                Read on ${escHtml(item._feedName)} →
            </a>
        </div>`;

    return article;
}

/* Load more handler */
document.getElementById('news-load-more').addEventListener('click', () => {
    state.newsPage++;
    renderNews();
});

/* ============================================================
   TICKER
   ============================================================ */
function updateTicker(items) {
    if (!items || items.length === 0) return;
    const el = document.getElementById('ticker-content');
    const text = items
        .map(item => `${item._feedName.toUpperCase()}: ${item.title || ''}`)
        .join('   ·   ');
    el.textContent = text;
    /* Restart animation */
    el.style.animation = 'none';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.animation = '';
        });
    });
}

/* ============================================================
   HIGHLIGHTS (YouTube RSS via rss2json)
   ============================================================ */
async function loadHighlights() {
    state.hlLoaded = true;
    const grid = document.getElementById('highlights-grid');
    grid.innerHTML = Array(6).fill('<div class="skeleton-card video-skeleton"></div>').join('');

    const results = await Promise.allSettled(
        CONFIG.youtubeChannels.map(ch => {
            const ytFeed = `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.channelId}`;
            return fetchWithTimeout(rss2jsonUrl(ytFeed, 10))
                .then(data => ({ channel: ch, items: data.items || [] }));
        })
    );

    state.hlItems = [];

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            const { channel, items } = result.value;
            items.forEach(item => {
                const videoId = extractYouTubeId(item.link || item.guid || '');
                if (videoId) {
                    state.hlItems.push({ ...item, _channel: channel, _videoId: videoId });
                }
            });
        }
    });

    /* Sort by date */
    state.hlItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    /* Build channel filter */
    buildHlFilters();

    if (state.hlItems.length === 0) {
        grid.innerHTML = `
            <div class="error-state">
                <span class="error-state-icon">🎬</span>
                <h3>Could not load highlights</h3>
                <p>YouTube RSS may be temporarily unavailable. Try refreshing, or visit the channels directly.</p>
                <a href="https://www.youtube.com/@premierleague" target="_blank" rel="noopener noreferrer" class="retry-btn" style="display:inline-block;margin-top:12px">Premier League on YouTube →</a>
            </div>`;
        return;
    }

    renderHighlights();
}

function buildHlFilters() {
    const container = document.getElementById('hl-filters');
    const existing = container.querySelectorAll('.filter-chip');
    existing.forEach(el => el.remove());

    const allChip = document.createElement('button');
    allChip.className = 'filter-chip active';
    allChip.dataset.filter = 'all';
    allChip.textContent = 'All';
    allChip.addEventListener('click', () => setHlFilter('all'));
    container.appendChild(allChip);

    /* Only show channels that returned data */
    const presentChannels = [...new Set(state.hlItems.map(i => i._channel.id))];
    CONFIG.youtubeChannels.filter(ch => presentChannels.includes(ch.id)).forEach(ch => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip';
        chip.dataset.filter = ch.id;
        chip.textContent = ch.name;
        chip.addEventListener('click', () => setHlFilter(ch.id));
        container.appendChild(chip);
    });
}

function setHlFilter(filterId) {
    state.activeHlFilter = filterId;
    document.querySelectorAll('#hl-filters .filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === filterId);
    });
    renderHighlights();
}

function renderHighlights() {
    const grid = document.getElementById('highlights-grid');
    const items = state.activeHlFilter === 'all'
        ? state.hlItems
        : state.hlItems.filter(i => i._channel.id === state.activeHlFilter);

    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🔍</span><h3>No videos found</h3><p>Try a different channel filter.</p></div>`;
        return;
    }

    items.forEach(item => {
        const card = buildHlCard(item);
        grid.appendChild(card);
    });
}

function buildHlCard(item) {
    const div = document.createElement('div');
    div.className = 'hl-card';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `Play: ${item.title || 'Video'}`);

    const thumb = `https://img.youtube.com/vi/${item._videoId}/mqdefault.jpg`;
    const title = escHtml(item.title || 'Watch video');
    const ch = item._channel;

    div.innerHTML = `
        <div class="hl-thumb-wrap">
            <img class="hl-thumb" src="${escHtml(thumb)}" alt="" loading="lazy">
            <div class="hl-play-btn" aria-hidden="true">
                <svg viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#cc0000"/>
                    <path d="M45 24 27 14v20" fill="#fff"/>
                </svg>
            </div>
        </div>
        <div class="hl-body">
            <div class="hl-source-row">
                <span class="hl-channel-badge ${ch.badgeClass}">${escHtml(ch.name)}</span>
                <span class="hl-date">${timeAgo(item.pubDate)}</span>
            </div>
            <p class="hl-title">${title}</p>
        </div>`;

    /* Open modal on click / keyboard */
    const openModal = () => openVideoModal(item._videoId, item.title || '', ch);
    div.addEventListener('click', openModal);
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } });

    return div;
}

/* ============================================================
   VIDEO MODAL
   ============================================================ */
const modalOverlay = document.getElementById('modal-overlay');
const modalIframe  = document.getElementById('modal-iframe');
const modalMeta    = document.getElementById('modal-meta');
const modalClose   = document.getElementById('modal-close');

function openVideoModal(videoId, title, channel) {
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    modalIframe.src = embedUrl;
    modalMeta.innerHTML = `
        <h4>${escHtml(title)}</h4>
        <p>Source: <a href="${escHtml(channel.credit)}" target="_blank" rel="noopener noreferrer">${escHtml(channel.name)}</a> on YouTube &mdash; all rights reserved to the original publisher.</p>`;
    modalOverlay.hidden = false;
    modalOverlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
}

function closeVideoModal() {
    modalIframe.src = '';
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeVideoModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeVideoModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modalOverlay.hidden) closeVideoModal(); });

/* ============================================================
   LIVE TAB — broadcasters & schedule
   ============================================================ */
function renderBroadcasters() {
    const grid = document.getElementById('broadcasters-grid');
    grid.innerHTML = '';

    CONFIG.broadcasters.forEach(b => {
        const card = document.createElement('div');
        card.className = 'broadcaster-card';
        card.style.background = b.bgColor;

        const linksHtml = b.links.map(l =>
            `<a href="${escHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="broadcaster-link${l.primary ? ' primary-link' : ''}">${escHtml(l.label)} ↗</a>`
        ).join('');

        const badgeHtml = b.isFree
            ? `<span class="broadcaster-free-badge">✓ FREE</span>`
            : '';

        const regHtml = b.requiresReg
            ? `<span class="broadcaster-reg-badge">&#9432; ${escHtml(b.regNote || 'Account needed')}</span>`
            : '';

        card.innerHTML = `
            <div class="broadcaster-header" style="background:${escHtml(b.headerColor)}20; border-bottom:1px solid ${escHtml(b.headerColor)}40;">
                <div class="broadcaster-logo">${b.logo}</div>
                <div>
                    <div class="broadcaster-name">${escHtml(b.name)}</div>
                    <div class="broadcaster-tagline">${escHtml(b.tagline)}</div>
                </div>
            </div>
            <div class="broadcaster-body">
                <div style="display:flex;gap:6px;flex-wrap:wrap;">${badgeHtml}${regHtml}</div>
                <p class="broadcaster-coverage">${escHtml(b.coverage)}</p>
                <div class="broadcaster-links">${linksHtml}</div>
            </div>`;

        grid.appendChild(card);
    });
}

function renderSchedule() {
    const grid = document.getElementById('schedule-grid');
    grid.innerHTML = '';

    CONFIG.fixtures.forEach(f => {
        const card = document.createElement('div');
        card.className = 'fixture-card';
        const liveBadge = f.isLive ? '<span class="fixture-live-badge">LIVE</span>' : '';

        card.innerHTML = `
            <div class="fixture-date-col">
                <div class="fixture-day">${escHtml(f.day)}</div>
                <div class="fixture-date">${escHtml(f.date)}</div>
                <div class="fixture-month">${escHtml(f.month)}</div>
            </div>
            <div class="fixture-info">
                <div class="fixture-teams">${escHtml(f.teams)}</div>
                <div class="fixture-comp">${escHtml(f.competition)}</div>
            </div>
            <div class="fixture-meta">
                ${liveBadge}
                <div class="fixture-time">${escHtml(f.time)}</div>
                <div class="fixture-broadcaster">${escHtml(f.broadcaster)}</div>
            </div>`;

        grid.appendChild(card);
    });
}

/* ============================================================
   REFRESH BUTTON
   ============================================================ */
document.getElementById('refresh-btn').addEventListener('click', () => {
    if (state.activeTab === 'news') {
        loadNews();
    } else if (state.activeTab === 'highlights') {
        state.hlLoaded = false;
        loadHighlights();
    }
});

/* ============================================================
   FOOTER YEAR
   ============================================================ */
document.getElementById('footer-year').textContent = new Date().getFullYear();

/* ============================================================
   AUTO-REFRESH
   ============================================================ */
setInterval(() => {
    if (state.activeTab === 'news') {
        loadNews(false); /* silent refresh */
    }
}, CONFIG.refreshInterval);

/* ============================================================
   INIT
   ============================================================ */
function init() {
    initTabs();
    renderBroadcasters();
    renderSchedule();
    loadNews();
}

/* Run after DOM is ready */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
