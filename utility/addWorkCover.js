export function insertContentFromJson(jsonData) {
  const contentContainer = document.querySelector(
    '.container.container--content'
  );
  if (!contentContainer) {
    console.error('No container found');
    return;
  }
  console.log(jsonData);
  // 創建 title 部分
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('container', 'container--title');

  const titleElement = document.createElement('h2');
  titleElement.classList.add('module', 'module__title');
  titleElement.textContent = jsonData.titleSection.title;
  titleContainer.appendChild(titleElement);

  // 創建 metaData 部分
  const metaDataContainer = document.createElement('div');
  metaDataContainer.classList.add('module', 'module__metaData');

  jsonData.titleSection.metaData.forEach((meta) => {
    const dataContainer = document.createElement('div');
    dataContainer.classList.add('module__data');

    const dataTitle = document.createElement('p');
    dataTitle.classList.add('module__dataTitle');
    dataTitle.textContent = meta.dataTitle;

    const dataDescription = document.createElement('p');
    dataDescription.classList.add('module__dataDescription');
    dataDescription.textContent = meta.dataDescription;

    dataContainer.appendChild(dataTitle);
    dataContainer.appendChild(dataDescription);
    metaDataContainer.appendChild(dataContainer);
  });

  titleContainer.appendChild(metaDataContainer);
  contentContainer.appendChild(titleContainer);

  // 創建 summary 部分
  const summaryContainer = document.createElement('div');
  summaryContainer.classList.add('container', 'container--summary');

  jsonData.summarySection.forEach((summaryItem) => {
    const summaryModule = document.createElement('div');
    summaryModule.classList.add('module', 'module__container');

    const numberElement = document.createElement('h2');
    numberElement.classList.add('module__number');
    numberElement.textContent = summaryItem.number;

    const lineElement = document.createElement('div');
    lineElement.classList.add('module__line');

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('module__description');

    const descriptionTitle = document.createElement('h6');
    descriptionTitle.classList.add('module__title');
    descriptionTitle.textContent = summaryItem.title;

    const descriptionText = document.createElement('p');
    descriptionText.classList.add('module__text');
    descriptionText.textContent = summaryItem.text;

    descriptionContainer.appendChild(descriptionTitle);
    descriptionContainer.appendChild(descriptionText);

    summaryModule.appendChild(numberElement);
    summaryModule.appendChild(lineElement);
    summaryModule.appendChild(descriptionContainer);

    summaryContainer.appendChild(summaryModule);
  });

  contentContainer.appendChild(summaryContainer);
}
