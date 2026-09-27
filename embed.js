/*!
 * TF Widgets — Business Hours v2
 * Встраивание: <script src=".../embed.js" data-id="CLIENT_ID"></script>
 * Конфиг клиента: configs/CLIENT_ID.json (формат v1 поддерживается, все новые поля необязательные)
 * Классы и CSS-переменные: префикс bhw- (общий для всех виджетов TF Widgets).
 * Все стили этого виджета ограничены классом .bhw-bh, чтобы не спорить с другими виджетами на странице.
 */
(function () {
    'use strict';
    var VERSION = '2.0.0';
    var LOG = '[TFW Hours]';
    // Где работает живое превью BHWBusinessHours.render() (конфигуратор на сайте)
    var PREVIEW_DOMAINS = ['tf-widgets.com', '*.tf-widgets.com', '9ac5za-h1.myshopify.com'];

    /* Тексты на разных языках. {time} — время, {day} — день недели */
    var I18N = {
        en: { open: 'Open now', closed: 'Closed', closesAt: 'Closes at {time}', closesSoon: 'Closes soon', opensToday: 'Opens today at {time}', opensTomorrow: 'Opens tomorrow at {time}', opensDay: 'Opens {day} at {time}', today: 'Today', closedDay: 'Closed', allDay: 'Open 24 hours', localTime: 'Local time', special: 'Special hours', hours: 'Opening hours' },
        es: { open: 'Abierto ahora', closed: 'Cerrado', closesAt: 'Cierra a las {time}', closesSoon: 'Cierra pronto', opensToday: 'Abre hoy a las {time}', opensTomorrow: 'Abre mañana a las {time}', opensDay: 'Abre el {day} a las {time}', today: 'Hoy', closedDay: 'Cerrado', allDay: 'Abierto 24 horas', localTime: 'Hora local', special: 'Horario especial', hours: 'Horario' },
        fr: { open: 'Ouvert', closed: 'Fermé', closesAt: 'Ferme à {time}', closesSoon: 'Ferme bientôt', opensToday: 'Ouvre aujourd’hui à {time}', opensTomorrow: 'Ouvre demain à {time}', opensDay: 'Ouvre {day} à {time}', today: 'Aujourd’hui', closedDay: 'Fermé', allDay: 'Ouvert 24 h/24', localTime: 'Heure locale', special: 'Horaires exceptionnels', hours: 'Horaires' },
        de: { open: 'Jetzt geöffnet', closed: 'Geschlossen', closesAt: 'Schließt um {time}', closesSoon: 'Schließt bald', opensToday: 'Öffnet heute um {time}', opensTomorrow: 'Öffnet morgen um {time}', opensDay: 'Öffnet am {day} um {time}', today: 'Heute', closedDay: 'Geschlossen', allDay: '24 Stunden geöffnet', localTime: 'Ortszeit', special: 'Sonderöffnungszeiten', hours: 'Öffnungszeiten' },
        it: { open: 'Aperto ora', closed: 'Chiuso', closesAt: 'Chiude alle {time}', closesSoon: 'Chiude a breve', opensToday: 'Apre oggi alle {time}', opensTomorrow: 'Apre domani alle {time}', opensDay: 'Apre {day} alle {time}', today: 'Oggi', closedDay: 'Chiuso', allDay: 'Aperto 24 ore', localTime: 'Ora locale', special: 'Orari speciali', hours: 'Orari' },
        nl: { open: 'Nu open', closed: 'Gesloten', closesAt: 'Sluit om {time}', closesSoon: 'Sluit binnenkort', opensToday: 'Opent vandaag om {time}', opensTomorrow: 'Opent morgen om {time}', opensDay: 'Opent {day} om {time}', today: 'Vandaag', closedDay: 'Gesloten', allDay: '24 uur open', localTime: 'Lokale tijd', special: 'Afwijkende openingstijden', hours: 'Openingstijden' },
        pt: { open: 'Aberto agora', closed: 'Fechado', closesAt: 'Fecha às {time}', closesSoon: 'Fecha em breve', opensToday: 'Abre hoje às {time}', opensTomorrow: 'Abre amanhã às {time}', opensDay: 'Abre {day} às {time}', today: 'Hoje', closedDay: 'Fechado', allDay: 'Aberto 24 horas', localTime: 'Hora local', special: 'Horário especial', hours: 'Horário' },
        pl: { open: 'Teraz otwarte', closed: 'Zamknięte', closesAt: 'Zamykamy o {time}', closesSoon: 'Wkrótce zamykamy', opensToday: 'Otwieramy dziś o {time}', opensTomorrow: 'Otwieramy jutro o {time}', opensDay: 'Otwarcie: {day}, {time}', today: 'Dzisiaj', closedDay: 'Zamknięte', allDay: 'Czynne całą dobę', localTime: 'Czas lokalny', special: 'Godziny specjalne', hours: 'Godziny otwarcia' },
        cs: { open: 'Otevřeno', closed: 'Zavřeno', closesAt: 'Zavíráme v {time}', closesSoon: 'Brzy zavíráme', opensToday: 'Otevíráme dnes v {time}', opensTomorrow: 'Otevíráme zítra v {time}', opensDay: 'Otevíráme: {day} v {time}', today: 'Dnes', closedDay: 'Zavřeno', allDay: 'Otevřeno nonstop', localTime: 'Místní čas', special: 'Mimořádná otevírací doba', hours: 'Otevírací doba' },
        sk: { open: 'Otvorené', closed: 'Zatvorené', closesAt: 'Zatvárame o {time}', closesSoon: 'Čoskoro zatvárame', opensToday: 'Otvárame dnes o {time}', opensTomorrow: 'Otvárame zajtra o {time}', opensDay: 'Otvárame: {day} o {time}', today: 'Dnes', closedDay: 'Zatvorené', allDay: 'Otvorené nonstop', localTime: 'Miestny čas', special: 'Mimoriadne otváracie hodiny', hours: 'Otváracie hodiny' }
    };

    var inlineCSS = `
        .bhw-bh { font-family: var(--bhw-font, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif); -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        .bhw-bh *, .bhw-bh *::before, .bhw-bh *::after { box-sizing: border-box; }
        .bhw-bh.bhw-container { width: 100%; max-width: var(--bhw-max-width, 400px); margin: var(--bhw-margin, 20px auto); }
        .bhw-bh .bhw-widget {
            position: relative; overflow: hidden; isolation: isolate; text-align: left;
            background: var(--bhw-bg, #ffffff); color: var(--bhw-text-color, #111111);
            border: 1px solid var(--bhw-widget-border, rgba(0,0,0,.07));
            border-radius: var(--bhw-widget-radius, 22px);
            padding: var(--bhw-padding, 26px);
            box-shadow: var(--bhw-shadow, 0 24px 60px -24px rgba(0,0,0,.3));
            font-size: var(--bhw-font-size, 15px); line-height: 1.45;
        }
        .bhw-bh .bhw-widget::before { content: none; }
        .bhw-bh.bhw-legacy .bhw-widget::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.15) 0%, transparent 50%); }

        .bhw-bh .bhw-header { display: flex; align-items: center; gap: 14px; margin: 0 0 18px; }
        .bhw-bh .bhw-icon { flex: none; display: grid; place-items: center; width: 48px; height: 48px; border-radius: calc(var(--bhw-block-radius, 14px) + 2px); background: var(--bhw-soft, rgba(0,0,0,.05)); font-size: 1.5em; line-height: 1; }
        .bhw-bh .bhw-logo { flex: none; display: block; max-width: 120px; max-height: 44px; object-fit: contain; }
        .bhw-bh .bhw-head-txt { min-width: 0; display: grid; gap: 6px; }
        .bhw-bh .bhw-business-name { margin: 0; padding: 0; font-family: inherit; font-size: var(--bhw-name-size, 1.25em); font-weight: 800; line-height: 1.2; letter-spacing: -.02em; text-shadow: var(--bhw-text-shadow, none); }
        .bhw-bh .bhw-status-line { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin: 0; }
        .bhw-bh .bhw-status-badge {
            display: inline-flex; align-items: center; gap: 7px; padding: 5px 11px 5px 9px; border-radius: 999px;
            font-size: .8em; font-weight: 700; letter-spacing: .01em; white-space: nowrap;
            color: var(--bhw-open, #16a34a); background: color-mix(in srgb, var(--bhw-open, #16a34a) 13%, transparent);
        }
        .bhw-bh .bhw-status-badge::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 0 currentColor; animation: bhw-bh-ping 2s ease-out infinite; }
        .bhw-bh .bhw-status-badge.closed { color: var(--bhw-closed, #dc2626); background: color-mix(in srgb, var(--bhw-closed, #dc2626) 12%, transparent); }
        .bhw-bh .bhw-status-badge.closed::before { animation: none; }
        .bhw-bh .bhw-status-badge.soon { color: var(--bhw-soon, #d97706); background: color-mix(in srgb, var(--bhw-soon, #d97706) 14%, transparent); }
        .bhw-bh .bhw-status-detail { font-size: .86em; opacity: .72; }

        .bhw-bh .bhw-notice { margin: 0 0 16px; padding: 10px 12px; border-radius: var(--bhw-block-radius, 14px); font-size: .86em; font-weight: 600; background: color-mix(in srgb, var(--bhw-accent, #16a34a) 11%, transparent); border: 1px solid color-mix(in srgb, var(--bhw-accent, #16a34a) 30%, transparent); }

        .bhw-bh .bhw-hours-table { margin: 0; padding: 6px; border-radius: var(--bhw-block-radius, 14px); background: var(--bhw-table-bg, rgba(0,0,0,.035)); color: var(--bhw-table-text, inherit); }
        .bhw-bh .bhw-hours-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 9px 12px; border-radius: calc(var(--bhw-block-radius, 14px) - 4px); }
        .bhw-bh .bhw-hours-row + .bhw-hours-row { box-shadow: inset 0 1px 0 var(--bhw-row-line, rgba(0,0,0,.06)); }
        .bhw-bh .bhw-hours-row.current-day { background: var(--bhw-today-bg, #ffffff); box-shadow: 0 6px 18px -10px rgba(0,0,0,.35); font-weight: 700; }
        .bhw-bh .bhw-hours-row.current-day + .bhw-hours-row { box-shadow: none; }
        .bhw-bh .bhw-day-name { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; white-space: nowrap; }
        .bhw-bh .bhw-today-tag { font-size: .7em; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; padding: 2px 7px; border-radius: 999px; color: var(--bhw-accent, #16a34a); background: color-mix(in srgb, var(--bhw-accent, #16a34a) 13%, transparent); }
        .bhw-bh .bhw-hours-time { font-family: var(--bhw-value-font, inherit); font-variant-numeric: tabular-nums; text-align: right; opacity: .85; }
        .bhw-bh .bhw-hours-row.current-day .bhw-hours-time { opacity: 1; }
        .bhw-bh .bhw-hours-time.closed { color: var(--bhw-closed, #dc2626); opacity: 1; font-weight: 600; }
        .bhw-bh .bhw-special { margin: 14px 0 0; }
        .bhw-bh .bhw-special-title { margin: 0 0 6px; font-size: .72em; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; opacity: .6; }
        .bhw-bh .bhw-special .bhw-hours-row { padding: 6px 2px; box-shadow: none; font-size: .9em; }
        .bhw-bh .bhw-special-note { opacity: .6; font-weight: 500; }
        .bhw-bh .bhw-closing-info { margin: 14px 0 0; padding: 10px 12px; border-radius: var(--bhw-block-radius, 14px); text-align: center; font-weight: 700; background: rgba(255,255,255,.2); }
        .bhw-bh .bhw-timezone-info { margin: 14px 0 0; font-size: .8em; opacity: .6; text-align: center; }

        /* v1-вид: всё по центру, плашка статуса сплошным цветом */
        .bhw-bh.bhw-legacy .bhw-header { flex-direction: column; text-align: center; }
        .bhw-bh.bhw-legacy .bhw-head-txt { justify-items: center; gap: 12px; }
        .bhw-bh.bhw-legacy .bhw-status-line { justify-content: center; }
        .bhw-bh.bhw-legacy .bhw-status-badge { padding: 8px 16px; font-size: .9em; }
        .bhw-bh.bhw-legacy .bhw-status-badge.bhw-has-icon::before { display: none; }
        .bhw-bh.bhw-legacy .bhw-status-detail { opacity: .9; font-weight: 600; }

        /* minimal: одна строка статуса, часы раскрываются */
        .bhw-bh.bhw-minimal .bhw-widget { padding: var(--bhw-padding-min, 14px 16px); }
        .bhw-bh.bhw-minimal .bhw-header { margin: 0; gap: 12px; }
        .bhw-bh.bhw-minimal .bhw-icon { width: 38px; height: 38px; font-size: 1.2em; }
        .bhw-bh.bhw-minimal .bhw-logo { max-height: 32px; max-width: 90px; }
        .bhw-bh.bhw-minimal .bhw-business-name { font-size: calc(var(--bhw-name-size, 1.25em) * .8); }
        .bhw-bh .bhw-toggle {
            flex: none; margin: 0 0 0 auto; padding: 8px 12px; min-height: 0; border: 0; border-radius: 999px; cursor: pointer;
            display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: .82em; font-weight: 700;
            background: var(--bhw-soft, rgba(0,0,0,.05)); color: inherit; box-shadow: none;
        }
        .bhw-bh .bhw-toggle svg { width: 14px; height: 14px; transition: transform .25s; }
        .bhw-bh.bhw-expanded .bhw-toggle svg { transform: rotate(180deg); }
        .bhw-bh.bhw-minimal .bhw-body { display: none; }
        .bhw-bh.bhw-minimal.bhw-expanded .bhw-body { display: block; margin: 14px 0 0; animation: bhw-bh-in .3s ease; }
        .bhw-bh .bhw-toggle:focus-visible { outline: 2px solid var(--bhw-accent, #16a34a); outline-offset: 2px; }

        @keyframes bhw-bh-ping { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 55%, transparent); } 80%, 100% { box-shadow: 0 0 0 7px transparent; } }
        @keyframes bhw-bh-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        @media (max-width: 480px) {
            .bhw-bh.bhw-container { margin: var(--bhw-margin-mobile, 16px auto); }
            .bhw-bh .bhw-widget { padding: var(--bhw-padding-mobile, 20px); }
            .bhw-bh .bhw-hours-row { padding: 9px 10px; }
        }
        @media (prefers-reduced-motion: reduce) { .bhw-bh *, .bhw-bh *::before { animation: none !important; transition: none !important; } }

        /* защита от тем сайта, которые красят весь текст через color: ... !important */
        .bhw-bh .bhw-widget { color: var(--bhw-text-color, #111) !important; }
        .bhw-bh .bhw-widget :where(*) { color: inherit !important; }
        .bhw-bh .bhw-widget .bhw-hours-table { color: var(--bhw-table-text, inherit) !important; }
        .bhw-bh .bhw-widget .bhw-status-badge { color: var(--bhw-open, #16a34a) !important; }
        .bhw-bh .bhw-widget .bhw-status-badge.closed, .bhw-bh .bhw-widget .bhw-hours-time.closed { color: var(--bhw-closed, #dc2626) !important; }
        .bhw-bh .bhw-widget .bhw-status-badge.soon { color: var(--bhw-soon, #d97706) !important; }
        .bhw-bh .bhw-widget .bhw-today-tag { color: var(--bhw-accent, #16a34a) !important; }
        .bhw-bh.bhw-legacy .bhw-widget .bhw-status-badge { color: #fff !important; background: var(--bhw-open, #16a34a); }
        .bhw-bh.bhw-legacy .bhw-widget .bhw-status-badge.closed { color: #fff !important; background: var(--bhw-closed, #ef4444); }
        .bhw-bh.bhw-legacy .bhw-widget .bhw-status-badge.soon { color: #fff !important; background: var(--bhw-soon, #d97706); }
    `;

    var CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 15.6 5.3 8.9l1.4-1.4 5.3 5.3 5.3-5.3 1.4 1.4z"/></svg>';

    /* =========================================================
       ПУБЛИЧНЫЕ API
       ========================================================= */
    window.BusinessHoursWidgets = window.BusinessHoursWidgets || {};
    window.BusinessHoursWidgets.businessHours = window.BusinessHoursWidgets.businessHours || {};

    // Живое превью для конфигуратора: BHWBusinessHours.render(container, config) -> { update, setState, destroy }
    // setState('live' | 'open' | 'soon' | 'closed') — показать нужный статус независимо от текущего времени
    var api = window.BHWBusinessHours = window.BHWBusinessHours || {};
    api.version = VERSION;
    api.defaults = getDefaultConfig;
    api.checkAccess = bhwCheckAccess;
    api.i18n = I18N;
    api.render = function (container, config) {
        var noop = { destroy: function () {}, update: function () {}, setState: function () {} };
        if (!bhwCheckAccess({ domains: PREVIEW_DOMAINS }).ok) { console.warn(LOG, 'preview is only available on tf-widgets.com'); return noop; }
        injectBaseStyles();
        if (container._bhwBhDestroy) container._bhwBhDestroy();
        var cls = container.__bhwBhClass || (container.__bhwBhClass = 'bhw-bh-preview-' + Math.random().toString(36).slice(2, 8));
        var widget = null, st = 'live', cfgRaw = config || {};
        function build() {
            var expanded = widget ? widget.root.classList.contains('bhw-expanded') : true;
            if (widget) widget.destroy();
            widget = mountWidget(normalizeConfig(cfgRaw), cls, 'preview', { inline: container, force: st === 'live' ? null : st, expanded: expanded });
        }
        build();
        var ctrl = {
            update: function (cfg) { cfgRaw = cfg || {}; build(); },
            setState: function (s) { st = s || 'live'; build(); },
            destroy: function () { if (widget) widget.destroy(); widget = null; container._bhwBhDestroy = null; }
        };
        container._bhwBhDestroy = ctrl.destroy;
        return ctrl;
    };

    /* =========================================================
       АВТОЗАПУСК ПО <script data-id="..."> (только свой тег)
       ========================================================= */
    try {
        var currentScript = document.currentScript || (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        if (currentScript && currentScript.dataset && currentScript.dataset.id && currentScript.dataset.bhwMounted !== '1') {
            currentScript.dataset.bhwMounted = '1';
            var debug = currentScript.dataset.debug === '1';
            var clientId = normalizeId(currentScript.dataset.id);
            var baseUrl = getBasePath(currentScript.src);
            loadConfig(clientId, baseUrl)
                .then(function (fetched) {
                    var access = bhwCheckAccess(fetched);
                    if (!access.ok) {
                        console.warn(LOG, 'widget "' + clientId + '" is not active on ' + (location.hostname || 'this page') + ': ' + access.reason);
                        return;
                    }
                    injectBaseStyles();
                    var cfg = normalizeConfig(fetched);
                    if (debug) console.log(LOG, 'config "' + clientId + '":', cfg);
                    var mount = function () {
                        var w = mountWidget(cfg, 'bhw-bh-' + clientId.replace(/[^a-z0-9_-]/gi, '') + '-' + Date.now(), clientId, { anchor: currentScript });
                        window.BusinessHoursWidgets.businessHours[clientId] = w;
                    };
                    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
                })
                .catch(function (error) {
                    // Нет конфига = нет виджета
                    console.warn(LOG, 'config "' + clientId + '" not loaded:', error.message);
                });
        }
    } catch (error) {
        console.error(LOG, 'critical error:', error);
    }

    /* =========================================================
       ФУНКЦИИ
       ========================================================= */
    function injectBaseStyles() {
        if (!document.getElementById('business-hours-widget-styles-v2')) {
            var style = document.createElement('style');
            style.id = 'business-hours-widget-styles-v2';
            style.textContent = inlineCSS;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    /* ---------------------------------------------------------
       ДОСТУП (общий блок для всех виджетов TF Widgets — копировать без изменений)
       В конфиге клиента:
         "active": true,                       // false = виджет выключен (например, подписка отменена)
         "domains": ["client.com", "client-shop.myshopify.com", "*.client.com"]
       "client.com" разрешает client.com и www.client.com,
       "*.client.com" — любые поддомены (shop.client.com и т.д.).
       Без списка domains виджет не запускается.
       На localhost и при открытии файла с компьютера работает всегда (для тестов).
       --------------------------------------------------------- */
    function bhwCheckAccess(config) {
        config = config || {};
        if (config.active === false) return { ok: false, reason: 'widget is switched off ("active": false)' };
        var host = String(location.hostname || '').toLowerCase().replace(/^www\./, '');
        if (!host || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') return { ok: true };
        var list = config.domains;
        if (typeof list === 'string') list = list.split(/[\s,]+/);
        if (!Array.isArray(list) || !list.length) return { ok: false, reason: 'no "domains" in config' };
        for (var i = 0; i < list.length; i++) {
            var d = String(list[i] || '').trim().toLowerCase()
                .replace(/^[a-z]+:\/\//, '').replace(/[\/:].*$/, '').replace(/^www\./, '');
            if (!d) continue;
            if (d.indexOf('*.') === 0) {
                var base = d.slice(2);
                if (host === base || host.slice(-(base.length + 1)) === '.' + base) return { ok: true };
            } else if (host === d) {
                return { ok: true };
            }
        }
        return { ok: false, reason: 'domain is not in "domains"' };
    }

    function normalizeId(id) { return String(id || 'demo').replace(/\.(json|js)$/i, ''); }
    function getBasePath(src) {
        if (!src) return './';
        try { var url = new URL(src, location.href); return url.origin + url.pathname.replace(/\/[^\/]*$/, '/'); }
        catch (error) { return './'; }
    }
    function loadConfig(clientId, baseUrl) {
        if (clientId === 'local') {
            var el = document.querySelector('#bhw-local-config');
            if (!el) return Promise.reject(new Error('#bhw-local-config not found'));
            try { return Promise.resolve(JSON.parse(el.textContent)); } catch (e) { return Promise.reject(e); }
        }
        var url = baseUrl + 'configs/' + encodeURIComponent(clientId) + '.json?v=' + Date.now();
        return fetch(url, { cache: 'no-store', headers: { 'Accept': 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    }

    function getDefaultConfig() {
        return {
            layout: 'card',                 // card — вся таблица; minimal — строка статуса, часы раскрываются
            businessName: 'Opening hours',
            icon: '',
            logo: '',
            notice: '',                     // объявление сверху, например "Closed 24–26 Dec"
            timezone: '',                   // "Europe/Prague" (с переходом на летнее время) или старый формат "+1"
            locale: 'en',                   // en es fr de it nl pt pl cs sk
            timeFormat: '24h',              // 24h | 12h
            weekStart: 'mon',               // mon | sun
            groupDays: false,               // Mon – Fri 09:00 – 17:00 одной строкой
            showTimezone: false,
            closingSoonMinutes: 30,
            // по дням недели, 0 = воскресенье; второй интервал (обед) — open2/close2
            hours: [
                { closed: true },
                { open: '09:00', close: '18:00' },
                { open: '09:00', close: '18:00' },
                { open: '09:00', close: '18:00' },
                { open: '09:00', close: '18:00' },
                { open: '09:00', close: '18:00' },
                { open: '10:00', close: '14:00' }
            ],
            specialDays: [],                // [{ "date": "2026-12-24", "closed": true, "note": "Christmas Eve" }]
            labels: {},
            style: {
                fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
                valueFontFamily: 'inherit',
                colors: {
                    background: '#ffffff',
                    text: '#111111',
                    accent: '#16a34a',
                    open: '#16a34a',
                    soon: '#d97706',
                    closed: '#dc2626',
                    widgetBorder: 'rgba(0, 0, 0, 0.07)',
                    tableBackground: 'rgba(0, 0, 0, 0.035)',
                    tableText: 'inherit',
                    todayBackground: '#ffffff',
                    rowLine: 'rgba(0, 0, 0, 0.06)',
                    soft: 'rgba(0, 0, 0, 0.05)'
                },
                borderRadius: { widget: 22, blocks: 14 },
                sizes: { fontSize: 1, padding: 26, width: 400 },
                shadow: { widget: '0 24px 60px -24px rgba(0, 0, 0, 0.3)', text: 'none' }
            }
        };
    }

    /* v1-конфиг (градиент primaryColor → secondaryColor, белый текст) выглядит как задумано */
    function normalizeConfig(raw) {
        raw = raw || {};
        var legacy = !raw.layout;
        var base = getDefaultConfig();
        if (legacy) {
            var s1 = raw.styling || {};
            var p = s1.primaryColor || '#667eea', q = s1.secondaryColor || '#764ba2';
            var c = base.style.colors;
            c.background = s1.backgroundColor || ('linear-gradient(135deg, ' + p + ' 0%, ' + q + ' 100%)');
            c.text = s1.textColor || '#ffffff'; c.accent = p; c.open = '#16a34a'; c.soon = '#d97706'; c.closed = '#ef4444';
            c.widgetBorder = 'transparent'; c.tableBackground = 'rgba(255, 255, 255, 0.95)'; c.tableText = '#333333';
            c.todayBackground = '#ffffff'; c.rowLine = 'rgba(0, 0, 0, 0.08)'; c.soft = 'rgba(255, 255, 255, 0.2)';
            base.style.borderRadius = { widget: parseFloat(s1.borderRadius) || 20, blocks: 15 };
            base.style.shadow = { widget: '0 20px 60px -20px ' + p, text: '0 2px 8px rgba(0,0,0,0.3)' };
            if (s1.fontFamily) base.style.fontFamily = s1.fontFamily;
            base.style.sizes.nameSize = s1.businessNameSize || '1.5em';
            base.weekStart = 'sun';
            base.showTimezone = !!(raw.timezone || raw.timezone === 0) && !(raw.timezoneDisplay && raw.timezoneDisplay.show === false);
            base.businessName = 'Opening hours';
        }
        var cfg = mergeDeep(base, raw);
        if (Array.isArray(raw.hours)) cfg.hours = raw.hours;
        if (Array.isArray(raw.specialDays)) cfg.specialDays = raw.specialDays;
        // старые подписи: labels.days, labels.open, labels.closed, labels.closesAt, labels.timezone
        var L = raw.labels || {};
        cfg._t = mergeDeep(I18N[I18N[cfg.locale] ? cfg.locale : 'en'], {});
        if (legacy) {
            if (L.open) cfg._t.open = L.open;
            if (L.closed) { cfg._t.closed = L.closed; cfg._t.closedDay = L.closed; }
            if (L.closesAt) cfg._t.closesAt = L.closesAt + ' {time}';
            if (L.timezone) cfg._t.localTime = L.timezone;
        } else {
            Object.keys(L).forEach(function (k) { if (typeof L[k] === 'string' && L[k]) cfg._t[k] = L[k]; });
        }
        cfg._days = Array.isArray(L.days) && L.days.length === 7 ? L.days.map(String) : null;
        cfg._legacy = legacy;
        cfg._tzTemplate = legacy && raw.timezoneDisplay && raw.timezoneDisplay.template ? String(raw.timezoneDisplay.template) : '';
        return cfg;
    }

    function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
    function mergeDeep(base, over) {
        var out = {};
        Object.keys(base || {}).forEach(function (k) { out[k] = isObj(base[k]) ? mergeDeep(base[k], {}) : base[k]; });
        Object.keys(over || {}).forEach(function (k) {
            var v = over[k];
            if (isObj(v) && isObj(out[k])) out[k] = mergeDeep(out[k], v);
            else if (v !== undefined) out[k] = v;
        });
        return out;
    }
    function cssValue(v, fallback) { if (v === undefined || v === null || v === '') return fallback; return String(v).replace(/[;{}<>]/g, ''); }
    function num(v, fallback) { var n = Number(v); return isFinite(n) && v !== '' && v !== null ? n : fallback; }
    function safeUrl(url) {
        var u = String(url || '').trim();
        if (!u) return '';
        if (/^https?:/i.test(u) || /^\/(?!\/)/.test(u)) return u;
        if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return 'https://' + u;
        return '';
    }
    function escapeHtml(text) {
        return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function renderIcon(icon) {
        var s = String(icon || '').trim();
        if (!s) return '';
        if (/^(&#?[a-z0-9]+;\s*)+$/i.test(s)) return s;
        return escapeHtml(s.slice(0, 8));
    }
    function tpl(s, map) { return String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
    function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

    /* ---------- время ---------- */
    function parseTime(t) {
        var m = String(t == null ? '' : t).match(/^(\d{1,2}):(\d{2})$/);
        if (!m) return null;
        var v = +m[1] * 60 + +m[2];
        return v >= 0 && v <= 1440 ? v : null;
    }
    function parseUTCOffset(offset) {
        if (offset === undefined || offset === null || offset === '') return null;
        if (typeof offset === 'number') return Math.round(offset * 60);
        var str = String(offset).trim().toUpperCase();
        if (str === '0' || str === 'UTC' || str === 'GMT' || str === 'Z') return 0;
        var m = str.match(/^(?:UTC|GMT)?\s*([+-]?)(\d{1,2})(?::?(\d{2}))?$/);
        if (!m) return null;
        var total = parseInt(m[2], 10) * 60 + parseInt(m[3] || '0', 10);
        return m[1] === '-' ? -total : total;
    }
    function isIana(tz) { return typeof tz === 'string' && /^[A-Za-z_]+(\/[A-Za-z0-9_+-]+){1,2}$/.test(tz); }
    /* текущие дата/день/минуты в часовом поясе бизнеса */
    function nowParts(tz) {
        var d = new Date();
        if (isIana(tz)) {
            try {
                var f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' });
                var o = {}; f.formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
                var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
                var h = +o.hour % 24;
                return { y: +o.year, mo: +o.month, d: +o.day, dow: wd, min: h * 60 + (+o.minute) };
            } catch (e) { /* неизвестный пояс — ниже */ }
        }
        var off = parseUTCOffset(tz);
        var t = off === null ? d : new Date(d.getTime() + d.getTimezoneOffset() * 60000 + off * 60000);
        return { y: t.getFullYear(), mo: t.getMonth() + 1, d: t.getDate(), dow: t.getDay(), min: t.getHours() * 60 + t.getMinutes() };
    }
    function addDays(p, n) {
        var t = new Date(Date.UTC(p.y, p.mo - 1, p.d + n));
        return { y: t.getUTCFullYear(), mo: t.getUTCMonth() + 1, d: t.getUTCDate(), dow: t.getUTCDay() };
    }
    function ymd(p) { return p.y + '-' + ('0' + p.mo).slice(-2) + '-' + ('0' + p.d).slice(-2); }
    function fmtTime(min, cfg) {
        min = ((min % 1440) + 1440) % 1440;
        var h = Math.floor(min / 60), m = min % 60, mm = ('0' + m).slice(-2);
        if (cfg.timeFormat === '12h') return (h % 12 || 12) + (m ? ':' + mm : '') + ' ' + (h < 12 ? 'AM' : 'PM');
        return ('0' + h).slice(-2) + ':' + mm;
    }
    function dayName(dow, cfg, short) {
        if (cfg._days) return cfg._days[dow];
        try {
            var s = new Intl.DateTimeFormat(cfg.locale || 'en', { weekday: short ? 'short' : 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2023, 0, 1 + dow)));
            return s;
        } catch (e) { return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dow]; }
    }
    function dateLabel(p, cfg) {
        try { return cap(new Intl.DateTimeFormat(cfg.locale || 'en', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(p.y, p.mo - 1, p.d)))); }
        catch (e) { return ymd(p); }
    }
    /* интервалы дня в минутах; конец может быть > 1440 (работа после полуночи) */
    function intervalsOf(h) {
        if (!h || h.closed) return [];
        var out = [];
        [[h.open, h.close], [h.open2, h.close2]].forEach(function (pr) {
            var a = parseTime(pr[0]), b = parseTime(pr[1]);
            if (a === null || b === null) return;
            if (b <= a) b += 1440;           // 22:00–02:00, 00:00–00:00 = круглосуточно
            out.push([a, b]);
        });
        return out.sort(function (x, y) { return x[0] - y[0]; });
    }
    function specialFor(dateStr, cfg) {
        var list = cfg.specialDays || [];
        for (var i = 0; i < list.length; i++) if (list[i] && list[i].date === dateStr) return list[i];
        return null;
    }
    function scheduleFor(p, cfg) {
        var sp = specialFor(ymd(p), cfg);
        return sp || (cfg.hours || [])[p.dow] || { closed: true };
    }
    function computeStatus(cfg) {
        var now = nowParts(cfg.timezone), m = now.min;
        var today = { y: now.y, mo: now.mo, d: now.d, dow: now.dow };
        var soonMin = num(cfg.closingSoonMinutes, 30);
        var cur = intervalsOf(scheduleFor(today, cfg)).map(function (x) { return [x[0], x[1]]; });
        intervalsOf(scheduleFor(addDays(today, -1), cfg)).forEach(function (x) { if (x[1] > 1440) cur.push([0, x[1] - 1440]); });
        for (var i = 0; i < cur.length; i++) {
            if (m >= cur[i][0] && m < cur[i][1]) {
                var end = cur[i][1];
                // круглосуточно подряд: ищем реальное закрытие
                if (end >= 1440) {
                    var nx = intervalsOf(scheduleFor(addDays(today, 1), cfg));
                    if (nx.length && nx[0][0] === 0) end = 1440 + nx[0][1];
                }
                if (end - cur[i][0] >= 1440 && end - m > 1440) return { open: true, allDay: true, now: now, today: today };
                return { open: true, soon: soonMin > 0 && end - m <= soonMin, closeAt: end, now: now, today: today };
            }
        }
        for (var k = 0; k < 8; k++) {
            var dp = addDays(today, k), iv = intervalsOf(scheduleFor(dp, cfg));
            for (var j = 0; j < iv.length; j++) {
                if (k > 0 || iv[j][0] > m) return { open: false, nextDay: k, nextDow: dp.dow, nextAt: iv[j][0], now: now, today: today };
            }
        }
        return { open: false, now: now, today: today };
    }
    function forcedStatus(kind, cfg) {
        var now = nowParts(cfg.timezone), today = { y: now.y, mo: now.mo, d: now.d, dow: now.dow };
        var iv = intervalsOf(scheduleFor(today, cfg)), close = iv.length ? iv[iv.length - 1][1] : 18 * 60;
        if (kind === 'open') return { open: true, closeAt: close, now: now, today: today };
        if (kind === 'soon') return { open: true, soon: true, closeAt: close, now: now, today: today };
        for (var k = 1; k < 8; k++) { var dp = addDays(today, k), n = intervalsOf(scheduleFor(dp, cfg)); if (n.length) return { open: false, nextDay: k, nextDow: dp.dow, nextAt: n[0][0], now: now, today: today }; }
        return { open: false, now: now, today: today };
    }
    function statusText(st, cfg) {
        var T = cfg._t;
        if (st.open) {
            if (st.allDay) return { badge: T.open, cls: '', detail: T.allDay };
            return { badge: st.soon ? T.closesSoon : T.open, cls: st.soon ? 'soon' : '', detail: tpl(T.closesAt, { time: fmtTime(st.closeAt, cfg) }) };
        }
        var detail = '';
        if (st.nextDay === 0) detail = tpl(T.opensToday, { time: fmtTime(st.nextAt, cfg) });
        else if (st.nextDay === 1) detail = tpl(T.opensTomorrow, { time: fmtTime(st.nextAt, cfg) });
        else if (st.nextDay > 1) detail = tpl(T.opensDay, { day: dayName(st.nextDow, cfg), time: fmtTime(st.nextAt, cfg) });
        return { badge: T.closed, cls: 'closed', detail: detail };
    }
    function hoursText(h, cfg) {
        var iv = intervalsOf(h);
        if (!iv.length) return null;
        if (iv.length === 1 && iv[0][1] - iv[0][0] >= 1440) return cfg._t.allDay;
        return iv.map(function (x) { return fmtTime(x[0], cfg) + ' – ' + fmtTime(x[1], cfg); }).join(', ');
    }

    function applyCustomStyles(uniqueClass, cfg) {
        var id = 'bhw-bh-style-' + uniqueClass;
        var el = document.getElementById(id);
        if (!el) { el = document.createElement('style'); el.id = id; (document.head || document.documentElement).appendChild(el); }
        var s = cfg.style || {}, c = s.colors || {}, z = s.sizes || {}, r = s.borderRadius || {}, sh = s.shadow || {};
        var fs = num(z.fontSize, 1), pad = num(z.padding, 26);
        el.textContent = '.' + uniqueClass + '{' +
            '--bhw-font:' + cssValue(s.fontFamily, "'Inter', system-ui, sans-serif") + ';' +
            '--bhw-value-font:' + cssValue(s.valueFontFamily, 'inherit') + ';' +
            '--bhw-max-width:' + Math.round(num(z.width, 400)) + 'px;' +
            '--bhw-font-size:' + (15 * fs).toFixed(2) + 'px;' +
            '--bhw-name-size:' + cssValue(z.nameSize, '1.25em') + ';' +
            '--bhw-bg:' + cssValue(c.background, '#ffffff') + ';' +
            '--bhw-text-color:' + cssValue(c.text, '#111111') + ';' +
            '--bhw-accent:' + cssValue(c.accent, '#16a34a') + ';' +
            '--bhw-open:' + cssValue(c.open, '#16a34a') + ';' +
            '--bhw-soon:' + cssValue(c.soon, '#d97706') + ';' +
            '--bhw-closed:' + cssValue(c.closed, '#dc2626') + ';' +
            '--bhw-widget-border:' + cssValue(c.widgetBorder, 'rgba(0,0,0,0.07)') + ';' +
            '--bhw-table-bg:' + cssValue(c.tableBackground, 'rgba(0,0,0,0.035)') + ';' +
            '--bhw-table-text:' + cssValue(c.tableText, 'inherit') + ';' +
            '--bhw-today-bg:' + cssValue(c.todayBackground, '#ffffff') + ';' +
            '--bhw-row-line:' + cssValue(c.rowLine, 'rgba(0,0,0,0.06)') + ';' +
            '--bhw-soft:' + cssValue(c.soft, 'rgba(0,0,0,0.05)') + ';' +
            '--bhw-widget-radius:' + num(r.widget, 22) + 'px;' +
            '--bhw-block-radius:' + num(r.blocks, 14) + 'px;' +
            '--bhw-padding:' + pad + 'px;' +
            '--bhw-padding-mobile:' + Math.round(pad * .78) + 'px;' +
            '--bhw-shadow:' + cssValue(sh.widget, '0 24px 60px -24px rgba(0,0,0,0.3)') + ';' +
            '--bhw-text-shadow:' + cssValue(sh.text, 'none') + ';' +
            '}';
        return id;
    }

    function rowsHtml(cfg, st) {
        var start = cfg.weekStart === 'sun' ? 0 : 1, rows = [];
        for (var i = 0; i < 7; i++) {
            var dow = (start + i) % 7;
            // сегодня с учётом особого дня
            var h = dow === st.today.dow ? scheduleFor(st.today, cfg) : (cfg.hours || [])[dow];
            rows.push({ dows: [dow], text: hoursText(h, cfg) });
        }
        if (cfg.groupDays) {
            var g = [];
            rows.forEach(function (r) { var last = g[g.length - 1]; if (last && last.text === r.text) last.dows.push(r.dows[0]); else g.push({ dows: r.dows.slice(), text: r.text }); });
            rows = g;
        }
        return rows.map(function (r) {
            var cur = r.dows.indexOf(st.today.dow) >= 0;
            var name = r.dows.length > 2 ? cap(dayName(r.dows[0], cfg, true)) + ' – ' + cap(dayName(r.dows[r.dows.length - 1], cfg, true))
                : r.dows.map(function (d) { return cap(dayName(d, cfg, r.dows.length > 1)); }).join(', ');
            return '<div class="bhw-hours-row' + (cur ? ' current-day' : '') + '">' +
                '<span class="bhw-day-name">' + escapeHtml(name) + (cur && !cfg._legacy ? '<span class="bhw-today-tag">' + escapeHtml(cfg._t.today) + '</span>' : '') + '</span>' +
                '<span class="bhw-hours-time' + (r.text ? '' : ' closed') + '">' + escapeHtml(r.text || cfg._t.closedDay) + '</span></div>';
        }).join('');
    }
    function specialHtml(cfg, st) {
        var todayStr = ymd(st.today), max = ymd(addDays(st.today, 30));
        var list = (cfg.specialDays || []).filter(function (s) { return s && /^\d{4}-\d{2}-\d{2}$/.test(s.date) && s.date >= todayStr && s.date <= max; })
            .sort(function (a, b) { return a.date < b.date ? -1 : 1; }).slice(0, 5);
        if (!list.length) return '';
        return '<div class="bhw-special"><p class="bhw-special-title">' + escapeHtml(cfg._t.special) + '</p>' + list.map(function (s) {
            var p = s.date.split('-').map(Number), t = hoursText(s, cfg);
            return '<div class="bhw-hours-row"><span class="bhw-day-name">' + escapeHtml(dateLabel({ y: p[0], mo: p[1], d: p[2] }, cfg)) +
                (s.note ? ' <span class="bhw-special-note">· ' + escapeHtml(s.note) + '</span>' : '') + '</span>' +
                '<span class="bhw-hours-time' + (t ? '' : ' closed') + '">' + escapeHtml(t || cfg._t.closedDay) + '</span></div>';
        }).join('') + '</div>';
    }
    function tzHtml(cfg, st) {
        if (!cfg.showTimezone) return '';
        var time = fmtTime(st.now.min, cfg), zone = '';
        if (isIana(cfg.timezone)) zone = cfg.timezone.split('/').pop().replace(/_/g, ' ');
        else { var off = parseUTCOffset(cfg.timezone); if (off !== null) zone = 'UTC' + (off < 0 ? '-' : '+') + Math.floor(Math.abs(off) / 60) + (Math.abs(off) % 60 ? ':' + ('0' + Math.abs(off) % 60).slice(-2) : ''); }
        var text = cfg._tzTemplate ? tpl(cfg._tzTemplate, { label: cfg._t.localTime, time: time, timezone: zone }) : cfg._t.localTime + ' ' + time + (zone ? ' · ' + zone : '');
        return '<div class="bhw-timezone-info">' + escapeHtml(text) + '</div>';
    }

    function widgetHtml(cfg, st) {
        var s = statusText(st, cfg);
        var logo = safeUrl(cfg.logo), icon = renderIcon(cfg.iconHtml || cfg.icon);
        var minimal = cfg.layout === 'minimal';
        // v1: иконка была внутри плашки статуса, а название часто уже с эмодзи
        var legacyIconInBadge = cfg._legacy && icon;
        var head = (logo ? '<img class="bhw-logo" src="' + escapeHtml(logo) + '" alt="">' : (icon && !legacyIconInBadge ? '<span class="bhw-icon" aria-hidden="true">' + icon + '</span>' : '')) +
            '<div class="bhw-head-txt">' +
                (cfg.businessName ? '<h3 class="bhw-business-name">' + escapeHtml(cfg.businessName) + '</h3>' : '') +
                '<p class="bhw-status-line"><span class="bhw-status-badge' + (s.cls ? ' ' + s.cls : '') + (legacyIconInBadge ? ' bhw-has-icon' : '') + '">' + (legacyIconInBadge ? icon + ' ' : '') + escapeHtml(s.badge) + '</span>' +
                (s.detail ? '<span class="bhw-status-detail">' + escapeHtml(s.detail) + '</span>' : '') + '</p>' +
            '</div>' +
            (minimal ? '<button class="bhw-toggle" type="button" aria-expanded="false"><span>' + escapeHtml(cfg._t.hours) + '</span>' + CHEVRON + '</button>' : '');
        return '<div class="bhw-widget">' +
            '<div class="bhw-header">' + head + '</div>' +
            '<div class="bhw-body">' +
                (cfg.notice ? '<div class="bhw-notice">' + escapeHtml(cfg.notice) + '</div>' : '') +
                '<div class="bhw-hours-table">' + rowsHtml(cfg, st) + '</div>' +
                specialHtml(cfg, st) +
                tzHtml(cfg, st) +
            '</div>' +
        '</div>';
    }

    function mountWidget(cfg, uniqueClass, id, opts) {
        opts = opts || {};
        var styleId = applyCustomStyles(uniqueClass, cfg);
        var root = document.createElement('div');
        root.id = 'business-hours-widget-' + id;
        root.className = 'bhw-bh bhw-container ' + uniqueClass + (cfg._legacy ? ' bhw-legacy' : '') + (cfg.layout === 'minimal' ? ' bhw-minimal' : '');
        var timer = 0, expanded = cfg.layout === 'minimal' && !!opts.expanded;
        function draw() {
            var st = opts.force ? forcedStatus(opts.force, cfg) : computeStatus(cfg);
            root.innerHTML = widgetHtml(cfg, st);
            root.classList.toggle('bhw-expanded', expanded);
            var t = root.querySelector('.bhw-toggle');
            if (t) { t.setAttribute('aria-expanded', String(expanded)); t.onclick = function () { expanded = !expanded; root.classList.toggle('bhw-expanded', expanded); t.setAttribute('aria-expanded', String(expanded)); }; }
        }
        draw();
        if (opts.inline) opts.inline.appendChild(root);
        else if (opts.anchor && opts.anchor.parentNode) opts.anchor.parentNode.insertBefore(root, opts.anchor.nextSibling);
        else document.body.appendChild(root);
        // статус меняется со временем — перерисовываем раз в минуту
        if (!opts.force) timer = setInterval(draw, 60000);
        return {
            root: root, config: cfg, id: id,
            refresh: draw,
            destroy: function () { clearInterval(timer); root.remove(); var s = document.getElementById(styleId); if (s) s.remove(); }
        };
    }
})();
