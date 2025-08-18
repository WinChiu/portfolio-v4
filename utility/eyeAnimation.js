// // avatar-eye.js
// (function () {
//   // 取得左右眼元素
//   const eyeLeft = document.querySelector(".media__img--eye1Left");
//   const eyeRight = document.querySelector(".media__img--eye1Right");

//   if (!eyeLeft || !eyeRight) return; // 沒找到就退出，避免報錯

//   // 開眼/閉眼圖片路徑
//   const eyeSrc = {
//     left: {
//       open: "/img/image-landingAvatarEye1-left.webp",
//       close: "/img/image-landingAvatarEye2-left.webp",
//     },
//     right: {
//       open: "/img/image-landingAvatarEye1-right.webp",
//       close: "/img/image-landingAvatarEye2-right.webp",
//     },
//   };

//   // --- 眨眼邏輯 ---
//   function blinkOnce() {
//     eyeLeft.src = eyeSrc.left.close;
//     eyeRight.src = eyeSrc.right.close;

//     setTimeout(() => {
//       eyeLeft.src = eyeSrc.left.open;
//       eyeRight.src = eyeSrc.right.open;
//     }, 120); // 眨眼閉合時間（ms）
//   }

//   // 隨機間隔（3–6 秒）眨眼
//   function scheduleBlink() {
//     const t = 1500 + Math.random() * 1500;
//     setTimeout(() => {
//       blinkOnce();
//       scheduleBlink();
//     }, t);
//   }

//   scheduleBlink();

//   // ----- 眼球追蹤 + 3D rotate -----
//   const maxOffset = 8; // 平移最大偏移 px
//   const maxRotateX = 30; // X 軸旋轉最大角度 deg
//   const maxRotateY = 5; // Y 軸旋轉最大角度 deg

//   function moveEyes(e) {
//     const vw = window.innerWidth;
//     const vh = window.innerHeight;

//     // 正規化座標 -1 ~ 1
//     const normX = (e.clientX / vw) * 2 - 1;
//     const normY = (e.clientY / vh) * 2 - 1;

//     // 平移量
//     const dx = normX * maxOffset;
//     const dy = normY * maxOffset;

//     // 上下對應 X 軸旋轉角度
//     const rotX = normY * maxRotateX; // 往下看正角度，往上看負角度
//     const rotY = normX * maxRotateY; // 左右 → Y 軸旋轉 ✅ 新增

//     const transformVal = (dx, dy) =>
//       `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

//     eyeLeft.style.transform = transformVal(dx, dy);
//     eyeRight.style.transform = transformVal(dx, dy);
//   }

//   window.addEventListener("mousemove", moveEyes);

//   // 可選：點擊頭像也觸發眨眼
//   //   const avatar = document.querySelector(".media--image");
//   //   if (avatar) {
//   //     avatar.addEventListener("click", blinkOnce);
//   //   }
// })();

// avatar-eye.js
(function () {
  const eyeLeft = document.querySelector(".media__img--eye1Left");
  const eyeRight = document.querySelector(".media__img--eye1Right");
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

    setTimeout(() => {
      if (!isPaused) {
        eyeLeft.src = eyeSrc.left.open;
        eyeRight.src = eyeSrc.right.open;
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

  // ----- 眼球追蹤 + 3D rotate + 靠近變臉 -----
  const maxOffset = 8; // 平移最大偏移 px
  const maxRotateX = 30; // X 軸旋轉最大角度 deg
  const maxRotateY = 5; // Y 軸旋轉最大角度 deg
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
      mouth.src = mouthSrc.strange;
    } else if (minDist >= threshold && inFocusZone) {
      inFocusZone = false;
      eyeLeft.src = eyeSrc.left.open;
      eyeRight.src = eyeSrc.right.open;
      mouth.src = mouthSrc.normal;
      startBlinking();
    }

    // --- 眼球移動與翻轉 ---
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const normX = (e.clientX / vw) * 2 - 1; // -1 ~ 1
    const normY = (e.clientY / vh) * 2 - 1;

    const dx = normX * maxOffset;
    const dy = normY * maxOffset;

    const rotX = normY * maxRotateX; // 上下看
    const rotY = normX * maxRotateY; // 左右看

    const transformVal = (dx, dy) =>
      `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    eyeLeft.style.transform = transformVal(dx, dy);
    eyeRight.style.transform = transformVal(dx, dy);
  });
})();
