document.addEventListener('DOMContentLoaded', () => {
    // 1. Data for the Table
    const fraudData = [
        { type: 'Фишинг', cases: 1450, damage: 12.5, year: 2023 },
        { type: 'Скимминг', cases: 890, damage: 5.2, year: 2022 },
        { type: 'Социальная инженерия', cases: 2100, damage: 34.0, year: 2024 },
        { type: 'Крипто-фрод', cases: 450, damage: 18.7, year: 2023 },
        { type: 'Фишинг', cases: 1800, damage: 15.1, year: 2024 },
        { type: 'Социальная инженерия', cases: 2600, damage: 42.5, year: 2025 },
        { type: 'Скимминг', cases: 700, damage: 4.1, year: 2023 },
        { type: 'Крипто-фрод', cases: 620, damage: 25.3, year: 2024 },
        { type: 'Фишинг', cases: 950, damage: 8.4, year: 2022 },
    ];

    let currentData = [...fraudData];

    // Table Elements
    const tableBody = document.getElementById('table-body');
    const filterType = document.getElementById('filter-type');
    const filterYear = document.getElementById('filter-year');
    const tableHeaders = document.querySelectorAll('#fraud-table th');
    const insightText = document.getElementById('insight-text');

    // 2. Table Implementation
    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = `
                <tr>
                    <td>${item.type}</td>
                    <td>${item.cases.toLocaleString()}</td>
                    <td>${item.damage}</td>
                    <td>${item.year}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
        updateInsights(data);
    }

    function filterData() {
        const type = filterType.value;
        const year = filterYear.value;

        currentData = fraudData.filter(item => {
            const matchesType = type === 'all' || item.type === type;
            const matchesYear = year === 'all' || item.year.toString() === year;
            return matchesType && matchesYear;
        });

        renderTable(currentData);
    }

    function sortData(column) {
        const typeMap = {
            'type': 'string',
            'cases': 'number',
            'damage': 'number',
            'year': 'number'
        };

        const type = typeMap[column];

        currentData.sort((a, b) => {
            if (type === 'string') {
                return a[column].localeCompare(b[column]);
            } else {
                return b[column] - a[column]; // Default desc
            }
        });

        renderTable(currentData);
    }

    function updateInsights(data) {
        if (data.length === 0) {
            insightText.innerText = "Нет данных для отображения.";
            return;
        }
        const totalDamage = data.reduce((sum, item) => sum + item.damage, 0).toFixed(1);
        const topType = [...data].sort((a, b) => b.damage - a.damage)[0].type;
        insightText.innerText = `Аналитика: В выбранном сегменте общий ущерб составил $${totalDamage} млн. Наиболее критической угрозой является "${topType}". Рекомендуется усилить протоколы мониторинга.`;
    }

    // Event Listeners for Table
    filterType.addEventListener('change', filterData);
    filterYear.addEventListener('change', filterData);

    tableHeaders.forEach(th => {
        th.addEventListener('click', () => {
            const col = th.getAttribute('data-sort');
            sortData(col);
        });
    });

    // 3. AI Agent Simulation
    const checkUpdatesBtn = document.getElementById('check-updates');
    const agentLog = document.getElementById('agent-log');
    const agentStatus = document.getElementById('agent-status');

    function addLog(message) {
        const entry = document.createElement('div');
        entry.classList.add('log-entry');
        entry.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
        agentLog.prepend(entry);
    }

    checkUpdatesBtn.addEventListener('click', () => {
        checkUpdatesBtn.disabled = true;
        checkUpdatesBtn.innerText = 'Анализ...';
        agentStatus.querySelector('.status-indicator').classList.add('active');
        agentStatus.querySelector('.status-text').innerText = 'Статус: Активный поиск';

        addLog('Запрос к внешним API новостей безопасности...');

        setTimeout(() => {
            addLog('Обнаружен новый отчет: Рост фишинга в банковском секторе на 12% за Q3.');
        }, 800);

        setTimeout(() => {
            addLog('Анализ корреляции с базой данных GuardWealth...');
        }, 1600);

        setTimeout(() => {
            addLog('Рекомендация: Обновите данные за 2025 год.');
            agentStatus.querySelector('.status-text').innerText = 'Статус: Рекомендация готова';
            checkUpdatesBtn.disabled = false;
            checkUpdatesBtn.innerText = 'Проверить актуальность данных';

            // Simulation of data update
            if (!fraudData.find(d => d.damage === 55.5)) {
                fraudData.push({ type: 'Социальная инженерия', cases: 3100, damage: 55.5, year: 2025 });
                addLog('Добавлена новая запись в аналитическую таблицу.');
                filterData();
            }
        }, 2500);
    });

    // 4. Chatbot Logic
    // 4. Chatbot Logic
    const chatWidget = document.getElementById('chat-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const sendMsg = document.getElementById('send-msg');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const suggestions = document.querySelectorAll('.suggest-btn');

    function toggleChat() {
        chatWidget.classList.toggle('chat-closed');
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', sender);

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        msgDiv.innerHTML = `${text.replace(/\n/g, '<br>')} <span style="display:block; font-size:0.75rem; opacity:0.5; margin-top:8px; text-align:right;">${time}</span>`;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        typingIndicator.classList.remove('typing-hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        typingIndicator.classList.add('typing-hidden');
    }

    async function handleChat(customText = null) {
        const text = customText || userInput.value.trim();
        if (!text) return;

        if (!customText) {
            appendMessage(text, 'user');
            userInput.value = '';
        } else {
            appendMessage(text, 'user');
        }

        // Intelligent chatbot with predefined responses
        showTyping();

        // Simulate processing delay
        setTimeout(() => {
            hideTyping();
            const reply = getSmartReply(text);
            appendMessage(reply, 'ai');
        }, 1000);
    }

    function getSmartReply(userMessage) {
        const msg = userMessage.toLowerCase();

        // Keyword-based responses
        if (msg.includes('защит') || msg.includes('безопас')) {
            return 'GuardWealth AI использует передовые алгоритмы машинного обучения для выявления подозрительных транзакций в режиме реального времени. Наша система анализирует более 50 параметров каждой операции и блокирует мошеннические действия до их завершения.';
        }

        if (msg.includes('фрод') || msg.includes('мошенн') || msg.includes('вид')) {
            return 'Основные виды финансового мошенничества:\n\n1. **Фишинг** — кража данных через поддельные сайты\n2. **Скимминг** — копирование данных банковских карт\n3. **Социальная инженерия** — манипуляция жертвой для получения доступа\n4. **Крипто-фрод** — мошенничество с криптовалютами\n\nНаша система эффективно обнаруживает все эти типы угроз.';
        }

        if (msg.includes('проект') || msg.includes('о вас') || msg.includes('что это')) {
            return 'GuardWealth AI — это инновационная платформа для мониторинга и предотвращения финансовых преступлений. Мы используем искусственный интеллект для анализа транзакций, выявления аномалий и защиты активов наших клиентов 24/7.';
        }

        if (msg.includes('работа') || msg.includes('как') || msg.includes('принцип')) {
            return 'Наша система работает в три этапа:\n\n1. **Сбор данных** — анализ всех транзакций в реальном времени\n2. **ИИ-анализ** — нейросеть оценивает риски по 50+ параметрам\n3. **Автоматическая блокировка** — подозрительные операции останавливаются мгновенно\n\nТочность обнаружения составляет 98.7%.';
        }

        if (msg.includes('стоимость') || msg.includes('цена') || msg.includes('тариф')) {
            return 'Мы предлагаем гибкие тарифные планы:\n\n• **Базовый** — для малого бизнеса\n• **Профессиональный** — для средних компаний\n• **Корпоративный** — индивидуальные решения\n\nСвяжитесь с нами для расчета стоимости под ваши задачи.';
        }

        if (msg.includes('контакт') || msg.includes('связ') || msg.includes('поддержка')) {
            return 'Наша служба поддержки работает круглосуточно:\n\n📧 Email: support@guardwealth.ai\n📞 Телефон: +7 (700) 123-45-67\n💬 Онлайн-чат: доступен 24/7\n\nМы ответим в течение 15 минут!';
        }

        if (msg.includes('привет') || msg.includes('здравствуй') || msg.includes('добрый')) {
            return 'Здравствуйте! Я — Аврора, ваш ИИ-ассистент GuardWealth. Готова ответить на вопросы о защите финансов, видах мошенничества и возможностях нашей платформы. Чем могу помочь?';
        }

        if (msg.includes('спасибо') || msg.includes('благодар')) {
            return 'Рада помочь! Если у вас возникнут ещё вопросы о финансовой безопасности — обращайтесь в любое время. 😊';
        }

        // Default response for unrecognized queries
        return 'Спасибо за ваш вопрос! Я могу рассказать о:\n\n• Защите от мошенничества\n• Видах финансовых угроз\n• Принципах работы GuardWealth AI\n• Тарифах и возможностях платформы\n\nЗадайте более конкретный вопрос, и я с удовольствием помогу!';
    }

    chatToggle.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    sendMsg.addEventListener('click', () => handleChat());
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            handleChat(btn.innerText);
        });
    });


    // 5. Neural Music
    const musicBtn = document.getElementById('play-music');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            bgMusic.play().catch(err => console.log("Music play blocked by browser"));
            musicBtn.innerHTML = '<span class="icon">⏸</span> Пауза музыки';
            isPlaying = true;
        } else {
            bgMusic.pause();
            musicBtn.innerHTML = '<span class="icon">♪</span> Нейро-музыка';
            isPlaying = false;
        }
    });

    // Initial render
    renderTable(fraudData);
});
