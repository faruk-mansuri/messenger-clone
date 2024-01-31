import { create } from 'zustand';

export const useActiveList = create((set) => {
  return {
    members: [],
    add: (id) =>
      set((state) => {
        return { members: [...state.members, id] };
      }),
    remove: (id) =>
      set((state) => {
        return { members: state.members.filter((memberId) => memberId !== id) };
      }),
    set: (ids) => set({ members: ids }),
  };
});
