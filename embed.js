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
            margin-bottom: var(--bhw-header-margin-bottom, 25px);
            position: relative;
            z-index: 1;
        }
        
        .bhw-business-name {
            font-size: var(--bhw-name-size, 1.6em);
            font-weight: var(--bhw-name-weight, 600);
            margin-bottom: var(--bhw-name-margin-bottom, 15px);
            text-shadow: var(--bhw-name-shadow, 0 2px 8px rgba(0,0,0,0.3));
            color: var(--bhw-name-color, inherit);
        }
        
        .bhw-status-badge {
            display: inline-flex;
            align-items: center;
            gap: var(--bhw-badge-gap, 8px);
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
            margin: var(--bhw-table-margin, 20px 0);
            position: relative;
            z-index: 1;
            backdrop-filter: var(--bhw-table-backdrop-filter, blur(10px));
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
            margin: var(--bhw-current-margin, 0 -15px);
            font-weight: var(--bhw-current-day-weight, 600);
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
            font-style: var(--bhw-closed-time-style, italic);
        }
        
        .bhw-closing-info {
            background: var(--bhw-info-bg, rgba(255, 255, 255, 0.2));
            padding: var(--bhw-info-padding, 12px);
            border-radius: var(--bhw-info-radius, 10px);
            text-align: center;
            font-weight: var(--bhw-info-weight, 600);
            margin-bottom: var(--bhw-info-margin-bottom, 15px);
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
            margin-top: var(--bhw-tz-margin-top, 0);
        }
        
        .bhw-loading {
            text-align: center;
            padding: var(--bhw-loading-padding, 40px);
            position: relative;
            z-index: 1;
            color: var(--bhw-loading-text-color, white);
        }
        
        .bhw-spinner {
            width: 40px;
            height: 40px;
            border: var(--bhw-spinner-border, 3px solid rgba(255,255,255,0.3));
            border-top: var(--bhw-spinner-top-border, 3px solid white);
            border-radius: 50%;
            animation: bhw-spin 1s linear infinite;
            margin: var(--bhw-spinner-margin, 0 auto 15px);
        }
        
        .bhw-error {
            background: var(--bhw-error-bg, linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%));
            padding: var(--bhw-error-padding, 30px);
            border-radius: var(--bhw-error-radius, 16px);
            color: var(--bhw-error-text, white);
            text-align: center;
            box-shadow: var(--bhw-error-shadow, 0 15px 40px rgba(255,107,107,0.4));
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

        // Убираем .js расширение
        if (clientId.endsWith('.js')) {
            clientId = clientId.slice(0, -3);
        }

        // Проверяем, не обработан ли уже этот конкретный скрипт
        if (currentScript.dataset.bhwMounted === '1') return;
        currentScript.dataset.bhwMounted = '1';

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

        // Создаем контейнер с уникальным классом
        const uniqueClass = `bhw-${clientId}-${Date.now()}`;
        const container = createContainer(currentScript, clientId, uniqueClass);
        
        // Показываем загрузку
        showLoading(container);

        // Загружаем конфигурацию
        loadConfig(clientId, baseUrl)
            .then(config => {
                applyCustomStyles(container, config, uniqueClass);
                createBusinessHoursWidget(container, config, uniqueClass);
                console.log(`[BusinessHoursWidget] Виджет ${clientId} успешно создан`);
            })
            .catch(error => {
                console.error('[BusinessHoursWidget] Ошибка:', error);
                showError(container, clientId, error.message);
            });

    } catch (error) {
        console.error('[BusinessHoursWidget] Критическая ошибка:', error);
    }

    function createContainer(scriptElement, clientId, uniqueClass) {
        const container = document.createElement('div');
        container.id = `business-hours-widget-${clientId}`;
        container.className = `bhw-container ${uniqueClass}`;
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

    // Загрузка конфигурации
    async function loadConfig(clientId, baseUrl) {
        if (clientId === 'local') {
            const localScript = document.querySelector('#bhw-local-config');
            if (!localScript) {
                throw new Error('Локальный конфиг не найден на странице (#bhw-local-config)');
            }
            try {
                return JSON.parse(localScript.textContent);
            } catch (err) {
                throw new Error('Ошибка парсинга локального конфига: ' + err.message);
            }
        } else {
            const configUrl = `${baseUrl}/configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;
            try {
                const response = await fetch(configUrl, { cache: 'no-cache', headers: { 'Accept': 'application/json' } });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.warn(`[BusinessHoursWidget] Основной конфиг недоступен, используем demo: ${error.message}`);
                const demoResponse = await fetch(`${baseUrl}/configs/demo.json?v=${Date.now()}`, {
                    cache: 'no-cache',
                    headers: { 'Accept': 'application/json' }
                });
                if (!demoResponse.ok) throw new Error('Конфигурация недоступна');
                return await demoResponse.json();
            }
        }
    }

    // Применение кастомных стилей с уникальным классом
    function applyCustomStyles(container, config, uniqueClass) {
        const s = config.styling || {};
        
        // Создаем уникальные стили для этого виджета
        const styleElement = document.createElement('style');
        styleElement.textContent = generateUniqueStyles(uniqueClass, s);
        container.appendChild(styleElement);
    }

    function generateUniqueStyles(uniqueClass, styling) {
        const s = styling;
        const background = s.primaryColor && s.secondaryColor ? 
            `linear-gradient(135deg, ${s.primaryColor} 0%, ${s.secondaryColor} 100%)` : 
            (s.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');

        return `
            .${uniqueClass} {
                font-family: ${s.fontFamily || 'inherit'};
            }
            
            .${uniqueClass} .bhw-widget {
                background: ${background};
                border-radius: ${s.borderRadius || '20px'};
                padding: ${s.padding || '30px'};
                color: ${s.textColor || 'white'};
            }
            
            .${uniqueClass} .bhw-business-name {
                font-size: ${s.businessNameSize || '1.6em'};
            }
            
            @media (max-width: 480px) {
                .${uniqueClass} .bhw-widget {
                    padding: ${s.paddingMobile || '20px'};
                }
                .${uniqueClass} .bhw-business-name {
                    font-size: ${s.nameSizeMobile || '1.4em'};
                }
            }
        `;
    }

    function createBusinessHoursWidget(container, config, uniqueClass) {
        // Получаем текущее время с учетом UTC смещения
        const { dayIndex, minutesNow } = getTimeWithUTCOffset(config.timezone);
        
        // Определяем статус (открыто/закрыто)
        const todayHours = config.hours[dayIndex];
        let isOpen = false;
        let closingTime = '';
        
        if (todayHours && !todayHours.closed && todayHours.open && todayHours.close) {
            const openTime = parseTime(todayHours.open);
            const closeTime = parseTime(todayHours.close);
            
            // Учитываем случай работы через полночь
            if (closeTime < openTime) {
                isOpen = minutesNow >= openTime || minutesNow < closeTime;
            } else {
                isOpen = minutesNow >= openTime && minutesNow < closeTime;
            }
            closingTime = todayHours.close;
        }

        // Названия дней из конфига или дефолтные
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
                
                ${generateTimezoneDisplay(config)}
            </div>
        `;

        // Применяем уникальные стили после создания HTML
        applyCustomStyles(container, config, uniqueClass);
    }

    // ===== НОВЫЕ ФУНКЦИИ ДЛЯ UTC СМЕЩЕНИЙ =====

    // Парсинг UTC смещения - поддерживает: "+3", "-2", "+5:30", "UTC+3", "GMT-7", "0"
    function parseUTCOffset(offset) {
        if (!offset && offset !== 0) return null;

        // Если передано число
        if (typeof offset === 'number') {
            return Math.round(offset * 60); // Часы в минуты
        }

        const str = String(offset).trim().toUpperCase();
        
        // Особые случаи
        if (str === '0' || str === 'UTC' || str === 'GMT' || str === 'Z') {
            return 0;
        }

        // Парсим формат: [UTC|GMT][+|-]HH[:MM]
        const match = str.match(/^(?:UTC|GMT)?([+-]?)(\d{1,2})(?::(\d{2}))?$/);
        if (!match) {
            throw new Error(`Неподдерживаемый формат UTC смещения: ${offset}`);
        }

        const [, sign = '+', hours, minutes = '0'] = match;
        const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
        
        return sign === '-' ? -totalMinutes : totalMinutes;
    }

    // Получение времени с UTC смещением
    function getTimeWithUTCOffset(timezoneOffset) {
        try {
            const offsetMinutes = parseUTCOffset(timezoneOffset);
            
            if (offsetMinutes === null) {
                // Если смещение не указано, используем локальное время
                const now = new Date();
                return { 
                    dayIndex: now.getDay(), 
                    minutesNow: now.getHours() * 60 + now.getMinutes() 
                };
            }

            // Получаем UTC время и применяем смещение
            const now = new Date();
            const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
            const targetTime = new Date(utcTime + (offsetMinutes * 60000));
            
            return {
                dayIndex: targetTime.getDay(),
                minutesNow: targetTime.getHours() * 60 + targetTime.getMinutes()
            };
        } catch (error) {
            console.warn('[BusinessHoursWidget] Ошибка обработки timezone, используем локальное время:', error);
            const now = new Date();
            return { 
                dayIndex: now.getDay(), 
                minutesNow: now.getHours() * 60 + now.getMinutes() 
            };
        }
    }

    // Получение текущего времени с UTC смещением (строка HH:MM)
    function getCurrentTimeWithUTCOffset(timezoneOffset) {
        try {
            const offsetMinutes = parseUTCOffset(timezoneOffset);
            
            if (offsetMinutes === null) {
                return new Date().toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                });
            }

            const now = new Date();
            const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
            const targetTime = new Date(utcTime + (offsetMinutes * 60000));
            
            return targetTime.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        } catch (error) {
            console.warn('[BusinessHoursWidget] Ошибка получения времени:', error);
            return new Date().toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        }
    }

    // Форматирование UTC смещения для отображения
    function formatUTCOffset(offset) {
        try {
            const offsetMinutes = parseUTCOffset(offset);
            
            if (offsetMinutes === null || offsetMinutes === 0) {
                return 'UTC+0';
            }

            const sign = offsetMinutes >= 0 ? '+' : '-';
            const absMinutes = Math.abs(offsetMinutes);
            const hours = Math.floor(absMinutes / 60);
            const minutes = absMinutes % 60;
            
            if (minutes === 0) {
                return `UTC${sign}${hours}`;
            } else {
                return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
            }
        } catch (error) {
            return String(offset || 'UTC');
        }
    }

    // Генерация отображения часового пояса
    function generateTimezoneDisplay(config) {
        if (!config.timezone && config.timezone !== 0) return '';
        
        const timezoneConfig = config.timezoneDisplay || {};
        if (timezoneConfig.show === false) return '';
        
        const template = timezoneConfig.template || '🕐 {label}: {time} ({timezone})';
        const label = config.labels?.timezone || 'Время';
        const timezone = formatUTCOffset(config.timezone);
        const currentTime = getCurrentTimeWithUTCOffset(config.timezone);
        
        const displayText = template
            .replace('{label}', label)
            .replace('{timezone}', timezone)
            .replace('{time}', currentTime);
        
        return `
            <div class="bhw-timezone-info">
                ${escapeHtml(displayText)}
            </div>
        `;
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
