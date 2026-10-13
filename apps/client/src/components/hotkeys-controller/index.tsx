import { Dialog } from '@/components/dialogs/dialogs';
import {
  setModifierKeysHeldMap,
  togglePluginSlotDebug
} from '@/features/app/actions';
import { toggleDialog } from '@/features/dialogs/actions';
import { memo, useEffect } from 'react';
import { ShortcutRegistrar } from '../shortcut-registrar';

const HotkeysController = memo(() => {
  useEffect(() => {
    const pressedKeys = new Set<string>();
    const forceRefresh = () => {
      const url = new URL(window.location.href);

      url.searchParams.set('_refresh', `${Date.now()}`);
      window.location.replace(url.toString());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      pressedKeys.add(e.key.toLowerCase());
      ShortcutRegistrar.submit(pressedKeys, e);

      setModifierKeysHeldMap({
        Shift: e.shiftKey,
        Control: e.ctrlKey,
        Alt: e.altKey
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key.toLowerCase());

      setModifierKeysHeldMap({
        Shift: e.shiftKey,
        Control: e.ctrlKey,
        Alt: e.altKey
      });
    };

    const handleBlur = () => {
      pressedKeys.clear();
      setModifierKeysHeldMap({
        Shift: false,
        Control: false,
        Alt: false
      });
    };

    ShortcutRegistrar.register([], 'F4', togglePluginSlotDebug);
    ShortcutRegistrar.register([], 'F9', () => toggleDialog(Dialog.VOICE_DEBUG));
    ShortcutRegistrar.register(['control'], 'F5', forceRefresh);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      ShortcutRegistrar.deregister([], 'F4');
      ShortcutRegistrar.deregister([], 'F9');
      ShortcutRegistrar.deregister(['control'], 'F5');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
  return null;
});

export { HotkeysController };
