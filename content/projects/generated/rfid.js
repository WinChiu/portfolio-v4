const project = {
  "slug": "rfid",
  "tags": "B2B Medical SaaS, Hardware Integration",
  "coverImage": "../../img/image-projectCover-rfid.webp",
  "languageLabel": "繁中 | EN",
  "head": {
    "en": {
      "htmlLang": "en",
      "title": "RFID Integration for a B2B PRC Medical Device Management System",
      "translatorHref": "../zh/rfid.html",
      "navigationLanguage": "en",
      "imageAlt": "Decontamination and Rental Service Management System for PRC Medical Device"
    },
    "zh": {
      "htmlLang": "zh",
      "title": "B2B PRC Medical Device Management System: RFID Integration",
      "translatorHref": "../en/rfid.html",
      "navigationLanguage": "zh",
      "imageAlt": "Decontamination and Rental Service Management System for PRC Medical Device"
    }
  },
  "header": {
    "en": {
      "title": "RFID Integration for a B2B PRC Medical Device Management System",
      "duration": "Dec. 2024 ~ Apr. 2025",
      "role": "Product Designer",
      "responsibility": "UI Mockup, Functional Specification, PM Testing, Field Simulation, Product Proposal",
      "company": "Wellell"
    },
    "zh": {
      "title": "B2B PRC 醫療器材清消與租賃管理系統：RFID 技術整合",
      "duration": "Dec. 2024 ~ Apr. 2025",
      "role": "Product Designer",
      "responsibility": "UI Mockup, Functional Specification, PM Testing, Field Simulation, Product Proposal",
      "company": "Wellell"
    }
  },
  "introduction": {
    "en": {
      "purpose": "To align with Europe's Industry 4.0 transformation, we planned to integrate an RFID scanning feature into the existing logistics module, providing customers with a more flexible way to track assets.",
      "challenge": "To reduce development cost and shorten the time to market, RFID feature should be added without major changes to the existing workflow. As the system architecture was complex, it was necessary to map all possible product tracking state and necessary response.",
      "production": "Conducted on-site research and built a simulated environment to test design concepts. Completed the final design of RFID-related features for the logistics module, delivered the full functional specification, and carried out PM testing.",
      "outcome": "Successfully initiated partnership discussions with a Danish a service provider and prepared for gradual implementation."
    },
    "zh": {
      "purpose": "因應歐洲市場工業 4.0 智慧製造的轉型趨勢，於既有物流模組新增產品 RFID 掃描輸入功能，提供客戶更多元的資產追蹤方式。",
      "challenge": "以不大量改動既有流程為前提加上 RFID 相關功能，以降低開發成本。既有軟體架構龐大，需清楚盤點產品追蹤所遇到的各式狀態。",
      "production": "進行客戶場域調查並建構模擬場域進行設計概念測試。最終完成物流模組 RFID 相關功能之設計完稿、交付完整 Functional Specification 並進行上線前測試。",
      "outcome": "成功推動丹麥服務商洽談合作事宜，並且準備進行逐步導入。"
    }
  },
  "sections": {
    "en": [
      {
        "modules": [
          {
            "type": "quote",
            "html": "This project is under an NDA, so detailed information cannot be\n                                                                                                      shared on public platforms.",
            "paragraphClass": "warning"
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
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "After meeting with a service provider, we found that their\n                                                                                                      logistics workflow was not well suited for QR code scanning. Since\n                                                                                                      QR code asset tags require users to locate and visually access the\n                                                                                                      tag to scan it,\n                                                                                                      <span class=\"highlight\"\n                                                                                                        >it's impossible for the service provider who transports air\n                                                                                                        mattresses in bulk using cage carts.</span\n                                                                                                      >"
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
              "src": "../../img/projects/rfid/image-rfid-workflow-en.webp",
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
            "headingHtml": "QR codes on stacked mattresses are often hard or even impossible\n                                                                                                      to access.",
            "callOuts": [
              {
                "title": "Frequent scanning reduce delivery and collection efficiency.",
                "text": "Nurses usually don't stack collected air mattresses neatly, instead, they're scattered in the return area. Drivers typically confirm them by sight and load them directly onto the cart without counting each item one by one."
              },
              {
                "title": "Stacked products makes it difficult to locate asset tags.",
                "text": "Some service providers stack air mattresses in metal cage carts where QR codes are not always visible, making it impossible for drivers to scan every code."
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
              "src": "../../img/projects/rfid/image-rfid-problem-en.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-factory.svg",
            "content": "To increase the efficiency and accuracy of asset tracking, == we\n                                                                                                      planned to introduce RFID tracking technology == as an alternative\n                                                                                                      to QR code scanning."
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
                "title": "Business Goal: Increase client base and revenue",
                "content": "Aims to improve customer satisfaction and strengthen market\n                                                                                                          competitiveness."
              },
              {
                "image": {
                  "src": "../../img/sketch-function.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "Product Goal: Integrate RFID operations into the logistics\n                                                                                                          workflow",
                "content": "Provide end-to-end RFID asset tracking across logistics and\n                                                                                                          warehouse operations."
              },
              {
                "image": {
                  "src": "../../img/sketch-webDesign.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "Design Goal: Support multiple workflows and error-state\n                                                                                                          guidance",
                "content": "Enable users to quickly switch between scanning modes on\n                                                                                                          mobile devices and provide clear prompts when unexpected\n                                                                                                          situations occur during scanning."
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Environment & Equipment Research"
          },
          {
            "type": "pureTitle",
            "html": "Different contexts require multiple types of RFID devices"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "Through on-site research at service provider's facilities, we\n                                                                                                      found that the logistics workflow required two types of RFID\n                                                                                                      scanners. KeepWell needed to\n                                                                                                      <span class=\"highlight\"> support both scanning methods</span> to\n                                                                                                      meet different usage scenarios and improve operational efficiency."
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-equipment-en.webp",
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
            "html": "Software Prototype"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "According to our research, service providers focus on two key\n                                                                                                      tracking points in logistics,\n                                                                                                      <span class=\"highlight\">\n                                                                                                        when air mattresses are delivered to hospitals and when they are\n                                                                                                        collected by drivers</span\n                                                                                                      >, which serve as the basis for rental billing. For drivers, the\n                                                                                                      main concern on-site is the number of collected mattresses,\n                                                                                                      ensuring the same number of clean ones are delivered."
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "Therefore, I integrated the RFID feature into the logistics module\n                                                                                                      based on two design principles:"
              }
            ]
          },
          {
            "type": "orderedList",
            "className": "module__content--content",
            "items": [
              "<span class=\"highlight\">Minimal necessary information</span>:\n                                                                                                      Focus on displaying the scanned model and quantity, while detailed\n                                                                                                      product information is placed on a secondary page.",
              "<span class=\"highlight\">Smooth exception handling</span>: When\n                                                                                                      scanning fails, for example, due to a damaged RFID tag or data\n                                                                                                      inconsistency, the system provides clear prompts and alternative\n                                                                                                      actions to allow operations to continue seamlessly."
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-prototype1-en.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-prototype2-en.webp",
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
            "html": "Simulated Environment Design"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "We recreated the environments of service providers and hospitals\n                                                                                                      based on the user journey map, building a simulated field and an\n                                                                                                      interactive prototype to test design concepts."
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-testing1.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "doubleImage",
            "images": [
              {
                "src": "../../img/projects/rfid/image-rfid-testing2.webp",
                "alt": "",
                "zoom": true
              },
              {
                "src": "../../img/projects/rfid/image-rfid-testing3.webp",
                "alt": "",
                "zoom": true
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Proposal Presentation and Outcome"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "To validate the concept, we demonstrated different RFID scanning\n                                                                                                      methods and results using a simulated work environment. Through\n                                                                                                      the proposal presentation, we outlined the software development\n                                                                                                      roadmap and implementation plan. The client later confirmed the\n                                                                                                      purchase agreement in the second half of 2025."
              }
            ]
          },
          {
            "type": "doubleImage",
            "images": [
              {
                "src": "../../img/projects/rfid/image-rfid-presentation1.webp",
                "alt": "",
                "zoom": true
              },
              {
                "src": "../../img/projects/rfid/image-rfid-presentation2.webp",
                "alt": "",
                "zoom": true
              }
            ]
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
            "html": "Usability isn't universal: design principles must adapt to user\n                                                                                                      context"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "Our research revealed that both service providers and hospitals\n                                                                                                      often\n                                                                                                      <span class=\"highlight\"\n                                                                                                        >bypass certain steps we initially considered important</span\n                                                                                                      >, such as rechecking product serial numbers, logging precise\n                                                                                                      return times, or inspecting product conditions on-site, simply to\n                                                                                                      keep everything faster. This showed that the interface we\n                                                                                                      originally designed to reduce errors and improve data accuracy,\n                                                                                                      based on general usability principles, ended up being\n                                                                                                      unnecessarily complex."
              }
            ]
          },
          {
            "type": "pureTitle",
            "html": "Highly coupled systems raise modification costs: modular\n                                                                                                      flexibility is key to scalable solutions"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "In the original system design, modifying any module could cause\n                                                                                                      the entire workflow to fail due to the tightly coupled data\n                                                                                                      between modules. As a result, we had to put significant effort\n                                                                                                      into restructuring the system to meet the service provider's needs\n                                                                                                      by making each module independently modifiable."
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "From this experience, we should\n                                                                                                      <span class=\"highlight\"\n                                                                                                        >design with modular integration in mind when serving users with\n                                                                                                        diverse workflows,</span\n                                                                                                      >\n                                                                                                      enabling quick adaptation to different operational processes\n                                                                                                      without costly redesigns."
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
            "paragraphClass": "warning"
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
              "src": "../../img/projects/rfid/image-rfid-fistImage.webp",
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
                "html": "接觸服務商後發現，其物流的作業流程難以配合 QRcode 的掃描方式。因為\n                                                                                                      Qrcode\n                                                                                                      資產追蹤標籤需要使用者找到並看到標籤本身才能掃描，而該服務商經常以籠車為單位在收送氣墊床，很難在運送過程中翻找出資產追蹤碼（一個籠車可放約\n                                                                                                      20 組氣墊床，一張氣墊床約 15 公斤重）。"
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
              "src": "../../img/projects/rfid/image-rfid-workflow.webp",
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
            "headingHtml": "QRcode\n                                                                                                      資產追蹤標籤使得使用者必須於物流作業過程中找出醫療氣墊床上的標籤並掃描，但相互堆疊的氣墊床讓使用者難以、甚至無法翻找。",
            "callOuts": [
              {
                "title": "頻繁掃描會降低收送貨作業效率。",
                "text": "護理人員回收後的氣墊床通常不會整齊堆放，而是分散在回收區。司機多半以目視確認後直接搬上籠車，不會逐一清點每一張床墊。"
              },
              {
                "title": "產品堆疊後難以找到資產追蹤標籤。",
                "text": "部分服務商會將氣墊床堆疊在金屬籠車中，QRcode 常被遮住或朝內，導致司機無法逐一找到並掃描每個標籤。"
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
              "src": "../../img/projects/rfid/image-rfid-problem.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-factory.svg",
            "content": "為了提升資產追蹤的效率與準確性與工業 4.0 的浪潮，我們計畫==加入\n                                                                                                      RFID資產追蹤技術==，提供除 QRcode 掃描的另一個選項"
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
                "title": "商業目標：增加客戶數量以增加收入",
                "content": "因應歐洲市場工業 4.0 的轉型趨勢，新增 RFID\n                                                                                                          掃描功能提升客戶滿意度與市場競爭力。"
              },
              {
                "image": {
                  "src": "../../img/sketch-function.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "產品目標：整合 RFID 相關操作於物流流程中",
                "content": "提供使用者從揀貨、出貨、收貨、卸貨入庫完整的 RFID\n                                                                                                          資產追蹤功能。"
              },
              {
                "image": {
                  "src": "../../img/sketch-webDesign.svg",
                  "alt": "",
                  "zoom": false
                },
                "title": "設計目標：提供多元掃入流程與「錯誤狀態」提示",
                "content": "讓用戶於手機端能快速進行產品掃描移轉，並針對掃描過程的例外情況提供適當的引導。"
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "環境與設備調查"
          },
          {
            "type": "pureTitle",
            "html": "情境多元需配備多種 RFID 設備"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "經過於客戶現場的場域調查，我們發現物流相關流程中，需選配二種 RFID\n                                                                                                      掃描設備並使軟體兼容不同的掃描方式，以滿足服務商在不同場域的使用需求，提升作業效率。"
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-equipment.webp",
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
            "html": "軟體功能原型"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "根據調查，服務商在物流階段資產追蹤最在乎的時間點為「氣墊床送達醫院」和「氣墊床被司機回收」（作為向醫院收取租賃費的依據），且「回收數量」為物流司機現場作業時最在意的資訊（確保補給醫院相同數量的乾淨氣墊床），產品序號、是否損壞、確切數量...\n                                                                                                      等皆等到回廠卸貨後，才交給產品清消人員做複查。"
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "因此，我採用以下兩個設計原則將 RFID 功能整合進物流模組："
              }
            ]
          },
          {
            "type": "orderedList",
            "className": "module__content--content",
            "items": [
              "最少必要資訊：以呈現掃描「型號與數量」為主，詳細產品資訊置於第二層頁面。",
              "確保異常處理流程順利：遇到無法正常掃描的情況時，包含 RFID\n                                                                                                      標籤損壞、產品狀態異常，提供明確提示與替代解法讓物流作業依然可以持續進行下去。"
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-prototype1.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-prototype2.webp",
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
            "html": "模擬場域設計"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "我們仿照服務商與醫院環境，依用戶旅程圖建構模擬場域，並製作可互動原型以測試設計概念。"
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/rfid/image-rfid-testing1.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "doubleImage",
            "images": [
              {
                "src": "../../img/projects/rfid/image-rfid-testing2.webp",
                "alt": "",
                "zoom": true
              },
              {
                "src": "../../img/projects/rfid/image-rfid-testing3.webp",
                "alt": "",
                "zoom": true
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "提案展示與成果"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "我們向客戶展示不同 RFID\n                                                                                                      設備的掃描方式與結果，利用模擬場域模擬作業人員的掃描方式，並搭配提案簡報說明軟體開發路徑與導入相關準備事宜。並成功於\n                                                                                                      2025 年下半年確認簽約購買相關服務。"
              }
            ]
          },
          {
            "type": "doubleImage",
            "images": [
              {
                "src": "../../img/projects/rfid/image-rfid-presentation1.webp",
                "alt": "",
                "zoom": true
              },
              {
                "src": "../../img/projects/rfid/image-rfid-presentation2.webp",
                "alt": "",
                "zoom": true
              }
            ]
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
            "html": "通用的易用性原則不一定適用於所有使用者：應根據不同的情境調整設計原則"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "在這次調查中發現，服務商和醫院為了提高作業效率，時常私下談妥並省略一部分我們原先認為重要的作業環節，例如出租商品序號複查、準確的回收時間、現場確認出租物無損壞...\n                                                                                                      等等。導致我們在初始版本中，根據易用性原則來避免用戶錯誤操作和確保數據精確的設計，對使用者來說反而是多餘的資訊與功能。"
              }
            ]
          },
          {
            "type": "pureTitle",
            "html": "系統過度耦合導致修改成本高：應確保模組間的設計彈性以因應模組化方案的商業模式"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "在系統過往的設計中，不同模組之間的資料是密不可分的，移除任一個模組都會造成資料無法運作。本次專案中，為符合客戶實體場域的需求，我們花了許多時間針對模組的拆解作許多調整，甚至花了不少心力改動其他模組的架構來允許模組拆分。"
              },
              {
                "type": "paragraph",
                "className": "project-module__text",
                "html": "未來，在已知目標使用者群本來就有多種使用流程的情況下，在設計各模組之間的串接時應更注意模組化的可能，避免每次遇到作業流程不同的客戶就需要花費大量時間調整。"
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
