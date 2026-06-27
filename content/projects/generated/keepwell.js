const project = {
  slug: 'keepwell',
  tags: 'B2B Medical SaaS, UIUX Design',
  coverImage: '../../img/projects/keepwell/image-keepwell-fistImage.webp',
  head: {
    en: {
      htmlLang: 'en',
      title: 'KeepWell: B2B PRC Medical Device Asset Tracking System Design',
      translatorHref: '../zh/keepwell.html',
      navigationLanguage: 'en',
      imageAlt: 'KeepWell project placeholder',
    },
    zh: {
      htmlLang: 'zh-Hant',
      title: 'KeepWell B2B PRC 醫療設備資產追蹤系統設計',
      translatorHref: '../en/keepwell.html',
      navigationLanguage: 'zh',
      imageAlt: 'KeepWell 專案圖片預留位置',
    },
  },
  header: {
    en: {
      title: 'KeepWell: B2B PRC Medical Device Asset Tracking System Design',
      duration: 'July. 2024 ~ Apr. 2025',
      role: 'Product Designer',
      responsibility:
        'UI Mockup, Functional Specification, PM Testing, Field Simulation, Product Proposal',
      company: 'Wellell',
    },
    zh: {
      title: 'KeepWell B2B PRC 醫療設備資產追蹤系統設計',
      duration: '2024 年 7 月～2025 年 4 月',
      role: '產品設計師',
      responsibility: 'UI Mockup、功能規格、PM 測試、現場模擬、產品提案',
      company: 'Wellell',
    },
  },
  sections: {
    en: [
      {
        modules: [
          {
            type: 'quote',
            paragraphClass: 'project-module__nda-note',
            html: '<strong>This project is under an NDA, so certain user research findings and the final design cannot be disclosed in detail publicly.</strong>',
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: 'Project Background', line: false },
          {
            type: 'pureText',
            paragraphs: [
              'KeepWell is a SaaS platform that streamlines decontamination and rental management for medical equipment, with an initial focus on medical air mattresses. By pairing barcode asset tags with each device, it helps European rental service providers manage the full workflow, including on-site inventory, disinfection, orders, logistics, and customer management.',
              'In this portfolio, I will focus on workflow “4. Cleaning & packing”. Detailed research findings and final interface designs are represented by placeholders because of the NDA.',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-serviceFlow.webp',
              alt: 'Placeholder for the cleaning and packing workflow',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'bigQuote',
            className: 'keepwell-rapid-quote',
            icon: '../../img/sketch-think.svg',
            content:
              'We adopted <span class="highlight">rapid iteration</span> to ensure the complex workflow aligned with the client’s requirements.',
          },
        ],
      },
      {
        modules: [
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-workflow.webp',
              alt: 'Rapid iteration workflow from on-site investigation through solution proposal',
            },
          },
        ],
      },
      {
        classes: [
          'specialSection',
          'specialSection--gray',
          'sectionNarrow',
          'keepwell-section--problem',
        ],
        modules: [
          { type: 'bgTitle', text: 'Problem Definition' },
          {
            type: 'bgQuote',
            headingTag: 'h3',
            headingHtml:
              'Inaccurate rental data and limited visibility into facility efficiency caused hidden revenue loss.',
            callOuts: [
              {
                title:
                  'Paper-based workflows and manual checks led to incomplete records.',
                text: 'Rental quantities and dates were recorded on paper. Even with multiple manual checks, service providers could not accurately track whether each product was in the hospital, returned, or lost. Human counting errors further widened the gap between estimated and actual revenue.',
              },
              {
                title:
                  'Limited visibility into operational efficiency and product status.',
                text: 'Product processing status inside the facility was unclear. Managers could not easily assess station efficiency, inventory availability, workflow bottlenecks, or future product demand.',
              },
            ],
          },
        ],
      },
      {
        classes: ['specialSection', 'specialSection--yellow', 'sectionNarrow'],
        modules: [
          { type: 'bgTitle', text: 'Goal Breakdown' },
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
                  '<span class="project-module__item-label">Business Goal</span>Introduce the system to clients to strengthen hardware sales',
                content:
                  'Beyond software subscriptions, KeepWell also serves as a foundation for future IoT integration with hardware products.',
              },
              {
                image: {
                  src: '../../img/sketch-function.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">Product Goal</span>Enable product status tracking and visualize workflow efficiency.',
                content:
                  'The current system includes too many features, does not match the client’s need for simplification, and lacks RFID support for bulk product registration.',
              },
              {
                image: {
                  src: '../../img/sketch-webDesign.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">Design Goal</span>Fast Product Component Registration at Each Workstation',
                content:
                  'Recording product status at each workstation adds extra work. The challenge was to make status updates fast while keeping the workflow efficient and uninterrupted.',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: 'Action 1: Facility Operations Workflow Investigation',
            line: false,
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                html: 'Reducing operational effort is a key concern for service providers as labor costs are high. Before starting the software design process, we <span class="highlight">observed and documented factory workers’ daily workflows</span> and mapped them into a user journey to help identify opportunities for improving the existing software experience. We focused on getting the following information:',
              },
              {
                type: 'unorderedList',
                items: [
                  'The mandatory information that the workers should record during the process.',
                  'The detailed steps in each station regarding disassembling, processing, and reassembling the product.',
                ],
              },
              {
                type: 'paragraph',
                html: '…in order to find out the minimum mandatory needs when adapting the software and the appropriate interaction points.',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-facilityFlow.webp',
              alt: 'Simplified facility operations workflow from unloading through storage',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: 'Action 2: RFID Scanning Workflow Evaluation',
            line: false,
          },
          {
            type: 'pureText',
            paragraphs: [
              'We conducted field simulations using different devices to evaluate how various RFID scanners performed in different environments, measuring factors such as <span class="highlight">maximum scanning range, the number of items that could be detected at once, and the time required to scan all products.</span> These findings informed the design of the final workflow.',
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 2,
            items: [
              {
                label: 'Testing Handheld Scanner 1',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-handheldCart.webp',
                  alt: 'Field test using a handheld RFID scanner with a product cart',
                },
              },
              {
                label: 'Testing Handheld Scanner 2',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-handheld2.webp',
                  alt: 'Field test using a second handheld RFID scanner',
                },
              },
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 1,
            items: [
              {
                label: 'Testing Gate-Type Scanner',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-fixScan.webp',
                  alt: 'Field test using a fixed gate-type RFID scanner',
                },
              },
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 1,
            items: [
              {
                label: 'Compare Result',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-compareResult.webp',
                  alt: 'Comparison of handheld and gate-type RFID scanners',
                },
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: 'Action 3: UIUX Design for Software',
            line: false,
          },
          {
            type: 'pureText',
            paragraphs: [
              'Through interviews, we <span class="highlight">found that returned products may have missing or extra components without records.</span> When records are digitized, these situations can create gaps in the tracking history. However, the service provider’s <span class="highlight">main goal is to accurately record rental and return times and respond to customers</span> to support accurate billing, rather than maintaining a perfectly complete tracking history.',
              'Based on these findings, I designed several key solutions. The following sections highlight some of the most impactful ones.',
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: '1) Enable multiple scanning options for any unpredicted scenario.',
          },
          {
            type: 'pureText',
            paragraphs: [
              'As an RFID scanning solution does not guarantee 100% coverage, <span class="highlight">other scanning or entering methods are still accessible</span> when RFID scanning fails or when only one or two product components need to be scanned or added.',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-scanningMethod.webp',
              alt: 'RFID, barcode, and keyboard product registration methods',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: '2) Automatically resolve non-critical errors without interrupting the workflow.',
          },
          {
            type: 'pureText',
            paragraphs: [
              'I identified the <span class="highlight">minimum data required for rental time tracking and automated the rest.</span> For most error cases, the system fills in non-critical data automatically, allowing rental tracking to continue without interrupting the workflow.',
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 1,
            items: [
              {
                label:
                  'Possible status error and solution when unloading product to the warehouse',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-flowchartHidden.webp',
                  alt: 'Possible status errors and automated resolution workflow',
                },
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: 'Action 4: Business Analysis Reports Design',
            line: false,
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                html: 'To enable service providers to periodically evaluate operational efficiency and customer needs, I designed several reports divided into two levels of granularity, helping supervisors quickly identify operational issues.',
              },
              {
                type: 'unorderedList',
                items: [
                  '<span class="highlight">High-level reports display key metrics</span>, such as total process time, helping users quickly identify potential issues.',
                  'More <span class="highlight">detailed reports show segmented data</span> for each major process, allowing users to trace problems efficiently.',
                ],
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-reportLogic.webp',
              alt: 'Business analysis report hierarchy from summary metrics to segmented detail reports',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: 'Final Result', line: false },
          {
            type: 'pureText',
            paragraphs: [
              'To validate the concept, we demonstrated different scanning methods and results using a simulated work environment. Through the proposal presentation, we outlined the software development roadmap and implementation plan. The client later confirmed the purchase agreement and implemented the solution in 2026.',
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 2,
            items: [
              {
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-final1.webp',
                  alt: 'KeepWell proposal presentation with the client team',
                },
              },
              {
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-final2.webp',
                  alt: 'KeepWell scanning workflow demonstration',
                },
              },
            ],
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: 'Reflection', line: false },
          {
            type: 'pureTitle',
            text: 'Usability isn’t universal: design principles must adapt to user context',
          },
          {
            type: 'pureText',
            paragraphs: [
              'Our research revealed that both service providers and hospitals often bypass certain steps we initially considered important, such as rechecking product serial numbers or inspecting product conditions on-site, simply to keep everything faster. This showed that the interface we originally designed to reduce errors and improve data accuracy, based on general usability principles, ended up being unnecessarily complex.',
            ],
          },
          {
            type: 'pureTitle',
            text: 'Highly coupled systems raise modification costs: modular flexibility is key to scalable solutions',
          },
          {
            type: 'pureText',
            paragraphs: [
              'In the original system design, modifying any module could cause the entire workflow to fail due to the tightly coupled data between modules. As a result, we had to put significant effort into restructuring the system to meet the service provider’s needs by making each module independently modifiable.',
              'From this experience, we should design with modular integration in mind when serving users with diverse workflows, enabling quick adaptation to different operational processes without costly redesigns.',
            ],
          },
        ],
      },
    ],
    zh: [
      {
        modules: [
          {
            type: 'quote',
            paragraphClass: 'project-module__nda-note',
            html: '<strong>本專案受保密協議（NDA）約束，因此部分使用者研究發現與最終設計無法公開揭露細節。</strong>',
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: '專案背景', line: false },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-fistImage.webp',
              alt: 'Wellell 工作人員處理醫療氣墊床元件',
            },
          },
          {
            type: 'pureText',
            paragraphs: [
              'KeepWell 是一套協助醫療設備進行去污與租賃管理的 SaaS 平台，初期聚焦於醫療氣墊床。系統透過設備上的條碼資產標籤，協助歐洲租賃服務商管理現場庫存、消毒、訂單、物流與客戶等完整流程。',
              '本專案頁將聚焦於「4. 清潔與包裝」工作流程。受 NDA 限制，研究細節與最終介面將先以佔位內容呈現。',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-serviceFlow.webp',
              alt: '清潔與包裝流程圖片預留位置',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'bigQuote',
            className: 'keepwell-rapid-quote',
            icon: '../../img/sketch-think.svg',
            content:
              '我們透過<span class="highlight">快速迭代</span>，確保複雜的工作流程符合客戶需求。',
          },
        ],
      },
      {
        modules: [
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-workflow.webp',
              alt: '從現場調查至解決方案提案的快速迭代流程',
            },
          },
        ],
      },
      {
        classes: [
          'specialSection',
          'specialSection--gray',
          'sectionNarrow',
          'keepwell-section--problem',
        ],
        modules: [
          { type: 'bgTitle', text: '問題定義' },
          {
            type: 'bgQuote',
            headingTag: 'h3',
            headingHtml:
              '不準確的租賃資料，以及對設施效率缺乏掌握，造成難以察覺的營收損失。',
            callOuts: [
              {
                title: '紙本流程與人工檢查導致紀錄不完整。',
                text: '租賃數量與日期皆記錄於紙本。即使經過多次人工檢查，服務商仍無法準確追蹤每項產品是在醫院、已歸還或遺失；人工計數誤差更進一步擴大預估收益與實際收益之間的落差。',
              },
              {
                title: '難以掌握營運效率與產品狀態。',
                text: '設施內部的產品處理狀態不明確，管理者無法快速評估工作站效率、庫存供應、流程瓶頸或未來產品需求。',
              },
            ],
          },
        ],
      },
      {
        classes: ['specialSection', 'specialSection--yellow', 'sectionNarrow'],
        modules: [
          { type: 'bgTitle', text: '目標拆解' },
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
                  '<span class="project-module__item-label">商業目標</span>向客戶導入系統以強化硬體銷售',
                content:
                  '除了軟體訂閱之外，KeepWell 也可作為未來 IoT 與硬體產品整合的基礎。',
              },
              {
                image: {
                  src: '../../img/sketch-function.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">產品目標</span>追蹤產品狀態並視覺化工作流程效率',
                content:
                  '現有系統功能過多，不符合客戶對簡化操作的需求，也缺少支援大量產品登錄的 RFID 功能。',
              },
              {
                image: {
                  src: '../../img/sketch-webDesign.svg',
                  alt: '',
                  zoom: false,
                },
                title:
                  '<span class="project-module__item-label">設計目標</span>在各工作站快速完成產品元件登錄',
                content:
                  '於每個工作站記錄產品狀態會增加額外作業；設計挑戰是讓狀態更新更快速，同時維持流程效率且不中斷。',
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: '行動一：設施營運流程調查',
            line: false,
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                html: '由於人力成本高昂，降低營運作業負擔是服務商的重要需求。在開始軟體設計之前，我們<span class="highlight">觀察並記錄工廠人員的日常工作流程</span>，再將其整理為使用者旅程，以找出改善既有軟體體驗的機會。我們著重蒐集以下資訊：',
              },
              {
                type: 'unorderedList',
                items: [
                  '工作人員在流程中必須記錄的資訊。',
                  '各工作站拆卸、處理與重新組裝產品的詳細步驟。',
                ],
              },
              {
                type: 'paragraph',
                html: '藉此確認導入軟體時最低限度的必要需求，以及適合安排互動操作的節點。',
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-facilityFlow.webp',
              alt: '從卸貨到入庫的設施營運簡化流程',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: '行動二：RFID 掃描流程評估',
            line: false,
          },
          {
            type: 'pureText',
            paragraphs: [
              '我們使用不同設備進行現場模擬，評估各類 RFID 掃描器在不同環境下的表現，包含<span class="highlight">最大掃描距離、單次可偵測的產品數量，以及掃描全部產品所需的時間。</span>這些結果成為最終工作流程設計的依據。',
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 2,
            items: [
              {
                label: '手持式掃描器測試一',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-handheldCart.webp',
                  alt: '使用手持式 RFID 掃描器與產品推車進行現場測試',
                },
              },
              {
                label: '手持式掃描器測試二',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-handheld2.webp',
                  alt: '使用第二款手持式 RFID 掃描器進行現場測試',
                },
              },
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 1,
            items: [
              {
                label: '閘門式掃描器測試',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-fixScan.webp',
                  alt: '使用固定閘門式 RFID 掃描器進行現場測試',
                },
              },
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 1,
            items: [
              {
                label: '比較結果',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-compareResult.webp',
                  alt: '手持式與閘門式 RFID 掃描器比較',
                },
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: '行動三：軟體 UIUX 設計',
            line: false,
          },
          {
            type: 'pureText',
            paragraphs: [
              '透過訪談，我們<span class="highlight">發現歸還的產品可能存在零件缺少或多出的情況，且未必留下紀錄。</span>當紀錄數位化後，這些狀況可能造成追蹤歷程不完整。然而，服務商的<span class="highlight">主要目標是準確記錄租借與歸還時間並回應客戶需求</span>，以支援正確計費，而不是維持完全無缺漏的追蹤歷程。',
              '基於這些發現，我設計了數個關鍵解決方案。後續段落將呈現其中影響較大的設計。',
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: '1）提供多種掃描方式，以因應不可預期的情境。',
          },
          {
            type: 'pureText',
            paragraphs: [
              'RFID 掃描無法保證涵蓋所有情況，因此當 RFID 掃描失敗，或僅需掃描、加入一至兩個產品元件時，<span class="highlight">使用者仍可選擇其他掃描或輸入方式。</span>',
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-scanningMethod.webp',
              alt: 'RFID、條碼與鍵盤產品登錄方式',
            },
          },
        ],
      },
      {
        modules: [
          {
            type: 'pureTitle',
            text: '2）自動處理非關鍵錯誤，避免中斷工作流程。',
          },
          {
            type: 'pureText',
            paragraphs: [
              '我確認了<span class="highlight">租賃時間追蹤所需的最低限度資料，並將其餘項目自動化。</span>在多數錯誤情況下，系統會自動補齊非關鍵資料，讓租賃追蹤可以持續進行而不中斷作業。',
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 1,
            items: [
              {
                label: '產品卸貨入庫時可能出現的狀態錯誤與解決方式',
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-flowchartHidden.webp',
                  alt: '可能的狀態錯誤與自動處理流程',
                },
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            type: 'bgTitle',
            text: '行動四：商業分析報表設計',
            line: false,
          },
          {
            type: 'pureText',
            items: [
              {
                type: 'paragraph',
                html: '為了讓服務商能定期評估營運效率與客戶需求，我設計了數份不同資料粒度的報表，分為兩個層級，協助管理者快速辨識營運問題。',
              },
              {
                type: 'unorderedList',
                items: [
                  '<span class="highlight">高層級報表呈現關鍵指標</span>，例如總處理時間，協助使用者快速發現潛在問題。',
                  '<span class="highlight">詳細報表呈現各主要流程的分段資料</span>，讓使用者能有效追查問題。',
                ],
              },
            ],
          },
          {
            type: 'singleImage',
            image: {
              src: '../../img/projects/keepwell/image-keepwell-reportLogic.webp',
              alt: '從摘要指標至分段詳細報表的商業分析報表層級',
            },
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: '最終成果', line: false },
          {
            type: 'pureText',
            paragraphs: [
              '為了驗證概念，我們在模擬工作環境中展示不同掃描方式與結果。提案簡報中也提出軟體開發藍圖與導入計畫；客戶後續確認採購協議，並於 2026 年導入此解決方案。',
            ],
          },
          {
            type: 'captionedMediaGrid',
            columns: 2,
            items: [
              {
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-final1.webp',
                  alt: '與客戶團隊進行 KeepWell 提案簡報',
                },
              },
              {
                image: {
                  src: '../../img/projects/keepwell/image-keepwell-final2.webp',
                  alt: 'KeepWell 掃描流程展示',
                },
              },
            ],
          },
        ],
      },
      {
        modules: [
          { type: 'bgTitle', text: '反思', line: false },
          {
            type: 'pureTitle',
            text: '易用性並非放諸四海皆準：設計原則必須配合使用情境調整',
          },
          {
            type: 'pureText',
            paragraphs: [
              '研究發現，服務商與醫院經常會略過我們起初認為重要的步驟，例如再次核對產品序號，或在現場檢查產品狀況，以加快整體作業。這表示原先依據通用易用性原則、為降低錯誤並提高資料準確度而設計的介面，最終反而產生了不必要的複雜度。',
            ],
          },
          {
            type: 'pureTitle',
            text: '高度耦合的系統會提高修改成本：模組化彈性是打造可擴充解決方案的關鍵',
          },
          {
            type: 'pureText',
            paragraphs: [
              '在原始系統設計中，由於模組之間的資料高度耦合，修改任何一個模組都可能導致整個工作流程失效。因此，我們投入大量心力重整系統，讓各模組能獨立修改，以符合服務商的實際需求。',
              '這次經驗讓我理解，面對具有多元工作流程的使用者時，系統應以模組化整合為設計前提，才能快速適應不同營運流程，避免高成本的全面重新設計。',
            ],
          },
        ],
      },
    ],
  },
};

module.exports = { project };
