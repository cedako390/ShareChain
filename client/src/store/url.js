import {create} from 'zustand'

const useUrlStore = create((set) => ({
    path: [
        {
            id: 1,
            name: "Отчеты"
        },
        {
            id: 2,
            name: "Папка"
        },
        {
            id: 3,
            name: "Самара 2012"
        },
        {
            id: 4,
            name: "Планы"
        },
        {
            id: 5,
            name: "Эщкерее"
        },
    ],
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
        path: []
    })),
    truncateAfter: (id) => set((state) => {
            const idx = state.path.findIndex((p) => p.id === id)
            return idx !== -1
                ? {path: state.path.slice(0, idx + 1)}
                : {}
        }),
}))

export {useUrlStore}