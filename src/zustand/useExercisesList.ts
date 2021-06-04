import create from 'zustand'
import {SearchExerciseDataItem} from "../database/databaseTypes";

type ExercisesListState = {
    exercisesList: SearchExerciseDataItem[]
    setExercisesList(exercisesList: SearchExerciseDataItem[]): void
}

export const useExercisesList = create<ExercisesListState>(set => ({
    exercisesList: [],
    setExercisesList: (exercisesList: SearchExerciseDataItem[]) => set({exercisesList})
}))
