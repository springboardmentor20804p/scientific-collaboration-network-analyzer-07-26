import { createContext, useContext } from 'react';

export type Role = 'Researcher' | 'Institution Admin' | 'System Admin' | 'Reviewer';

export interface RoleContextValue {
  role: Role | null;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextValue>({
  role: null,
  setRole: () => {},
});

export function useRole() {
  return useContext(RoleContext);
}
