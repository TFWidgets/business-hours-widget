(function() {
    'use strict';

    // Базовые CSS стили с CSS-переменными для полной кастомизации
    const inlineCSS = `
        .bhw-container {
            font-family: var(--bhw-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            max-width: var(--bhw-max-width, 400px);
            margin: var(--bhw-margin, 20px auto);
        }
        
        .bhw-widget {
            background: var(--bhw-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
            border-radius: var(--bhw-radius, 20px);
            padding: var(--bhw-padding, 30px);
            color: var(--bhw-text-color, white);
            box-shadow: var(--bhw-shadow, 0 20px 60px rgba(102, 126, 234, 0.4));
            position: relative;
            overflow: hidden;
        }
        
        .bhw-widget::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--bhw-overlay, radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%));
            pointer-events: none;
        }
        
        .bhw-header {
            text-align: var(--bhw-header-align, center);
            margin-bottom: 25px;
            position: relative;
            z-index: 1;
        }
        
        .bhw-business-name {
            font-size: var(--bhw-name-size, 1.6em);
            font-weight: var(--bhw-name-weight, 600);
            margin-bottom: 15px;
            text-shadow: var(--bhw-name-shadow, 0 2px 8px rgba(0,0,0,0.3));
            color: var(--bhw-name-color, inherit);
        }
        
        .bhw-status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--bhw-open-color, #4ade80);
            color: var(--bhw-badge-text, white);
            padding: var(--bhw-badge-padding, 8px 16px);
            border-radius: var(--bhw-badge-radius, 25px);
            font-weight: var(--bhw-badge-weight, 600);
            font-size: var(--bhw-badge-size, 0.9em);
            transition: all 0.3s ease;
        }
        
        .bhw-status-badge.closed {
            background: var(--bhw-closed-color, #ef4444);
        }
        
        .bhw-hours-table {
            background: var(--bhw-table-bg, rgba(255, 255, 255, 0.95));
            border-radius: var(--bhw-table-radius, 15px);
            padding: var(--bhw-table-padding, 20px);
            color: var(--bhw-table-text, #333);
            margin: 20px 0;
            position: relative;
            z-index: 1;
            backdrop-filter: blur(10px);
        }
        
        .bhw-hours-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--bhw-row-padding, 12px 0);
            border-bottom: var(--bhw-row-border, 1px solid rgba(0,0,0,0.1));
            transition: all 0.2s ease;
        }
        
        .bhw-hours-row:last-child {
            border-bottom: none;
        }
        
        .bhw-hours-row.current-day {
            background: var(--bhw-current-bg, rgba(102, 126, 234, 0.1));
            border-radius: var(--bhw-current-radius, 8px);
            padding: var(--bhw-current-padding, 12px 15px);
            margin: 0 -15px;
            font-weight: 600;
        }
        
        .bhw-day-name {
            font-weight: var(--bhw-day-weight, 600);
            font-size: var(--bhw-day-size, 1em);
            color: var(--bhw-day-color, inherit);
        }
        
        .bhw-hours-time {
            font-weight: var(--bhw-time-weight, 500);
            color: var(--bhw-time-color, #666);
            font-size: var(--bhw-time-size, 1em);
        }
        
        .bhw-hours-time.closed {
            color: var(--bhw-closed-text, #ef4444);
            font-style: italic;
        }
        
        .bhw-closing-info {
            background: var(--bhw-info-bg, rgba(255, 255, 255, 0.2));
            padding: var(--bhw-info-padding, 12px);
            border-radius: var(--bhw-info-radius, 10px);
            text-align: center;
            font-weight: var(--bhw-info-weight, 600);
            margin-bottom: 15px;
            color: var(--bhw-info-color, inherit);
            position: relative;
            z-index: 1;
        }
        
        .bhw-timezone-info {
            text-align: center;
            font-size: var(--bhw-tz-size, 0.85em);
            opacity: var(--bhw-tz-opacity, 0.8);
            color: var(--bhw-tz-color, inherit);
            position: relative;
            z-index: 1;
        }
        
        .bhw-loading {
            text-align: center;
            padding: 40px;
            position: relative;
            z-index: 1;
        }
        
        .bhw-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: bhw-spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        .bhw-error {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            padding: 30px;
            border-radius: 16px;
            color: white;
            text-align: center;
            box-shadow: 0 15px 40px rgba(255,107,107,0.4);
        }
        
        @keyframes bhw-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
            .bhw-widget {
                padding: var(--bhw-padding-mobile, 20px);
            }
            .bhw-hours-table {
                padding: var(--bhw-table-padding-mobile, 15px);
            }
            .bhw-business-name {
                font-size: var(--bhw-name-size-mobile, 1.4em);
            }
        }
    `;

    try {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

       let clientId = currentScript.dataset.id;
if (!clientId) {
    console.error('[BusinessHoursWidget] data-id обязателен');
    return;
}

// Нормализация clientId: удаляем расширение .js если присутствует
if (clientId.endsWith('.js')) {
    clientId = clientId.slice(0, -3);
}

console.log(`[BusinessHoursWidget] Normalized clientId: ${clientId}`);


        // Добавляем стили один раз
        if (!document.querySelector('#business-hours-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'business-hours-widget-styles';
            style.textContent = inlineCSS;
            document.head.appendChild(style);
        }

        // Определяем baseUrl
        const baseUrl = currentScript.src ? 
            currentScript.src.replace(/\/[^\/]*$/, '') : 
            'https://business-hours-widget.tf-widgets.com';

        // URL конфига с кеш-бастером для мгновенных обновлений
        const configUrl = `${baseUrl}/configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;

        // Создаем контейнер
        const container = createContainer(currentScript, clientId);
        
        // Показываем загрузку
        showLoading(container);

        // Загружаем конфигурацию с fallback
        loadConfig(configUrl, baseUrl)
            .then(config => {
                applyCustomStyles(container, config);
                createBusinessHoursWidget(container, config, clientId);
                console.log(`[BusinessHoursWidget] Виджет ${clientId} успешно создан`);
            })
            .catch(error => {
                console.error('[BusinessHoursWidget] Ошибка:', error);
                showError(container, clientId, error.message);
            });

    } catch (error) {
        console.error('[BusinessHoursWidget] Критическая ошибка:', error);
    }

    function createContainer(scriptElement, clientId) {
        const container = document.createElement('div');
        container.id = `business-hours-widget-${clientId}`;
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

    // Загрузка конфига с fallback на demo.json
    async function loadConfig(configUrl, baseUrl) {
        try {
            const response = await fetch(configUrl, {
                cache: 'no-cache',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.warn(`[BusinessHoursWidget] Основной конфиг недоступен, используем demo: ${error.message}`);
            
            // Fallback на demo.json
            const demoResponse = await fetch(`${baseUrl}/configs/demo.json?v=${Date.now()}`, {
                cache: 'no-cache',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!demoResponse.ok) {
                throw new Error('Конфигурация недоступна');
            }
            
            return await demoResponse.json();
        }
    }

    // Применение кастомных стилей из конфига
    function applyCustomStyles(container, config) {
        const s = config.styling || {};
        
        // Основные стили
        if (s.fontFamily) container.style.setProperty('--bhw-font', s.fontFamily);
        if (s.maxWidth) container.style.setProperty('--bhw-max-width', s.maxWidth);
        if (s.margin) container.style.setProperty('--bhw-margin', s.margin);
        
        // Градиент или цвет фона
        if (s.primaryColor && s.secondaryColor) {
            container.style.setProperty('--bhw-bg', `linear-gradient(135deg, ${s.primaryColor} 0%, ${s.secondaryColor} 100%)`);
        } else if (s.backgroundColor) {
            container.style.setProperty('--bhw-bg', s.backgroundColor);
        }
        
        // Виджет
        if (s.borderRadius) container.style.setProperty('--bhw-radius', s.borderRadius);
        if (s.padding) container.style.setProperty('--bhw-padding', s.padding);
        if (s.shadow) container.style.setProperty('--bhw-shadow', s.shadow);
        if (s.textColor) container.style.setProperty('--bhw-text-color', s.textColor);
        if (s.overlay) container.style.setProperty('--bhw-overlay', s.overlay);
        
        // Заголовок
        if (s.headerAlign) container.style.setProperty('--bhw-header-align', s.headerAlign);
        if (s.businessNameSize) container.style.setProperty('--bhw-name-size', s.businessNameSize);
        if (s.businessNameWeight) container.style.setProperty('--bhw-name-weight', s.businessNameWeight);
        if (s.businessNameColor) container.style.setProperty('--bhw-name-color', s.businessNameColor);
        if (s.businessNameShadow) container.style.setProperty('--bhw-name-shadow', s.businessNameShadow);
        
        // Статус
        if (s.openColor) container.style.setProperty('--bhw-open-color', s.openColor);
        if (s.closedColor) container.style.setProperty('--bhw-closed-color', s.closedColor);
        if (s.badgeTextColor) container.style.setProperty('--bhw-badge-text', s.badgeTextColor);
        if (s.badgeRadius) container.style.setProperty('--bhw-badge-radius', s.badgeRadius);
        if (s.badgeSize) container.style.setProperty('--bhw-badge-size', s.badgeSize);
        
        // Таблица
        if (s.tableBackground) container.style.setProperty('--bhw-table-bg', s.tableBackground);
        if (s.tableRadius) container.style.setProperty('--bhw-table-radius', s.tableRadius);
        if (s.tablePadding) container.style.setProperty('--bhw-table-padding', s.tablePadding);
        if (s.tableTextColor) container.style.setProperty('--bhw-table-text', s.tableTextColor);
        
        // Строки
        if (s.rowBorder) container.style.setProperty('--bhw-row-border', s.rowBorder);
        if (s.currentDayBackground) container.style.setProperty('--bhw-current-bg', s.currentDayBackground);
        if (s.currentDayRadius) container.style.setProperty('--bhw-current-radius', s.currentDayRadius);
        
        // Текст
        if (s.dayTextColor) container.style.setProperty('--bhw-day-color', s.dayTextColor);
        if (s.timeTextColor) container.style.setProperty('--bhw-time-color', s.timeTextColor);
        if (s.closedTextColor) container.style.setProperty('--bhw-closed-text', s.closedTextColor);
        
        // Информация
        if (s.infoBackground) container.style.setProperty('--bhw-info-bg', s.infoBackground);
        if (s.infoColor) container.style.setProperty('--bhw-info-color', s.infoColor);
        
        // Часовой пояс
        if (s.timezoneSize) container.style.setProperty('--bhw-tz-size', s.timezoneSize);
        if (s.timezoneColor) container.style.setProperty('--bhw-tz-color', s.timezoneColor);
        if (s.timezoneOpacity) container.style.setProperty('--bhw-tz-opacity', s.timezoneOpacity);
        
        // Мобильные стили
        if (s.paddingMobile) container.style.setProperty('--bhw-padding-mobile', s.paddingMobile);
    }

    function createBusinessHoursWidget(container, config, clientId) {
        // Получаем текущее время с учетом часового пояса
        const { dayIndex, minutesNow } = getTimeInTimezone(config.timezone);
        
        // Определяем статус (открыто/закрыто)
        const todayHours = config.hours[dayIndex];
        let isOpen = false;
        let closingTime = '';
        
        if (todayHours && !todayHours.closed && todayHours.open && todayHours.close) {
            const openTime = parseTime(todayHours.open);
            const closeTime = parseTime(todayHours.close);
            isOpen = minutesNow >= openTime && minutesNow < closeTime;
            closingTime = todayHours.close;
        }

        // Названия дней
        const daysOfWeek = config.labels?.days || [
            'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
        ];

        // Генерируем HTML строк
        const hoursHTML = config.hours.map((dayHours, index) => {
            const isCurrent = index === dayIndex;
            const dayName = daysOfWeek[index] || `День ${index}`;
            const timeText = dayHours.closed ? 
                (config.labels?.closed || 'Закрыто') : 
                `${dayHours.open}–${dayHours.close}`;
            
            return `
                <div class="bhw-hours-row ${isCurrent ? 'current-day' : ''}">
                    <span class="bhw-day-name">${escapeHtml(dayName)}</span>
                    <span class="bhw-hours-time ${dayHours.closed ? 'closed' : ''}">${escapeHtml(timeText)}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="bhw-widget">
                <div class="bhw-header">
                    <h2 class="bhw-business-name">${escapeHtml(config.businessName || 'Часы работы')}</h2>
                    <div class="bhw-status-badge ${isOpen ? '' : 'closed'}">
                        ${config.icon ? `${escapeHtml(config.icon)} ` : '● '}${escapeHtml(isOpen ? (config.labels?.open || 'Открыто') : (config.labels?.closed || 'Закрыто'))}
                    </div>
                </div>
                
                <div class="bhw-hours-table">
                    ${hoursHTML}
                </div>
                
                ${isOpen && closingTime ? `
                    <div class="bhw-closing-info">
                        ${escapeHtml(config.labels?.closesAt || 'Закрываемся в')} ${escapeHtml(closingTime)}
                    </div>
                ` : ''}
                
                ${config.timezone ? `
                    <div class="bhw-timezone-info">
                        ${escapeHtml(config.labels?.timezone || 'Время')}: ${escapeHtml(config.timezone)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Получение времени с учетом часового пояса
    function getTimeInTimezone(timezone) {
        if (!timezone) {
            const now = new Date();
            return { 
                dayIndex: now.getDay(), 
                minutesNow: now.getHours() * 60 + now.getMinutes() 
            };
        }

        try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'short',
                hour12: false
            });
            
            const parts = formatter.formatToParts(now);
            const hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
            const minutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
            const weekday = parts.find(p => p.type === 'weekday')?.value?.toLowerCase();
            
            const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
            const dayIndex = dayMap[weekday?.slice(0, 3)] ?? now.getDay();
            
            return { 
                dayIndex, 
                minutesNow: hours * 60 + minutes 
            };
        } catch (error) {
            console.warn('[BusinessHoursWidget] Ошибка timezone, используем локальное время:', error);
            const now = new Date();
            return { 
                dayIndex: now.getDay(), 
                minutesNow: now.getHours() * 60 + now.getMinutes() 
            };
        }
    }

    function parseTime(timeStr) {
        const [hours, minutes] = String(timeStr).split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function showError(container, clientId, message) {
        container.innerHTML = `
            <div class="bhw-widget bhw-error">
                <h3 style="margin: 0 0 15px 0;">⏰ Виджет недоступен</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 0.9em;">ID: ${escapeHtml(clientId)}</p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; opacity: 0.8;">Подробности</summary>
                    <p style="margin: 10px 0 0 0; font-size: 0.8em; opacity: 0.7;">${escapeHtml(message)}</p>
                </details>
            </div>
        `;
    }
})();
