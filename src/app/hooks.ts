import { useEffect, useState } from 'react';
import type { PersistedWorkbenchState } from '../shared/types/migration';
import { DEFAULT_SCOPE, DEFAULT_WEIGHTS } from '../shared/utils/calculations';
import { STORAGE_KEY } from './consts';

function loadInitialState(): PersistedWorkbenchState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        scope: DEFAULT_SCOPE,
        mitigatedBlockers: [],
        migratedComponents: [],
        weights: DEFAULT_WEIGHTS,
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedWorkbenchState>;
    return {
      scope: { ...DEFAULT_SCOPE, ...parsed.scope },
      mitigatedBlockers: Array.isArray(parsed.mitigatedBlockers) ? parsed.mitigatedBlockers : [],
      migratedComponents: Array.isArray(parsed.migratedComponents) ? parsed.migratedComponents : [],
      weights: { ...DEFAULT_WEIGHTS, ...parsed.weights },
    };
  } catch {
    return {
      scope: DEFAULT_SCOPE,
      mitigatedBlockers: [],
      migratedComponents: [],
      weights: DEFAULT_WEIGHTS,
    };
  }
}

export function useWorkbenchState() {
  const [workbench, setWorkbench] = useState<PersistedWorkbenchState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workbench));
    } catch {
      // Ignore storage quota errors
    }
  }, [workbench]);

  return [workbench, setWorkbench] as const;
}

export function useToastMessage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  return { toastMessage, notify: setToastMessage };
}
