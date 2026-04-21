const project = {
  slug: 'gongChi',
  tags: 'Animated, Interactive',
  coverImage: '../../img/image-projectCover-gongChi.webp',
  languageLabel: '繁中 | EN',
  head: {
    en: {
      htmlLang: 'en',
      title: 'GongChi:  Beiguan Music Mixer Simulation Website',
      translatorHref: '../zh/gongChi.html',
      navigationLanguage: 'en',
      imageAlt: 'GoGongChi:  iguan Music Mixer Simulation Website',
    },
    zh: {
      htmlLang: 'zh',
      title: '工尺 - 北管樂混音器操作展示網站',
      translatorHref: '../en/gongChi.html',
      navigationLanguage: 'zh',
      imageAlt: '工尺 - 北管樂混音器操作展示網站',
    },
  },
  header: {
    en: {
      title: 'GoGongChi:  iguan Music Mixer Simulation Website',
      duration: 'Jul. 2021 ~ Aug. 2021',
      role: 'Frontend Developer',
      responsibility: 'Front-end Layout, Voice Interaction Function',
      company: 'Freelance Project',
    },
    zh: {
      title: '工尺 - 北管樂混音器操作展示網站',
      duration: 'Jul. 2021 ~ Aug. 2021',
      role: 'Frontend Developer',
      responsibility: '前端切版、發聲操作功能',
      company: '自行接案',
    },
  },
  introduction: {
    en: {
      purpose:
        "Provide step-by-step tutorials explaining the purpose of each button, along with a free-play mode to simulate the operation of the physical Beiguan music mixer 'Gong-Chi'.",
      challenge: '',
      production:
        'Use website animations and the Tone.js library to enable users to perform mixer operations such as pitch shifting, recording, mixing, and playing on a tablet with multi-touch functionality.',
      outcome: '',
    },
    zh: {
      purpose:
        '以步驟式教學說明各按鍵用途，搭配自由遊玩模式，模擬實體北管樂混音器「工尺」的操作效果。',
      challenge: '',
      production:
        '以網站動畫與 tone.js 套件，讓使用者在平板上以多點觸控達到升降調、錄音、混音、演奏…等混音器操作效果。',
      outcome: '',
    },
  },
  sections: {
    en: [
      {
        modules: [
          {
            type: 'bgTitle',
            html: 'Project Background',
          },
          {
            type: 'doubleImage',
            images: [
              {
                src: '../../img/projects/gongChi/image-gongChi-demo1.webp',
                alt: '',
                zoom: true,
              },
              {
                src: '../../img/projects/gongChi/image-gongChi-demo2.webp',
                alt: '',
                zoom: true,
              },
            ],
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: 'This is the showcase website for the graduation project by Wang\n                                                                                                      Jun-Teng and Chen Qi-Yuan, graduates of the Industrial Design\n                                                                                                      Program in the Department of Design at National Taiwan University\n                                                                                                      of Science and Technology. The project combines elements of\n                                                                                                      Taiwanese folk culture, such as the sounds and instruments of\n                                                                                                      Beiguan music, with Western music mixing consoles, creating the\n                                                                                                      Beiguan music mixer "Gong-Chi."',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            html: '成果展示',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: "This website is specifically designed for touchscreens, and to\n                                                                                                      ensure a good user experience, it is designed with a resolution of\n                                                                                                      1366x768 to avoid making the interactive areas too small for easy\n                                                                                                      operation. If using a computer, please simulate touch mode using\n                                                                                                      Chrome's Developer Tools.",
              },
              {
                type: 'button',
                href: 'https://ntust-music-project.onrender.com',
                target: '_blank',
                label: 'View Website',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/gongChi/image-gongChi-demo3.gif',
              alt: '',
              zoom: true,
            },
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/gongChi/image-gongChi-demo4.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
    ],
    zh: [
      {
        modules: [
          {
            type: 'bgTitle',
            html: '專案背景',
          },
          {
            type: 'doubleImage',
            images: [
              {
                src: '../../img/projects/gongChi/image-gongChi-demo1.webp',
                alt: '',
                zoom: true,
              },
              {
                src: '../../img/projects/gongChi/image-gongChi-demo2.webp',
                alt: '',
                zoom: true,
              },
            ],
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '此為台灣科技大學畢業生 - 設計系工業設計組王駿騰、\n                                                                                                      陳錡淵的畢業製作作品之展示網站。該作品將台灣民俗文化之一：北管樂的音色、樂器等元素與西方音樂常見的混音器結合，創造出北管樂混音器「工尺」。',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            html: '成果展示',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '因本網站專為觸控式螢幕做設計，且為保持使用者良好的體驗，僅以\n                                                                                                      1366*768 做設計，以避操作操作區過小造成使用者操作上的不便。\n                                                                                                      若以電腦操作，請以 chrome 開發者工具中模擬觸控模式進行操作。',
              },
              {
                type: 'button',
                href: 'https://ntust-music-project.onrender.com',
                target: '_blank',
                label: '網站連結',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/gongChi/image-gongChi-demo3.gif',
              alt: '',
              zoom: true,
            },
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/gongChi/image-gongChi-demo4.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
    ],
  },
};

module.exports = {
  project,
};
