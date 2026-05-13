const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const pages = [
  ...fs.readdirSync(path.join(root, 'pages', 'en')).map((file) => path.join(root, 'pages', 'en', file)),
  ...fs.readdirSync(path.join(root, 'pages', 'zh')).map((file) => path.join(root, 'pages', 'zh', file)),
].filter((file) => file.endsWith('.html'));

const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'header-above-stack', width: 1153, height: 900 },
  { name: 'header-at-stack', width: 1152, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeDirWithRetry(dir) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 9) {
        throw error;
      }

      await delay(150);
    }
  }
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });
}

async function waitForDevtoolsPort(userDataDir) {
  const activePortPath = path.join(userDataDir, 'DevToolsActivePort');

  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (fs.existsSync(activePortPath)) {
      const [port] = fs.readFileSync(activePortPath, 'utf8').trim().split(/\r?\n/);
      return Number(port);
    }

    await delay(100);
  }

  throw new Error('Chrome did not expose a DevTools port.');
}

function createCdpClient(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result || {});
      }

      return;
    }

    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) {
        listener(message.params || {});
      }
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          id += 1;
          socket.send(JSON.stringify({ id, method, params }));

          return new Promise((sendResolve, sendReject) => {
            pending.set(id, { resolve: sendResolve, reject: sendReject });
          });
        },
        once(method) {
          return new Promise((eventResolve) => {
            const listener = (params) => {
              const methodListeners = listeners.get(method) || [];
              listeners.set(
                method,
                methodListeners.filter((item) => item !== listener)
              );
              eventResolve(params);
            };
            listeners.set(method, [...(listeners.get(method) || []), listener]);
          });
        },
        close() {
          socket.close();
        },
      });
    });
    socket.addEventListener('error', reject);
  });
}

const inspectPage = `(() => {
  const rectOf = (element) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      left: Math.round(rect.left * 100) / 100,
      right: Math.round(rect.right * 100) / 100,
      top: Math.round(rect.top * 100) / 100,
      bottom: Math.round(rect.bottom * 100) / 100,
      width: Math.round(rect.width * 100) / 100,
      height: Math.round(rect.height * 100) / 100,
    };
  };

  const isVisible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
  };

  const normalLine = document.querySelector('.project-page__section:not(.project-page__section--featured) .project-module--section-title .project-module__line');
  const normalRect = rectOf(normalLine);
  const headerImage = document.querySelector('.project-header__image');
  const headerImageStyle = headerImage ? getComputedStyle(headerImage) : null;

  const sectionPaddings = [...document.querySelectorAll('.project-page__section')]
    .map((section, index) => {
      const style = getComputedStyle(section);

      return {
        index,
        classes: section.className,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        isWide: section.classList.contains('project-page__section--wide'),
        isNarrow: section.classList.contains('project-page__section--narrow'),
      };
    });

  const graySections = [...document.querySelectorAll('.project-page__section--featured-gray')].map((section, index) => {
    const style = getComputedStyle(section);
    const line = section.querySelector('.project-module--section-title .project-module__line');
    const bgQuote = section.querySelector('.project-module--bg-quote');
    const heading = bgQuote ? bgQuote.querySelector('.project-module__heading') : null;
    const calloutList = bgQuote ? bgQuote.querySelector('.project-module__callout-list') : null;
    const lineRect = rectOf(line);
    const headingRect = rectOf(heading);
    const calloutListRect = rectOf(calloutList);

    return {
      index,
      title: section.querySelector('.project-module--section-title .project-module__heading')?.textContent.trim() || '',
      classes: section.className,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      rect: rectOf(section),
      line: lineRect,
      bgQuote: Boolean(bgQuote),
      heading: headingRect,
      calloutList: calloutListRect,
      calloutCount: section.querySelectorAll('.project-module__callout').length,
      isStacked: headingRect && calloutListRect ? headingRect.bottom <= calloutListRect.top + 2 : null,
      widthAligned: headingRect && calloutListRect ? Math.abs(headingRect.left - calloutListRect.left) <= 2 && Math.abs(headingRect.width - calloutListRect.width) <= 3 : null,
      lineDiffFromNormal: normalRect && lineRect ? {
        left: Math.round((lineRect.left - normalRect.left) * 100) / 100,
        right: Math.round((lineRect.right - normalRect.right) * 100) / 100,
      } : null,
    };
  });

  const visibleOverflow = [...document.body.querySelectorAll('*')]
    .filter(isVisible)
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ element, rect }) => {
      const tag = element.tagName.toLowerCase();
      if (['html', 'body', 'script', 'style'].includes(tag)) return false;
      if (element.classList.contains('project-page__content')) return false;
      if (element.classList.contains('project-page__content-inner')) return false;
      if (element.classList.contains('project-page__section--featured')) return false;
      return rect.left < -2 || rect.right > window.innerWidth + 2;
    })
    .slice(0, 12)
    .map(({ element, rect }) => ({
      tag: element.tagName.toLowerCase(),
      className: element.className,
      text: element.textContent.trim().replace(/\\s+/g, ' ').slice(0, 80),
      rect: rectOf(element),
    }));

  const textOverflow = [...document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')]
    .filter(isVisible)
    .filter((element) => element.scrollWidth > element.clientWidth + 2)
    .slice(0, 12)
    .map((element) => ({
      tag: element.tagName.toLowerCase(),
      className: element.className,
      text: element.textContent.trim().replace(/\\s+/g, ' ').slice(0, 100),
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      rect: rectOf(element),
    }));

  return {
    title: document.title,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    documentWidth: document.documentElement.scrollWidth,
    headerImageDisplay: headerImageStyle ? headerImageStyle.display : null,
    normalLine: normalRect,
    sectionPaddings,
    graySections,
    visibleOverflow,
    textOverflow,
  };
})()`;

async function run() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-layout-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--allow-file-access-from-files',
    'about:blank',
  ]);

  try {
    const port = await waitForDevtoolsPort(userDataDir);
    const targets = await requestJson(`http://127.0.0.1:${port}/json/list`);
    const pageTarget = targets.find((target) => target.type === 'page');
    const cdp = await createCdpClient(pageTarget.webSocketDebuggerUrl);

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const results = [];

    for (const viewport of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.name === 'mobile',
      });

      for (const page of pages) {
        const url = pathToFileURL(page).href;
        const load = cdp.once('Page.loadEventFired');
        await cdp.send('Page.navigate', { url });
        await load;
        await delay(750);
        const evaluated = await cdp.send('Runtime.evaluate', {
          expression: inspectPage,
          returnByValue: true,
          awaitPromise: true,
        });

        results.push({
          viewport: viewport.name,
          file: path.relative(root, page).replace(/\\/g, '/'),
          ...evaluated.result.value,
        });
      }
    }

    cdp.close();

    const issues = [];

    for (const result of results) {
      if (result.viewport.width > 1152 && result.headerImageDisplay === 'none') {
        issues.push(`${result.viewport} ${result.file}: header main image is hidden above 72rem`);
      }

      if (result.viewport.width <= 1152 && result.headerImageDisplay !== 'none') {
        issues.push(`${result.viewport} ${result.file}: header main image is visible at or below 72rem`);
      }

      for (const section of result.sectionPaddings) {
        const expectedWide = result.viewport.width <= 480
          ? '16px'
          : result.viewport.width <= 1152
            ? '32px'
            : '64px';
        const expectedNarrow = result.viewport.width <= 480
          ? '16px'
          : result.viewport.width <= 1152
            ? '32px'
            : '256px';

        if (section.isWide && (section.paddingLeft !== expectedWide || section.paddingRight !== expectedWide)) {
          issues.push(`${result.viewport} ${result.file}: wide section ${section.index} padding is ${section.paddingLeft}/${section.paddingRight}, expected ${expectedWide}`);
        }

        if (section.isNarrow && (section.paddingLeft !== expectedNarrow || section.paddingRight !== expectedNarrow)) {
          issues.push(`${result.viewport} ${result.file}: narrow section ${section.index} padding is ${section.paddingLeft}/${section.paddingRight}, expected ${expectedNarrow}`);
        }
      }

      for (const section of result.graySections) {
        if (section.bgQuote && section.isStacked === false) {
          issues.push(`${result.viewport} ${result.file}: gray bgQuote is not stacked`);
        }
        if (section.bgQuote && section.widthAligned === false) {
          issues.push(`${result.viewport} ${result.file}: bgQuote heading/callout widths differ`);
        }
      }

      if (result.visibleOverflow.length > 0) {
        issues.push(`${result.viewport} ${result.file}: visible overflow ${JSON.stringify(result.visibleOverflow)}`);
      }

      if (result.textOverflow.length > 0) {
        issues.push(`${result.viewport} ${result.file}: text overflow ${JSON.stringify(result.textOverflow)}`);
      }
    }

    console.log(JSON.stringify({ pages: pages.length, viewports, results, issues }, null, 2));
    process.exitCode = issues.length ? 1 : 0;
  } finally {
    chrome.kill();
    await removeDirWithRetry(userDataDir);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
