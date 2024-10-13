const workCoverContent = [
  {
    number: '05',
    title: '台北市社會局公托登記與抽籤系統網站改造',
    tag: 'UX Design｜UX Research',
    description:
      '為台北市公托登記報名與抽籤系統進行使用者研究與再設計。讓民眾能一站完成規則了解、機構查詢、登記候補...等所有作業流程',
    image: '/img/sample.webp',
  },
  {
    number: '04',
    title: '博客來如何在一年內提升 6 成電子書銷售額',
    tag: 'Consultant',
    description:
      '經分析約 1500 份填寫者的量化研究與 10 為使用者訪談資料，並搭配競品與客群分析，定義博客來電子書的優劣勢。並以博客來電子書從瀏覽到下單的轉換率過低做為問題切入點，制定可以提升其電子書銷售的策略',
    image: '/img/sample.webp',
  },
  {
    number: '03',
    title: 'ShopperApp UI 介面優化設計',
    tag: 'Frontend Development',
    description:
      '進行 APP 元件優化以滿足店家在會員與銷售上的需求，提交約 5 項 UI 元件視覺與邏輯調整之設計稿，並於上線前進行 UI Testing',
    image: '/img/sample.webp',
  },
  {
    number: '02',
    title: '設計系統架構設計與整理',
    tag: 'UX/UI Design',
    description:
      '以「提升使用效率」、「提升上手速度」、「維護完整性與正確性」為目標，經過訪談與調查共整理出 5 項主要問題，並整理 45 種元件與相關規範。最終提出新的設計系統架構與團隊維護方式，落地使用並不斷進行迭代',
    image: '/img/sample.webp',
  },
  {
    number: '01',
    title: 'POS TW/HK 金流串接正逆流程設計',
    tag: 'UX Design',
    description:
      '完成 6 項正逆金流系統操作流程設計，涵蓋 3 種金流、非金流付款方式與多種付款結果處理（成功、失敗、離線、操作錯誤…），範圍涉及後台設定、POS 結帳/取消/退貨流程與刷卡機結帳功能，並進行上線前的 UI Test',
    image: '/img/sample.webp',
  },
];

const mainSection = document.querySelector('.block--switcher');
const aboutSection = document.querySelector('.section--about');

workCoverContent.forEach((item) => {
  const section = document.createElement('section');
  section.className = 'section section--work';

  section.innerHTML = `
    <div class="container container--content">
      <figure class="media media--workCover">
        <img class="media__img" src="${item.image}" alt="" />
      </figure>
      <article class="block block--introduction">
        <div class="block__header">
          <h1 class="block__number">${item.number}</h1>
          <div class="block__content">
            <h2 class="block__title">${item.title}</h2>
            <h6 class="block__tag">${item.tag}</h6>
          </div>
        </div>
        <p class="block__description">
          ${item.description}
        </p>
        <div class="block__button"><p>View Project</p></div>
      </article>
    </div>
  `;

  // 在 mainSection 和 aboutSection 之間插入 section
  mainSection.insertAdjacentElement('afterend', section);
});
