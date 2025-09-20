
(function() {
    'use strict';
    
    // Встроенные стили для мгновенной загрузки
    const inlineCSS = `
        .bhw-container{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:420px;margin:20px auto}
        .bhw-widget{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:16px;padding:0;box-shadow:0 12px 40px rgba(102,126,234,0.25);color:white;position:relative;overflow:hidden}
        .bhw-widget::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,0.15) 0%,transparent 60%);pointer-events:none}
        .bhw-header{padding:24px 24px 20px;text-align:center;position:relative;z-index:1}
        .bhw-title{font-size:1.4em;font-weight:600;margin:0 0 12px 0;text-shadow:0 2px 4px rgba(0,0,0,0.3)}
        .bhw-status{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:25px;font-size:0.95em;font-weight:500;backdrop-filter:blur(15px);transition:all 0.3s ease}
        .bhw-status.open{background:rgba(34,197,94,0.25);border:1px solid rgba(34,197,94,0.4);color:#dcfce7}
        .bhw-status.closed{background:rgba(239,68,68,0.25);border:1px solid rgba(239,68,68,0.4);color:#fecaca}
        .bhw-status.opening-soon{background:rgba(251,191,36,0.25);border:1px solid rgba(251,191,36,0.4);color:#fef3c7}
        .bhw-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;transition:all 0.3s ease}
        .bhw-dot.open{background:#22c55e;box-shadow:0 0 12px rgba(34,197,94,0.8)}
        .bhw-dot.closed{background:#ef4444;box-shadow:0 0 12px rgba(239,68,68,0.8)}
        .bhw-dot.opening-soon{background:#fbbf24;box-shadow:0 0 12px rgba(251,191,36,0.8);animation:bhw-pulse 2s ease-in-out infinite}
        .bhw-body{background:rgba(255,255,255,0.95);color:#333;margin:0 16px 16px;border-radius:12px;backdrop-filter:blur(20px);position:relative;z-index:1}
        .bhw-schedule{padding:20px}
        .bhw-day{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;margin:3px 0;border-radius:8px;transition:all 0.3s ease;font-size:0.95em}
        .bhw-day:hover{background:rgba(102,126,234,0.08);transform:translateX(2px)}
        .bhw-day.today{background:rgba(102,126,234,0.12);border:1px solid rgba(102,126,234,0.2);font-weight:600}
        .bhw-day-name{font-weight:500;min-width:90px;color:#374151}
        .bhw-day-hours{color:#6b7280;font-size:0.9em}
        .bhw-day-hours.closed{color:#dc2626;font-style:italic}
        .bhw-day-hours.special{color:#7c3aed;font-weight:500}
        .bhw-next-change{text-align:center;padding:12px 20px;background:rgba(102,126,234,0.08);margin:0 20px 20px;border-radius:8px;font-size:0.85em;color:#4f46e5;border:1px solid rgba(102,126,234,0.15)}
        .bhw-timezone{text-align:center;padding:8px 20px 16px;font-size:0.75em;opacity:0.7;color:#6b7280}
        .bhw-error{background:linear-gradient(135deg,#ff6b6b 0%,#ee5a24 100%);padding:24px;border-radius:16px;color:white;text-align:center;box-shadow:0 12px 40px rgba(255,107,107,0.3)}
        .bhw-loading{background:rgba(255,255,255,0.95);padding:40px;text-align:center;border-radius:16px;color:#6b7280}
        .bhw-spinner{width:32px;height:32px;border:3px solid rgba(102,126,234,0.2);border-top:3px solid #667eea;border-radius:50%;animation:bhw-spin 1s linear infinite;margin:0 auto 16px}
        @keyframes bhw-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes bhw-pulse{0%{opacity:0.8}50%{opacity:1}100%{opacity:0.8}}
        @media (max-width:480px){.bhw-widget{margin:10px;border-radius:12px}.bhw-header{padding:20px 20px 16px}.bhw-body{margin:0 12px 12px}.bhw-day{padding:8px 10px}.bhw-day-name{min-width:75px;font-size:0.9em}}
    `;
    
    // Константы для дней недели и локализации
    const DAYS_EN = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const DAYS_RU = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
    const DAYS_EN_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    
    try {
        const currentScript = document.currentScript || 
            (function() {
                const scripts = document.getElementsByTagName('script');
                return scripts[scripts.length - 1];
            })();
        
        const clientId = currentScript.dataset.id;
        if (!clientId) {
            console.error('[BusinessHoursWidget] data-id обязателен');
            return;
        }
        
        // Добавляем стили если их еще нет
        if (!document.querySelector('#bhw-styles')) {
            const style = document.createElement('style');
            style.id = 'bhw-styles';
            style.textContent = inlineCSS;
            document.head.appendChild(style);
        }
        
        // Определяем baseUrl
        let baseUrl = currentScript.dataset.base;
        if (!baseUrl) {
            const scriptSrc = currentScript.src;
            if (scriptSrc) {
                baseUrl = scriptSrc.replace(/\/[^\/]*$/, '');
            } else {
                baseUrl = 'https://business-hours-widget.tf-widgets.com';
            }
        }
        
        const configUrl = `${baseUrl}/configs/${encodeURIComponent(clientId)}.json`;
        
        console.log('[BusinessHoursWidget] Загружаем конфигурацию:', configUrl);
        
        // Создаем контейнер и показываем загрузку
        const container = createContainer(currentScript, clientId);
        showLoading(container);
        
        // Загружаем конфигурацию
        fetch(configUrl, { 
            cache: 'no-cache',
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            console.log('[BusinessHoursWidget] Ответ сервера:', response.status);
            if (!response.ok) {
                throw new Error(`Конфигурация для ${clientId} не найдена (${response.status})`);
            }
            return response.json();
        })
        .then(config => {
            console.log('[BusinessHoursWidget] Конфигурация загружена:', config);
            createBusinessHoursWidget(container, config, clientId);
            console.log(`[BusinessHoursWidget] Виджет ${clientId} успешно создан`);
        })
        .catch(error => {
            console.error('[BusinessHoursWidget] Ошибка загрузки:', error);
            showError(container, clientId, error.message);
        });
        
    } catch (error) {
        console.error('[BusinessHoursWidget] Критическая ошибка:', error);
    }
    
    function createContainer(scriptElement, clientId) {
        const container = document.createElement('div');
        container.id = `bhw-${clientId}`;
        container.className = 'bhw-container';
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        return container;
    }
    
    function showLoading(container) {
        container.innerHTML = `
            <div class="bhw-widget">
                <div class="bhw-loading">
                    <div class="bhw-spinner"></div>
                    <div>Загрузка часов работы...</div>
                </div>
            </div>
        `;
    }
    
    function showError(container, clientId, message) {
        container.innerHTML = `
            <div class="bhw-error">
                <h3 style="margin: 0 0 15px 0;">🕐 Виджет временно недоступен</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 0.9em;">ID: ${clientId}</p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; opacity: 0.8;">Подробности</summary>
                    <p style="margin: 10px 0 0 0; font-size: 0.8em; opacity: 0.7;">${message}</p>
                </details>
            </div>
        `;
    }
    
    // Функции для работы с временем и часовыми поясами
    function getTimeZoneInfo(timezone) {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        
        const parts = formatter.formatToParts(now);
        const partsObj = Object.fromEntries(parts.map(p => [p.type, p.value]));
        
        const weekdayIndex = DAYS_EN_FULL.indexOf(partsObj.weekday);
        const currentMinutes = parseInt(partsObj.hour) * 60 + parseInt(partsObj.minute);
        const dateString = `${partsObj.year}-${partsObj.month}-${partsObj.day}`;
        
        return {
            weekday: weekdayIndex,
            weekdayName: DAYS_EN[weekdayIndex],
            currentMinutes,
            dateString,
            now
        };
    }
    
    function parseTime(timeStr) {
        if (!timeStr || timeStr.toLowerCase() === 'closed') return null;
        const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        return hours * 60 + minutes;
    }
    
    function formatTime(minutes, format = '24h', locale = 'ru') {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (format === '12h') {
            const ampm = locale === 'ru' 
                ? (hours >= 12 ? 'ПП' : 'ДП')
                : (hours >= 12 ? 'PM' : 'AM');
            const displayHour = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
            return `${displayHour}:${String(mins).padStart(2, '0')} ${ampm}`;
        }
        
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
    
    function normalizeIntervals(intervals) {
        if (!intervals || !Array.isArray(intervals)) return [];
        
        const normalized = [];
        intervals.forEach(interval => {
            const start = parseTime(interval.start);
            const end = parseTime(interval.end);
            
            if (start === null || end === null) return;
            
            if (end > start) {
                // Обычный интервал в пределах одного дня
                normalized.push({ start, end });
            } else {
                // Интервал через полночь - разбиваем на два
                normalized.push({ start, end: 24 * 60 }); // до полуночи
                normalized.push({ start: 0, end, overnight: true }); // после полуночи
            }
        });
        
        return normalized.sort((a, b) => a.start - b.start);
    }
    
    function getDaySchedule(config, weekdayName, dateString) {
        // Проверяем исключения (праздники, особые дни)
        if (config.exceptions && config.exceptions[dateString]) {
            const exception = config.exceptions[dateString];
            if (exception === 'closed' || exception === null) {
                return { intervals: [], isException: true, note: 'Праздничный день' };
            }
            if (Array.isArray(exception)) {
                return { 
                    intervals: normalizeIntervals(exception), 
                    isException: true, 
                    note: config.exceptions[dateString + '_note'] || 'Особый режим'
                };
            }
        }
        
        // Обычное расписание
        const daySchedule = config.hours && config.hours[weekdayName];
        return {
            intervals: normalizeIntervals(daySchedule),
            isException: false,
            note: null
        };
    }
    
    function getCurrentStatus(config, tzInfo) {
        const { weekdayName, currentMinutes, dateString } = tzInfo;
        const todaySchedule = getDaySchedule(config, weekdayName, dateString);
        
        // Проверяем, работает ли сейчас
        for (const interval of todaySchedule.intervals) {
            if (!interval.overnight && currentMinutes >= interval.start && currentMinutes < interval.end) {
                return {
                    status: 'open',
                    closesAt: interval.end,
                    message: config.messages?.open || 'Открыто сейчас'
                };
            }
        }
        
        // Проверяем ночные интервалы от вчерашнего дня
        const yesterday = new Date(tzInfo.now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayInfo = getTimeZoneInfo(config.timezone);
        const yesterdaySchedule = getDaySchedule(config, DAYS_EN[yesterday.getDay()], 
            yesterday.toISOString().split('T')[0]);
        
        for (const interval of yesterdaySchedule.intervals) {
            if (interval.overnight && currentMinutes >= interval.start && currentMinutes < interval.end) {
                return {
                    status: 'open',
                    closesAt: interval.end,
                    message: config.messages?.open || 'Открыто сейчас'
                };
            }
        }
        
        // Проверяем, скоро ли откроется (в течение часа)
        for (const interval of todaySchedule.intervals) {
            if (!interval.overnight && currentMinutes < interval.start) {
                const minutesUntilOpen = interval.start - currentMinutes;
                if (minutesUntilOpen <= 60) {
                    return {
                        status: 'opening-soon',
                        opensAt: interval.start,
                        message: config.messages?.openingSoon || 
                            `Откроется через ${minutesUntilOpen} мин`
                    };
                }
                break; // Берем только ближайшее открытие
            }
        }
        
        return {
            status: 'closed',
            message: config.messages?.closed || 'Закрыто',
            nextOpening: findNextOpening(config, tzInfo)
        };
    }
    
    function findNextOpening(config, tzInfo) {
        const { now } = tzInfo;
        
        // Ищем в следующие 7 дней
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const checkDate = new Date(now);
            checkDate.setDate(checkDate.getDate() + dayOffset);
            
            const checkWeekday = checkDate.getDay();
            const checkWeekdayName = DAYS_EN[checkWeekday];
            const checkDateString = checkDate.toISOString().split('T')[0];
            
            const daySchedule = getDaySchedule(config, checkWeekdayName, checkDateString);
            
            if (daySchedule.intervals.length > 0) {
                const firstInterval = daySchedule.intervals.find(i => !i.overnight);
                if (firstInterval) {
                    if (dayOffset === 0) {
                        return `Сегодня в ${formatTime(firstInterval.start, config.format, config.locale)}`;
                    } else if (dayOffset === 1) {
                        return `Завтра в ${formatTime(firstInterval.start, config.format, config.locale)}`;
                    } else {
                        const dayNames = config.locale === 'ru' ? DAYS_RU : DAYS_EN_FULL;
                        return `${dayNames[checkWeekday]} в ${formatTime(firstInterval.start, config.format, config.locale)}`;
                    }
                }
            }
        }
        
        return 'Check schedule';
    }
    
    function createBusinessHoursWidget(container, config, clientId) {
        function renderWidget() {
            const tzInfo = getTimeZoneInfo(config.timezone || 'UTC');
            const status = getCurrentStatus(config, tzInfo);
            
            const businessName = config.name || config.businessName || 'Opening Hours';
            const locale = config.locale || 'ru';
            const dayNames = locale === 'ru' ? DAYS_RU : DAYS_EN_FULL;
            
            // Генерируем расписание на неделю
            const scheduleHtml = DAYS_EN.map((dayKey, index) => {
                const isToday = index === tzInfo.weekday;
                const checkDate = new Date(tzInfo.now);
                checkDate.setDate(checkDate.getDate() + (index - tzInfo.weekday));
                const dateString = checkDate.toISOString().split('T')[0];
                
                const daySchedule = getDaySchedule(config, dayKey, dateString);
                
                let hoursText = '';
                let hoursClass = '';
                
                if (daySchedule.intervals.length === 0) {
                    hoursText = config.messages?.closed || 'Closed';
                    hoursClass = 'closed';
                } else {
                    const regularIntervals = daySchedule.intervals.filter(i => !i.overnight);
                    hoursText = regularIntervals.map(interval => 
                        `${formatTime(interval.start, config.format, locale)}–${formatTime(interval.end, config.format, locale)}`
                    ).join(', ');
                    
                    if (daySchedule.isException) {
                        hoursClass = 'special';
                        if (daySchedule.note) {
                            hoursText += ` (${daySchedule.note})`;
                        }
                    }
                }
                
                return `
                    <div class="bhw-day ${isToday ? 'today' : ''}">
                        <span class="bhw-day-name">${dayNames[index]}</span>
                        <span class="bhw-day-hours ${hoursClass}">${hoursText}</span>
                    </div>
                `;
            }).join('');
            
           // Information about the next change
let nextChangeHtml = '';
if (status.closesAt) {
    nextChangeHtml = `<div class="bhw-next-change">Closes at ${formatTime(status.closesAt, config.format, locale)}</div>`;
} else if (status.opensAt) {
    nextChangeHtml = `<div class="bhw-next-change">Opens at ${formatTime(status.opensAt, config.format, locale)}</div>`;
} else if (status.nextOpening) {
    nextChangeHtml = `<div class="bhw-next-change">📅 Next opening: ${status.nextOpening}</div>`;
}
            
            container.innerHTML = `
                <div class="bhw-widget">
                    <div class="bhw-header">
                        <h3 class="bhw-title">${businessName}</h3>
                        <div class="bhw-status ${status.status}">
                            <span class="bhw-dot ${status.status}"></span>
                            ${status.message}
                        </div>
                    </div>
                    
                    <div class="bhw-body">
                        <div class="bhw-schedule">
                            ${scheduleHtml}
                        </div>
                        
                        ${nextChangeHtml}
                        
                        <div class="bhw-timezone">
                            Время: ${config.timezone?.replace('_', ' ') || 'UTC'}
                        </div>
                    </div>
                </div>
            `;
        }
        
        renderWidget();
        
        // Обновляем каждую минуту
        const interval = setInterval(renderWidget, 60000);
        
        // Очистка при удалении элемента
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach(node => {
                        if (node === container) {
                            clearInterval(interval);
                            observer.disconnect();
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
