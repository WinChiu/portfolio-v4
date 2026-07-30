# Motion

Use six durations only: `stagger` for sequencing, `fast` for direct feedback, `standard` for ordinary UI transitions, `slow` for zoom and deliberate movement, `loading` for loader dismissal, and `entrance` for staged page reveals. No UI transition may exceed `entrance`.

Use `--motion-ease-standard` for direct feedback, `--motion-ease-emphasized` for entrances, and `--motion-ease-drawing` for SVG strokes. Prefer complete `--transition-*` tokens when one matches the interaction. Reduced-motion behavior must preserve visibility and state.
