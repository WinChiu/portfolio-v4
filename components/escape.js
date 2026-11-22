// Shared helper for component templates: escape text or an attribute value.
// Works in the browser (window.UI.escape) and in Node (require).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.UI = root.UI || {}; root.UI.escape = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return function escape(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => entities[char]);
  };
});
