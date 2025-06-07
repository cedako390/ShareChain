import {create} from 'zustand'

const useUrlStore = create((set) =>({
    path: [
        {
            id: 1,
            name: 'Избранное'
        }
    ]
}))

export {useUrlStore}