'use client';

import { useEffect } from 'react';

/**
 * Blocks the most common save-image shortcuts on the current page:
 *  - Right-click context menu
 *  - Ctrl/Cmd+S (save page)
 *  - Ctrl/Cmd+P (print)
 *  - Ctrl/Cmd+U (view source)
 *  - F12 / Ctrl+Shift+I (devtools — best-effort, not 100%)
 *  - Drag images out of the page
 */
export function useImageProtection() {
  useEffect(() => {
    const blockKeyboard = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
      const isPrint = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p';
      const isViewSource = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u';
      const isDevtools =
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()));

      if (isSave || isPrint || isViewSource || isDevtools) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const blockContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow form fields to keep their context menu (paste, etc.)
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
    };

    const blockDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', blockKeyboard);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('dragstart', blockDrag);

    return () => {
      document.removeEventListener('keydown', blockKeyboard);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('dragstart', blockDrag);
    };
  }, []);
}
