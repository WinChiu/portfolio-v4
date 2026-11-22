// EffortMeter: 1 to 3 flames showing how much work a dish takes.
// UI.EffortMeter({ level: 2, max: 3 }) -> <span class="effort-meter" role="img" aria-label="Effort 2 of 3">...</span>
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.UI = root.UI || {}; root.UI.EffortMeter = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  const flame = '<svg viewBox="0 0 11 14" aria-hidden="true"><path d="M5.5 13C2.5 13 1 11 1 8.6 1 6 3.4 4.6 4 1.2c2.4 1.6 3.3 3.4 3 5.4.8-.5 1.4-1.3 1.6-2.2C9.6 5.6 10 7 10 8.6 10 11 8.5 13 5.5 13Z"/></svg>';
  return function EffortMeter({ level, max = 3 }) {
    const flames = Array.from({ length: max }, (_, index) => {
      const off = index + 1 > level ? ' effort-meter__flame--off' : '';
      return `<span class="effort-meter__flame${off}">${flame}</span>`;
    }).join('');
    return `<span class="effort-meter" role="img" aria-label="Effort ${Number(level)} of ${max}">${flames}</span>`;
  };
});
