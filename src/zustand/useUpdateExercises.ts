import create from 'zustand'

type UpdateExercises = {
    updateExercisesVersion: number
    updateExercises(): void
}

export const useUpdateExercises = create<UpdateExercises>(set => ({
    updateExercisesVersion: 0,
    updateExercises: () => set(prev =>{
        prev.updateExercisesVersion++
    })
}))
