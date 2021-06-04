import create from 'zustand'

type SelectedDateState = {
    selectedDate: string
    setSelectedDate(date: string): void
}

export const useSelectedDate = create<SelectedDateState>(set => ({
    selectedDate: new Date().toISOString().slice(0, 10),
    setSelectedDate: (date: string) => set({ selectedDate: date })
}))
