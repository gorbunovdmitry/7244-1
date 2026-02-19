// Функция для рендеринга заглушки
function renderPlaceholder() {
    const app = document.getElementById('app');
    
    // Отправляем событие просмотра финальной страницы только один раз за сессию
    if (!sessionStorage.getItem('endPageViewed')) {
        sendAnalyticsEvent('7244_end_page_view_var1');
        sessionStorage.setItem('endPageViewed', '1');
    }
    
    app.innerHTML = `
        <div class="placeholder">
            <img src="img/moai.png" alt="Moai" class="placeholder__img" />
            <div class="placeholder__title">Только тссс</div>
            <div class="placeholder__desc">
                Вы поучаствовали в очень важном исследовании, которое поможет улучшить продукт. Вы – наш герой!
            </div>
        </div>
    `;
    
    // Очищаем историю, чтобы нельзя было вернуться назад
    history.replaceState(null, '', location.href);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    
    // Если уже была показана заглушка, показываем её сразу
    if (localStorage.getItem('7244_placeholderShown_var1') === '1') {
        renderPlaceholder();
        return;
    }
    
    const smsItems = document.querySelectorAll('.sms-item');
    const applyButton = document.getElementById('applyButton');
    
    // Отправка события просмотра лендинга (один раз за сессию)
    if (!hasPageViewBeenSent()) {
        sendAnalyticsEvent('7244_page_view_var1');
        markPageViewAsSent();
    }
    
    // По умолчанию выбираем первый шаблон
    if (smsItems.length > 0) {
        smsItems[0].classList.add('active');
    }
    
    // Обработчик клика на шаблон SMS
    smsItems.forEach(item => {
        item.addEventListener('click', function() {
            // Снимаем выбор со всех элементов
            smsItems.forEach(i => i.classList.remove('active'));
            // Выбираем текущий элемент
            this.classList.add('active');
            updateApplyButton();
        });
    });
    
    // Функция обновления состояния кнопки "Применить"
    function updateApplyButton() {
        const activeItems = document.querySelectorAll('.sms-item.active');
        if (activeItems.length === 0) {
            applyButton.disabled = true;
            applyButton.textContent = 'Выберите шаблон';
        } else {
            applyButton.disabled = false;
            applyButton.textContent = 'Применить';
        }
    }
    
    // Обработчик клика на кнопку "Применить"
    applyButton.addEventListener('click', function() {
        const activeItems = document.querySelectorAll('.sms-item.active');
        
        if (activeItems.length === 0) {
            alert('Пожалуйста, выберите шаблон сообщения');
            return;
        }
        
        const selectedTemplate = activeItems[0].getAttribute('data-template');
        
        // Определяем букву для события (1=A, 2=B, 3=C, 4=D)
        const variantMap = {
            '1': 'A',
            '2': 'B',
            '3': 'C',
            '4': 'D'
        };
        const variant = variantMap[selectedTemplate] || 'A';
        
        // Отправка события клика по кнопке "Применить"
        const eventName = `7244_click_continue${variant}_var1`;
        sendAnalyticsEvent(eventName);
        
        console.log('Выбранный шаблон:', selectedTemplate, 'Variant:', variant);
        
        // Отключаем кнопку
        applyButton.disabled = true;
        
        // Сохраняем флаг показа заглушки
        localStorage.setItem('7244_placeholderShown_var1', '1');
        
        // Показываем заглушку моментально
        renderPlaceholder();
    });
    
    // Инициализация состояния кнопки
    updateApplyButton();
});
