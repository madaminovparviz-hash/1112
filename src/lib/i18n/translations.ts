/**
 * Default site texts — flat keys ("section.name") with RU/TJ values.
 *
 * HOW MISSING TAJIK WORKS: any key whose `tj` is "" renders on the TJ site as
 * "[TJ translation needed] <russian text>". Translators fill them in here or
 * via the admin panel (Панель → Тексты сайта), which stores overrides in the
 * demo database. NEVER auto-fill Tajik with Russian silently.
 *
 * Bible quotations use the Russian Synodal translation with accurate
 * references; paraphrases are explicitly marked «пересказ».
 */

export interface TextEntry {
  ru: string;
  tj: string;
}

export const DEFAULT_TEXTS: Record<string, TextEntry> = {
  // ---------------- common ----------------
  "common.appName": { ru: "Церковь «Надежда»", tj: "Калисои «Умед»" },
  "common.appNameFull": {
    ru: "Церковь христиан Адвентистов Седьмого дня «Надежда»",
    tj: "Калисои адвентистҳои рӯзи ҳафтум «Умед»",
  },
  "common.tagline": { ru: "Место веры, надежды и любви", tj: "Ҷои имон, умед ва муҳаббат" },
  "common.loading": { ru: "Загрузка…", tj: "Бор шуда истодааст…" },
  "common.readMore": { ru: "Подробнее", tj: "Бештар" },
  "common.close": { ru: "Закрыть", tj: "Пӯшидан" },
  "common.send": { ru: "Отправить", tj: "Фиристодан" },
  "common.save": { ru: "Сохранить", tj: "Нигоҳ доштан" },
  "common.cancel": { ru: "Отмена", tj: "Бекор кардан" },
  "common.delete": { ru: "Удалить", tj: "Нест кардан" },
  "common.edit": { ru: "Редактировать", tj: "Таҳрир кардан" },
  "common.add": { ru: "Добавить", tj: "Илова кардан" },
  "common.back": { ru: "Назад", tj: "Бозгашт" },
  "common.search": { ru: "Поиск", tj: "Ҷустуҷӯ" },
  "common.optional": { ru: "необязательно", tj: "ихтиёрӣ" },
  "common.language": { ru: "Язык", tj: "Забон" },
  "common.textSize": { ru: "Размер текста", tj: "Андозаи матн" },
  "common.increaseText": { ru: "Увеличить шрифт", tj: "Калон кардани ҳарф" },
  "common.decreaseText": { ru: "Уменьшить шрифт", tj: "Хурд кардани ҳарф" },
  "common.adminEntry": { ru: "Вход для администрации", tj: "Воридшавӣ барои маъмурон" },
  "common.backToSite": { ru: "Вернуться на сайт", tj: "Ба сайт баргаштан" },
  "common.demoMode": { ru: "Демо-версия", tj: "Намуна" },
  "common.privacyNote": {
    ru: "Демо-режим: все данные хранятся только в вашем браузере (localStorage) и никуда не отправляются.",
    tj: "Реҷаи намуна: ҳамаи маълумот танҳо дар браузери шумо нигоҳ дошта мешавад.",
  },
  "common.of": { ru: "из", tj: "аз" },

  // ---------------- nav ----------------
  "nav.home": { ru: "Главная", tj: "Асосӣ" },
  "nav.about": { ru: "О церкви", tj: "Дар бораи калисо" },
  "nav.schedule": { ru: "Расписание", tj: "Ҷадвали ибодатҳо" },
  "nav.lessons": { ru: "Уроки", tj: "Дарсҳо" },
  "nav.media": { ru: "Медиа", tj: "Медиа" },
  "nav.prayer": { ru: "Молитвенные нужды", tj: "Хоҳишҳои дуо" },
  "nav.contact": { ru: "Контакты", tj: "Тамос" },
  "nav.openMenu": { ru: "Открыть меню", tj: "Кушодани меню" },

  // ---------------- footer ----------------
  "footer.about": {
    ru: "Тёплая община в Душанбе: Библия, молитва и забота друг о друге. Приходите знакомиться — мы рады каждому гостю.",
    tj: "Ҷамъияти гарм дар Душанбе: Библия, дуо ва ғамхории якдигар. Биёед шинос шавед!",
  },
  "footer.navTitle": { ru: "Разделы", tj: "Бахҳо" },
  "footer.contactsTitle": { ru: "Контакты", tj: "Тамос" },
  "footer.timesTitle": { ru: "Богослужения", tj: "Ибодатҳо" },
  "footer.verse": {
    ru: "«Возрадовался я, когда сказали мне: пойдем в дом Господень»",
    tj: "«Вақте ба ман гуфтанд: биёед ба хонаи Худо равем — шод шудам» (таҳрири озод)",
  },
  "footer.verseRef": { ru: "Псалом 121:1", tj: "Забур 121:1" },
  "footer.rights": { ru: "Все права защищены.", tj: "Ҳамаи ҳуқуқҳо ҳифз шудаанд." },
  "footer.adminTitle": { ru: "Панель управления", tj: "Панели идора" },
  "footer.adminHint": { ru: "Для пастора и служителей", tj: "Барои барангузор ва хидматгарон" },
  "footer.timesText": { ru: "Суббота: 9:30 — Субботняя школа, 11:00 — богослужение", tj: "" },

  // ---------------- home ----------------
  "home.hero.badge": { ru: "Все приглашены — приходите как есть", tj: "Ҳама даъват шудаанд — ҳамон гуна ки ҳастед, биёед" },
  "home.hero.title": { ru: "Церковь — это семья, в которой вас ждут", tj: "Калисо — оилаест, ки шуморо интизор аст" },
  "home.hero.subtitle": {
    ru: "Мы — адвентистская община в Душанбе. Каждую Субботу собираемся, чтобы изучать Библию, петь и молиться вместе. Вы приходите как есть — остальное сделает Бог.",
    tj: "",
  },
  "home.hero.btnSchedule": { ru: "Расписание богослужений", tj: "Ҷадвали ибодатҳо" },
  "home.hero.btnPrayer": { ru: "Оставить молитвенную нужду", tj: "Хоҳиши дуо гузоштан" },
  "home.announcements": { ru: "Объявления", tj: "Эълонҳо" },
  "home.announcements.empty": { ru: "Новых объявлений пока нет.", tj: "Ҳоло эълони нав нест." },
  "home.verse.title": { ru: "Стих для размышления", tj: "Оят барои андеша" },
  "home.verse.text": {
    ru: "«Придите ко Мне, все труждающиеся и обремененные, и Я успокою вас»",
    tj: "«Ҳамаи душмандӣ ва бордоршудагон назди Ман биёед, Ман ба шумо оромӣ медиҳам» (таҳрири озод)",
  },
  "home.verse.ref": { ru: "Матфея 11:28", tj: "Матто 11:28" },
  "home.cards.schedule.title": { ru: "Служения недели", tj: "Хидматҳои ҳафта" },
  "home.cards.schedule.text": {
    ru: "Субботняя школа, богослужение, молитвенные встречи — узнайте время и приходите.",
    tj: "",
  },
  "home.cards.lessons.title": { ru: "Уроки Субботней школы", tj: "Дарсҳои Мактаби Саббат" },
  "home.cards.lessons.text": {
    ru: "Читаем, обсуждаем и растём вместе. Подготовьтесь к следующей Субботе заранее.",
    tj: "",
  },
  "home.cards.prayer.title": { ru: "Молитвенные нужды", tj: "Хоҳишҳои дуо" },
  "home.cards.prayer.text": {
    ru: "Команда молитвы готова поддержать вас. Просьба останется в доверии.",
    tj: "",
  },
  "home.cards.media.title": { ru: "Проповеди и видео", tj: "Ваъзҳо ва видео" },
  "home.cards.media.text": {
    ru: "Пропустили встречу? Слушайте записи проповедей и смотрите видео общины.",
    tj: "",
  },
  "home.about.title": { ru: "Кто мы", tj: "Мо киҳоем" },
  "home.about.text": {
    ru: "Мы — часть всемирной семьи Адвентистов Седьмого дня. Наша община открыта для всех: независимо от возраста, опыта и прошлого. В центре — Библия, Иисус и забота друг о друге.",
    tj: "",
  },
  "home.about.link": { ru: "Больше о церкви", tj: "Бештар дар бораи калисо" },
  "home.upcoming.title": { ru: "Ближайшие богослужения", tj: "Ибодатҳои наздик" },
  "home.upcoming.intro": {
    ru: "Самый простой способ познакомиться — прийти в Субботу.",
    tj: "",
  },
  "home.sermons.title": { ru: "Последние проповеди", tj: "Ваъзҳои охирин" },
  "home.sermons.all": { ru: "Все проповеди", tj: "Ҳамаи ваъзҳо" },
  "home.cta.title": { ru: "Первый раз в церкви?", tj: "Нахустин бор дар калисо?" },
  "home.cta.text": {
    ru: "Ничего знать заранее не нужно. Приходите на 10–15 минут раньше — мы познакомимся и проводим вас. Для детей есть своя программа, а после богослужения мы пьём чай.",
    tj: "",
  },
  "home.cta.btn": { ru: "Как нас найти", tj: "Чӣ тавр ёфтан" },
  "home.cta.btn2": { ru: "Написать нам", tj: "Ба мо навиштан" },

  // ---------------- about ----------------
  "about.title": { ru: "О нашей церкви", tj: "Дар бораи калисои мо" },
  "about.subtitle": { ru: "Кто мы, во что верим и чем живём", tj: "Мо киҳоем, ба чӣ имон дорем" },
  "about.intro.title": { ru: "Добро пожаловать в семью «Надежда»", tj: "Хуш омадед ба оилаи «Умед»" },
  "about.intro.text": {
    ru: "Мы — обычные люди: учителя и врачи, студенты и пенсионеры, родители и дети. Нас объединяет желание знать Библию и жить так, как учит Иисус. В нашей общине тепло: здесь здороваются по имени, спрашивают о семье и молятся друг за друга.",
    tj: "",
  },
  "about.history.title": { ru: "Наша история", tj: "Таърихи мо" },
  "about.history.text": {
    ru: "Община началась с нескольких семей, которые в 1990-е годы собирались дома, чтобы читать Библию и петь. С годами нас стало больше, появилась детская комната, библиотека и команда помощи семьям. Но главное осталось прежним: Суббота, Слово и тёплый чай после богослужения.",
    tj: "",
  },
  "about.beliefs.title": { ru: "Во что мы верим", tj: "Ба чӣ имон дорем" },
  "about.beliefs.intro": {
    ru: "Мы — часть всемирной Церкви Адвентистов Седьмого дня. Наши вероучения основаны на Библии и соответствуют 28 фундаментальным вероучениям церкви. Ниже — краткий пересказ главных из них простыми словами.",
    tj: "",
  },
  "about.beliefs.1.title": { ru: "Библия — слово Бога к нам", tj: "Библия — сухани Худо" },
  "about.beliefs.1.text": {
    ru: "Мы принимаем Библию как боговдохновенное слово — надёжное руководство для веры и жизни. Каждый день стараемся читать её открыто и с молитвой.",
    tj: "",
  },
  "about.beliefs.2.title": { ru: "Бог — Отец, Сын и Святой Дух", tj: "Худо — Падар, Писар ва Рӯҳи Муқаддас" },
  "about.beliefs.2.text": {
    ru: "Мы верим в единого Бога, Который открылся нам как Отец, любящий нас; Иисус Христос, спасающий нас; и Святой Дух, пребывающий рядом.",
    tj: "",
  },
  "about.beliefs.3.title": { ru: "Спасение — дар по благодати", tj: "Наҷот — туҳфаи латифат" },
  "about.beliefs.3.text": {
    ru: "Спасение невозможно заработать — это дар Божьей благодати, который мы принимаем верой в Иисуса Христа. Никто из нас не совершен, и потому дверь всегда открыта.",
    tj: "",
  },
  "about.beliefs.4.title": { ru: "Суббота — день покоя", tj: "Саббат — рӯзи оромӣ" },
  "about.beliefs.4.text": {
    ru: "Седьмой день недели — Суббота — особый день отдыха и времени с Богом, установленный ещё при творении мира. Мы собираемся вместе, чтобы благодарить и учиться.",
    tj: "",
  },
  "about.beliefs.5.title": { ru: "Надежда второго пришествия", tj: "Умед ба омадани дуюм" },
  "about.beliefs.5.text": {
    ru: "Мы с радостью ожидаем видимого, буквального возвращения Иисуса. Эта надежда помогает нам жить осмысленно и заботливо уже сегодня.",
    tj: "",
  },
  "about.beliefs.6.title": { ru: "Здоровье и служение людям", tj: "Тандурустӣ ва хидмат" },
  "about.beliefs.6.text": {
    ru: "Тело — храм Святого Духа, поэтому мы бережём здоровье и служим окружающим: помогаем семьям, детям и тем, кому сейчас трудно.",
    tj: "",
  },
  "about.beliefs.note": {
    ru: "Это краткое изложение простыми словами. Полный текст 28 фундаментальных вероучений Церкви АСД доступен на официальном сайте adventist.org.",
    tj: "",
  },
  "about.values.title": { ru: "Ценности нашей общины", tj: "Арзишҳои ҷамъияти мо" },
  "about.values.1.title": { ru: "Тепло и гостеприимство", tj: "Гармӣ ва меҳмоннавозӣ" },
  "about.values.1.text": {
    ru: "У нас нет «своих» и «чужих»: гостей сажают на лучшие места, а после богослужения все остаются на чай.",
    tj: "",
  },
  "about.values.2.title": { ru: "Библия в центре", tj: "Библия дар марказ" },
  "about.values.2.text": {
    ru: "Проповеди и уроки строятся на тексте Писания — с открытыми Библиями и честными вопросами.",
    tj: "",
  },
  "about.values.3.title": { ru: "Семья и дети", tj: "Оила ва кӯдакон" },
  "about.values.3.text": {
    ru: "Для детей — своя программа во время проповеди, для семей — встречи и помощь в трудный период.",
    tj: "",
  },
  "about.values.4.title": { ru: "Молитва", tj: "Дуо" },
  "about.values.4.text": {
    ru: "Мы верим, что молитва меняет сердца. Поэтому в среду мы собираемся молиться о нуждах города и друг друга.",
    tj: "",
  },
  "about.mission.title": { ru: "Наша миссия", tj: "Ҳадафи мо" },
  "about.mission.text": {
    ru: "Знать Иисуса и делиться этой надеждой с городом: словами, песнями, делами милосердия и просто чашкой чая. Мы верим, что каждому нужен дом веры — и стараемся быть таким домом.",
    tj: "",
  },
  "about.verse.text": {
    ru: "«где двое или трое собраны во имя Мое, там Я посреди них»",
    tj: "«ҳамон ҷо, ки ду ё се нафар ба номи Ман ҷамъ шудаанд, Мон дар байни онҳо ҳастам»",
  },
  "about.verse.ref": { ru: "Матфея 18:20", tj: "Матто 18:20" },

  // ---------------- schedule ----------------
  "schedule.title": { ru: "Расписание богослужений", tj: "Ҷадвали ибодатҳо" },
  "schedule.subtitle": { ru: "Приходите в любой день — мы будем рады", tj: "Ҳар рӯзе биёед — хушҳол мешавем" },
  "schedule.intro": {
    ru: "Главное богослужение недели проходит в Субботу — мы начинаем с изучения Библии в группах, а затем служим вместе всей общиной. В будни — молитвенные встречи и библейские курсы.",
    tj: "",
  },
  "schedule.header.time": { ru: "Время", tj: "Вақт" },
  "schedule.header.service": { ru: "Служение", tj: "Хидмат" },
  "schedule.day.0": { ru: "Воскресенье", tj: "якшанбе" },
  "schedule.day.1": { ru: "Понедельник", tj: "душанбе" },
  "schedule.day.2": { ru: "Вторник", tj: "сешанбе" },
  "schedule.day.3": { ru: "Среда", tj: "чоршанбе" },
  "schedule.day.4": { ru: "Четверг", tj: "панҷшанбе" },
  "schedule.day.5": { ru: "Пятница", tj: "ҷумъа" },
  "schedule.day.6": { ru: "Суббота", tj: "шанбе" },
  "schedule.sabbathNote.title": { ru: "Почему мы встречаемся в Субботу?", tj: "Чаро дар Саббат ҷамъ мешавем?" },
  "schedule.sabbathNote.text": {
    ru: "Суббота — седьмой день недели, который Бог благословил ещё при творении мира как день покоя и времени с Ним. Мы не считаем это обузой: Суббота — подарок, в котором есть место семье, природе и тишине.",
    tj: "",
  },
  "schedule.address.title": { ru: "Адрес и как найти", tj: "Суроға" },
  "schedule.address.hint": {
    ru: "В демо указан вымышленный адрес. На реальном сайте здесь будет интерактивная карта и подсказки маршрута.",
    tj: "",
  },
  "schedule.guests.title": { ru: "Гостям", tj: "Ба меҳмонон" },
  "schedule.guests.text": {
    ru: "Приходите на 10–15 минут раньше — встретим, проводим и познакомим. Одежда — любая, в которой вам удобно. Дети могут остаться с вами или пойти на свою программу.",
    tj: "",
  },

  // ---------------- lessons ----------------
  "lessons.title": { ru: "Уроки Субботней школы", tj: "Дарсҳои Мактаби Саббат" },
  "lessons.subtitle": { ru: "Изучаем Библию вместе — каждую Субботу в 9:30", tj: "Бо ҳам Библиямебинамӯзем — ҳар шанбе соати 9:30" },
  "lessons.quarter.label": { ru: "Тема квартала", tj: "Мавзӯи фасл" },
  "lessons.quarter.title": { ru: "Послание к Римлянам: благодать и вера", tj: "" },
  "lessons.lesson": { ru: "Урок", tj: "Дарс" },
  "lessons.keyVerse": { ru: "Стих для заучивания", tj: "Ояти барои ҳифз кардан" },
  "lessons.date": { ru: "Дата изучения", tj: "Санаи омӯзиш" },
  "lessons.download": { ru: "Скачать урок (PDF)", tj: "Гирифтани дарс (PDF)" },
  "lessons.noPdf": { ru: "PDF появится позже — приходите в Субботу!", tj: "" },
  "lessons.view": { ru: "Открыть урок", tj: "Кушодани дарс" },
  "lessons.empty": { ru: "Уроки скоро появятся.", tj: "Дарсҳо ба зудӣ пайдо мешаванд." },
  "lessons.materialsNote": {
    ru: "Материалы носят демонстрационный характер и опираются на текст Послания к Римлянам. Официальные материалы Субботней школы доступны на сайте adventist.org.",
    tj: "",
  },

  // ---------------- media ----------------
  "media.title": { ru: "Медиа", tj: "Медиа" },
  "media.subtitle": { ru: "Проповеди и видеозаписи нашей общины", tj: "Ваъзҳо ва видеҳои ҷамъият" },
  "media.tab.sermons": { ru: "Проповеди", tj: "Ваъзҳо" },
  "media.tab.videos": { ru: "Видео", tj: "Видео" },
  "media.sermons.empty": { ru: "Записи проповедей скоро появятся.", tj: "Сабтҳои ваъзҳо ба зудӣ пайдо мешаванд." },
  "media.sermon.speaker": { ru: "Проповедник", tj: "Воиз" },
  "media.sermon.scripture": { ru: "Отрывок", tj: "Қисми Калом" },
  "media.sermon.date": { ru: "Дата", tj: "Сана" },
  "media.sermon.watch": { ru: "Смотреть видео", tj: "Дидани видео" },
  "media.sermon.listen": { ru: "Слушать аудио", tj: "Гӯш кардани аудио" },
  "media.sermon.notes": { ru: "Конспект (PDF)", tj: "Конспект (PDF)" },
  "media.sermon.summaryTitle": { ru: "Краткое содержание", tj: "Хулоса" },
  "media.videos.empty": { ru: "Видео пока нет.", tj: "Ҳоло видео нест." },
  "media.video.placeholder": { ru: "Видео появится здесь", tj: "Видео дар ин ҷо хоҳад буд" },
  "media.video.placeholderText": {
    ru: "Это демо-плейсхолдер. Когда у карточки появится ссылка YouTube или будет настроен API-ключ канала — здесь откроется плеер.",
    tj: "",
  },
  "media.video.watchOn": { ru: "Смотреть на YouTube", tj: "Дар YouTube дидан" },

  // ---------------- prayer ----------------
  "prayer.title": { ru: "Молитвенные нужды", tj: "Хоҳишҳои дуо" },
  "prayer.subtitle": {
    ru: "«Все заботы ваши возложите на Него, ибо Он печется о вас» — 1 Петра 5:7",
    tj: "«Ҳамаи ғамхориҳои худро ба Ӯ гузоред, чунки Ӯ барои шумо ғамхорӣ мекунад» — 1 Бутрус 5:7 (таҳрири озод)",
  },
  "prayer.form.title": { ru: "Поделиться нуждой", tj: "Баён кардани эҳтиёҷ" },
  "prayer.form.intro": {
    ru: "Ваша просьба попадёт к пастору и команде молитвы. Можно просить анонимно — мы уважаем доверие.",
    tj: "",
  },
  "prayer.form.name": { ru: "Имя", tj: "Ном" },
  "prayer.form.nameHint": { ru: "Можно не указывать", tj: "Метавонед нависед" },
  "prayer.form.contact": { ru: "Телефон или e-mail", tj: "Телефон ё e-mail" },
  "prayer.form.contactHint": { ru: "Только для молитвенной команды, никогда не публикуется", tj: "" },
  "prayer.form.anonymous": { ru: "Отправить анонимно", tj: "Номин фиристодан" },
  "prayer.form.public": { ru: "Показать просьбу на сайте (без контактных данных)", tj: "" },
  "prayer.form.publicHint": { ru: "Если снять отметку — просьбу увидит только команда молитвы.", tj: "" },
  "prayer.form.text": { ru: "О чём помолиться", tj: "Барои чӣ дуо кунем" },
  "prayer.form.textPh": {
    ru: "Расскажите, о чём просить Бога. Это увидит только молитвенная команда.",
    tj: "",
  },
  "prayer.form.submit": { ru: "Отправить молитвенную нужду", tj: "Фиристодани хоҳиш" },
  "prayer.form.required": { ru: "Напишите, пожалуйста, о чём молиться.", tj: "Лутфан нависед, барои чӣ дуо кардан." },
  "prayer.form.success.title": { ru: "Спасибо за доверие", tj: "Ташаккур барои боварӣ" },
  "prayer.form.success.text": {
    ru: "Ваша просьба принята — команда молитвы будет молиться вместе с вами.",
    tj: "",
  },
  "prayer.list.title": { ru: "Просьбы общины", tj: "Хоҳишҳои ҷамъият" },
  "prayer.list.intro": {
    ru: "Просьбы, которые братья и сёстры разрешили показать на сайте. Присоединяйтесь к молитве.",
    tj: "",
  },
  "prayer.list.empty": {
    ru: "Пока нет опубликованных просьб. Ваша может стать первой.",
    tj: "",
  },
  "prayer.list.anonymous": { ru: "Анонимная просьба", tj: "Хоҳиши номин" },
  "prayer.status.new": { ru: "Новая", tj: "Нав" },
  "prayer.status.in_prayer": { ru: "В молитве", tj: "Дар дуо" },
  "prayer.status.prayed": { ru: "Помолились", tj: "Дуо карда шуд" },
  "prayer.status.archived": { ru: "В архиве", tj: "Дар архив" },
  "prayer.privacy.title": { ru: "О приватности", tj: "Дар бораи маҳрамият" },
  "prayer.privacy.text": {
    ru: "В демо-режиме просьбы хранятся только в вашем браузере и никуда не отправляются. Реальная церковь должна использовать защищённую систему с ограниченным доступом — таковы требования заботы о людях.",
    tj: "",
  },
  "prayer.verse.text": {
    ru: "«Не заботьтесь ни о чем, но всегда в молитве и прошении с благодарением открывайте свои нужды Богу»",
    tj: "",
  },
  "prayer.verse.ref": { ru: "Филиппийцам 4:6", tj: "Филиппиён 4:6" },

  // ---------------- contact ----------------
  "contact.title": { ru: "Контакты", tj: "Тамос" },
  "contact.subtitle": { ru: "Мы рядом и всегда рады ответить", tj: "Мо наздикем ва омодаем ҷавоб диҳем" },
  "contact.form.title": { ru: "Написать нам", tj: "Ба мо навиштан" },
  "contact.form.intro": {
    ru: "Вопрос о вере, приглашение на встречу, предложение помощи — напишите, мы ответим с заботой.",
    tj: "",
  },
  "contact.form.name": { ru: "Ваше имя", tj: "Номи шумо" },
  "contact.form.email": { ru: "E-mail", tj: "E-mail" },
  "contact.form.phone": { ru: "Телефон", tj: "Телефон" },
  "contact.form.message": { ru: "Сообщение", tj: "Паём" },
  "contact.form.messagePh": { ru: "Здравствуйте! Я хотел(а) бы…", tj: "Салом! Ман мехостам…" },
  "contact.form.submit": { ru: "Отправить сообщение", tj: "Фиристодани паём" },
  "contact.form.required": {
    ru: "Заполните, пожалуйста, имя, e-mail и сообщение.",
    tj: "Лутфан ном, e-mail ва паёмро пур кунед.",
  },
  "contact.form.emailInvalid": { ru: "Проверьте, пожалуйста, адрес e-mail.", tj: "" },
  "contact.form.success.title": { ru: "Сообщение отправлено", tj: "Паём фиристода шуд" },
  "contact.form.success.text": {
    ru: "Спасибо! Мы ответим при первой возможности.",
    tj: "Ташаккур! Ба зудӣ ҷавоб медиҳем.",
  },
  "contact.address": { ru: "Адрес", tj: "Суроға" },
  "contact.phone": { ru: "Телефон", tj: "Телефон" },
  "contact.email": { ru: "E-mail", tj: "E-mail" },
  "contact.hours": { ru: "Время богослужений", tj: "Вақти ибодатҳо" },
  "contact.hours.text": {
    ru: "Суббота: 9:30 — Субботняя школа, 11:00 — богослужение. Среда: 18:00 — молитвенная встреча.",
    tj: "",
  },
  "contact.map.note": {
    ru: "Здесь будет карта. В демо мы используем тёплую иллюстрацию вместо карты.",
    tj: "",
  },
  "contact.socials": { ru: "Мы в сети", tj: "Мо дар шабака" },
  "contact.socials.note": { ru: "Ссылки на соцсети появятся позже.", tj: "" },

  // ---------------- admin: login & shell ----------------
  "admin.login.title": { ru: "Панель управления", tj: "Панели идора" },
  "admin.login.subtitle": { ru: "Вход для пастора и служителей", tj: "Воридшавӣ барои барангузор" },
  "admin.login.username": { ru: "Имя пользователя", tj: "Номи корбар" },
  "admin.login.password": { ru: "Пароль", tj: "Рамз" },
  "admin.login.submit": { ru: "Войти", tj: "Даромадан" },
  "admin.login.error": { ru: "Неверное имя пользователя или пароль", tj: "Ном ё рамз нодуруст аст" },
  "admin.login.demo": {
    ru: "Демо-доступ: admin / admin123 · editor / editor123 · moderator / moderator123 · viewer / viewer123",
    tj: "",
  },
  "admin.login.privacy": {
    ru: "Демо-режим: учётные записи хранятся в браузере без шифрования. Не используйте настоящие пароли.",
    tj: "",
  },
  "admin.welcome": { ru: "Добро пожаловать", tj: "Хуш омадед" },
  "admin.logout": { ru: "Выйти", tj: "Баромадан" },
  "admin.role": { ru: "Роль", tj: "Нақш" },
  "admin.noAccess": { ru: "У вашей роли нет доступа к этому разделу.", tj: "" },
  "admin.nav.dashboard": { ru: "Обзор", tj: "Кӯрониш" },
  "admin.nav.schedule": { ru: "Расписание", tj: "Ҷадвал" },
  "admin.nav.lessons": { ru: "Уроки", tj: "Дарсҳо" },
  "admin.nav.sermons": { ru: "Проповеди", tj: "Ваъзҳо" },
  "admin.nav.videos": { ru: "Видео", tj: "Видео" },
  "admin.nav.prayers": { ru: "Молитвенные нужды", tj: "Хоҳишҳои дуо" },
  "admin.nav.messages": { ru: "Сообщения", tj: "Паёмҳо" },
  "admin.nav.announcements": { ru: "Объявления", tj: "Эълонҳо" },
  "admin.nav.pages": { ru: "Страницы", tj: "Саҳифаҳо" },
  "admin.nav.texts": { ru: "Тексты сайта", tj: "Матнҳои сайт" },
  "admin.nav.users": { ru: "Пользователи", tj: "Корбарон" },
  "admin.nav.settings": { ru: "Настройки", tj: "Танзимот" },

  // ---------------- admin: dashboard ----------------
  "admin.dashboard.title": { ru: "Обзор", tj: "Кӯрониш" },
  "admin.dashboard.subtitle": { ru: "Короткая сводка по общине", tj: "" },
  "admin.stat.newPrayers": { ru: "Новых молитвенных нужд", tj: "" },
  "admin.stat.unreadMessages": { ru: "Непрочитанных сообщений", tj: "" },
  "admin.stat.lessons": { ru: "Уроков в квартале", tj: "" },
  "admin.stat.sermons": { ru: "Проповедей", tj: "" },
  "admin.stat.services": { ru: "Служений в расписании", tj: "" },
  "admin.stat.pages": { ru: "Дополнительных страниц", tj: "" },
  "admin.dashboard.prayersByStatus": { ru: "Молитвенные нужды по статусам", tj: "" },
  "admin.dashboard.recentActivity": { ru: "Последние действия", tj: "" },
  "admin.dashboard.quickLinks": { ru: "Быстрые действия", tj: "" },
  "admin.quick.addLesson": { ru: "Добавить урок", tj: "" },
  "admin.quick.addSermon": { ru: "Добавить проповедь", tj: "" },
  "admin.quick.addAnnouncement": { ru: "Добавить объявление", tj: "" },
  "admin.quick.openPrayers": { ru: "Молитвенные нужды", tj: "" },

  // ---------------- admin: schedule ----------------
  "admin.schedule.title": { ru: "Расписание богослужений", tj: "Ҷадвали ибодатҳо" },
  "admin.schedule.subtitle": { ru: "Управляйте служениями недели", tj: "" },
  "admin.schedule.add": { ru: "Добавить службу", tj: "" },
  "admin.schedule.weekday": { ru: "День недели", tj: "Рӯзи ҳафта" },
  "admin.schedule.time": { ru: "Время", tj: "Вақт" },
  "admin.schedule.empty": { ru: "Расписание пусто.", tj: "" },

  // ---------------- admin: lessons ----------------
  "admin.lessons.title": { ru: "Уроки Субботней школы", tj: "Дарсҳои Мактаби Саббат" },
  "admin.lessons.subtitle": { ru: "Управляйте уроками квартала", tj: "" },
  "admin.lessons.add": { ru: "Добавить урок", tj: "Илова кардани дарс" },
  "admin.lessons.number": { ru: "Номер урока", tj: "Рақами дарс" },
  "admin.lessons.date": { ru: "Дата изучения (Суббота)", tj: "" },
  "admin.lessons.empty": { ru: "Уроков пока нет.", tj: "" },
  "admin.lessons.quarterInfo": {
    ru: "Тема квартала редактируется в разделе «Тексты сайта» (ключ lessons.quarter.title).",
    tj: "",
  },

  // ---------------- admin: sermons ----------------
  "admin.sermons.title": { ru: "Проповеди", tj: "Ваъзҳо" },
  "admin.sermons.subtitle": { ru: "Список проповедей и записи", tj: "" },
  "admin.sermons.add": { ru: "Добавить проповедь", tj: "Илова кардани ваъз" },
  "admin.sermons.speaker": { ru: "Проповедник", tj: "Воиз" },
  "admin.sermons.date": { ru: "Дата проповеди", tj: "" },
  "admin.sermons.scripture": { ru: "Отрывок Писания", tj: "" },
  "admin.sermons.videoUrl": { ru: "Ссылка или ID видео YouTube", tj: "" },
  "admin.sermons.empty": { ru: "Проповедей пока нет.", tj: "" },

  // ---------------- admin: prayers ----------------
  "admin.prayers.title": { ru: "Молитвенные нужды", tj: "Хоҳишҳои дуо" },
  "admin.prayers.subtitle": { ru: "Статусы, комментарии команды и публикация", tj: "" },
  "admin.prayers.anonymous": { ru: "Анонимно", tj: "Номин" },
  "admin.prayers.contact": { ru: "Контакт (приватно)", tj: "" },
  "admin.prayers.public": { ru: "Публикуется на сайте", tj: "" },
  "admin.prayers.private": { ru: "Видна только команде", tj: "" },
  "admin.prayers.comments": { ru: "Комментарии команды (не публикуются)", tj: "" },
  "admin.prayers.commentPh": { ru: "Заметка пастора или команды молитвы…", tj: "" },
  "admin.prayers.commentAdd": { ru: "Добавить заметку", tj: "" },
  "admin.prayers.noComments": { ru: "Комментариев пока нет.", tj: "" },
  "admin.prayers.empty": { ru: "Молитвенных нужд нет.", tj: "" },
  "admin.prayers.statusChange": { ru: "Изменить статус", tj: "" },
  "admin.prayers.privacyWarning": {
    ru: "Внимание: персональные данные. Демо-хранилище (localStorage) не защищено — для реальной работы подключите backend с ограничением доступа.",
    tj: "",
  },
  "admin.prayers.status.new": { ru: "Новая", tj: "Нав" },
  "admin.prayers.status.in_prayer": { ru: "В молитве", tj: "Дар дуо" },
  "admin.prayers.status.prayed": { ru: "Помолились", tj: "Дуо карда шуд" },
  "admin.prayers.status.archived": { ru: "В архиве", tj: "Дар архив" },

  // ---------------- admin: messages ----------------
  "admin.messages.title": { ru: "Сообщения из формы", tj: "Паёмҳо" },
  "admin.messages.subtitle": { ru: "Обращения посетителей сайта", tj: "" },
  "admin.messages.from": { ru: "От кого", tj: "Аз кӣ" },
  "admin.messages.contact": { ru: "Контакт", tj: "Тамос" },
  "admin.messages.date": { ru: "Дата", tj: "Сана" },
  "admin.messages.markRead": { ru: "Прочитано", tj: "Хонда шуд" },
  "admin.messages.markUnread": { ru: "Непрочитано", tj: "Хонда нашуд" },
  "admin.messages.replyHint": {
    ru: "В демо отправка писем не настроена — ответьте на указанный контакт вручную.",
    tj: "",
  },
  "admin.messages.empty": { ru: "Сообщений нет.", tj: "" },
  "admin.messages.privacyWarning": {
    ru: "Внимание: персональные данные. Демо-хранилище (localStorage) не защищено — для реальной работы подключите backend.",
    tj: "",
  },

  // ---------------- admin: announcements ----------------
  "admin.announcements.title": { ru: "Объявления", tj: "Эълонҳо" },
  "admin.announcements.subtitle": { ru: "Показываются на главной странице", tj: "" },
  "admin.announcements.add": { ru: "Добавить объявление", tj: "Илова кардани эълон" },
  "admin.announcements.date": { ru: "Дата показа", tj: "" },
  "admin.announcements.pinned": { ru: "Закрепить сверху", tj: "" },
  "admin.announcements.empty": { ru: "Объявлений нет.", tj: "" },

  // ---------------- admin: pages ----------------
  "admin.pages.title": { ru: "Дополнительные страницы", tj: "Саҳифаҳои иловагӣ" },
  "admin.pages.subtitle": {
    ru: "Создавайте новые разделы (RU/TJ) и добавляйте их в меню сайта",
    tj: "",
  },
  "admin.pages.add": { ru: "Создать страницу", tj: "Эҷоди саҳифа" },
  "admin.pages.slug": { ru: "Адрес (латиница, без пробелов)", tj: "" },
  "admin.pages.content": { ru: "Содержание (заголовки «## », списки «- »)", tj: "" },
  "admin.pages.showInNav": { ru: "Показывать в меню сайта", tj: "" },
  "admin.pages.published": { ru: "Опубликована", tj: "" },
  "admin.pages.view": { ru: "Открыть на сайте", tj: "" },
  "admin.pages.empty": { ru: "Страниц пока нет.", tj: "" },
  "admin.pages.slugExists": { ru: "Страница с таким адресом уже существует", tj: "" },
  "admin.pages.slugInvalid": { ru: "Адрес: только латинские буквы, цифры и дефис", tj: "" },

  // ---------------- admin: texts ----------------
  "admin.texts.title": { ru: "Тексты сайта", tj: "Матнҳои сайт" },
  "admin.texts.subtitle": { ru: "Правьте надписи и переводы RU/TJ", tj: "" },
  "admin.texts.searchPh": { ru: "Поиск по ключам и текстам…", tj: "" },
  "admin.texts.key": { ru: "Ключ", tj: "Калид" },
  "admin.texts.ruValue": { ru: "Русский текст", tj: "Матни русӣ" },
  "admin.texts.tjValue": { ru: "Таджикский текст", tj: "Матни тоҷикӣ" },
  "admin.texts.changed": { ru: "Изменён", tj: "Тағйирёфта" },
  "admin.texts.reset": { ru: "Вернуть исходный текст", tj: "" },
  "admin.texts.empty": { ru: "Ничего не найдено.", tj: "" },
  "admin.texts.groupNames": {
    ru: "common · общий, nav · меню, footer · подвал, home · главная, about · о церкви, schedule · расписание, lessons · уроки, media · медиа, prayer · молитвы, contact · контакты, admin · панель",
    tj: "",
  },
  "admin.texts.info": {
    ru: "Если таджикский перевод отсутствует, сайт показывает пометку «[TJ translation needed]» и русский текст — так переводчики находят незаполненные места.",
    tj: "",
  },

  // ---------------- admin: videos ----------------
  "admin.videos.title": { ru: "Видеогалерея", tj: "Галереяи видео" },
  "admin.videos.subtitle": { ru: "Карточки для страницы «Медиа»", tj: "" },
  "admin.videos.add": { ru: "Добавить видео", tj: "Илова кардани видео" },
  "admin.videos.videoId": { ru: "YouTube video ID (пусто = плейсхолдер)", tj: "" },
  "admin.videos.thumbnail": { ru: "Ссылка на обложку (необязательно)", tj: "" },
  "admin.videos.empty": { ru: "Видео пока нет.", tj: "" },
  "admin.videos.source.seed": { ru: "Демо", tj: "Намуна" },
  "admin.videos.source.youtube": { ru: "YouTube", tj: "YouTube" },
  "admin.videos.source.manual": { ru: "Вручную", tj: "Дастӣ" },
  "admin.videos.syncHint": {
    ru: "Чтобы загрузить видео с канала церкви, укажите ключ и ID канала в «Настройках» и нажмите «Синхронизировать».",
    tj: "",
  },

  // ---------------- admin: users ----------------
  "admin.users.title": { ru: "Пользователи панели", tj: "Корбарон" },
  "admin.users.subtitle": { ru: "Роли: superadmin · editor · moderator · viewer", tj: "" },
  "admin.users.add": { ru: "Добавить пользователя", tj: "Илова кардани корбар" },
  "admin.users.username": { ru: "Имя пользователя", tj: "Номи корбар" },
  "admin.users.displayName": { ru: "Отображаемое имя", tj: "Номи намоён" },
  "admin.users.password": { ru: "Пароль", tj: "Рамз" },
  "admin.users.role": { ru: "Роль", tj: "Нақш" },
  "admin.users.role.superadmin": { ru: "Superadmin — полный доступ", tj: "" },
  "admin.users.role.editor": { ru: "Editor — редактор содержимого", tj: "" },
  "admin.users.role.moderator": { ru: "Moderator — молитвы и сообщения", tj: "" },
  "admin.users.role.viewer": { ru: "Viewer — только просмотр", tj: "" },
  "admin.users.selfDelete": { ru: "Нельзя удалить свою учётную запись", tj: "" },
  "admin.users.demoWarning": {
    ru: "В демо пароли хранятся в браузере в открытом виде. В продакшене — только хэширование (bcrypt) на сервере.",
    tj: "",
  },
  "admin.users.usernameExists": { ru: "Такое имя пользователя уже занято", tj: "" },

  // ---------------- admin: settings ----------------
  "admin.settings.title": { ru: "Настройки", tj: "Танзимот" },
  "admin.settings.subtitle": { ru: "Общие данные и интеграции", tj: "" },
  "admin.settings.churchName": { ru: "Название церкви", tj: "Номи калисо" },
  "admin.settings.address": { ru: "Адрес", tj: "Суроға" },
  "admin.settings.phone": { ru: "Телефон", tj: "Телефон" },
  "admin.settings.email": { ru: "E-mail", tj: "E-mail" },
  "admin.settings.youtube.title": { ru: "YouTube — YouTube Data API v3", tj: "" },
  "admin.settings.youtube.desc": {
    ru: "Укажите API-ключ и ID канала, чтобы кнопка «Синхронизировать» загружала видео с канала церкви. В этом демо ключ хранится локально — в продакшене ключ должен жить на сервере.",
    tj: "",
  },
  "admin.settings.youtube.key": { ru: "API-ключ (AIza…)", tj: "" },
  "admin.settings.youtube.channel": { ru: "ID канала (UC…)", tj: "" },
  "admin.settings.youtube.sync": { ru: "Синхронизировать видео", tj: "" },
  "admin.settings.youtube.syncing": { ru: "Синхронизация…", tj: "" },
  "admin.settings.youtube.syncOk": { ru: "Видео обновлены", tj: "" },
  "admin.settings.youtube.syncError": { ru: "Не удалось загрузить видео", tj: "" },
  "admin.settings.youtube.noKey": {
    ru: "Сначала укажите API-ключ и ID канала",
    tj: "",
  },
  "admin.settings.youtube.fallback": {
    ru: "Без ключа сайт показывает демо-плейсхолдеры — это нормально.",
    tj: "",
  },
  "admin.settings.data.title": { ru: "Данные и журнал", tj: "" },
  "admin.settings.export": { ru: "Экспорт данных (JSON)", tj: "" },
  "admin.settings.exportOk": { ru: "Файл сохранён", tj: "" },
  "admin.settings.reset": { ru: "Сбросить демо-данные", tj: "" },
  "admin.settings.resetConfirm.title": { ru: "Сбросить все данные?", tj: "" },
  "admin.settings.resetConfirm.text": {
    ru: "Все записи, молитвенные нужды и изменения вернутся к исходному демо-состоянию. Действие необратимо.",
    tj: "",
  },
  "admin.settings.log": { ru: "Журнал действий", tj: "" },
  "admin.settings.logEmpty": { ru: "Журнал пуст.", tj: "" },

  // ---------------- admin: shared bits ----------------
  "admin.table.actions": { ru: "Действия", tj: "Амалҳо" },
  "admin.table.status": { ru: "Статус", tj: "Ҳолат" },
  "admin.table.title": { ru: "Название", tj: "Ном" },
  "admin.table.date": { ru: "Дата", tj: "Сана" },
  "admin.toast.saved": { ru: "Сохранено", tj: "Нигоҳ дошта шуд" },
  "admin.toast.deleted": { ru: "Удалено", tj: "Нест карда шуд" },
  "admin.toast.error": { ru: "Проверьте обязательные поля", tj: "" },
  "admin.form.ruTitle": { ru: "Название (русский)", tj: "Ном (русӣ)" },
  "admin.form.tjTitle": { ru: "Название (таджикский)", tj: "Ном (тоҷикӣ)" },
  "admin.form.ruDescription": { ru: "Описание (русский)", tj: "Тавсиф (русӣ)" },
  "admin.form.tjDescription": { ru: "Описание (таджикский)", tj: "Тавсиф (тоҷикӣ)" },
  "admin.form.ruText": { ru: "Текст (русский)", tj: "Матн (русӣ)" },
  "admin.form.tjText": { ru: "Текст (таджикский)", tj: "Матн (тоҷикӣ)" },
  "admin.form.summaryRu": { ru: "Краткое содержание (русский)", tj: "" },
  "admin.form.summaryTj": { ru: "Краткое содержание (таджикский)", tj: "" },
  "admin.form.verseRu": { ru: "Стих для заучивания (русский)", tj: "" },
  "admin.form.verseTj": { ru: "Стих для заучивания (таджикский)", tj: "" },
  "admin.form.verseRef": { ru: "Ссылка на стих — книга глава:стихи", tj: "" },
  "admin.form.published": { ru: "Опубликовать", tj: "Нашр кардан" },
  "admin.confirmDelete.title": { ru: "Удалить запись?", tj: "" },
  "admin.confirmDelete.text": { ru: "Действие нельзя отменить.", tj: "" },

  // ---------------- custom pages ----------------
  "page.lastUpdated": { ru: "Обновлено", tj: "Таҷдид шуд" },
};

/** Groups shown in admin → Тексты сайта (prefix → friendly label key). */
export const TEXT_GROUP_LABELS: { prefix: string; label: string }[] = [
  { prefix: "common", label: "common — общие" },
  { prefix: "nav", label: "nav — меню" },
  { prefix: "footer", label: "footer — подвал" },
  { prefix: "home", label: "home — главная" },
  { prefix: "about", label: "about — о церкви" },
  { prefix: "schedule", label: "schedule — расписание" },
  { prefix: "lessons", label: "lessons — уроки" },
  { prefix: "media", label: "media — медиа" },
  { prefix: "prayer", label: "prayer — молитвы" },
  { prefix: "contact", label: "contact — контакты" },
  { prefix: "admin", label: "admin — панель" },
  { prefix: "page", label: "page — страницы" },
];
