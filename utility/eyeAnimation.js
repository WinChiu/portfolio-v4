(function () {
  const eyeLeft = document.querySelector(".media__img--eye1Left");
  const eyeRight = document.querySelector(".media__img--eye1Right");
  const eyeLeftSocket = document.querySelector(".media__img--eye1SocketLeft");
  const eyeRightSocket = document.querySelector(".media__img--eye1SocketRight");
  const eyebrowLeft = document.querySelector(".media__img--eyebrowLeft");
  const eyebrowRight = document.querySelector(".media__img--eyebrowRight");
  const mouth = document.querySelector(".media__img--mouth");

  if (!eyeLeft || !eyeRight || !mouth) return;

  // 開眼/閉眼/專注圖片路徑
  const eyeSrc = {
    left: {
      open: "/img/image-landingAvatarEye1-left.webp",
      close: "/img/image-landingAvatarEye2-left.webp",
      focus: "/img/image-landingAvatarEye3-left.webp",
    },
    right: {
      open: "/img/image-landingAvatarEye1-right.webp",
      close: "/img/image-landingAvatarEye2-right.webp",
      focus: "/img/image-landingAvatarEye3-right.webp",
    },
  };

  const mouthSrc = {
    normal: "/img/image-landingAvatarMouth-smile.webp",
    strange: "/img/image-landingAvatarMouth-strange.webp",
  };

  let blinkTimer = null;
  let isPaused = false;
  let inFocusZone = false;

  // --- 眨眼邏輯 ---
  function blinkOnce() {
    if (isPaused) return;
    eyeLeft.src = eyeSrc.left.close;
    eyeRight.src = eyeSrc.right.close;
    eyeLeftSocket.style.display = "none";
    eyeRightSocket.style.display = "none";

    setTimeout(() => {
      if (!isPaused) {
        eyeLeft.src = eyeSrc.left.open;
        eyeRight.src = eyeSrc.right.open;
        eyeLeftSocket.style.display = "block";
        eyeRightSocket.style.display = "block";
      }
    }, 120);
  }

  function scheduleBlink() {
    const t = 750 + Math.random() * 750; // 0.75-1.5 秒
    blinkTimer = setTimeout(() => {
      blinkOnce();
      scheduleBlink();
    }, t);
  }

  function stopBlinking() {
    isPaused = true;
    clearTimeout(blinkTimer);
  }

  function startBlinking() {
    if (!isPaused) return;
    isPaused = false;
    scheduleBlink();
  }

  scheduleBlink();

  // --- 計算元素中心點 ---
  function getCenter(el) {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  // ----- 眼球追蹤 + 靠近變臉 -----
  const maxOffset = 10; // 平移最大偏移 px
  const threshold = 100; // 滑鼠與眼睛/嘴巴的距離閾值 px

  window.addEventListener("mousemove", (e) => {
    const mouse = { x: e.clientX, y: e.clientY };
    // --- 判斷靠近表情區 ---
    const centers = [getCenter(eyeLeft), getCenter(eyeRight), getCenter(mouth)];
    const minDist = Math.min(...centers.map((c) => distance(c, mouse)));

    if (minDist < threshold && !inFocusZone) {
      inFocusZone = true;
      stopBlinking();
      eyeLeft.src = eyeSrc.left.focus;
      eyeRight.src = eyeSrc.right.focus;
      eyeLeftSocket.style.display = "none";
      eyeRightSocket.style.display = "none";
      mouth.src = mouthSrc.strange;
    } else if (minDist >= threshold && inFocusZone) {
      inFocusZone = false;
      eyeLeft.src = eyeSrc.left.open;
      eyeRight.src = eyeSrc.right.open;
      eyeLeftSocket.style.display = "block";
      eyeRightSocket.style.display = "block";
      mouth.src = mouthSrc.normal;
      startBlinking();
    }

    // --- 眼球移動值 ---
    // const vw = window.innerWidth;
    // const vh = window.innerHeight;
    // const normX = (e.clientX / vw) * 2 - 1; // -1 ~ 1
    // const normY = (e.clientY / vh) * 2 - 1;
    // const dx = normX * maxOffset;
    // const dy = normY * maxOffset;

    // 抓兩隻眼睛的中心
    const rectL = eyeLeft.getBoundingClientRect();
    const rectR = eyeRight.getBoundingClientRect();
    const cL = {
      x: rectL.left + rectL.width / 2,
      y: rectL.top + rectL.height / 2,
    };
    const cR = {
      x: rectR.left + rectR.width / 2,
      y: rectR.top + rectR.height / 2,
    };

    // 兩眼中點
    const eyeCenter = {
      x: (cL.x + cR.x) / 2,
      y: (cL.y + cR.y) / 2,
    };

    // 滑鼠相對中點的偏移
    const dxRaw = e.clientX - eyeCenter.x;
    const dyRaw = e.clientY - eyeCenter.y;

    const eyeDist = Math.hypot(cR.x - cL.x, cR.y - cL.y);
    const normX = dxRaw / (eyeDist * 4); // 倍數越小越靈敏
    const normY = dyRaw / (eyeDist * 4);

    // 限制範圍 [-1, 1]
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const dx = clamp(normX) * maxOffset;
    const dy = clamp(normY) * maxOffset;

    // ---眼球位移---
    const transformEye = `translate(-50%, -50%) translate(${dx}px, ${
      dy > 0 ? dy * 1.5 : dy
    }px)`;

    eyeLeft.style.transform = transformEye;
    eyeRight.style.transform = transformEye;

    // ---眼框位移---
    const transformEyeSocket = `translate(-50%, -50%) translate(${
      dx * 0.2
    }px, ${dy}px)`;

    eyeLeftSocket.style.transform = transformEyeSocket;
    eyeRightSocket.style.transform = transformEyeSocket;

    // ---眉毛位移---
    const transformEyebrow = `translate(-50%, -50%) translate(0px, ${
      dy * 2
    }px)`;

    eyebrowLeft.style.transform = transformEyebrow;
    eyebrowRight.style.transform = transformEyebrow;
  });
})();
