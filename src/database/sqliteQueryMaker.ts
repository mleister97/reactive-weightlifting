import {Query} from "expo-sqlite";
import {ExerciseDataItem} from "./databaseTypes";

export const sqliteCheckMigrationsQuery = (): Query[] => {
    return [
        {
            sql: "CREATE TABLE IF NOT EXISTS `migrations` (`batch` INT NOT NULL);",
            args: []
        },
        {
            sql: "SELECT ROWID, * FROM `migrations` ORDER BY `batch` DESC LIMIT 1",
            args: []
        }
    ]
}

export const sqliteGetAllExercisesQuery = (): Query[] => {
    return [
        {
            sql: "SELECT ROWID, * FROM `exercises`;",
            args: []
        }
    ]
}

export const sqliteGetAllExercisesWithRecordsQuery = (): Query[] => {
    return [
        {
            sql: "SELECT ROWID, `exercises`.* FROM `exercises` WHERE ROWID IN (SELECT `exerciseid` FROM `exercises_user` GROUP BY `exerciseid`);",
            args: []
        }
    ]
}

export const sqliteGetUserExercisesQuery = (date: string): Query[] => {
    return [
        {
            sql: "SELECT exercises_user.rowid as 'exerciseid', exercises.title, exercises_user.increaseInExerciseSet, exercises_user.exerciseSet, exercises_user.exerciseid as 'rowid', exercises_user.date, exercises.category FROM exercises_user JOIN exercises ON exercises_user.exerciseid = exercises.rowid WHERE exercises_user.date = ?;",
            args: [date]
        }
    ]
}

export const sqliteUpdateExerciseSetQuery = (dataItem: ExerciseDataItem): Query[] => {
    return [
        {
            sql: "UPDATE `exercises_user` SET `exerciseSet` = ?, `increaseInExerciseSet` = ? WHERE rowid = ?;",
            args: [JSON.stringify(dataItem.exerciseSet), dataItem.increaseInExerciseSet, dataItem.exerciseid]
        }
    ]
}

export const sqliteDeleteExerciseSetQuery = (dataItem: ExerciseDataItem): Query[] => {
    return [
        {
            sql: "DELETE FROM `exercises_user` WHERE rowid = ?;",
            args: [dataItem.exerciseid]
        }
    ]
}

export const sqliteCreateExerciseSetQuery = (dataItem: ExerciseDataItem): Query[] => {
    return [
        {
            sql: "INSERT INTO `exercises_user` (`exerciseid`, `increaseInExerciseSet`, `exerciseSet`, `date`) VALUES (?,?,?,?)",
            args: [dataItem.rowid, dataItem.increaseInExerciseSet, JSON.stringify(dataItem.exerciseSet), dataItem.date]
        }
    ]
}
export const sqliteGetExerciseQuery = (rowid: number): Query[] => {
    return [
        {
            sql: "SELECT exercises_user.rowid as 'exerciseid', exercises.title, exercises_user.increaseInExerciseSet, exercises_user.exerciseSet, exercises_user.exerciseid as 'rowid', exercises_user.date, exercises.category FROM exercises_user JOIN exercises ON exercises_user.exerciseid = exercises.rowid WHERE exercises_user.rowid = ?;",
            args: [rowid]
        }
    ]
}

export const sqliteGetExerciseByTypeLatestQuery = (exerciseid: number, date: string): Query[] => {
    return [
        {
            sql: "SELECT exercises_user.rowid as 'exerciseid', exercises.title, exercises_user.increaseInExerciseSet, exercises_user.exerciseSet, exercises_user.exerciseid as 'rowid', exercises_user.date, exercises.category FROM exercises_user JOIN exercises ON exercises_user.exerciseid = exercises.rowid WHERE exercises.rowid = ? AND exercises_user.date < ? ORDER BY `date` DESC LIMIT 1;",
            args: [exerciseid, date]
        }
    ]
}
export const sqliteGetAllExercisesPerTypeQuery = (exerciseid: number): Query[] => {
    return [
        {
            sql: "SELECT exercises_user.rowid as 'exerciseid', exercises.title, exercises_user.increaseInExerciseSet, exercises_user.exerciseSet, exercises_user.exerciseid as 'rowid', exercises_user.date, exercises.category FROM exercises_user JOIN exercises ON exercises_user.exerciseid = exercises.rowid WHERE exercises.rowid = ? ORDER BY `date` DESC;",
            args: [exerciseid]
        }
    ]
}

export const sqliteGetAllExerciseSetDatesQuery = (): Query[] => {
    return [
        {
            sql: "SELECT `date` FROM `exercises_user` GROUP BY `date`;",
            args: []
        }
    ]
}


