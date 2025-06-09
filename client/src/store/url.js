import {create} from 'zustand'

const useUrlStore = create((set) => ({
    path: [],
    version: 0,
    selectedItem: null, // <-- НОВОЕ: для хранения выбранного файла/папки

    triggerRefresh: () => set((state) => ({ version: state.version + 1 })),

    // --- НОВЫЕ МЕТОДЫ ---
    setSelectedItem: (item) => set({ selectedItem: item }),
    clearSelectedItem: () => set({ selectedItem: null }),

    enterPage: (page) => set((state) => ({
        path: [...state.path, page],
    })),
    backPage: () => set((state) => ({
        path:
            state.path.length > 1
                ? state.path.slice(0, -1)
                : state.path,
    })),
    clear: () => set(() => ({
        path: [],
        selectedItem: null // Сбрасываем выбор при полной очистке
    })),
    truncateAfter: (id) => set((state) => {
        const idx = state.path.findIndex((p) => p.id === id)
        return idx !== -1
            ? {path: state.path.slice(0, idx + 1)}
            : {}
    }),
}))

export {useUrlStore}