// Leader: the dotted line that joins a label to its value (menu item to effort, ingredient to quantity).
// UI.Leader() -> '<span class="leader" aria-hidden="true"></span>'
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.UI = root.UI || {}; root.UI.Leader = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  return function Leader() {
    return '<span class="leader" aria-hidden="true"></span>';
  };
});
