# Hairline cover

`kernel.js` and `componentTray.js` are extracted from the user-supplied
`hairline/html-output/hairline-component-tray-actions-v2.html`.
`delivery.js` comes from the supplied `hairline/html-output/hairline-delivery.html`
and retains its automatic medical-device delivery loop and stock interactions.
The kernel is unchanged apart from an ES module export; the figure retains its
mount/destroy API and drawing logic. The standalone demo controls are excluded.

`hairlineCover.js` owns lazy mounting, the original-image fallback, Shadow DOM
style isolation, keyboard input, and disconnect cleanup. The kernel handles
offscreen suspension, idle animation frames, touch scrolling, and reduced motion.
Palette overrides come from the portfolio's existing CSS tokens.
