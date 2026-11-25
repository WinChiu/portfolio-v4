const lifeItems = [
  {
    note: 'Life is hard and full of stones.',
    location: 'Sweden, Gotland',
    date: '',
    imageSrc: '/img/web/life/image-life-01.webp',
    imageAlt: 'Life is hard and full of stones.',
  },
  {
    note: 'Try to stay healthy.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-02.webp',
    imageAlt: 'Try to stay healthy.',
  },
  {
    note: 'Mirror is a good friend of solo traveler.',
    location: 'Netherlands, Rotterdam',
    date: '',
    imageSrc: '/img/web/life/image-life-03.webp',
    imageAlt: 'Mirror is a good friend of solo traveler.',
  },
  {
    note: 'Clear from NTU to KTH.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-04.webp',
    imageAlt: 'Clear from NTU to KTH.',
  },
  {
    note: 'Summer.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-05.webp',
    imageAlt: 'Summer.',
  },
  {
    note: "Pity that I'm not there to ski.",
    location: 'Germany, Garmisch-Partenkirchen',
    date: '',
    imageSrc: '/img/web/life/image-life-06.webp',
    imageAlt: "Pity that I'm not there to ski.",
  },
  {
    note: 'I’m done with the wires.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-07.webp',
    imageAlt: 'I’m done with the wires.',
  },
  {
    note: 'Life is a circle.',
    location: 'Denmark, Copenhagen',
    date: '',
    imageSrc: '/img/web/life/image-life-08.webp',
    imageAlt: 'Life is a circle.',
  },
  {
    note: 'Try to move house with bare hands.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-09.webp',
    imageAlt: 'Try to move house with bare hands.',
  },
  {
    note: 'Spring at KTH.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-10.webp',
    imageAlt: 'Spring at KTH.',
  },
  {
    note: 'First ski in my life.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-11.webp',
    imageAlt: 'First ski in my life.',
  },
  {
    note: 'Once and only once, bald.',
    location: 'Taiwan, Taipei',
    date: '',
    imageSrc: '/img/web/life/image-life-12.webp',
    imageAlt: 'Once and only once, bald.',
  },
  {
    note: 'Hell’s kitchen.',
    location: 'Sweden, Gotland',
    date: '',
    imageSrc: '/img/web/life/image-life-13.webp',
    imageAlt: 'Hell’s kitchen.',
  },
  {
    note: 'End of the first stage.',
    location: 'Taiwan, Taipei',
    date: '',
    imageSrc: '/img/web/life/image-life-14.webp',
    imageAlt: 'End of the first stage.',
  },
  {
    note: "That's not my phone.",
    location: 'Taiwan, Chiayi',
    date: '',
    imageSrc: '/img/web/life/image-life-15.webp',
    imageAlt: "That's not my phone.",
  },
  {
    note: 'Daily international student life.',
    location: 'Sweden, Stockholm',
    date: '',
    imageSrc: '/img/web/life/image-life-16.webp',
    imageAlt: 'Daily international student life.',
  },
  {
    note: 'Taiwan is awesome!',
    location: 'Taiwan, Yilan',
    date: '',
    imageSrc: '/img/web/life/image-life-17.webp',
    imageAlt: 'Taiwan is awesome!',
  },
  {
    note: 'I love design.',
    location: 'Taiwan, Taipei',
    date: '',
    imageSrc: '/img/web/life/image-life-18.webp',
    imageAlt: 'I love design.',
  },
  {
    note: 'Marathon with lovely people.',
    location: 'Taiwan, Taipei',
    date: '',
    imageSrc: '/img/web/life/image-life-19.webp',
    imageAlt: 'Marathon with lovely people.',
  },
  {
    note: 'Lake swim with Taiwan’s ex-president.',
    location: 'Taiwan, Nantou',
    date: '',
    imageSrc: '/img/web/life/image-life-20.webp',
    imageAlt: 'Lake swim with Taiwan’s ex-president.',
  },
  {
    note: 'Another group of lovely people.',
    location: 'Taiwan, Yilan',
    date: '',
    imageSrc: '/img/web/life/image-life-21.webp',
    imageAlt: 'Another group of lovely people.',
  },
  {
    note: 'Jump high to reach the sky.',
    location: 'Taiwan, Tainan',
    date: '',
    imageSrc: '/img/web/life/image-life-22.webp',
    imageAlt: 'Jump high to reach the sky.',
  },
  {
    note: 'Let’s go!',
    location: 'Taiwan, Yilan',
    date: '',
    imageSrc: '/img/web/life/image-life-23.webp',
    imageAlt: 'Let’s go!',
  },
];

// Kitchen dishes come from content/kitchen-menu.csv via
// scripts/build-kitchen-menu.js -> content/kitchenMenuData.js (loaded first).
function kitchenMenuItems(lang) {
  return (window.__KITCHEN_MENU__ || []).map((item) => ({
    ...item,
    note: lang === 'zh' ? item.noteZh : item.noteEn,
    imageAlt: lang === 'zh' ? item.nameZh : item.imageAltEn,
  }));
}

window.__HOME_PAGE_CONTENT__ = {
  en: {
    translatorHref: 'home-zh.html',
    translatorLabel: '繁中 | EN',
    navLanguageLabel: '繁 / EN',
    nav: [
      { label: 'Work', href: '#work' },
      { label: 'About', href: '#about' },
      { label: 'Kitchen', href: '#kitchen' },
      { label: 'Life', href: '#life' },
    ],
    hero: {
      eyebrow: "Hi! I'm Win🏅, and I'm a",
      title: 'Product Designer',
      description:
        'I design <span class="highlight">B2B workflows and design systems</span> for healthcare and e-commerce, with 2+ years in the field. Now in Stockholm, studying Interactive Media Technology at KTH, and cooking a lot.',
    },
    workTabs: {
      design: 'Design & Research',
      code: 'Programming',
    },
    about: {
      title: 'About',
      imageSrc: '/img/intro.webp',
      imageAlt: 'Win portrait',
      paragraphs: [
        "Hi! I'm Win, a product designer with 2+ years of experience across e-commerce and B2B healthcare, specializing in complex workflow design and design systems. Currently pursuing a Master's in Interactive Media Technology at KTH, expanding into information visualization and accessibility.",
        'I truly enjoy the hands-on process of building products and the satisfaction that comes from solving real user problems. I believe the value of design lies in the harmony between user experience and a well-defined product strategy. With a cross-field background, I am able to balance business needs, design principles, and feasibility to create comprehensive solutions.',
        "To me, design is not only about solving problems, but also about exploring new possibilities in life. I hope to continue creating meaningful and positive experiences that make a genuine impact on people's lives.",
      ],
      jobs: [
        {
          company: 'KTH Royal Institute of Technology',
          title: 'MSc Interactive Media Technology',
          isPast: false,
        },
        { company: 'Wellell inc.', title: 'Product Designer', isPast: true },
        {
          company: 'National Taiwan University',
          title: 'Design Thinking Coach',
          isPast: true,
        },
        {
          company: 'SHOPLINE Technology Corp., Ltd.',
          title: 'UIUX Intern',
          isPast: true,
        },
        { company: 'PDIS Ray5.0', title: 'UIUX Intern', isPast: true },
      ],
    },
    kitchen: {
      courses: [
        { key: 'rice', zh: '飯', en: 'Rice' },
        { key: 'noodle', zh: '麵', en: 'Noodles' },
        { key: 'main', zh: '主菜', en: 'Mains' },
        { key: 'stew', zh: '湯鍋', en: 'Soups & Stews' },
        { key: 'snack', zh: '小吃', en: 'Street Food' },
        { key: 'sweet', zh: '甜點', en: 'Sweets' },
      ],
      labels: { effort: 'Effort', time: 'Time', course: 'Course', ingredients: 'Ingredients', method: 'Method', prev: 'Prev', next: 'Next', close: 'Close recipe', comingSoon: 'Recipe coming soon.' },
      title: 'Kitchen',
      description:
        'I started to love cooking after I <span class="hl">couldn’t stand bread and meatballs anymore</span> in Sweden.',
      previewLabel: 'Kitchen dish preview',
      items: kitchenMenuItems('en'),
    },
    life: {
      title: 'Life',
      description:
        'Instead of chasing work–life balance, I wish to <span class="hl">enjoy my work and cherish my life</span>.',
      items: lifeItems,
    },
    projects: [
      {
        number: '01',
        title: 'Design System Architecture Design and Organization',
        tag: 'Design System | UIUX Design',
        description:
          'Redesigned the design system architecture, rebuilt components, and reviewed usage scenarios to improve efficiency, speed up onboarding, and maintain integrity and accuracy.',
        imageUrl: '/img/image-projectCover-designSystem.webp',
        coverType: 'component-tray',
        projectUrl: 'pages/en/designSystem.html',
        order: 1,
        type: 'design',
        lang: 'en',
      },
      {
        number: '02',
        title:
          'RFID Integration for a B2B PRC Medical Device Management System',
        tag: 'B2B Medical Saas | UIUX Design',
        description:
          'Integrate an RFID scanning feature into the existing logistics module, providing customers with a more flexible way to track assets.',
        imageUrl: '/img/image-projectCover-rfid.webp',
        projectUrl: 'pages/en/rfid.html',
        hidden: true,
        type: 'design',
        lang: 'en',
      },
      {
        number: '03',
        title:
          'Business Analytics Model Design for B2B PRC Medical Device Management System',
        tag: 'Data Analysis | UX Research',
        description:
          'Identified client needs and system data limitations, designed business analysis reports that enhanced operational efficiency, and incorporated business models to attract clients to upgrade to advanced software plans.',
        imageUrl: '/img/image-projectCover-ba.webp',
        projectUrl: 'pages/en/ba.html',
        hidden: true,
        type: 'design',
        lang: 'en',
      },
      {
        number: '03',
        title:
          'POS TW/HK Payment Gateway Integration - Forward and Reverse Process Design',
        tag: 'Ecommerce | UIUX Design',
        description:
          'Designed the payment integration flow for SHOPLINE POS in Taiwan and Hong Kong. Ensured merchants could quickly complete the payment process and efficiently resolve errors to minimize customer wait times.',
        imageUrl: '/img/image-projectCover-pos.webp',
        projectUrl: 'pages/en/pos.html',
        order: 3,
        type: 'design',
        lang: 'en',
      },
      {
        number: '04',
        title: 'Taipei City Childcare Registration and Lottery System Redesign',
        tag: 'Public Service | UX Research | UX Design',
        description:
          'Conducted user research and redesigned the Taipei City childcare registration and lottery system. Ensured citizens could complete all tasks in one stop, including understanding rules, searching for institutions, and completing registration.',
        imageUrl: '/img/image-projectCover-childcare.webp',
        projectUrl: 'pages/en/childcare.html',
        order: 4,
        type: 'design',
        lang: 'en',
      },
      // {
      //   number: '06',
      //   title: 'Interpreting Message Recall Behavior in IM Communications',
      //   tag: 'UX Research',
      //   description:
      //     'Analyzed how message recipients interpret the behavior of message senders recalling messages. Presented messaging strategies at the TAICHI 2022 HCI Conference (Poster Session).',
      //   imageUrl: '/img/image-projectCover-im.webp',
      //   projectUrl:
      //     'https://drive.google.com/file/d/1mlDUvumGRjlcTlMQWbwnuzDjTTObUxR6/view?usp=sharing',
      //   type: 'design',
      //   lang: 'en',
      // },
      {
        number: '05',
        title:
          'Comparing Haptic and Auditory Guidance in Non-visual Navigation System',
        tag: 'Multimodal Interaction | UX Research',
        description: `Evaluate and compare multimodal navigation systems (haptic and audio) in users' wayfinding performance and subjective experience, exploring the feasibility and design potential of non-visual navigation.`,
        imageUrl: '/img/image-projectCover-wayfinding.webp',
        projectUrl:
          'https://drive.google.com/file/d/1gW0bjl66qyWCAEFt6Bqg6CDiXGYfFeJq/view?usp=sharing',
        order: 5,
        type: 'design',
        lang: 'en',
      },
      {
        number: '06',
        title:
          'Culture Compass: Visualizing Cultural Values Across Countries and 30 Years',
        tag: 'Information Visualization | UIUX Design',
        description:
          'An interactive visualization platform built on the World Values Survey, enabling exploration of cultural value differences across countries, time periods, and demographic groups.',
        imageUrl: '/img/image-projectCover-culture.webp',
        projectUrl: 'https://winchiu.github.io/culture-compass/#/overview',
        order: 6,
        type: 'design',
        lang: 'en',
      },
      {
        number: '02',
        title: 'KeepWell: B2B PRC Medical Device Asset Tracking System Design',
        tag: 'B2B Medical SaaS | UIUX Design',
        description:
          'Designed an asset tracking workflow for medical equipment rental service and deviceOrientation to improve operational efficiency and billing accuracy.',
        imageUrl: '/img/projects/keepwell/image-keepwell-fistImage.webp',
        coverType: 'delivery',
        projectUrl: 'pages/en/keepwell.html',
        order: 2,
        type: 'design',
        lang: 'en',
      },
      {
        number: '01',
        title: 'BizPro: Club Official Website Design and Development',
        tag: 'UIUX Design｜Full-Stack Development',
        description:
          "Assisted BizPro, the NTU Business Research Club, in redesigning their website and subsequent development, improving information readability and highlighting the club's value.",
        imageUrl: '/img/image-projectCover-bp.webp',
        projectUrl: 'pages/en/bizpro.html',
        siteUrl: 'https://www.bizpro-taipei.com',
        type: 'code',
        lang: 'en',
      },
      {
        number: '02',
        title: 'Forest Life: Forest Sustainability Advocacy Website',
        tag: 'Frontend Development',
        description:
          'Created an interactive animation website themed around sustainable forests as part of the SDGs, completed within 50 hours during the 5th Taiwan Youth Hackathon, and won the championship and the Most Popular Award.',
        imageUrl: '/img/image-projectCover-forest.webp',
        projectUrl: 'pages/en/forest.html',
        siteUrl: 'https://forest-life.onrender.com',
        type: 'code',
        lang: 'en',
      },
      {
        number: '03',
        title: 'GongChi: Beiguan Music Mixer Simulation Website',
        tag: 'Frontend Development',
        description:
          "A step-by-step guide explaining the function of each button, combined with a free-play mode, simulating the operation of a physical Beiguan music mixer, 'GongChi.'",
        imageUrl: '/img/image-projectCover-gongChi.webp',
        projectUrl: 'pages/en/gongChi.html',
        siteUrl: 'https://ntust-music-project.onrender.com',
        type: 'code',
        lang: 'en',
      },
      {
        number: '04',
        title: 'Elite Sniper: English Typing Practice and Battle Game',
        tag: 'Programmer',
        description:
          'A typing game with multiple play modes using Python and game libraries, themed around a shooting game. Won the championship at the 2020 Coding 101 competition.',
        imageUrl: '/img/image-projectCover-sniper.webp',
        projectUrl:
          'https://drive.google.com/file/d/1etnJz_AhdmPRFdXBVsFnvT6TVkz3AVjd/view?usp=sharing',
        type: 'code',
        lang: 'en',
      },
    ],
  },
  zh: {
    translatorHref: 'index.html',
    translatorLabel: '繁中 | EN',
    navLanguageLabel: '繁 / EN',
    nav: [
      { label: 'Work', href: '#work' },
      { label: 'About', href: '#about' },
      { label: 'Kitchen', href: '#kitchen' },
      { label: 'Life', href: '#life' },
    ],
    hero: {
      eyebrow: "Hi! I'm Win🏅, and I'm a",
      title: 'Product Designer',
      description:
        '專注於 <span class="highlight">B2B 工具設計</span>、<span class="highlight">設計系統</span>與<a class="highlight block__descriptionLink" href="#kitchen">做菜</a>，具備 2+ 年<span class="highlight">醫療照護</span>與<span class="highlight">電商</span>產業經驗。',
    },
    workTabs: {
      design: 'Design & Research',
      code: 'Programming',
    },
    about: {
      title: 'About',
      imageSrc: '/img/intro.webp',
      imageAlt: 'Win 頭像',
      paragraphs: [
        'Hi！我是 Win，一位經濟系與創意創業學程背景、擁有基礎前端技能和 2+ 年產業經驗的產品設計師，曾在政府部門、電商、B2B 醫療產業協助打造數位產品，目前正於瑞典皇家理工學院（KTH）攻讀 Interactive Media Technology 碩士學位',
        '我十分喜歡親手實作產品的過程，享受以設計師的角度幫他人解決問題，特別是使用者的認同與讚許所帶來的成就感。我相信設計的價值來自於使用者和完善的產品策略，跨領域的背景讓我能以更全面的角度，考量商業需求、設計原則與可行性，並提出完善的設計解決方案。',
        '設計不只是為使用者解決問題，更是為了探索更多生活的可能性；期待未來能繼續以設計師的身份，為使用者帶來正向的影響。',
      ],
      jobs: [
        {
          company: 'KTH Royal Institute of Technology',
          title: 'MSc Interactive Media Technology',
          isPast: false,
        },
        { company: 'Wellell inc.', title: 'Product Designer', isPast: true },
        {
          company: 'National Taiwan University',
          title: 'Design Thinking Coach',
          isPast: true,
        },
        {
          company: 'SHOPLINE Technology Corp., Ltd.',
          title: 'UIUX Intern',
          isPast: true,
        },
        { company: 'PDIS Ray5.0', title: 'UIUX Intern', isPast: true },
      ],
    },
    kitchen: {
      courses: [
        { key: 'rice', zh: '飯', en: 'Rice' },
        { key: 'noodle', zh: '麵', en: 'Noodles' },
        { key: 'main', zh: '主菜', en: 'Mains' },
        { key: 'stew', zh: '湯鍋', en: 'Soups & Stews' },
        { key: 'snack', zh: '小吃', en: 'Street Food' },
        { key: 'sweet', zh: '甜點', en: 'Sweets' },
      ],
      labels: { effort: '難度', time: '時間', course: '分類', ingredients: '食材', method: '步驟', prev: '上一道', next: '下一道', close: '關閉食譜', comingSoon: '食譜整理中。' },
      title: 'Kitchen',
      description:
        '到了瑞典之後我慢慢開始喜歡上做菜。雖然稱不上什麼大作，但至少能幫我撐過北歐物價。',
      previewLabel: '料理預覽照',
      items: kitchenMenuItems('zh'),
    },
    life: {
      title: 'Life',
      description: '生活裡的片段——一種氣味、一道光、一次值得記得的迷路。',
      items: lifeItems,
    },
    projects: [
      {
        number: '01',
        title: '設計系統架構規劃與整理',
        tag: 'Design System | UIUX Design',
        description:
          '以「提升使用效率」、「提升上手速度」、「維護完整性與正確性」為目標，為 SHOPLINE 進行設計系統架構重設計、元件再造與使用情境盤點。',
        imageUrl: '/img/image-projectCover-designSystem.webp',
        coverType: 'component-tray',
        projectUrl: 'pages/zh/designSystem.html',
        order: 1,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '02',
        title: 'B2B PRC 醫療器材清消與租賃管理系統：RFID 技術整合',
        tag: 'B2B Medical Saas | UIUX Design',
        description:
          '將 RFID 掃描技術與作業流程整合進管理系統，提供客戶更多元的資產追蹤方式。',
        imageUrl: '/img/image-projectCover-rfid.webp',
        projectUrl: 'pages/zh/rfid.html',
        hidden: true,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '03',
        title: 'B2B PRC 醫療器材清消與租賃管理系統：商業分析報表設計',
        tag: 'UX Research | Data Analysis',
        description:
          '了解客戶需求與系統資料限制，設計能協助客戶提升其營運效率的商業分析報表，並結合商業模式吸引客戶訂閱軟體進階方案。',
        imageUrl: '/img/image-projectCover-ba.webp',
        projectUrl: 'pages/zh/ba.html',
        hidden: true,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '03',
        title: 'POS TW/HK 金流串接正逆流程設計',
        tag: 'Ecommerce | UIUX Design',
        description:
          '為 SHOPLINE POS 台灣與香港版金流串接需求，設計金流正逆流程的設計稿。讓店家能快速完成金流結帳流程，並有效協助排除錯誤狀態以避免顧客長時間的等待。',
        imageUrl: '/img/image-projectCover-pos.webp',
        projectUrl: 'pages/zh/pos.html',
        order: 3,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '04',
        title: '台北市社會局公托登記與抽籤系統網站改造',
        tag: 'Public Service | UX Research | UX Design',
        description:
          '為台北市公托登記報名與抽籤系統進行使用者研究與再設計。讓民眾能一站完成規則了解、機構查詢、登記候補...等所有作業流程。',
        imageUrl: '/img/image-projectCover-childcare.webp',
        projectUrl: 'pages/zh/childcare.html',
        order: 4,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '05',
        title: '非視覺導航中觸覺與聽覺引導方式之比較',
        tag: 'Multimodal Interaction | UX Research',
        description:
          '比較並評估多模態導航系統（觸覺與音訊）在使用者尋路表現與主觀體驗上的差異，探索非視覺導航的可行性與設計潛力。',
        imageUrl: '/img/image-projectCover-wayfinding.webp',
        projectUrl:
          'https://drive.google.com/file/d/1gW0bjl66qyWCAEFt6Bqg6CDiXGYfFeJq/view?usp=sharing',
        order: 5,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '06',
        title: 'Culture Compass：跨國與跨 30 年文化價值視覺化平台',
        tag: 'Information Visualization | UIUX Design',
        description:
          '以 World Values Survey 為基礎打造的互動式視覺化平台，讓使用者探索不同國家、時間區段與人口群體之間的文化價值差異。',
        imageUrl: '/img/image-projectCover-culture.webp',
        projectUrl: 'https://winchiu.github.io/culture-compass/#/overview',
        order: 6,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '02',
        title: 'KeepWell B2B PRC 醫療設備資產追蹤系統設計',
        tag: 'B2B Medical SaaS | UIUX Design',
        description:
          '設計醫療設備於清潔與包裝階段的資產追蹤流程。受 NDA 限制，研究細節與最終設計暫以佔位內容呈現。',
        imageUrl: '/img/projects/keepwell/image-keepwell-fistImage.webp',
        coverType: 'delivery',
        projectUrl: 'pages/zh/keepwell.html',
        order: 2,
        type: 'design',
        lang: 'zh',
      },
      {
        number: '01',
        title: 'BizPro：社團官方網站前後臺開發',
        tag: 'UIUX Design｜Full-Stack Development',
        description:
          '以 MERN 框架協助 BizPro 台大商學研究社的重新設計網站與後續開發，改善資訊易讀性並突顯社團價值。',
        imageUrl: '/img/image-projectCover-bp.webp',
        projectUrl: 'pages/zh/bizpro.html',
        siteUrl: 'https://www.bizpro-taipei.com',
        type: 'code',
        lang: 'zh',
      },
      {
        number: '02',
        title: '森活：森林永續議題倡議動畫網頁',
        tag: 'Frontend Development',
        description:
          '以 SDGs 永續森林議題為主題，在 50 小時內完成互動式動畫網頁，並於第五屆台灣青年黑客松獲得冠軍與最佳人氣獎。',
        imageUrl: '/img/image-projectCover-forest.webp',
        projectUrl: 'pages/zh/forest.html',
        siteUrl: 'https://forest-life.onrender.com',
        type: 'code',
        lang: 'zh',
      },
      {
        number: '03',
        title: '工尺 - 北管樂混音器操作展示網站',
        tag: 'Frontend Development',
        description:
          '以步驟式教學說明各按鍵用途，搭配自由遊玩模式，模擬實體北管樂混音器「工尺」的操作效果。',
        imageUrl: '/img/image-projectCover-gongChi.webp',
        projectUrl: 'pages/zh/gongChi.html',
        siteUrl: 'https://ntust-music-project.onrender.com',
        type: 'code',
        lang: 'zh',
      },
      {
        number: '04',
        title: '菁英狙擊手 - 英打練習與對戰遊戲',
        tag: 'Programmer',
        description:
          '透過 Python 與遊戲套件，以射擊遊戲為主題製作具有多種遊玩模式的英文打字練習遊戲。於 2020 年 Coding 101 競賽中獲得冠軍。',
        imageUrl: '/img/image-projectCover-sniper.webp',
        projectUrl:
          'https://drive.google.com/file/d/11le_59yoEMBsNNcp3lJiriQ2L9N855OX/view?usp=sharing',
        type: 'code',
        lang: 'zh',
      },
    ],
  },
};
