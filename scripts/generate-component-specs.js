const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outputDirectory = path.join(root, 'specs', 'components');

const components = [
  {
    file: 'project-card.md', name: 'Project Card', category: 'Content', status: 'Stable',
    use: 'Use on the home work grid to summarize and link to one portfolio project.',
    avoid: 'Do not use for long case-study content or generic navigation.',
    anatomy: ['Cover image', 'Project number', 'Title', 'Tag', 'Description', 'Primary project link', 'Optional site link'],
    tokens: ['--color-text', '--color-text-subtle', '--color-interactive', '--color-interactive-hover', '--color-text-inverse', '--space-*', '--font-weight-*'],
    api: '`<project-card>` attributes: `number`, `title`, `tag`, `description`, `image-url`, `project-url`, optional `site-url`, `type`, and `lang`.',
    states: ['Default: project summary and primary action', 'Hover: shared Button hover state', 'Active: inherited link activation', 'Focus: shared Button focus state', 'Disabled: shared Button disabled state', 'Error: not defined; omit cards with invalid required data'],
    example: '<project-card number="01" title="RFID" tag="UX" description="Case study" image-url="img/rfid.webp" project-url="pages/en/rfid.html"></project-card>',
    related: ['Button', 'Hero', 'Tag', 'Work Switcher'],
  },
  {
    file: 'main-navigation.md', name: 'Main Navigation', category: 'Navigation', status: 'Stable',
    use: 'Use as the persistent site-level navigation on landing pages.', avoid: 'Do not use inside project-page content.',
    anatomy: ['Navigation list', 'Navigation item', 'Social links', 'Language action'],
    tokens: ['--color-background', '--color-border', '--color-text', '--space-*', '--font-size-*', '--z-sticky'],
    api: 'CSS block `.nav--main`; navigation anchors compose the shared `.ui-link.ui-link--nav` component.',
    states: ['Default: fixed vertical rail', 'Hover: link and icon browser behavior', 'Active: page link semantics supplied by markup', 'Focus: native focus-visible behavior', 'Disabled: not applicable', 'Error: not applicable'],
    example: '<nav class="nav nav--main"><a class="ui-link ui-link--nav" href="#work">Work</a></nav>', related: ['Hero', 'Link', 'Project Navigation'],
  },
  {
    file: 'hero.md', name: 'Hero', category: 'Page section', status: 'Stable',
    use: 'Use once at the top of the portfolio landing page.', avoid: 'Do not repeat inside case studies.',
    anatomy: ['Eyebrow', 'Title', 'Description', 'Annotation', 'Detail list', 'Illustration'],
    tokens: ['--color-text', '--color-text-subtle', '--color-link', '--font-size-*', '--font-weight-*', '--space-*', '--motion-duration-entrance', '--z-*'],
    api: 'CSS section `.section--main`; animation hooks use `.animate-item` and existing JavaScript.',
    states: ['Default: content visible after loading', 'Hover: inline links change color', 'Active: link activation only', 'Focus: links use focus-visible behavior', 'Disabled: not applicable', 'Error: illustration may be absent without hiding text'],
    example: '<section class="section section--main"><h1 class="block__title">Portfolio</h1><p class="block__description">Selected work</p></section>', related: ['Main Navigation', 'Work Switcher'],
  },
  {
    file: 'work-switcher.md', name: 'Work Switcher', category: 'Navigation', status: 'Stable',
    use: 'Use to switch the landing work list between design and coding projects.', avoid: 'Do not use as a generic two-option form control.',
    anatomy: ['Design option', 'Coding option', 'Selected marker'],
    tokens: ['--color-background', '--color-border', '--color-interactive-hover', '--color-text-inverse', '--space-*', '--font-weight-medium', '--z-content'],
    api: 'Use `.ui-segmented-control` with `.ui-segmented-control__item` buttons, `aria-pressed`, and `.is-selected`.',
    states: ['Default: background surface', 'Hover: gold interactive surface', 'Active: `.selected` persists the gold surface', 'Focus: anchor focus remains available', 'Disabled: not defined', 'Error: not applicable'],
    example: '<div class="ui-segmented-control block--switcher"><button class="ui-segmented-control__item is-selected" aria-pressed="true">Design</button></div>', related: ['Project Card', 'Segmented Control'],
  },
  {
    file: 'kitchen-gallery.md', name: 'Kitchen Gallery', category: 'Interactive content', status: 'Stable',
    use: 'Use for the personal kitchen project list, preview, controls, and lightbox.', avoid: 'Do not use for a generic image carousel.',
    anatomy: ['Intro', 'Preview stack', 'Item table', 'Effort rating', 'Previous and next controls', 'Lightbox'],
    tokens: ['--color-*', '--space-*', '--font-size-*', '--font-weight-*', '--radius-*', '--shadow-*', '--transition-*', '--z-overlay'],
    api: 'CSS block `.section--kitchen`; composes Interactive List Item, Rating, Icon Button, and Modal primitives.',
    states: ['Default: first visible item', 'Hover: row highlight and control lift', 'Active: `.kitchen__item--active` highlights selection', 'Focus: controls and rows show focus outline', 'Disabled: `.kitchen__control--disabled` prevents movement', 'Error: missing images should retain item text and controls'],
    example: '<button class="kitchen__item kitchen__item--active"><span class="kitchen__nameZh">料理</span></button>', related: ['Image Zoom', 'Icon List'],
  },
  {
    file: 'project-header.md', name: 'Project Header', category: 'Case study', status: 'Stable',
    use: 'Use at the start of each project case study.', avoid: 'Do not use on the landing page.',
    anatomy: ['Artwork', 'Title', 'Subtitle', 'Metadata tags', 'Introduction'],
    tokens: ['--color-background', '--color-surface-glass', '--color-text', '--space-*', '--font-size-*', '--filter-shadow-project-image', '--z-raised'],
    api: 'CSS block `.project-header`; metadata composes Metadata Item and categories compose Tag.',
    states: ['Default: responsive header layout', 'Hover: no component-level hover', 'Active: not applicable', 'Focus: interactive descendants retain focus', 'Disabled: not applicable', 'Error: artwork is optional; text structure remains required'],
    example: '<header class="project-header"><span class="ui-tag">UX</span><div class="ui-metadata-item">Role</div></header>', related: ['Metadata Item', 'Project Navigation', 'Project Module', 'Tag'],
  },
  {
    file: 'project-navigation.md', name: 'Project Navigation', category: 'Navigation', status: 'Stable',
    use: 'Use as the fixed project-page navigation and mobile navigation bar.', avoid: 'Do not combine with Main Navigation on the same page.',
    anatomy: ['Home link', 'Section links', 'Language action'],
    tokens: ['--color-background', '--color-border', '--color-text', '--space-*', '--font-size-*', '--font-weight-*', '--transition-nav', '--z-sticky'],
    api: 'CSS block `.project-nav`; navigation composes Link and generated TOC Item components.',
    states: ['Default: fixed rail', 'Hover: link feedback', 'Active: current section may be marked in markup', 'Focus: keyboard focus-visible', 'Disabled: not applicable', 'Error: broken targets must be removed or corrected'],
    example: '<nav class="project-nav"><a class="ui-link ui-toc-item" href="#overview">Overview</a></nav>', related: ['Link', 'Project Header', 'Main Navigation', 'TOC Item'],
  },
  {
    file: 'project-module.md', name: 'Project Module', category: 'Case study', status: 'Stable',
    use: 'Use as the primary compositional container for case-study text, media, lists, and callouts.', avoid: 'Do not use for site chrome.',
    anatomy: ['Section title', 'Body content', 'Media', 'Caption', 'Optional callout'],
    tokens: ['--color-*', '--space-*', '--font-size-*', '--font-weight-*', '--radius-*', '--shadow-low'],
    api: 'CSS block `.project-module` with modifier classes for existing content arrangements.',
    states: ['Default: stacked editorial content', 'Hover: zoomable media may elevate', 'Active: not applicable', 'Focus: links and zoomable media remain focusable', 'Disabled: not applicable', 'Error: missing media must not remove its caption context'],
    example: '<section class="project-module"><h2 class="project-module__title">Research</h2><p>Findings</p></section>', related: ['Quote', 'Media Aside', 'Icon List', 'Process Flow'],
  },
  {
    file: 'quote.md', name: 'Quote', category: 'Case study content', status: 'Stable',
    use: 'Use for highlighted research quotes or key statements.', avoid: 'Do not use as a generic decorative card.',
    anatomy: ['Quote text', 'Optional citation'], tokens: ['--color-accent-subtle', '--color-interactive-subtle', '--space-*', '--font-family-serif'],
    api: 'Use `.ui-quote`; project content retains `.project-module` modifiers for layout variants.', states: ['Default: highlighted quotation', 'Hover: none', 'Active: none', 'Focus: linked citations retain focus', 'Disabled: not applicable', 'Error: omit an empty citation element'],
    example: '<blockquote class="ui-quote project-module--quote"><p>Research quote</p></blockquote>', related: ['Callout', 'Project Module'],
  },
  {
    file: 'media-aside.md', name: 'Media Aside', category: 'Case study content', status: 'Stable',
    use: 'Use when media and explanatory copy must sit side by side.', avoid: 'Do not use when content order would become ambiguous on mobile.',
    anatomy: ['Media region', 'Text region', 'Title', 'Caption'], tokens: ['--color-text', '--space-*', '--font-size-*', '--radius-*'],
    api: 'Media-aside modifier classes under `.project-module`.', states: ['Default: split layout', 'Hover: zoomable media may elevate', 'Active: not applicable', 'Focus: media and links retain focus', 'Disabled: not applicable', 'Error: copy expands to full width if media is absent'],
    example: '<div class="project-module__media-aside"><figure>…</figure><div>Explanation</div></div>', related: ['Project Module', 'Image Zoom'],
  },
  {
    file: 'icon-list.md', name: 'Icon List', category: 'Case study content', status: 'Stable',
    use: 'Use for short parallel facts represented by an icon and label.', avoid: 'Do not use for long prose or ordered procedures.',
    anatomy: ['List', 'Icon item', 'Icon', 'Label'], tokens: ['--color-text', '--space-*', '--font-size-*', '--radius-*'],
    api: 'Icon-list modifier classes under `.project-module`.', states: ['Default: aligned icon items', 'Hover: none', 'Active: none', 'Focus: linked items retain focus', 'Disabled: not applicable', 'Error: missing icons require meaningful text labels'],
    example: '<ul class="project-module__icon-list"><li><img alt=""><span>Fast</span></li></ul>', related: ['Project Module', 'Process Flow'],
  },
  {
    file: 'process-flow.md', name: 'Process Flow', category: 'Case study content', status: 'Stable',
    use: 'Use to show the ordered phases of a project process.', avoid: 'Do not use for unordered feature lists.',
    anatomy: ['Step number', 'Step heading', 'Step description', 'Connector'], tokens: ['--color-link', '--color-text', '--space-*', '--font-size-*', '--font-weight-*'],
    api: 'Process-flow modifier classes under `.project-module`; local custom properties derive from Layer 2 tokens.', states: ['Default: ordered flow', 'Hover: none', 'Active: none', 'Focus: linked steps retain focus', 'Disabled: not applicable', 'Error: step order and numbering must remain consistent'],
    example: '<ol class="project-module__process-flow"><li><h3>Discover</h3></li></ol>', related: ['Project Module', 'Icon List'],
  },
  {
    file: 'translator.md', name: 'Translator', category: 'Utility navigation', status: 'Temporarily hidden',
    use: 'Use for switching between Chinese and English project pages when language switching is enabled.', avoid: 'Do not expose it until both language targets exist.',
    anatomy: ['Fixed container', 'Language link', 'Label'], tokens: ['--color-background', '--color-border', '--color-interactive-hover', '--color-text-inverse', '--space-*', '--radius-sm', '--shadow-raised', '--z-sticky'],
    api: 'Landing `.block__translator` and project `.project-translator`; currently hidden by global policy.', states: ['Default: hidden site-wide', 'Hover: gold background and inverse text when enabled', 'Active: link navigation', 'Focus: link focus remains available', 'Disabled: hidden state acts as disabled', 'Error: hide when alternate-language URL is absent'],
    example: '<aside class="project-translator"><a href="../zh/rfid.html"><p>中文</p></a></aside>', related: ['Main Navigation', 'Project Navigation'],
  },
  {
    file: 'image-zoom.md', name: 'Image Zoom', category: 'Media utility', status: 'Stable',
    use: 'Use on case-study images that benefit from full-screen inspection.', avoid: 'Do not use on decorative images or tiny icons.',
    anatomy: ['Source image', 'Backdrop', 'Zoom clone'], tokens: ['--color-zoom-overlay', '--motion-duration-slow', '--motion-ease-standard', '--z-zoom-image', '--z-zoom-clone', '--z-zoom-backdrop', '--z-modal'],
    api: 'Use `.ui-zoomable-media` with `data-zoom-image`; backdrop and clone continue to use data attributes.', states: ['Default: source image in document flow', 'Hover: zoom cursor', 'Active: image or clone moves above backdrop', 'Focus: provide keyboard activation in JavaScript', 'Disabled: omit `data-zoom-image`', 'Error: failed clones must restore source image and scrolling'],
    example: '<img data-zoom-image src="img/detail.webp" alt="Interface detail">', related: ['Media Aside', 'Project Module'],
  },
  {
    file: 'page-loader.md', name: 'Page Loader', category: 'Feedback', status: 'Stable',
    use: 'Use during initial project-page asset loading.', avoid: 'Do not use for short in-page actions.',
    anatomy: ['Full-page mask', 'Lottie indicator'], tokens: ['--color-background', '--motion-duration-loading', '--space-*', '--z-loader'],
    api: 'Use `.ui-loader` with the legacy page-specific class; add `.is-hidden` after readiness.', states: ['Default: blocks page with visible indicator', 'Hover: none', 'Active: loading', 'Focus: no interactive target', 'Disabled: `.is-hidden` fades the mask', 'Error: loading timeout must remove the mask and expose content'],
    example: '<div class="ui-loader page-loader"><dotlottie-wc aria-label="Loading"></dotlottie-wc></div>', related: ['Hero'],
  },
];
components.unshift(
  { file: 'button.md', name: 'Button', category: 'Action', status: 'Stable', use: 'Use for actions that change state or start a task.', avoid: 'Do not use a button for navigation when a link is semantically correct.', anatomy: ['Container', 'Label', 'Optional icon'], tokens: ['--color-interactive', '--color-interactive-hover', '--color-text-inverse', '--color-focus', '--space-*', '--font-weight-medium', '--motion-duration-fast'], api: 'Use `.ui-button` with `.ui-button--primary`, `.ui-button--secondary`, or `.ui-button--text`. Native `disabled`, `aria-disabled="true"`, and `.is-disabled` share the disabled state.', states: ['Default: variant surface and label', 'Hover: interactive color feedback', 'Active: pressed color feedback', 'Focus: tokenized focus outline', 'Disabled: muted, non-interactive state', 'Error: not applicable'], example: '<button class="ui-button ui-button--primary" type="button">View project</button>', related: ['Icon Button', 'Link'] },
  { file: 'icon-button.md', name: 'Icon Button', category: 'Action', status: 'Stable', use: 'Use for compact actions whose icon has a clear accessible label.', avoid: 'Do not use without `aria-label` when no visible text exists.', anatomy: ['Button container', 'Icon', 'Accessible name'], tokens: ['--color-interactive', '--color-interactive-hover', '--color-focus', '--space-4xl', '--radius-lg', '--motion-duration-fast'], api: 'Use `.ui-icon-button` on a native button and provide `aria-label`.', states: ['Default: interactive surface', 'Hover: raised hover feedback', 'Active: pressed feedback', 'Focus: tokenized focus outline', 'Disabled: native disabled state', 'Error: missing accessible name is invalid'], example: '<button class="ui-icon-button" type="button" aria-label="Next"><img src="next.svg" alt=""></button>', related: ['Button', 'Modal'] },
  { file: 'link.md', name: 'Link', category: 'Navigation', status: 'Stable', use: 'Use for navigation to another location or resource.', avoid: 'Do not use a link for an action that does not navigate.', anatomy: ['Anchor', 'Label', 'Optional icon'], tokens: ['--color-link', '--color-link-hover', '--color-focus', '--motion-duration-fast'], api: 'Use `.ui-link`; add `.ui-link--nav` for navigation chrome and `.is-active` for the current destination.', states: ['Default: link color', 'Hover: stronger link color', 'Active: current destination or activation', 'Focus: tokenized focus outline', 'Disabled: omit the href and use a non-link element', 'Error: empty destinations are invalid'], example: '<a class="ui-link" href="/work">Work</a>', related: ['Button', 'Main Navigation'] },
  { file: 'tag.md', name: 'Tag', category: 'Data display', status: 'Stable', use: 'Use for short project categories and metadata labels.', avoid: 'Do not use tags as interactive filters without button semantics.', anatomy: ['Container', 'Label'], tokens: ['--color-text-muted', '--color-accent-soft', '--space-*', '--radius-sm', '--font-size-small'], api: 'Use `.ui-tag`; add `.ui-tag--text` for the borderless text treatment.', states: ['Default: passive label', 'Hover: none', 'Active: none', 'Focus: not applicable', 'Disabled: not applicable', 'Error: omit empty tags'], example: '<span class="ui-tag">UX Design</span>', related: ['Project Card', 'Project Header'] },
  { file: 'segmented-control.md', name: 'Segmented Control', category: 'Selection', status: 'Stable', use: 'Use for switching between a small set of mutually exclusive views.', avoid: 'Do not use for navigation to unrelated pages.', anatomy: ['Group', 'Items', 'Selected state'], tokens: ['--color-background', '--color-border', '--color-interactive-hover', '--color-text-inverse', '--space-*', '--motion-duration-fast'], api: 'Use `.ui-segmented-control` with native buttons using `.ui-segmented-control__item` and `aria-pressed`.', states: ['Default: unselected option', 'Hover: interactive surface', 'Active: pressed option', 'Focus: tokenized focus outline', 'Disabled: native button disabled', 'Error: exactly one item should be selected'], example: '<div class="ui-segmented-control"><button class="ui-segmented-control__item is-selected" aria-pressed="true">Design</button></div>', related: ['Work Switcher', 'Button'] },
  { file: 'interactive-list-item.md', name: 'Interactive List Item', category: 'Selection', status: 'Stable', use: 'Use for selectable rows that update nearby content.', avoid: 'Do not use a generic div when native button semantics are available.', anatomy: ['Button row', 'Primary label', 'Supporting content'], tokens: ['--color-highlight-soft', '--color-focus', '--motion-duration-fast'], api: 'Use `.ui-interactive-item` on a native button with `aria-pressed`; use `.is-active` for the selected state.', states: ['Default: transparent row', 'Hover: highlighted row', 'Active: persistent highlight', 'Focus: tokenized focus outline', 'Disabled: native button disabled', 'Error: invalid items should be omitted'], example: '<button class="ui-interactive-item is-active" aria-pressed="true">Item</button>', related: ['Kitchen Gallery', 'Button'] },
  { file: 'metadata-item.md', name: 'Metadata Item', category: 'Data display', status: 'Stable', use: 'Use for repeated label and value pairs in project headers.', avoid: 'Do not use for long narrative content.', anatomy: ['Label', 'Value'], tokens: ['--color-link', '--color-text', '--space-xs', '--font-family-serif', '--font-size-body'], api: 'Use `.ui-metadata-item`, `.ui-metadata-item__label`, and `.ui-metadata-item__value`.', states: ['Default: label and value pair', 'Hover: none', 'Active: none', 'Focus: linked values retain link focus', 'Disabled: not applicable', 'Error: omit pairs without a value'], example: '<div class="ui-metadata-item"><p class="ui-metadata-item__label">Role</p><p class="ui-metadata-item__value">Designer</p></div>', related: ['Project Header', 'Tag'] },
  { file: 'rating.md', name: 'Rating', category: 'Data display', status: 'Stable', use: 'Use to display the kitchen effort level with a fixed visual scale.', avoid: 'Do not use as an editable rating input.', anatomy: ['Accessible label', 'Rating icons'], tokens: ['--space-3xs', '--space-lg'], api: 'Use `.ui-rating` with decorative `.ui-rating__icon` children and an accessible label on the group.', states: ['Default: read-only rating', 'Hover: none', 'Active: none', 'Focus: not applicable', 'Disabled: not applicable', 'Error: provide a text equivalent'], example: '<span class="ui-rating" aria-label="Effort 2 out of 3"><img class="ui-rating__icon" alt=""></span>', related: ['Kitchen Gallery'] },
  { file: 'modal.md', name: 'Modal', category: 'Overlay', status: 'Stable', use: 'Use for focused image inspection that temporarily overlays the page.', avoid: 'Do not use for content that can remain in normal page flow.', anatomy: ['Root', 'Backdrop', 'Dialog', 'Content'], tokens: ['--color-overlay', '--radius-lg', '--shadow-floating', '--z-modal'], api: 'Use `.ui-modal`, `.ui-modal__backdrop`, and `.ui-modal__dialog`; toggle the native `hidden` attribute.', states: ['Default: hidden', 'Hover: none', 'Active: open overlay', 'Focus: dialog owns focus while open', 'Disabled: not applicable', 'Error: Escape and backdrop must close the modal'], example: '<div class="ui-modal" hidden><div class="ui-modal__backdrop"></div><div class="ui-modal__dialog" role="dialog"></div></div>', related: ['Kitchen Gallery', 'Icon Button'] },
  { file: 'callout.md', name: 'Callout', category: 'Content', status: 'Stable', use: 'Use for supplementary findings, warnings, and key supporting information.', avoid: 'Do not use as a quotation or generic decoration.', anatomy: ['Container', 'Optional title', 'Content'], tokens: ['--color-interactive-subtle', '--color-interactive', '--color-text', '--space-md'], api: 'Use `.ui-callout`; project content keeps `.project-module__callout` for its layout variant.', states: ['Default: emphasized supporting content', 'Hover: none', 'Active: none', 'Focus: links retain focus', 'Disabled: not applicable', 'Error: omit empty callouts'], example: '<aside class="ui-callout"><strong>Finding</strong><p>Supporting information</p></aside>', related: ['Quote', 'Project Module'] },
  { file: 'toc-item.md', name: 'TOC Item', category: 'Navigation', status: 'Stable', use: 'Use in project navigation to link to a generated section anchor.', avoid: 'Do not use outside an in-page table of contents.', anatomy: ['Link', 'Status dot', 'Label'], tokens: ['--color-interactive', '--color-focus', '--font-weight-bold', '--motion-duration-fast'], api: 'Use `.ui-toc-item` with `.ui-link`; apply `.is-active` to the current section.', states: ['Default: section link', 'Hover: reduced opacity feedback', 'Active: interactive color and bold label', 'Focus: tokenized focus outline', 'Disabled: not applicable', 'Error: target anchor must exist'], example: '<a class="ui-link ui-toc-item is-active" href="#research">Research</a>', related: ['Project Navigation', 'Link'] },
);

function list(items) { return items.map((item) => `- ${item}`).join('\n'); }

const fileByName = new Map(components.map((component) => [component.name, component.file]));

fs.mkdirSync(outputDirectory, { recursive: true });
for (const component of components) {
  const markdown = `# ${component.name}\n\n## 1. Metadata\n\n- Name: ${component.name}\n- Category: ${component.category}\n- Status: ${component.status}\n\n## 2. Overview\n\n${component.use}\n\n${component.avoid}\n\n## 3. Anatomy\n\n${list(component.anatomy)}\n\n## 4. Tokens used\n\n${list(component.tokens.map((token) => `\`${token}\``))}\n\n## 5. Props/API\n\n${component.api}\n\n## 6. States\n\n${list(component.states)}\n\n## 7. Code example\n\n\`\`\`html\n${component.example}\n\`\`\`\n\n## 8. Cross-references\n\n${list(component.related.map((name) => `[${name}](./${fileByName.get(name)})`))}\n`;
  fs.writeFileSync(path.join(outputDirectory, component.file), markdown);
}
console.log(`Wrote ${components.length} component specs.`);
