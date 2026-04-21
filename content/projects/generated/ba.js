const project = {
  "slug": "ba",
  "tags": "B2B Medical SaaS, Business Analytics",
  "coverImage": "../../img/image-projectCover-ba.webp",
  "languageLabel": "繁中 | EN",
  "head": {
    "en": {
      "htmlLang": "en",
      "title": "Business Analytics Model Design for B2B PRC Medical Device Management System",
      "translatorHref": "../zh/ba.html",
      "navigationLanguage": "en",
      "imageAlt": "Decontamination and Rental Service Management System for PRC Medical Device"
    },
    "zh": {
      "htmlLang": "zh",
      "title": "PRC 醫療器材清消與租賃管理系統：商業分析報表設計",
      "translatorHref": "../en/ba.html",
      "navigationLanguage": "zh",
      "imageAlt": "Decontamination and Rental Service Management System for PRC Medical Device"
    }
  },
  "header": {
    "en": {
      "title": "Business Analytics Model Design for B2B PRC Medical Device Management System",
      "duration": "Dec. 2024",
      "role": "Product Designer",
      "responsibility": "Competitor Analysis, Data Cleaning and Analysis, Report Structure Planning",
      "company": "Wellell"
    },
    "zh": {
      "title": "PRC 醫療器材清消與租賃管理系統：商業分析報表設計",
      "duration": "Dec. 2024",
      "role": "Product Designer",
      "responsibility": "競品分析、數據清理與分析、報表架構規劃",
      "company": "Wellell"
    }
  },
  "introduction": {
    "en": {
      "purpose": "Identified client needs and system data limitations, designed business analysis reports that enhanced operational efficiency, and incorporated business models to attract clients to upgrade to advanced software plans.",
      "challenge": "The system included various modules and data types that had not yet been reviewed. It was necessary to check the existing data and assess the feasibility of adding new data for additional reports.",
      "production": "6 main categories with a total of 36 business analysis reports. Based on the level of data granularity, the reports were divided into basic and advanced categories, each included in different software pricing plans.",
      "outcome": "Proposed to the client to conduct initial testing using manually generated reports."
    },
    "zh": {
      "purpose": "了解客戶需求與系統資料限制，設計能協助客戶提升其營運效率的商業分析報表，並結合商業模式吸引客戶訂閱軟體進階方案。",
      "challenge": "系統中模組類型與資料多樣，且資料尚未經過盤點與可行性評估。需重新盤點既有資料並評估新增其他報表所需資料的可行性。",
      "production": "6 大分類、共 36 個商業分析報表。並依照資料分析顆粒度，分成基礎與進階報表分屬不同軟體收費方案。",
      "outcome": "對客戶進行提案，預計以人工生成報表的方式進行前期測試。"
    }
  },
  "sections": {
    "en": [
      {
        "modules": [
          {
            "type": "quote",
            "html": "This project is under an NDA, so detailed information cannot be\n                                                                                                      shared on public platforms.",
            "paragraphClass": "project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text warning"
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Project Background"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "KeepWell is a SaaS platform designed to streamline the\n                                                                                                      decontamination and rental management of medical equipment,\n                                                                                                      currently focusing on medical air mattresses. By combining QR code\n                                                                                                      asset tags with medical devices, it helps European service\n                                                                                                      providers manage their entire process — from on-site inventory and\n                                                                                                      disinfection to orders, logistics, and customer management."
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/ba/image-ba-workflow-en.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "classes": [
          "specialSection",
          "specialSection--gray"
        ],
        "modules": [
          {
            "type": "bgTitle",
            "html": "Problem Definition"
          },
          {
            "type": "bgQuote",
            "headingTag": "h3",
            "headingHtml": "Service providers track consumable and maintenance costs and\n                                                                                                      product utilization, but still rely on manual checks and paper\n                                                                                                      records without reliable data for optimization.",
            "headingStyle": "flex: 1",
            "callOutListStyle": "flex: 1",
            "callOuts": [
              {
                "title": "Unable to identified which part of the whole process needs optimization",
                "text": "The rental workflow is complex and involves many products. Without data support, providers rely on observation and staff feedback to assess efficiency, making it hard to find and fix bottlenecks."
              },
              {
                "title": "Unable to analyze equipment replacement and maintenance records.",
                "text": "Replacement and maintenance are key cost factors for service providers. Without a systematic analysis, it's hard for them to track inventory, decide when to restock, and understand why equipment breaks."
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-factory.svg",
            "content": "Most report users are senior staff. The key goal of this report\n                                                                                                      design is to ==help them quickly identify operational issues\n                                                                                                      within complex workflows.=="
          }
        ]
      },
      {
        "classes": [
          "specialSection",
          "specialSection--yellow"
        ],
        "modules": [
          {
            "type": "bgTitle",
            "html": "Goal Breakdown"
          },
          {
            "type": "horizontalIconList",
            "items": [
              {
                "image": {
                  "src": "../../img/sketch-money.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "Business Goal: Increase subscription revenue",
                "content": "Attract clients to upgrade to higher-tier software plans to\n                                                                                                          boost subscription income."
              },
              {
                "image": {
                  "src": "../../img/sketch-function.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "Product Goal: Add a new business analysis module",
                "content": "Enhance plan differentiation and increase the appeal of\n                                                                                                          advanced subscription tiers."
              },
              {
                "image": {
                  "src": "../../img/sketch-webDesign.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "Design Goal: Help users identify workflow bottlenecks",
                "content": "Ensure users can quickly locate issues in reports, identify\n                                                                                                          process bottlenecks, and optimize operational efficiency."
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Main Concept of the Report Structure"
          },
          {
            "type": "quote",
            "html": "Make sure users don't get lost among numerous reports.",
            "paragraphClass": "project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "The reports are divided into two levels of granularity:"
              }
            ]
          },
          {
            "type": "orderedList",
            "className": "module__content--content",
            "items": [
              "<span class=\"highlight\">High-level reports</span> display key\n                                                                                                      metrics, such as total process time, helping users quickly\n                                                                                                      identify potential issues.",
              "<span class=\"highlight\">More detailed reports</span> show\n                                                                                                      segmented data for each major process, allowing users to trace\n                                                                                                      problems efficiently."
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/ba/image-ba-reportConcept-en.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Outcome"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "The report structure includes 6 categories in total, 5 based on\n                                                                                                      relevant KeepWell modules and 1 for employee efficiency analysis,\n                                                                                                      focusing on service providers' key concerns such as consumable and\n                                                                                                      maintenance costs, and product utilization, resulting in 36\n                                                                                                      reports in total."
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/ba/image-ba-outcome.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Self-reflection"
          },
          {
            "type": "pureTitle",
            "html": "Reports are merely fancy and useless numbers without pointing to a\n                                                                                                      clear next action."
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "During competitor research, we found that some systems offer a\n                                                                                                      large number of reports and data views but lack a clear hierarchy\n                                                                                                      and logical connections. As a result, users often get lost among\n                                                                                                      various charts and struggle to identify which information truly\n                                                                                                      matters for decision-making. In other words,\n                                                                                                      <span class=\"highlight\"\n                                                                                                        >these reports appear comprehensive but fail to translate into\n                                                                                                        actionable insights.</span\n                                                                                                      >"
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "From client interviews, we also learned that service providers\n                                                                                                      tend to focus first on key accounting indicators, such as revenue,\n                                                                                                      to decide whether further investigation is needed. This highlights\n                                                                                                      that\n                                                                                                      <span class=\"highlight\"\n                                                                                                        >a clear structure and actionable guidance are far more\n                                                                                                        important than simply displaying data.</span\n                                                                                                      >\n                                                                                                      A well-designed report should not only present information but\n                                                                                                      also point users toward meaningful decisions."
              }
            ]
          }
        ]
      }
    ],
    "zh": [
      {
        "modules": [
          {
            "type": "quote",
            "html": "本專案已簽署 NDA，無法於公開平台展示專案細節。",
            "paragraphClass": "project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text warning"
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "專案背景"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/ba/image-ba-fistImage.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "KeepWell 是一個為 PRC 醫療器材所開發的清消與租賃流程管理 SaaS\n                                                                                                      系統，搭配專為醫療器材所設計的 QRcode\n                                                                                                      資產追蹤標籤，提供歐洲的醫療器材服務商進行場內器材庫存、清消、訂單、物流、客戶…\n                                                                                                      等完整服務流程的數位化管理。此軟體當前主要服務出租醫療氣墊床的服務商。"
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "KeepWell\n                                                                                                      希望提供給客戶的最大價值為協助其找出服務流程中的瓶頸，進而提升其效率。透過密集的資產追蹤時間點，KeepWell\n                                                                                                      理應能從不同流程的處理時間、產品通過某節點的流量、各醫院的租賃趨勢…\n                                                                                                      等不同的角度，以產品序號級別的顆粒度，提供服務商如服務效率、需求預測…\n                                                                                                      等洞察，協助其提升營運效率，增加營收"
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/ba/image-ba-workflow.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "classes": [
          "specialSection",
          "specialSection--gray"
        ],
        "modules": [
          {
            "type": "bgTitle",
            "html": "問題定義"
          },
          {
            "type": "bgQuote",
            "headingTag": "h3",
            "headingHtml": "使用者重視整體運營中的耗材 /\n                                                                                                      維修成本和產品利用率。當前僅依靠人員觀察與紙本資料，缺乏可靠的流程優化依據",
            "headingStyle": "flex: 1",
            "callOutListStyle": "flex: 1",
            "callOuts": [
              {
                "title": "難以判斷整體流程中哪些環節需要優化",
                "text": "租賃流程複雜且涉及多種產品，在缺乏數據支持的情況下，服務商只能依賴觀察與人員回饋來評估效率，因此很難精確找出並改善流程瓶頸。"
              },
              {
                "title": "難以分析設備汰換與維修紀錄",
                "text": "設備汰換與維修是服務商的重要成本來源。若沒有系統化分析，就難以掌握庫存狀況、判斷何時補貨，或釐清設備損壞的原因。"
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-factory.svg",
            "content": "閱讀報表的使用者多為上級人員，==\n                                                                                                      如何協助其在繁雜的流程中快速定位營運問題 ==，是本次報表設計的關鍵"
          }
        ]
      },
      {
        "classes": [
          "specialSection",
          "specialSection--yellow"
        ],
        "modules": [
          {
            "type": "bgTitle",
            "html": "目標拆解"
          },
          {
            "type": "horizontalIconList",
            "items": [
              {
                "image": {
                  "src": "../../img/sketch-money.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "商業目標：增加訂閱費用收入",
                "content": "吸引客戶訂閱軟體進階方案以提升訂閱費收入。"
              },
              {
                "image": {
                  "src": "../../img/sketch-function.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "產品目標：新增商業分析模組",
                "content": "增加軟體訂閱方案的差異化，提高訂閱進階方案的誘因。"
              },
              {
                "image": {
                  "src": "../../img/sketch-webDesign.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "設計目標：協助用戶找出流程瓶頸",
                "content": "確保使用者可以從報表快速定位問題，找出流程瓶頸並針對性地提升營運效率。"
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "報表架構主概念"
          },
          {
            "type": "quote",
            "html": "確保使用者不會迷失於眾多報表中",
            "paragraphClass": "project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text project-module__text"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "報表依照顆粒度大小分為兩類："
              }
            ]
          },
          {
            "type": "orderedList",
            "className": "module__content--content",
            "items": [
              "顆粒度大者顯示關鍵指標（例如流程總耗時），讓使用者快速判別流程是否出現問題。",
              "顆粒度小者顯示分段數據，提供各大流程更為細節的數據。"
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/ba/image-ba-reportConcept.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "專案產出"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "根據服務商在意的「耗材 / 維修成本」和「產品利用率」，挑選 KeepWell\n                                                                                                      中 5 個與之相關的模組，並加上「個別員工效率分析」一共 6 大類、36\n                                                                                                      份報表。"
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/ba/image-ba-outcome.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "個人反思"
          },
          {
            "type": "pureTitle",
            "html": "每個報表都需要指出明確的下一步，否則只是豐富但無用的數字與圖表"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "在競品調查的過程中，我們發現有些系統雖然提供了大量報表與數據視圖，但缺乏明確的層級與邏輯關聯，導致使用者在閱讀時容易迷失於各式圖表之中，難以快速判斷哪些資訊對決策真正有價值。報表看似豐富卻無法轉化為具體行動。"
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "在客戶現況調查中也瞭解到，服務商會優先從會計帳目中聚焦關鍵指標（例如：營收），以此判斷是否需要進一步追查背後原因。這說明了「提供明確的結構與行動指引」比單純展示數據更為關鍵。因此好的報表設計不僅應呈現資訊，更要清楚指示決策方向。"
              }
            ]
          }
        ]
      }
    ]
  }
};

module.exports = {
  project,
};
