## TODO
- [x] Add strict Content-Security-Policy to `renderer/index.html` (remove Electron CSP warning, avoid `unsafe-eval`)
- [x] Enforce CSP via Electron response headers (`electron/main/index.ts`)
- [ ] Verify Electron CSP warnings are gone (run dev)
- [x] Fix React Flow nodeTypes warning (GraphShell)
- [ ] Refactor UI layout (GraphShell/Toolbar/Legend/FileViewer/SearchInTree + styles.css)




- [ ] (Optional hardening) Review/adjust `electron/main/index.ts` BrowserWindow security settings (e.g., sandbox)
- [ ] Fix React Flow warning: memoize `nodeTypes` / `edgeTypes` objects
- [x] Improve UI layout: remove “fixed/bad framing”, improve spacing/responsiveness in GraphShell/Toolbar/Legend/FileViewer/SearchInTree (first structural refactor)

- [ ] Run dev + verify warnings gone
- [x] Run build to ensure packaged mode works



