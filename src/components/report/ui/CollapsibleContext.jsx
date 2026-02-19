import { createContext, useContext } from 'react';

export const CollapsibleContext = createContext({ expandSignal: 0, collapseSignal: 0 });

export function useCollapsibleSignals() {
  return useContext(CollapsibleContext);
}
