/**
 * Demo (seed) data for the church website.
 *
 * CONTENT ACCURACY NOTES:
 * - All Bible quotations below follow the Russian Synodal translation with
 *   accurate book/chapter/verse references. Where wording is a paraphrase,
 *   it is explicitly marked as «пересказ».
 * - Belief summaries align with the Seventh-day Adventist Church's official
 *   28 Fundamental Beliefs (grouped and shortened for the website — the full
 *   official text is available at adventist.org). No invented theology.
 * - Names, phone numbers and addresses are realistic-looking placeholders.
 *
 * Tajik (tj) fields left as "" are intentionally untranslated; the i18n layer
 * renders them as "[TJ translation needed] <russian text>" so translators can
 * find them. NEVER silently fall back to Russian without the marker.
 */

import type { ChurchData, Lesson, ServiceItem, Sermon } from "./types";

let idCounter = 0;
export function uid(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/** Returns the ISO date (YYYY-MM-DD) of the Sabbath `weeksBack` weeks before the upcoming/current one. */
function sabbathDate(weeksBack: number): string {
  const d = new Date();
  // Days until next Saturday (6). If today is Saturday use today.
  const day = d.getDay();
  const diff = (6 - day + 7) % 7;
  d.setDate(d.getDate() + diff - weeksBack * 7);
  return d.toISOString().slice(0, 10);
}

export function createSeedData(): ChurchData {
  const services: ServiceItem[] = [
    {
      id: uid("svc"),
      weekday: 6, // Saturday — Sabbath
      time: "09:30",
      title: { ru: "Субботняя школа", tj: "Мактаби Саббат" },
      description: {
        ru: "Тёплая встреча с песнями и изучением Библии в небольших группах. Уроки подходят и для тех, кто впервые в церкви.",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("svc"),
      weekday: 6,
      time: "11:00",
      title: { ru: "Божественное богослужение", tj: "" },
      description: {
        ru: "Главное богослужение недели: молитва, пение общины и проповедь. Дети приглашаются на детскую программу во время проповеди.",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("svc"),
      weekday: 5, // Friday
      time: "17:00",
      title: { ru: "Встреча наступления Субботы", tj: "" },
      description: {
        ru: "Спокойный вечерний час песен, короткого слова и молитвы, когда заканчивается пятница и наступает Суббота.",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("svc"),
      weekday: 2, // Wednesday
      time: "18:00",
      title: { ru: "Молитвенная встреча", tj: "" },
      description: {
        ru: "Небольшая группа собирается, чтобы вместе помолиться о нуждах общины, города и личных просьбах.",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("svc"),
      weekday: 3, // Thursday
      time: "17:30",
      title: { ru: "Библейские курсы", tj: "" },
      description: {
        ru: "Спокойные беседы о Библии для всех желающих — без обязательств, в дружеской обстановке. Запись не требуется.",
        tj: "",
      },
      published: true,
    },
  ];

  const lessons: Lesson[] = [
    {
      id: uid("les"),
      number: 1,
      title: { ru: "Рабы греха, наследники благодати", tj: "" },
      summary: {
        ru: "Апостол Павел начинает послание с хорошей новости: прежде чем говорить о наших ошибках, он говорит о благодати Божьей, которая приходит к каждому из нас даром.",
        tj: "",
      },
      keyVerse: {
        ru: "Получая оправдание даром, по благодати Его, искуплением во Христе Иисусе.",
        tj: "",
      },
      verseRef: { ru: "Римлянам 3:24", tj: "" },
      startDate: sabbathDate(3),
      published: true,
    },
    {
      id: uid("les"),
      number: 2,
      title: { ru: "Оправдание верой", tj: "" },
      summary: {
        ru: "Спасение — не награда за достижения, а дар, который мы принимаем верой. На уроке мы рассмотрим пример Авраама, поверившего Богу.",
        tj: "",
      },
      keyVerse: {
        ru: "Итак, оправдавшись верою, мы имеем мир с Богом через Господа нашего Иисуса Христа.",
        tj: "",
      },
      verseRef: { ru: "Римлянам 5:1", tj: "" },
      startDate: sabbathDate(2),
      published: true,
    },
    {
      id: uid("les"),
      number: 3,
      title: { ru: "Новая жизнь во Христе", tj: "" },
      summary: {
        ru: "Крещение — это не просто обряд, а начало новой жизни. Что значит каждый день «ходить в обновлённой жизни»?",
        tj: "",
      },
      keyVerse: {
        ru: "Итак мы погреблись с Ним крещением в смерть, чтобы, как Христос воскрес из мёртвых славою Отца, так и нам ходить в обновлённой жизни.",
        tj: "",
      },
      verseRef: { ru: "Римлянам 6:4", tj: "" },
      startDate: sabbathDate(1),
      published: true,
    },
    {
      id: uid("les"),
      number: 4,
      title: { ru: "Нет осуждения во Христе", tj: "" },
      summary: {
        ru: "Внутренняя борьба знакома каждому верующему. Урок о том, как Дух Святой помогает жить победой, а не чувством вины.",
        tj: "",
      },
      keyVerse: {
        ru: "Ныне нет никакого осуждения тем, которые во Христе Иисусе живут не по плоти, но по духу.",
        tj: "",
      },
      verseRef: { ru: "Римлянам 8:1", tj: "" },
      startDate: sabbathDate(0),
      published: true,
    },
    {
      id: uid("les"),
      number: 5,
      title: { ru: "Божий народ и обетования", tj: "" },
      summary: {
        ru: "Бог верен Своим обещаниям. Говорим о том, как безграничная мудрость Божья соединяет Свои обетования со свободой человека.",
        tj: "",
      },
      keyVerse: {
        ru: "О, бездна богатства и премудрости и ведения Божия! Как непостижимы судьбы Его и неисследимы пути Его!",
        tj: "",
      },
      verseRef: { ru: "Римлянам 11:33", tj: "" },
      startDate: sabbathDate(-1),
      published: true,
    },
    {
      id: uid("les"),
      number: 6,
      title: { ru: "Любовь — исполнение закона", tj: "" },
      summary: {
        ru: "Как жить с людьми, которые думают иначе? Практический урок о нежности, терпении и любви, которая не притворяется.",
        tj: "",
      },
      keyVerse: {
        ru: "Будьте братолюбивы друг к другу с нежностью; в почтительности друг друга предупреждайте.",
        tj: "",
      },
      verseRef: { ru: "Римлянам 12:10", tj: "" },
      startDate: sabbathDate(-2),
      published: true,
    },
  ];

  const sermons: Sermon[] = [
    {
      id: uid("ser"),
      title: { ru: "Живая вода для уставшей души", tj: "" },
      speaker: { ru: "пастор Виктор Нестеров", tj: "" },
      date: sabbathDate(0),
      scripture: { ru: "Иоанна 4:1–26", tj: "" },
      summary: {
        ru: "История встречи Иисуса с самарянкой у колодца. О человеке, который обещает утолить жажду, которую не утоляет ни вода, ни успех, ни отношения.",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("ser"),
      title: { ru: "Свет, который нельзя спрятать", tj: "" },
      speaker: { ru: "пастор Виктор Нестеров", tj: "" },
      date: sabbathDate(1),
      scripture: { ru: "Матфея 5:14–16", tj: "" },
      summary: {
        ru: "Каждый верующий призван быть маленьким светом в своём доме, на работе и во дворе. Как светить, не ослепляя и не уставая?",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("ser"),
      title: { ru: "Суббота — дар покоя", tj: "" },
      speaker: { ru: "пресвитер Ильдар Сафин", tj: "" },
      date: sabbathDate(2),
      scripture: { ru: "Марка 2:27; Исайя 58:13, 14 (пересказ)", tj: "" },
      summary: {
        ru: "Суббота — не обуза, а подарок: день, когда можно остановиться, выдохнуть и провести время с Богом и близкими.",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("ser"),
      title: { ru: "Не бойся, только веруй", tj: "" },
      speaker: { ru: "пастор Виктор Нестеров", tj: "" },
      date: sabbathDate(3),
      scripture: { ru: "Марка 5:21–43", tj: "" },
      summary: {
        ru: "Две истории отчаяния и надежды: отец, потерявший дочь, и женщина, боровшаяся с болезнью двенадцать лет. Оба услышали одни и те же слова.",
        tj: "",
      },
      published: true,
    },
    {
      id: uid("ser"),
      title: { ru: "Дом молитвы для всех народов", tj: "" },
      speaker: { ru: "диакон Руслан Каримов", tj: "" },
      date: sabbathDate(4),
      scripture: { ru: "Исайя 56:7", tj: "" },
      summary: {
        ru: "Бог называет Свой дом домом молитвы для всех народов. Какая дверь открыта для соседа, гостя и каждого, кто ищет Бога.",
        tj: "",
      },
      published: true,
    },
  ];

  return {
    services,
    lessons,
    sermons,
    prayers: [
      {
        id: uid("pr"),
        name: null,
        contact: null,
        anonymous: true,
        text: "Прошу помолиться о здоровье моей мамы. Врачи назначили обследование, и нам очень нужен мир и доверие Богу в эти недели.",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: "in_prayer",
        isPublic: true,
        comments: [
          {
            id: uid("pc"),
            author: "moderator",
            text: "Взяли в список молитвенной встречи в среду.",
            createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          },
        ],
      },
      {
        id: uid("pr"),
        name: "Мария",
        contact: null,
        anonymous: false,
        text: "Молитесь, пожалуйста, о поиске работы. Хочу быть полезной людям и не терять доверие Богу в этот период ожидания.",
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        status: "new",
        isPublic: true,
        comments: [],
      },
      {
        id: uid("pr"),
        name: "Семья Ахмедовых",
        contact: null,
        anonymous: false,
        text: "Благодарим за молитвы о нашей поездке — дорога прошла спокойно. Просим помолиться о новом доме, чтобы в нём всегда был гостеприимный очаг.",
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        status: "prayed",
        isPublic: true,
        comments: [],
      },
    ],
    messages: [
      {
        id: uid("msg"),
        name: "Анна",
        email: "anna.demo@example.com",
        phone: "",
        message:
          "Здравствуйте! Хотела бы прийти с детьми на богослужение впервые. Подскажите, есть ли детская комната и во сколько лучше подойти?",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        read: false,
      },
      {
        id: uid("msg"),
        name: "Дмитрий",
        email: "dmitry.demo@example.com",
        phone: "+992 90 000-00-00",
        message:
          "Добрый день. Интересуют библейские курсы по четвергам. Нужно ли что-то читать заранее или приносить с собой?",
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        read: true,
      },
    ],
    announcements: [
      {
        id: uid("ann"),
        title: { ru: "Дружеский обед после богослужения", tj: "" },
        text: {
          ru: "В ближайшую Субботу после богослужения приглашаем всех на простой дружеский обед в зале общины. Приходите знакомиться — гостей ждать с радостью!",
          tj: "",
        },
        startDate: sabbathDate(0),
        pinned: true,
        published: true,
      },
      {
        id: uid("ann"),
        title: { ru: "Сбор книг и канцелярии для детей", tj: "" },
        text: {
          ru: "Община собирает детские книги, альбомы и канцелярию для семей из села. Коробка для сбора стоит в холле по Субботам.",
          tj: "",
        },
        startDate: sabbathDate(1),
        pinned: false,
        published: true,
      },
    ],
    customPages: [
      {
        id: uid("page"),
        slug: "molodezh",
        title: { ru: "Молодёжное служение", tj: "" },
        content: {
          ru: "## Молодёжная встреча\nКаждую неделю молодёжь общины собирается для дружеского общения, изучения Библии и служения городу.\n\n## Чем мы занимаемся\n- Изучаем Библию в открытой беседе\n- Проводим субботы служения для соседей\n- Учимся песням и участвуем в прославлении\n\nПриходите познакомиться — дверь открыта для всех.",
          tj: "",
        },
        published: true,
        showInNav: true,
        createdAt: new Date().toISOString(),
      },
    ],
    videos: [
      {
        id: uid("vid"),
        title: { ru: "Запись богослужения (демо)", tj: "" },
        description: {
          ru: "Демо-карточка. Подключите YouTube API-ключ в панели администратора, чтобы загружать реальные видео с канала церкви.",
          tj: "",
        },
        videoId: null,
        source: "seed",
      },
      {
        id: uid("vid"),
        title: { ru: "Молитвенная встреча (демо)", tj: "" },
        description: {
          ru: "Демо-карточка видеогалереи. Плейсхолдер показывается, пока у видео нет ссылки.",
          tj: "",
        },
        videoId: null,
        source: "seed",
      },
      {
        id: uid("vid"),
        title: { ru: "Прославление общины (демо)", tj: "" },
        description: {
          ru: "Здесь может появиться запись хора или группы прославления церкви.",
          tj: "",
        },
        videoId: null,
        source: "seed",
      },
      {
        id: uid("vid"),
        title: { ru: "Свидетельство члена общины (демо)", tj: "" },
        description: {
          ru: "Короткие истории веры — один из самых тёплых форматов видеогалереи.",
          tj: "",
        },
        videoId: null,
        source: "seed",
      },
    ],
    users: [
      {
        id: uid("usr"),
        username: "admin",
        password: "admin123",
        displayName: "Администратор",
        role: "superadmin",
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("usr"),
        username: "editor",
        password: "editor123",
        displayName: "Редактор",
        role: "editor",
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("usr"),
        username: "moderator",
        password: "moderator123",
        displayName: "Модератор",
        role: "moderator",
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("usr"),
        username: "viewer",
        password: "viewer123",
        displayName: "Наблюдатель",
        role: "viewer",
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
      churchName: {
        ru: "Церковь христиан Адвентистов Седьмого дня «Надежда»",
        tj: "",
      },
      address: { ru: "г. Душанбе, ул. Примерная, 12 (демо-адрес)", tj: "" },
      phone: "+992 90 000-00-00",
      email: "salom@nadezhda-church.example",
      youtubeApiKey: "",
      youtubeChannelId: "",
    },
    textOverrides: {},
    actionLog: [
      {
        id: uid("log"),
        at: new Date().toISOString(),
        user: "system",
        action: "Демо-данные инициализированы",
        details: "Созданы стандартные записи: расписание, уроки, проповеди, объявления.",
      },
    ],
  };
}
