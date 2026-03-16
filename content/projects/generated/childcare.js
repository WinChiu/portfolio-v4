const project = {
  "slug": "childcare",
  "tags": "Public Service",
  "coverImage": "../../img/image-projectCover-childcare.webp",
  "languageLabel": "繁中 | EN",
  "head": {
    "en": {
      "htmlLang": "en",
      "title": "Taipei City Childcare Registration and Lottery System Redesign",
      "translatorHref": "../zh/childcare.html",
      "navigationLanguage": "en",
      "imageAlt": "Taipei Childcare System Redesign"
    },
    "zh": {
      "htmlLang": "zh",
      "title": "台北市社會局公托登記與抽籤系統網站改造",
      "translatorHref": "../en/childcare.html",
      "navigationLanguage": "zh",
      "imageAlt": "台北市社會局公托登記與抽籤系統網站改造"
    }
  },
  "header": {
    "en": {
      "title": "Taipei City Childcare Registration and Lottery System Redesign",
      "duration": "Jul. 2021 ~ Aug. 2021",
      "role": "UX Researcher, UX Designer",
      "responsibility": "Usability Testing, Cognitive Walkthrough, User Interviews",
      "company": "PDIS - Ray 5.0 Program"
    },
    "zh": {
      "title": "台北市社會局公托登記與抽籤系統網站改造",
      "duration": "Jul. 2021 ~ Aug. 2021",
      "role": "UX Researcher, UX Designer",
      "responsibility": "易用性測試、認知走查、使用者訪談、問題收斂",
      "company": "PDIS - Ray 5.0 Program"
    }
  },
  "introduction": {
    "en": {
      "purpose": "Conducted user research and redesign for Taipei City's public childcare registration and lottery system, enabling citizens to complete all processes—such as understanding rules, searching for institutions, and registering—on a single platform.",
      "challenge": "Persuading the government to adopt the proposal without a pre-allocated budget was a significant challenge.",
      "production": "Completed usability testing, user interviews, wireframes, high-fidelity prototypes, and concept testing, ultimately delivering high-fidelity design files for government reference.",
      "outcome": "Proposed three solutions of varying complexity for the government's consideration. Two years after the project's completion, a new user-friendly guide was successfully launched on the official website."
    },
    "zh": {
      "purpose": "為台北市公托登記報名與抽籤系統進行使用者研究與再設計。讓民眾能一站完成規則了解、機構查詢、登記候補...等所有作業流程。",
      "challenge": "政府單位並無事先編列預算，如何說服與提案讓政府部門採納是為一項挑戰。",
      "production": "完成易用性測試、使用者訪談、Wireframe、Hifi Prototype 與概念測試，最終提供 Hifi 設計稿供政府部門參考。",
      "outcome": "由簡至繁提供三種方案讓政府部門參考。最終於專案結束後兩年，促成新懶人包上架於網站上。"
    }
  },
  "sections": {
    "en": [
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Project Background"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-background.webp",
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
                "html": "Public childcare primarily serves infants and toddlers aged 2\n                                                                                                      months to 2 years old, as well as parents registered in Taipei\n                                                                                                      City. Eligible parents can visit the Social Affairs Bureau's\n                                                                                                      public childcare website, read the relevant guidelines, and\n                                                                                                      complete the registration form to participate in the waitlist or\n                                                                                                      lottery for available spots. Each year, many anxious parents hope\n                                                                                                      to secure public childcare services to alleviate the pressures of\n                                                                                                      raising young children."
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
              "src": "../../img/projects/childcare/image-cc-workflow-en.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "classes": [
          "specialSection",
          "specialSection--gray",
          "specialSection--narrow"
        ],
        "modules": [
          {
            "type": "bgTitle",
            "html": "Problem Definition"
          },
          {
            "type": "verticalIconList",
            "items": [
              {
                "title": "Over 30% of applications were disqualified due to errors.",
                "titleTag": "h6",
                "paragraphs": [
                  "The Social Affairs Bureau's public childcare website lacks a\n                                                                                                          well-structured information architecture and seamless user\n                                                                                                          flow, making it difficult for parents to quickly find the\n                                                                                                          necessary information and requirements. As a result, over 30%\n                                                                                                          of the submitted documents contained errors or were from\n                                                                                                          ineligible applicants."
                ]
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-persona1-en.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "pureTitle",
            "html": "In response to the nature of public services and childcare\n                                                                                                      services, the following three design challenges remain:"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "callOut",
                "title": "All users are beginners",
                "text": "The public childcare service is used infrequently (1-2 times per\n                                                                                                        year), so the design must treat every user as a first-time user."
              },
              {
                "type": "callOut",
                "title": "Extensive childcare information",
                "text": "With rules varying by publication year and complex eligibility\n                                                                                                        and priority criteria, it is crucial to ensure users can clearly\n                                                                                                        understand the information provided."
              },
              {
                "type": "callOut",
                "title": "Diverse user types and scenarios",
                "text": "As a public service catering to a wide audience, users will have\n                                                                                                        diverse motivations and needs, requiring thoughtful\n                                                                                                        consideration of different usage scenarios."
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Current State Analysis"
          },
          {
            "type": "mdTitle",
            "html": "Stakeholder Map"
          },
          {
            "type": "pureTitle",
            "html": "Focus on the issues parents face during the stages of selecting\n                                                                                                      childcare institutions, applying, and retrieving information."
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-stakeholder-en.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "mdTitle",
            "html": "Usability evaluation and cognitive walkthrough"
          },
          {
            "type": "pureTitle",
            "html": "The main issues are cluttered information and difficulty\n                                                                                                      understanding lottery regulations."
          },
          {
            "type": "doubleImage",
            "images": [
              {
                "src": "../../img/projects/childcare/image-cc-noewWeb1.webp",
                "alt": "",
                "zoom": true
              },
              {
                "src": "../../img/projects/childcare/image-cc-noewWeb2.webp",
                "alt": "",
                "zoom": true
              }
            ]
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "callOut",
                "title": "Insufficient Error Prevention, Lack of Consistency, and Missing\n                                                                                                        Assistance",
                "text": "We rated issues on a scale of 1 to 4 based on their severity.\n                                                                                                        Among the 64 usability problems identified, the most critical\n                                                                                                        were insufficient error prevention, lack of consistency, and the\n                                                                                                        absence of help or guidance."
              },
              {
                "type": "callOut",
                "title": "Scattered Documents and Poorly Organized Forms",
                "text": "Through the team's cognitive walkthrough of three main\n                                                                                                        tasks—understanding rules, finding childcare institution\n                                                                                                        information, and registration—it was observed that although the\n                                                                                                        process is simple and linear, disorganized documents,\n                                                                                                        inconsistent text and color usage, and cluttered form layouts\n                                                                                                        significantly reduce users' efficiency in reading and locating\n                                                                                                        information."
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-interview.svg",
            "content": "We interviewed six parents and summarized the results into ==three\n                                                                                                      personas=="
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Personas and User Variables"
          },
          {
            "type": "pureTitle",
            "html": "Based on varying motivation levels and information needs, users\n                                                                                                      can be categorized into three types."
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-personas-en.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-personaVariable-en.webp",
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
            "icon": "../../img/sketch-think.svg",
            "content": "Based on the current situation and user interview results, we\n                                                                                                      identified ==three issues where the system fails to meet user\n                                                                                                      needs== and developed corresponding design solutions."
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Problem Convergence"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-problem-en.webp",
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
            "html": "Solutions"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-solution1-en.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-solution2-en.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-solution3-en.webp",
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
            "icon": "../../img/sketch-think.svg",
            "content": "We also found that parents ==frequently use their mobile phones==\n                                                                                                      for service applications in daily scenarios, so we decided to\n                                                                                                      optimize the ==RWD interface.=="
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Additional Finding"
          },
          {
            "type": "pureTitle",
            "html": "Due to childcare needs and busy work schedules, parents often rely\n                                                                                                      on their mobile phones for complex information searches and\n                                                                                                      applications."
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-rwd-en.webp",
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
            "html": "Concept Validation"
          },
          {
            "type": "pureTitle",
            "html": "Qualitative feedback from testing shows that the final design\n                                                                                                      successfully addresses the issues originally identified."
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-feedback-en.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-sus-en.webp",
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
            "html": "Proposal"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-presentation.webp",
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
                "html": "Due to the inherent difficulty of implementing website reforms in\n                                                                                                      the government, we broke down all solutions into the following\n                                                                                                      three approaches and guided Social Affairs Bureau staff, including\n                                                                                                      the Women's and Children's Section staff, Section Chief, and\n                                                                                                      Digital Minister Audrey Tang, to interact with the prototype. All\n                                                                                                      government officials were highly satisfied with our design:"
              },
              {
                "type": "orderedList",
                "className": "module__content--content",
                "items": [
                  "Minimal Cost Solution: No website development needed, only\n                                                                                                        reorganizing information.",
                  "Priority Solution for Maximum Benefit: In addition to\n                                                                                                        redesigning the information, prioritize improving the\n                                                                                                        form-filling experience.",
                  "Full Solution for Maximum User Experience Optimization: Complete\n                                                                                                        solution with all improvements."
                ]
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-yeah.svg",
            "content": "Two years after the project ended, the staff contacted us to\n                                                                                                      ==request the design of the original guide==, which was then used\n                                                                                                      as the foundation for the release of a new guide!"
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "Key Learnings"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "linkParagraph",
                "href": "https://winchiu.medium.com/%E5%AF%A6%E7%BF%92%E5%BF%83%E5%BE%97-%E6%88%91%E5%9C%A8%E5%94%90%E9%B3%B3%E8%BE%A6%E5%85%AC%E5%AE%A4%E5%AF%A6%E7%BF%92%E3%84%9D-%E5%85%AC%E5%85%B1%E6%95%B8%E4%BD%8D%E5%89%B5%E6%96%B0%E7%A9%BA%E9%96%93-pdis-x-ray-5-0-%E8%A6%8B%E7%BF%92%E8%A8%88%E7%95%AB-%E4%B8%8A-69c5ff8146a0",
                "target": "_blank",
                "html": "《 實習心得 》 我在唐鳳辦公室實習ㄝ！？公共數位創新空間 PDIS x\n                                                                                                        Ray 5.0 見習計畫（上）"
              },
              {
                "type": "linkParagraph",
                "href": "https://winchiu.medium.com/%E5%AF%A6%E7%BF%92%E5%BF%83%E5%BE%97-%E6%9B%B2%E7%B5%82%E4%BA%BA%E6%95%A3-%E6%9C%80%E7%B5%82%E6%88%91%E5%80%91%E7%95%99%E4%B8%8B%E4%BA%86%E4%BB%80%E9%BA%BC-%E5%85%AC%E5%85%B1%E6%95%B8%E4%BD%8D%E5%89%B5%E6%96%B0%E7%A9%BA%E9%96%93-pdis-x-ray-5-0-%E8%A6%8B%E7%BF%92%E8%A8%88%E7%95%AB-%E4%B8%8B-c993ad5c2417",
                "target": "_blank",
                "html": "《 實習心得 》 曲終人散 ~ 最終我們留下了什麼？公共數位創新空間\n                                                                                                        PDIS x Ray 5.0 見習計畫（下）"
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
            "type": "bgTitle",
            "html": "專案背景"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-background.webp",
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
                "html": "公共托育主要服務對象為年齡滿 2 個月至 2\n                                                                                                      足歲以下之嬰幼兒和設籍台北市的家長。符合資格的家長可上社會局公托網站，在閱讀相關規則後填寫登記表單，即可參與名額候補與開園抽籤。每年有大量的著急的家長們希望排隊申請公托服務以減緩帶小孩的壓力。"
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
              "src": "../../img/projects/childcare/image-cc-workflow.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "classes": [
          "specialSection",
          "specialSection--gray",
          "specialSection--narrow"
        ],
        "modules": [
          {
            "type": "bgTitle",
            "html": "現況問題"
          },
          {
            "type": "verticalIconList",
            "items": [
              {
                "title": "超過 3 成的不合格申請文件",
                "titleTag": "h6",
                "paragraphs": [
                  "由於社會局公托網站缺乏良好的資訊架構和流暢的使用流程，家長們難以快速找到所需的資訊與規定，有過\n                                                                                                          3 成的文件出現填寫錯誤或申請人不合資格。"
                ]
              }
            ]
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-persona1.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "pureTitle",
            "html": "因應公共服務與公托服務特性，尚有以下三項設計挑戰"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "callOut",
                "title": "使用者皆為新手",
                "text": "公托服務使用頻率極低（一年抽 1 - 2\n                                                                                                        次），必須將每位使用者當作首次操作來看待。"
              },
              {
                "type": "callOut",
                "title": "公托資料繁多",
                "text": "相關規則具有不同的發布年份，抽籤資格與順位規範多，需注意使用者對資料的理解力。"
              },
              {
                "type": "callOut",
                "title": "使用者種類與情境多樣",
                "text": "作為公共服務面向所有大眾，將會有動機與需需求不盡相同的使用者，需多方考量不同的使用情況。"
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "現況分析"
          },
          {
            "type": "mdTitle",
            "html": "利害關係人圖"
          },
          {
            "type": "pureTitle",
            "html": "聚焦在家長在選擇托育機構、申請及查詢資料階段遇到的問題"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-stakeholder.webp",
              "alt": "",
              "zoom": true
            }
          }
        ]
      },
      {
        "modules": [
          {
            "type": "mdTitle",
            "html": "易用性評估與認知走查"
          },
          {
            "type": "pureTitle",
            "html": "資訊雜亂、抽籤規範難以閱讀為最大問題"
          },
          {
            "type": "doubleImage",
            "images": [
              {
                "src": "../../img/projects/childcare/image-cc-noewWeb1.webp",
                "alt": "",
                "zoom": true
              },
              {
                "src": "../../img/projects/childcare/image-cc-noewWeb2.webp",
                "alt": "",
                "zoom": true
              }
            ]
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "callOut",
                "title": "錯誤預防不足、缺乏一致性及缺少幫助",
                "text": "我們根據問題嚴重程度分為 1 到 4 分評分。而在 64\n                                                                                                        個易用性問題中，錯誤預防不足、缺乏一致性及缺少幫助和說明是最嚴重的問題。"
              },
              {
                "type": "callOut",
                "title": "文件散亂、填寫表單未分流",
                "text": "經團隊認知走查「理解規則」、「查找托育機構資訊」及「登記」三大任務後發現，雖然流程簡單且線性，但未整理的文件、混亂的文字配色與資訊混雜的表單，降低使用者閱讀與查找資料的效率。"
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-interview.svg",
            "content": "我們邀請 6 位家長進行訪談，根據結果歸納出==3 類人物誌=="
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "人物誌與使用者變數"
          },
          {
            "type": "pureTitle",
            "html": "根據不同動機強度與資訊需求，可以將使用者分成 3 類"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-personas.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-personaVariable.webp",
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
            "icon": "../../img/sketch-think.svg",
            "content": "我們根據現況與使用者訪談結果，總結==三項系統無法回應用戶需求的問題==，並發展設計解方"
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "問題收斂"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-problem.webp",
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
            "html": "設計解方"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-solution1.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-solution2.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-solution3.webp",
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
            "icon": "../../img/sketch-think.svg",
            "content": "我們也發現在日常情境中，==家長使用手機進行服務申請的比例相當高==，因此決定優化\n                                                                                                      RWD 介面"
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "額外發現"
          },
          {
            "type": "pureTitle",
            "html": "因為嬰幼兒照護需求與工作繁忙，即便是繁複的資訊查詢與申請，也經常使用手機操作"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-rwd.webp",
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
            "html": "概念測試"
          },
          {
            "type": "pureTitle",
            "html": "在質化測試回饋中，可發現最終設計有解決原先發現的問題"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-feedback.webp",
              "alt": "",
              "zoom": true
            }
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-sus.webp",
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
            "html": "成果提案"
          },
          {
            "type": "singleImage",
            "image": {
              "src": "../../img/projects/childcare/image-cc-presentation.webp",
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
                "html": "因在政府推行網站改革本就有一定難度，我們將所有解方拆分為以下三種解決方式，同時也引導社會局婦幼科承辦人、婦幼科科長、唐鳳政務委員進行原型的操作，各政府機要也十分滿意我們的設計："
              },
              {
                "type": "orderedList",
                "className": "module__content--content",
                "items": [
                  "最低成本解決方案：無需進行網站開發，僅針對資訊作重新整理。",
                  "優先解決效益最高的問題：除重新設計資訊，優先改善表單填寫體驗。",
                  "最大程度優化使用者經驗：完整解方。"
                ]
              }
            ]
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bigQuote",
            "icon": "../../img/sketch-yeah.svg",
            "content": "專案結束兩年後，承辦人有==聯繫我們索取當時設計的懶人包==，並以此為基礎公布了新的懶人包！"
          }
        ]
      },
      {
        "modules": [
          {
            "type": "bgTitle",
            "html": "專案心得"
          },
          {
            "type": "pureText",
            "items": [
              {
                "type": "linkParagraph",
                "href": "https://winchiu.medium.com/%E5%AF%A6%E7%BF%92%E5%BF%83%E5%BE%97-%E6%88%91%E5%9C%A8%E5%94%90%E9%B3%B3%E8%BE%A6%E5%85%AC%E5%AE%A4%E5%AF%A6%E7%BF%92%E3%84%9D-%E5%85%AC%E5%85%B1%E6%95%B8%E4%BD%8D%E5%89%B5%E6%96%B0%E7%A9%BA%E9%96%93-pdis-x-ray-5-0-%E8%A6%8B%E7%BF%92%E8%A8%88%E7%95%AB-%E4%B8%8A-69c5ff8146a0",
                "target": "_blank",
                "html": "《 實習心得 》 我在唐鳳辦公室實習ㄝ！？公共數位創新空間 PDIS x\n                                                                                                        Ray 5.0 見習計畫（上）"
              },
              {
                "type": "linkParagraph",
                "href": "https://winchiu.medium.com/%E5%AF%A6%E7%BF%92%E5%BF%83%E5%BE%97-%E6%9B%B2%E7%B5%82%E4%BA%BA%E6%95%A3-%E6%9C%80%E7%B5%82%E6%88%91%E5%80%91%E7%95%99%E4%B8%8B%E4%BA%86%E4%BB%80%E9%BA%BC-%E5%85%AC%E5%85%B1%E6%95%B8%E4%BD%8D%E5%89%B5%E6%96%B0%E7%A9%BA%E9%96%93-pdis-x-ray-5-0-%E8%A6%8B%E7%BF%92%E8%A8%88%E7%95%AB-%E4%B8%8B-c993ad5c2417",
                "target": "_blank",
                "html": "《 實習心得 》 曲終人散 ~ 最終我們留下了什麼？公共數位創新空間\n                                                                                                        PDIS x Ray 5.0 見習計畫（下）"
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
