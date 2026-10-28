// Runs before anything imports react-dom: without AnimationEvent, React would listen for the
// vendor-prefixed event name and never see `animationend` in jsdom.
if (typeof window !== 'undefined') window.AnimationEvent ??= class extends Event {} as unknown as typeof AnimationEvent
