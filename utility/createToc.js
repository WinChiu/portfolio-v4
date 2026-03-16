document.addEventListener("DOMContentLoaded", function () {
  /* ========== 第 1 步：幫 section title 加上 ID，並動態生成 TOC ========== */
  const bgTextElements = document.querySelectorAll(
    ".project-module--section-title .project-module__heading"
  );

  // 建立 TOC 容器
  const tocContainer = document.createElement("div");
  tocContainer.className = "project-nav__toc";

  bgTextElements.forEach((section, index) => {
    const id = `toc${index + 1}`;
    section.id = id; // 幫每個 section title 加上動態 ID

    // 建立 <a> 作為 TOC 連結
    const tocLink = document.createElement("a");
    tocLink.className = "project-toc";
    tocLink.href = `#${id}`;

    // dot
    const tocDot = document.createElement("div");
    tocDot.className = "project-toc__dot";

    // 文字
    const tocText = document.createElement("p");
    tocText.className = "project-toc__label";
    tocText.textContent = section.textContent.trim();

    // 組合
    tocLink.appendChild(tocDot);
    tocLink.appendChild(tocText);
    tocContainer.appendChild(tocLink);
  });

  // 插入到 nav 裡第一個子元素後
  const navbar = document.getElementById("navbar");
  if (navbar && navbar.firstElementChild) {
    navbar.insertBefore(tocContainer, navbar.firstElementChild.nextSibling);
  } else if (navbar) {
    navbar.appendChild(tocContainer);
  }

  /* ========== 第 2 步：使用 IntersectionObserver，並保留最後一次的焦點 ========== */

  const observerOptions = {
    root: null, // 以視窗為觀察容器
    threshold: 0.5, // 目標元素 50% 進入視窗時觸發
  };

  const activeSections = new Set(); // 目前在視窗中的區塊
  let lastActiveSection = null; // 最後一次成為焦點的區塊

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 目標元素進入視窗
        activeSections.add(entry.target);
      } else {
        // 目標元素離開視窗
        activeSections.delete(entry.target);
        if (entry.boundingClientRect.top > window.innerHeight) {
          if (activeSections.size === 0) {
            // 找出「目前已經滾出視窗且最接近頂部」的區塊
            const sectionsArray = Array.from(bgTextElements);
            let fallbackSection = null;
            for (let i = 0; i < sectionsArray.length; i++) {
              const rect = sectionsArray[i].getBoundingClientRect();
              // rect.bottom < 0 代表整個區塊已經在視窗頂部以上
              if (rect.bottom < 0) {
                fallbackSection = sectionsArray[i];
              } else {
                break;
              }
            }
            // 如果確實找到上一個區塊，就把它當作最後焦點
            if (fallbackSection) {
              lastActiveSection = fallbackSection;
            }
          }
        }
      }
    });

    // 從 activeSections 中找「視窗中最下面」的區塊
    let currentActive = null;
    activeSections.forEach((section) => {
      if (!currentActive) {
        currentActive = section;
      } else {
        // 比較 top 值 (越大代表越下面)
        if (
          section.getBoundingClientRect().top >
          currentActive.getBoundingClientRect().top
        ) {
          currentActive = section;
        }
      }
    });

    // 若有新的 currentActive，就更新 lastActiveSection
    if (currentActive) {
      lastActiveSection = currentActive;
    }
    // 若沒有任何區塊在視窗中，則維持 lastActiveSection 不變
    // （保留上一個焦點，不清除）

    // 更新 TOC focus 樣式
    document.querySelectorAll(".project-toc").forEach((link) => {
      link.classList.remove("project-toc--active");
    });
    if (lastActiveSection) {
      const link = document.querySelector(
        `.project-toc[href="#${lastActiveSection.id}"]`
      );
      if (link) {
        link.classList.add("project-toc--active");
      }
    }
  }, observerOptions);

  // 開始觀察每個 section title
  bgTextElements.forEach((section) => observer.observe(section));

  /* ========== 第 3 步：預留錨點滾動的置頂空間 ========== */
  const tocLinks = document.querySelectorAll(".project-toc");
  const offset = 24; // 預留 24px 空間
  tocLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // 阻止預設的錨點跳轉行為
      const targetId = this.getAttribute("href").substring(1); // 取得 ID
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // 計算滾動位置 (目標元素的頂部位置 - 預留空間)
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.scrollY - offset;

        // 執行平滑滾動
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
