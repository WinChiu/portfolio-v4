const designSystemProject = {
  slug: 'designSystem',
  tags: 'Design System',
  coverImage: '../../img/image-projectCover-designSystem.webp',
  languageLabel: '繁中 | EN',
  head: {
    en: {
      htmlLang: 'en',
      title: 'Design System Architecture Design and Organization',
      translatorHref: '../zh/designSystem.html',
      navigationLanguage: 'en',
      imageAlt: 'Design System Redesign',
    },
    zh: {
      htmlLang: 'zh',
      title: '設計系統架構規劃與整理',
      translatorHref: '../en/designSystem.html',
      navigationLanguage: 'zh',
      imageAlt: '設計系統架構規劃與整理',
    },
  },
  header: {
    en: {
      title: 'Design System Architecture Design and Organization',
      duration: 'May. 2022 ~ Jul. 2022',
      role: 'UIUX Designer',
      responsibility:
        'Requirement Exploration, Architecture Planning, and Component Creation',
      company: 'SHOPLINE',
    },
    zh: {
      title: '設計系統架構規劃與整理',
      duration: 'May. 2022 ~ Jul. 2022',
      role: 'UIUX Designer',
      responsibility: '需求探索、架構規劃、元件製作',
      company: 'SHOPLINE',
    },
  },
  introduction: {
    en: {
      purpose:
        'To improve efficiency, speed up onboarding, and ensure integrity and accuracy by redesigning the design system architecture, rebuilding components, and reviewing usage scenarios.',
      challenge:
        'Currently, the design components and guidelines are scattered across various design system files and design drafts. Many components, after being migrated from Sketch, were broken and required rebuilding.',
      production:
        'Identified 5 usability issues, proposed a new design system architecture and team maintenance approach, and defined 45 components with related guidelines.',
      outcome:
        "The design system was implemented in SHOPLINE's e-commerce platform V2, with over 45 newly updated components and UI specifications, ongoing discussions and iterations held during internal weekly meetings.",
    },
    zh: {
      purpose:
        '以「提升使用效率」、「提升上手速度」、「維護完整性與正確性」為目標，進行設計系統架構重設計、元件再造與使用情境盤點。',
      challenge:
        '使用中的設計元件與規範分散在各設計系統檔案與設計稿中，許多元件經 Sketch 搬運後破損需要重建。',
      production:
        '整理出 5 項使用問題，提出新的設計系統架構與團隊維護方式，定義 45 種元件與相關規範。',
      outcome:
        '設計系統投入 SHOPLINE 電商平台 V2 使用，並於內部週會進行設計系統更新討論與迭代。',
    },
  },
  sections: {
    en: [
      {
        modules: [
          { type: 'bgTitle', text: 'Project Background' },
          {
            type: 'pureText',
            paragraphs: [
              `The V2.0 design system in SHOPLINE's e-commerce product line, used for the backend management pages of B2B products. It offers features like online store design and order processing and is one of the primary design systems.`,
              `However, due to the lack of clear management and usage guidelines, the <span class="highlight">library suffered from unclear usage scenarios, broken components, and poor discoverability. </span>This slowed down the design process and made it difficult to maintain consistency across projects.`,
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-workflow-en.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: 'Problem Definition' },
          { type: 'mdTitle', text: 'Problem 1' },
          {
            type: 'pureTitle',
            text: 'Undefined component usage scenarios made it difficult for designers to build new pages using the design system.',
          },
          {
            type: 'pureText',
            paragraphs: [
              'Without clear usage scenarios, designers had to look at existing pages or ask others verbally to confirm which patterns to use. This increased the risk of inconsistencies across the interface.',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-problem1-en.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'mdTitle', text: 'Problem 2' },
          {
            type: 'pureTitle',
            text: 'Inconsistent component naming and organization made components difficult to located',
          },
          {
            type: 'pureText',
            paragraphs: [
              'Designers often had to browse through large sections of the design system file just to find a component, rather than finding it through direct search.',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-problem2-en.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'mdTitle', text: 'Problem 3' },
          {
            type: 'verticalIconList',
            items: [
              {
                image: {
                  src: '../../img/projects/designSystem/image-ds-problem3.webp',
                  alt: '',
                  zoom: true,
                },
                title:
                  'No standardized format for guidelines, reducing reading efficiency.',
                paragraphs: [
                  'The component guidelines lack a unified writing standard. Key elements such as basic styles, states, and interaction patterns is incomplete, making it difficult to find comprehensive documentation.',
                ],
              },
            ],
          },
        ],
      },
      {
        modules: [
          { type: 'mdTitle', text: 'Problem 4' },
          {
            type: 'verticalIconList',
            items: [
              {
                image: {
                  src: '../../img/sketch-confuse.svg',
                  alt: '',
                },
                title:
                  'No clear update mechanism caused the design system to fall out of sync with the live product.',
                paragraphs: [
                  'Because newly created or updated components were never documented, the design system remained outdated and failed to reflect the actual state of the components.',
                ],
              },
            ],
          },
        ],
      },
      {
        classes: ['specialSection', 'specialSection--yellow'],
        modules: [
          { type: 'bgTitle', text: 'Design Goals' },
          {
            type: 'horizontalIconList',
            items: [
              {
                image: { src: '../../img/sketch-aha.svg', alt: '' },
                title: 'Improve Efficiency',
                content:
                  'Restructure the sidebar organization in the Figma file, allowing designers to quickly locate design guidelines and components.',
              },
              {
                image: { src: '../../img/sketch-checkListPaper.svg', alt: '' },
                title: 'Increase Onboarding Speed',
                content:
                  'Provide sufficient guidance and instructions to help first-time users quickly understand the design system.',
              },
              {
                image: { src: '../../img/sketch-fix.svg', alt: '' },
                title: 'Maintain Quality',
                content:
                  'Ensure the integrity and accuracy of the design guidelines as they evolve with future updates and modifications.',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bigQuote',
            icon: '../../img/sketch-think.svg',
            content:
              'Based on the goals, I provided a comprehensive solution covering ==guideline creation, component organization, and maintenance updates.==',
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: 'Solution' },
          { type: 'pureTitle', text: 'Restructure Documentation' },
          {
            type: 'pureText',
            paragraphs: [
              `To maintain quality and align with designers' habits, components are organized using the following structure in Figma:`,
            ],
          },
          {
            type: 'imgAndContentBlock',
            image: {
              src: '../../img/projects/designSystem/image-ds-solution1.webp',
              alt: '',
            },
            entries: [
              {
                title: 'Introduction',
                paragraphs: [
                  `Provides a clear user manual outlining the design system's document architecture, along with instruction for creating, maintaining, and updating components.`,
                ],
              },
              {
                title: 'All Components',
                paragraphs: [
                  'Lists all components in the design system so designers can easily browse, reference and duplicate.',
                ],
              },
              {
                title: 'Full Guide',
                paragraphs: [
                  'Shows the detail guideline for each component, including UI specification and usage scenarios.',
                ],
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: 'Separate Parent and Subcomponents to Ensure Maintainability, Link Components and Guidelines for Cross-Reference',
          },
          {
            type: 'pureText',
            paragraphs: [
              'All subcomponents are stored on one page, allowing users to easily find and use the components. The use of subcomponents also helps preserve the integrity of the overall design system.',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-solution2.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureText',
            paragraphs: [
              'Links to the storybook and full guide are provided in the top right corner of each subcomponent section, allowing users to access the current component status and usage guideline.',
            ],
          },
          {
            type: 'doubleImage',
            images: [
              {
                src: '../../img/projects/designSystem/image-ds-solution3-1.webp',
                alt: '',
              },
              {
                src: '../../img/projects/designSystem/image-ds-solution3-2.webp',
                alt: '',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: 'Define a Unified Writing Style and Format',
          },
          {
            type: 'pureText',
            paragraphs: [
              'Create a checklist that standardizes components under the following seven fixed headings: Usage, Spec, Content, Layout, Application, Asset, and Components.',
            ],
          },
          {
            type: 'doubleImage',
            images: [
              {
                src: '../../img/projects/designSystem/image-ds-solution4-1.webp',
                alt: '',
              },
              {
                src: '../../img/projects/designSystem/image-ds-solution4-2.webp',
                alt: '',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: 'Create a Report Form for Real-Time Component Status Updates',
          },
          {
            type: 'pureText',
            paragraphs: [
              'Record component issues and assign an owner. Review all pending issues during the weekly meeting and discuss potential solutions.',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-solution5.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: 'Key Learnings' },
          {
            type: 'pureTitle',
            text: 'The Design System Must Be Scenario-Based and Improve Cross-Role Synchronization',
          },
          {
            type: 'verticalIconList',
            items: [
              {
                paragraphs: [
                  'I realized that the design system is crucial for product consistency. Scenario-driven guidelines help designers understand how to use a component, not just how it looks. Moreover, when guidelines and components are scattered across different documents, It slows down implementation and leads to more design inconsistencies.',
                  `Another goal of a design system is to improve collaboration across different product teams. Consistent naming affects coding efficiency and designers' ability to locate components. Poor communication can cause misalignment in component usage, with designers and engineers choosing different components. Therefore, clear syncing and update mechanisms across roles are essential to maintaining the design system and ensuring overall product quality.`,
                ],
              },
            ],
          },
        ],
      },
    ],
    zh: [
      {
        modules: [
          { type: 'bgTitle', text: '專案背景' },
          {
            type: 'pureText',
            paragraphs: [
              '本次重設系統為 SHOPLINE 電商產品線的 V2.0 設計系統，用於 B 端產品後台管理頁面，提供網店設計和訂單處理等功能，是主要設計系統之一。',
              '目前該系統以 Figma 文件構建，供設計師和工程師使用。但由於缺乏完整的管理方式和使用規範，且部分元件來自 Sketch 轉檔，<span class="highlight">導致元件使用情境不明、Figma 元件破損、查找困難，降低了效率並影響設計一致性。</span>',
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-workflow.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: '問題定義' },
          { type: 'mdTitle', text: '問題一' },
          {
            type: 'pureTitle',
            text: '各元件無定義使用情境，難以根據設計系統創建新頁面',
          },
          {
            type: 'pureText',
            paragraphs: [
              '本次重設系統為 SHOPLINE 電商產品線的 V2.0 設計系統，用於 B 端產品後台管理頁面，提供網店設計和訂單處理等功能，是主要設計系統之一。',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-problem1.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'mdTitle', text: '問題二' },
          {
            type: 'pureTitle',
            text: '元件命名與歸檔方式無統一規則，造成歸檔不符使用方式，難易查找元件',
          },
          {
            type: 'pureText',
            paragraphs: [
              '元件缺失與命名不統一，導致無法通過搜尋找到所需元件，加上情境定義不明，設計師每次使用元件時都需回到設計系統主文件中查找。',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-problem2.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'mdTitle', text: '問題三' },
          {
            type: 'verticalIconList',
            items: [
              {
                image: {
                  src: '../../img/projects/designSystem/image-ds-problem3.webp',
                  alt: '',
                  zoom: true,
                },
                title: '無統一架構進行資源管理，導致元件與規範分散無法同步',
                paragraphs: [
                  '現行設計系統採用元件與規範並行歸檔，導致內容重複。例如，名為 Flow 的文件記錄了所有元件的互動方式（如：menu bar 的互動模式），同時還有各元件規格（如：menu bar 的顏色規範），分屬不同頁面且部分重複。',
                ],
              },
            ],
          },
        ],
      },
      {
        modules: [
          { type: 'mdTitle', text: '問題四' },
          {
            type: 'verticalIconList',
            items: [
              {
                image: {
                  src: '../../img/sketch-confuse.svg',
                  alt: '',
                },
                title: '規範編寫無統一格式，閱讀效率低',
                paragraphs: [
                  '各元件頁面的規範沒有統一的書寫規則，缺乏情境定義，基本樣式、狀態、互動方式等要素也不完整，無法在文件中找到完整規範。',
                ],
              },
            ],
          },
        ],
      },
      {
        modules: [
          { type: 'mdTitle', text: '問題五' },
          {
            type: 'verticalIconList',
            items: [
              {
                image: {
                  src: '../../img/sketch-webDesign.svg',
                  alt: '',
                },
                title: '無明確的更新機制，使得設計系統時常無法與線上版本對齊',
                paragraphs: [
                  '產品中的元件大致分為 V2 原版、工程師自創版、設計師自創版和其他 UI kit 四種。這些版本缺乏明確的溝通和更新機制，導致 V2 設計系統無法及時更新元件與規範，變得過時。',
                ],
              },
            ],
          },
        ],
      },
      {
        classes: ['specialSection', 'specialSection--yellow'],
        modules: [
          { type: 'bgTitle', text: '設計目標' },
          {
            type: 'horizontalIconList',
            items: [
              {
                image: { src: '../../img/sketch-aha.svg', alt: '' },
                title: '提升使用效率',
                content:
                  '重整設計系統在 figma 檔案上的邊排方式，讓設計師能快速查找設計規範與使用元件。',
              },
              {
                image: { src: '../../img/sketch-checkListPaper.svg', alt: '' },
                title: '提升上手速度',
                content:
                  '提供足夠的引導與說明，讓首次使用本設計系統的使用者可以快速理解用法。',
              },
              {
                image: { src: '../../img/sketch-fix.svg', alt: '' },
                title: '維護品質',
                content:
                  '確保在未來不斷增減與修改設計規範時，內容一員能維持完整性與正確性。',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bigQuote',
            icon: '../../img/sketch-think.svg',
            content:
              '根據目標，我提供了從==規範建立、元件歸納到更新維護的完整方案。==',
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: '解決方案' },
          { type: 'pureTitle', text: '重整文件架構:' },
          {
            type: 'pureText',
            paragraphs: [
              '根據設計師既有的使用習慣，以維護品質為目標，利用以下架構整理元件:',
            ],
          },
          {
            type: 'imgAndContentBlock',
            image: {
              src: '../../img/projects/designSystem/image-ds-solution1.webp',
              alt: '',
            },
            entries: [
              {
                title: 'Introduction',
                orderedList: [
                  '檔案層級與用途說明',
                  '文件瀏覽與取用說明',
                  '元件建立、使用、命名規範、更新方式說明',
                  '註解方式說明',
                ],
              },
              {
                title: 'All Components',
                orderedList: [
                  '按類型與狀態，歸類存放元件之子元件',
                  '建立元件目錄，並連接到 full guide 中對應的元件',
                  '僅作為取用與查找，此頁面元件不可修正',
                ],
              },
              {
                title: 'Full Guide',
                orderedList: [
                  '編寫完整規範，存放元件之父元件',
                  '建立連結連接至 All Components 頁面中對應的子元件',
                  '作為規範編寫與設計更新使用，此頁面元件不可取用',
                ],
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: '區隔父元件與子元件確保維護性，連接元件與規範以互相參照',
          },
          {
            type: 'pureText',
            paragraphs: [
              '在 All Component 頁面中存放所有子元件，使用者只需在此頁面尋找並使用所需元件，且子元件的特性可以避免破壞整體設計系統。',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-solution2.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureText',
            paragraphs: [
              '在各子元件區域的右上角附上 storybook 和 full guide 的連結，方便使用者查看元件狀態並解決使用疑問。',
              '同時，在 full guide 頁面右上角也附有 storybook 和 all component 的連結，讓使用者在閱讀規範後能回到 all component 頁面，避免直接修改母元件。',
            ],
          },
          {
            type: 'doubleImage',
            images: [
              {
                src: '../../img/projects/designSystem/image-ds-solution3-1.webp',
                alt: '',
              },
              {
                src: '../../img/projects/designSystem/image-ds-solution3-2.webp',
                alt: '',
              },
            ],
          },
        ],
      },
      {
        modules: [
          { type: 'pureTitle', text: '定義統一編寫樣式與格式' },
          {
            type: 'pureText',
            paragraphs: [
              '規範各元件需包含以下 7 項固定標題：Usage、Spec、Content、Layout、Application、Asset、Components，並明確規定各標題下的內容。',
            ],
          },
          {
            type: 'doubleImage',
            images: [
              {
                src: '../../img/projects/designSystem/image-ds-solution4-1.webp',
                alt: '',
              },
              {
                src: '../../img/projects/designSystem/image-ds-solution4-2.webp',
                alt: '',
              },
            ],
          },
        ],
      },
      {
        modules: [
          { type: 'pureTitle', text: '建立回報表，即時更新元件狀態' },
          {
            type: 'pureText',
            paragraphs: [
              '紀錄遇到的元件問題，並指派相關人員進行修正；定期於週會確認待處理的元件問題，並討論解決方案。',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/designSystem/image-ds-solution5.webp',
              alt: '',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: '學習點' },
          {
            type: 'pureTitle',
            text: '設計系統需以情境為中心，並加強跨職位同步與維護機制',
          },
          {
            type: 'verticalIconList',
            items: [
              {
                paragraphs: [
                  '通過本次專案，我發現設計系統對產品一致性至關重要。如果設計系統未以『情境』為中心進行規範，Design System 只能作為元件庫，無法提供有效的實作參考。此外，當規範和元件分散在不同文件中時，會增加實作時間成本，最終導致產品設計不一致問題加劇。',
                  '不同職位對設計系統的需求也不同，統一的命名影響程式編寫、設計師查找元件及測試時的效率。無效的溝通會導致元件使用不同步，設計師和工程師使用不同元件。因此，各職位間的同步與更新機制對設計系統的維護尤為重要，這不僅關乎設計師，也關乎產品品質。',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

module.exports = {
  designSystemProject,
};
