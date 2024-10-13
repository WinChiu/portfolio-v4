export function generateContent(jsonData) {
  const contentContainers = document.querySelectorAll(
    '.container.container--content'
  );

  if (contentContainers.length >= 2) {
    const targetContainer = contentContainers[1]; // 選擇第二個容器

    const sectionContainer = document.createElement('div');
    sectionContainer.classList.add('container', 'container--contentSection');

    jsonData.sections.forEach((section) => {
      section.content.forEach((module) => {
        let moduleElement;

        switch (module.type) {
          case 'module__sideTitle':
            moduleElement = createSideTitle(module);
            break;

          case 'module__title':
            moduleElement = createTitle(module);
            break;

          case 'module__singleImage':
            moduleElement = createSingleImage(module);
            break;

          case 'module__doubleImage':
            moduleElement = createDoubleImage(module);
            break;

          case 'module__quote':
            moduleElement = createQuote(module);
            break;

          case 'module__callOut':
            moduleElement = createCallOut(module);
            break;

          case 'module__pureText':
            moduleElement = createPureText(module);
            break;

          default:
            console.warn('Unknown module type:', module.type);
        }

        if (moduleElement) {
          sectionContainer.appendChild(moduleElement);
        }
      });
    });

    targetContainer.appendChild(sectionContainer); // 將生成的內容嵌入到指定容器中
  } else {
    console.error(
      'There are not enough containers with class "container--content"'
    );
  }
}

// 生成 sideTitle 的函數
function createSideTitle(module) {
  const moduleElement = document.createElement('div');
  moduleElement.classList.add('module', 'module__sideTitle');
  const sideTitle = document.createElement('h6');
  sideTitle.classList.add('module__sideText');
  sideTitle.textContent = module.sideText;
  moduleElement.appendChild(sideTitle);
  return moduleElement;
}

// 生成 title 的函數
function createTitle(module) {
  const moduleElement = document.createElement('div');
  moduleElement.classList.add('module', 'module__title');
  const title = document.createElement('h4');
  title.classList.add('module__sideText');
  title.textContent = module.titleText;
  moduleElement.appendChild(title);
  return moduleElement;
}

// 生成單圖片模組的函數
function createSingleImage(module) {
  const moduleElement = document.createElement('div');
  moduleElement.classList.add('module', 'module__singleImage');
  const singleImage = document.createElement('img');
  singleImage.src = module.src;
  singleImage.alt = module.alt || '';
  moduleElement.appendChild(singleImage);
  return moduleElement;
}

// 生成雙圖片模組的函數
function createDoubleImage(module) {
  const moduleElement = document.createElement('div');
  moduleElement.classList.add('module', 'module__doubleImage');
  module.images.forEach((image) => {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt || '';
    moduleElement.appendChild(img);
  });
  return moduleElement;
}

// 生成引用模組的函數
function createQuote(module) {
  const moduleElement = document.createElement('div');
  moduleElement.classList.add('module', 'module__quote');
  const quoteText = document.createElement('p');
  quoteText.textContent = module.quoteText;
  moduleElement.appendChild(quoteText);
  return moduleElement;
}

// 生成 callOut 模組的函數
function createCallOut(module) {
  const moduleElement = document.createElement('div');
  moduleElement.classList.add('module', 'module__callOut');
  const callOutTitle = document.createElement('p');
  callOutTitle.classList.add('module__title');
  callOutTitle.textContent = module.callOutTitle;
  moduleElement.appendChild(callOutTitle);

  const callOutText = document.createElement('p');
  callOutText.classList.add('module__text');
  callOutText.textContent = module.callOutText;
  moduleElement.appendChild(callOutText);
  return moduleElement;
}

// 生成純文本模組的函數
function createPureText(module) {
  const moduleElement = document.createElement('div');
  moduleElement.classList.add('module', 'module__pureText');
  // 確認 sections 存在並且是陣列
  if (Array.isArray(module.elements)) {
    module.elements.forEach((section) => {
      switch (section.type) {
        case 'semiTitle':
          const semiTitle = document.createElement('h5');
          semiTitle.classList.add('module__semiTitle');
          semiTitle.textContent = section.content;
          moduleElement.appendChild(semiTitle);
          break;
        case 'text':
          const text = document.createElement('p');
          text.classList.add('module__text');
          text.textContent = section.content;
          moduleElement.appendChild(text);
          break;
        case 'bulletPoints':
          const ul = document.createElement('ul');
          ul.classList.add('module__bullet');
          section.points.forEach((point) => {
            const li = document.createElement('li');
            li.textContent = point;
            ul.appendChild(li);
          });
          moduleElement.appendChild(ul);
          break;
        default:
          console.warn('Unknown module type:', module.type);
          break;
      }
    });
  } else {
    console.warn('module.sections is undefined or not an array');
  }

  return moduleElement;
}
