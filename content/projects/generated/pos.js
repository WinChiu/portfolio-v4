const project = {
  slug: 'pos',
  tags: 'E-commerce, Finance',
  coverImage: '../../img/image-projectCover-pos.webp',
  languageLabel: '繁中 | EN',
  head: {
    en: {
      htmlLang: 'en',
      title:
        'POS TW/HK Payment Gateway Integration - Forward and Reverse Process Design',
      translatorHref: '../zh/pos.html',
      navigationLanguage: 'en',
      imageAlt: 'POS TW/HK Payment Gateway Integration',
    },
    zh: {
      htmlLang: 'zh',
      title: 'POS TW/HK 金流串接正逆流程設計',
      translatorHref: '../en/pos.html',
      navigationLanguage: 'zh',
      imageAlt: 'POS TW/HK 金流串接正逆流程設計',
    },
  },
  header: {
    en: {
      title:
        'POS TW/HK Payment Gateway Integration - Forward and Reverse Process Design',
      duration: 'Jul. 2022 ~ Nov. 2022',
      role: 'UX Designer',
      responsibility: 'Process Planning, UI Mock-up, UI Testing',
      company: 'SHOPLINE',
    },
    zh: {
      title: 'POS TW/HK 金流串接正逆流程設計',
      duration: 'Jul. 2022 ~ Nov. 2022',
      role: 'UX Designer',
      responsibility: '流程規劃、設計完稿、UI Testing',
      company: 'SHOPLINE',
    },
  },
  introduction: {
    en: {
      purpose:
        'Designed the forward and reverse payment integration flow for SHOPLINE POS in Taiwan and Hong Kong, enabling merchants to complete transactions quickly while efficiently resolving errors to minimize customer wait times.',
      challenge:
        'The POS product is already in use, and merchants are accustomed to the existing processes. To reduce learning costs, the design must align closely with the current workflow.',
      production:
        'Completed the design of 6 forward and reverse payment system processes, covering 3 payment gateways, non-payment methods, and various payment outcome handling (success, failure, offline, operational errors, etc.).',
      outcome:
        'Launched the product for use by merchants in Taiwan and Hong Kong.',
    },
    zh: {
      purpose:
        '為 SHOPLINE POS 台灣與香港版金流串接需求，設計金流正逆流程的設計稿。讓店家能快速完成金流結帳流程，並有效協助排除錯誤狀態以避免顧客長時間的等待。',
      challenge:
        'POS 產品已經上線使用且店家已習慣既有流程，為降低學習成本，在進行設計時需貼合既有流程進行。',
      production:
        '完成 6 項正逆金流系統操作流程設計，涵蓋 3 種金流、非金流付款方式與多種付款結果處理（成功、失敗、離線、操作錯誤…）。',
      outcome: '產品上線並讓台灣與香港店家使用。',
    },
  },
  sections: {
    en: [
      {
        classes: ['pos-section--wide', 'pos-section--background'],
        modules: [
          {
            type: 'mediaAside',
            variant: 'cover',
            title: 'Project Background',
            image: {
              src: '../../img/projects/pos/image-pos-marketing.webp',
              alt: '',
              zoom: true,
            },
            paragraphs: [
              'SHOPLINE is an e-commerce platform that integrates online and\n                                                                                                      offline sales, offering a POS system to help merchants manage\n                                                                                                      payment processes in physical stores.',
              "At the time of this project, SHOPLINE's POS system in Taiwan had\n                                                                                                      not integrated its own payment service, requiring merchants to\n                                                                                                      contract with banks directly. In Hong Kong, although payment\n                                                                                                      integration was completed, multiple card terminal brands needed\n                                                                                                      support, and fees remained higher than the market average.",
            ],
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--workflow'],
        modules: [
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-workflow-en.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: [
          'specialSection',
          'specialSection--gray',
          'pos-section--narrow',
        ],
        modules: [
          {
            type: 'bgTitle',
            html: 'Problem Definition',
          },
          {
            type: 'bgQuote',
            headingTag: 'h3',
            headingHtml:
              "Lack of Payment Integration and High Pricing Undermining\n                                                                                                      SHOPLINE's Competitiveness",
            headingStyle: 'flex: 1',
            callOutListStyle: 'flex: 1',
            callOuts: [
              {
                type: 'callOut',
                title:
                  'No Payment Integration, Reducing Product Competitiveness',
                text: 'In the Taiwan market, the lack of card payment integration means merchants using SHOPLINE services must handle credit card payments separately, which decreases checkout efficiency.',
              },
              {
                type: 'callOut',
                title:
                  'Higher-than-Average Pricing, Hindering Business Promotion',
                text: 'In the Hong Kong market, the current card terminal payment cost is higher than the market average, making it difficult to promote and adopt the POS system.',
              },
            ],
          },
        ],
      },
      {
        classes: [
          'specialSection',
          'specialSection--yellow',
          'pos-section--narrow',
        ],
        modules: [
          {
            type: 'bgTitle',
            html: 'Goal Breakdown',
          },
          {
            type: 'horizontalIconList',
            items: [
              {
                image: {
                  src: '../../img/sketch-money.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">Business Goal</span>Increase SHOPLINE Payment Revenue',
                content:
                  'Increase the number of orders using SHOPLINE Payment to <span class="highlight">boost credit card\n                                                                                                          transaction fee income.</span>',
              },
              {
                image: {
                  src: '../../img/sketch-function.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">Product Goal</span>Provide Comprehensive Payment Services',
                content:
                  'Deliver a <span class="highlight">full suite of SHOPLINE Payment services</span> (checkout,\n                                                                                                          cancellation, refund, returns) to enable merchants to offer\n                                                                                                          credit card payment options to consumers.',
              },
              {
                image: {
                  src: '../../img/sketch-webDesign.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">Design Goal</span>Provide Seamless Payment Experience',
                content:
                  'Ensure that merchants can <span class="highlight">quickly complete</span> the payment process\n                                                                                                          while <span class="highlight">effectively resolving errors</span> to prevent prolonged\n                                                                                                          customer wait times.',
              },
            ],
          },
        ],
      },
      {
        classes: ['pos-section--wide', 'pos-section--analysis'],
        modules: [
          {
            type: 'mediaAside',
            title: 'Challenge',
            image: {
              src: '../../img/projects/pos/image-pos-complexFlow-en.webp',
              alt: '',
              zoom: true,
            },
            paragraphs: [
              'Evaluate the existing POS system mechanism by reviewing the timing\n                                                                                                      of status evaluations, response times, and the differences in\n                                                                                                      handling payment and non-payment methods.',
            ],
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-intro'],
        modules: [
          {
            type: 'bgTitle',
            html: 'Solution',
          },
          {
            type: 'pureTitle',
            html: 'Clearly Remind Merchants of Incomplete Card Terminal Settlement',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: "After a card transaction, the funds are not immediately\n                                                                                                      transferred to the merchant's account; a manual terminal\n                                                                                                      settlement is required. Therefore, when adding the card terminal\n                                                                                                      settlement feature, we need to clearly remind merchants to\n                                                                                                      complete the settlement.",
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-cashFlow-en.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-detail'],
        modules: [
          {
            type: 'quote',
            html: 'Design Focus: Ensure that important actions are promptly\n                                                                                                      communicated to merchants without adding informational overload.',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: "As a key feature for merchant payments, I designed a separate\n                                                                                                      'Settlement' tab with a red dot notification for incomplete\n                                                                                                      settlements. Upon entering the page, merchants can quickly check\n                                                                                                      the status of each card terminal and complete the settlement one\n                                                                                                      terminal at a time.",
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-sol1New-en.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-intro'],
        modules: [
          {
            type: 'pureTitle',
            html: 'Real-Time Refund Restrictions to Reduce Operational Errors',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: 'In the refund process, different payment methods and card terminal\n                                                                                                      types have various refund restrictions (e.g., full refunds only or\n                                                                                                      partial refunds). Without clear prompts for the applicable refund\n                                                                                                      option, merchants may waste time with unnecessary attempts.\n                                                                                                      Therefore, the system must preserve input flexibility while\n                                                                                                      preventing incorrect actions to ensure a smooth customer\n                                                                                                      experience during refunds.',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-figmaFlow.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-detail'],
        modules: [
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: 'To maintain flexibility in entering refund amounts, the original\n                                                                                                      design triggered error messages only after the amount was entered.\n                                                                                                      However, in some cases, merchants have only one refund option\n                                                                                                      (e.g., full refund), making this design result in unnecessary\n                                                                                                      actions and increased operation time.',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-sol2Origin-en.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-detail'],
        modules: [
          {
            type: 'quote',
            html: 'Design Focus: Remind and prevent merchants from entering incorrect\n                                                                                                      refund amounts without affecting operational efficiency.',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: "I added refund amount prompts in the 'Select Refund Method' and\n                                                                                                      'Refund Method List' sections, and displayed the correct amount\n                                                                                                      again in case of an error to assist merchants in completing the\n                                                                                                      refund process.",
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-sol2New-en.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--learning'],
        modules: [
          {
            type: 'bgTitle',
            html: 'Key Learnings',
          },
          {
            type: 'pureTitle',
            html: "Reflect on the Rationality of the Solution from the User's\n                                                                                                      Perspective",
          },
          {
            type: 'verticalIconList',
            items: [
              {
                image: {
                  src: '../../img/sketch-checkList.svg',
                  alt: '',
                  zoom: false,
                },
                paragraphs: [
                  "Even when receiving very specific requirements, a designer\n                                                                                                          should still assess the business, product, and design goals.\n                                                                                                          This applies even in feature-driven B2B products, where it's\n                                                                                                          essential to ensure that the solution aligns with the user's\n                                                                                                          context and provides a good experience. This prevents the\n                                                                                                          product from becoming overly complex due to feature bloat,\n                                                                                                          which can ultimately compromise usability.",
                ],
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-figmaFile.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
    ],
    zh: [
      {
        classes: ['pos-section--wide', 'pos-section--background'],
        modules: [
          {
            type: 'mediaAside',
            variant: 'cover',
            title: '專案背景',
            image: {
              src: '../../img/projects/pos/image-pos-marketing.webp',
              alt: '',
              zoom: true,
            },
            paragraphs: [
              'SHOPLINE 是一個整合線上線下銷售的電商平台，提供 POS\n                                                                                                      系統幫助店家管理實體店面的支付流程。',
              '在本專案進行時，SHOPLINE 的 POS\n                                                                                                      系統在台灣尚未串接自有金流，店家需自行與銀行簽約；香港市場雖完成金流串接，但需支援多品牌刷卡機，且手續費高於市場平均。',
            ],
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--workflow'],
        modules: [
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-workflow.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: [
          'specialSection',
          'specialSection--gray',
          'pos-section--narrow',
        ],
        modules: [
          {
            type: 'bgTitle',
            html: '問題定義',
          },
          {
            type: 'bgQuote',
            headingTag: 'h3',
            headingHtml: '缺乏金流功能、定價過高導致自家電商方案無競爭力',
            headingStyle: 'flex: 1',
            callOutListStyle: 'flex: 1',
            callOuts: [
              {
                type: 'callOut',
                title: '缺乏金流整合，削弱產品競爭力',
                text: '在台灣市場，由於缺乏信用卡金流整合，使用 SHOPLINE 服務的店家仍需另外處理刷卡收款流程，降低整體結帳效率。',
              },
              {
                type: 'callOut',
                title: '定價高於市場平均，不利商業推廣',
                text: '在香港市場，現行刷卡機與金流服務成本高於市場平均，使 POS 系統在推廣與導入上更具阻力。',
              },
            ],
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--bridge'],
        modules: [
          {
            type: 'bigQuote',
            icon: '../../img/sketch-think.svg',
            content:
              '我針對 PRD\n                                                                                                      交付文件中對於商業現況的描述，==定義本次專案在產品面與設計面的目標==，以聚焦設計解方。',
          },
        ],
      },
      {
        classes: [
          'specialSection',
          'specialSection--yellow',
          'pos-section--narrow',
        ],
        modules: [
          {
            type: 'bgTitle',
            html: '目標拆解',
          },
          {
            type: 'horizontalIconList',
            items: [
              {
                image: {
                  src: '../../img/sketch-money.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">商業目標</span>提升 SHOPLINE Payment 收益',
                content:
                  '增加使用 SHOPLINE Payment 的訂單以<span class="highlight">提升刷卡手續費收入</span>。',
              },
              {
                image: {
                  src: '../../img/sketch-function.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">產品目標</span>提供完整金流服務',
                content:
                  '提供<span class="highlight">完整（結帳、取消、退款、退貨）的 SHOPLINE Payment\n                                                                                                          金流服務</span>，以支援店家提供消費者信用卡結帳的選項。',
              },
              {
                image: {
                  src: '../../img/sketch-webDesign.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">設計目標</span>提供順暢的金流體驗',
                content:
                  '讓店家能<span class="highlight">快速完成</span>金流結帳流程，並<span class="highlight">有效協助排除錯誤狀態</span>以避免顧客長時間的等待。',
              },
            ],
          },
        ],
      },
      {
        classes: ['pos-section--wide', 'pos-section--analysis'],
        modules: [
          {
            type: 'mediaAside',
            title: '挑戰',
            image: {
              src: '../../img/projects/pos/image-pos-complexFlow.webp',
              alt: '',
              zoom: true,
            },
            paragraphs: [
              '針對 POS 系統現有機制，盤點各狀態的判斷時機、回應時間與各金流 /\n                                                                                                      非金流的判斷差異。',
            ],
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--bridge'],
        modules: [
          {
            type: 'bigQuote',
            icon: '../../img/sketch-think.svg',
            content:
              '雖然 PRD\n                                                                                                      已經提供明確的設計解方，但我==重新釐清問題後提出更能對應到目標的解方==，並獲得採納。',
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-intro'],
        modules: [
          {
            type: 'bgTitle',
            html: 'Solutions',
          },
          {
            type: 'pureTitle',
            html: '明確提醒商家尚未進行刷卡機結帳',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '進行刷卡後，刷卡機並不會立即將款項撥入店家的帳戶中，需手動清機才能收到金流。因此在增加刷卡機結帳功能後，我們需要明確提醒商家尚未進行刷卡機結帳。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-cashFlow.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-detail'],
        modules: [
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '原先預期商家會使用 POS\n                                                                                                      中的「小結」頁面清點帳務後，一同進行清機。因此原需求希望在「小結」頁籤中提示清機操作，但我發現這不符合用戶操作習慣，因此進行了修改。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-sol1Origin.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-detail'],
        modules: [
          {
            type: 'quote',
            html: '設計聚焦：在不增加資訊負擔的前提下，可以即時提醒店家有重要操作尚未完成。',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '作為店家收款的重要功能，我設計了一個獨立的「清機」頁籤，並使用紅點提示未完成的清機操作。進入頁面後，店家可快速查看每台刷卡機的狀態，並逐台完成清機。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-sol1New.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-intro'],
        modules: [
          {
            type: 'bgTitle',
            html: 'Solution 2',
          },
          {
            type: 'pureTitle',
            html: '即時提示店家退款限制，減少錯誤操作',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '退款流程中，不同結帳方式與刷卡機機種有不同的退款限制（如僅能全額退或部分退）。若無清楚提示適用的退款方案，可能導致店家進行無謂的嘗試。因此，系統需在保留輸入靈活性的同時，防止錯誤操作，確保退款過程中的良好體驗。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-figmaFlow.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-detail'],
        modules: [
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '為了保留輸入金額的彈性，原需求設計為在輸入後才顯示錯誤提示。但在某些退款情況下，店家只能選擇一種退款額度（如全額退款），這樣的設計會導致不必要的操作，增加時間成本。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-sol2Origin.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--solution-detail'],
        modules: [
          {
            type: 'quote',
            html: '設計聚焦：在不影響店家操作效率的情況下，提醒並制止店家進行錯誤的退款金額輸入',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '我在「選擇退款方式」和「退款方式列表」中添加可退款金額提示，並在報錯時再次顯示可輸入的金額，幫助店家完成退款流程。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-sol2New.webp',
              alt: '',
              zoom: true,
            },
          },
        ],
      },
      {
        classes: ['pos-section--narrow', 'pos-section--learning'],
        modules: [
          {
            type: 'bgTitle',
            html: '學習點',
          },
          {
            type: 'pureTitle',
            html: '回到使用者情境思考解決方案的合理性',
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                className: 'project-module__text',
                html: '當接收到很精確的需求時，作為設計師依然該從商業、產品與設計三項目標盤點起，即便是在\n                                                                                                      B2B\n                                                                                                      功能導向的產品中，也要確保解方符合用戶情境與良好的體驗，避免產品本身因功能的堆疊，而逐漸失去易用性。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/pos/image-pos-figmaFile.webp',
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
