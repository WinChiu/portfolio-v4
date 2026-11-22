// MenuItem: one dish on the Kitchen menu. A button that opens the recipe sheet.
//   UI.MenuItem({ index: 3, nameZh: '東坡肉', nameEn: 'Dongpo Pork', effort: 3 })
// Composes Leader (the dotted line) and EffortMeter (the flames).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../escape.js'), require('../Leader/leader.js'), require('../EffortMeter/effortMeter.js'));
  } else {
    root.UI = root.UI || {};
    root.UI.MenuItem = factory(root.UI.escape, root.UI.Leader, root.UI.EffortMeter);
  }
})(typeof self !== 'undefined' ? self : this, function (escape, Leader, EffortMeter) {
  return function MenuItem({ index, nameZh, nameEn, effort, controls = 'kitchen-recipe' }) {
    return `<button type="button" class="menu-item" data-index="${Number(index)}" aria-haspopup="dialog" aria-controls="${escape(controls)}">
        <span class="menu-item__names"><span class="menu-item__zh" lang="zh-Hant">${escape(nameZh)}</span><span class="menu-item__en">${escape(nameEn)}</span></span>${Leader()}${EffortMeter({ level: effort })}
      </button>`;
  };
});
