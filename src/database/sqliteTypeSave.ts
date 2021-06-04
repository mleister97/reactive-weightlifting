import {db} from "./db";
import {Query, SQLError, SQLResultSet} from "expo-sqlite";
import migrations from "./migrations";
import {ExerciseDataItem, RecordItem, SearchExerciseDataItem} from "./databaseTypes";
import {
    sqliteCheckMigrationsQuery,
    sqliteCreateExerciseSetQuery,
    sqliteDeleteExerciseSetQuery,
    sqliteGetAllExerciseSetDatesQuery,
    sqliteGetAllExercisesPerTypeQuery,
    sqliteGetAllExercisesQuery,
    sqliteGetAllExercisesWithRecordsQuery,
    sqliteGetExerciseByTypeLatestQuery,
    sqliteGetExerciseQuery,
    sqliteGetUserExercisesQuery,
    sqliteUpdateExerciseSetQuery
} from "./sqliteQueryMaker";

export interface SQLiteCallback {
    errors: SQLError[],
    resultSets: SQLResultSet[],
    isSuccessful: boolean
}

const fetchTypeSaveSql = async (queries: Query[]): Promise<SQLiteCallback> => {
    const sqlResults: SQLiteCallback = {
        errors: [],
        resultSets: [],
        isSuccessful: false
    }

    await new Promise((resolve) => {
        db.transaction(tx => {
                queries.forEach((query) => {
                    tx.executeSql(
                        query.sql, query.args,
                        (_, result) => {
                            sqlResults.resultSets.push(result)
                        },
                        (_, error): boolean => {
                            sqlResults.errors.push(error)
                            return false;
                        })
                })
            }, (e) => {
                sqlResults.errors.push(e)
                resolve(sqlResults)
            },
            () => resolve(sqlResults))
    })
    sqlResults.isSuccessful = sqlResults.errors.length === 0;
    return sqlResults;
}

export const sqliteGetUserExercisesByDate = async (date: string): Promise<ExerciseDataItem[]> => {
    let sqLiteCallback = await fetchTypeSaveSql(sqliteGetUserExercisesQuery(date))
    console.log("sqliteGetUserExercisesQuery", sqLiteCallback)
    if (!sqLiteCallback.isSuccessful) return [];

    const returnArray: ExerciseDataItem[] = [];
    for (let i = 0; i < sqLiteCallback.resultSets[0].rows.length; i++) {
        let userExercise: ExerciseDataItem = sqLiteCallback.resultSets[0].rows.item(i)
        userExercise.exerciseSet = JSON.parse(sqLiteCallback.resultSets[0].rows.item(i).exerciseSet)
        returnArray.push(userExercise)
    }
    console.log(returnArray)
    return returnArray;
}

export const sqliteGetAllExercises = async (): Promise<SearchExerciseDataItem[]> => {
    let sqLiteCallback = await fetchTypeSaveSql(sqliteGetAllExercisesQuery())
    if (!sqLiteCallback.isSuccessful) return [];

    const returnArray: SearchExerciseDataItem[] = [];
    for (let i = 0; i < sqLiteCallback.resultSets[0].rows.length; i++) {
        returnArray.push(sqLiteCallback.resultSets[0].rows.item(i))
    }
    return returnArray;
}

export const sqliteGetExercise = async (exerciseid: number): Promise<ExerciseDataItem | null> => {
    let sqLiteCallback = await fetchTypeSaveSql(sqliteGetExerciseQuery(exerciseid))
    // console.log("sqliteGetExerciseQuery", sqLiteCallback)
    if (!sqLiteCallback.isSuccessful) return null;

    if (sqLiteCallback.resultSets[0].rows.length <= 0) return null;
    let userExercise: ExerciseDataItem = sqLiteCallback.resultSets[0].rows.item(0)
    userExercise.exerciseSet = JSON.parse(sqLiteCallback.resultSets[0].rows.item(0).exerciseSet)
    return userExercise;
}

export const sqliteGetLastExercisePerType = async (rowid: number, date: string): Promise<ExerciseDataItem | null> => {
    let sqLiteCallback = await fetchTypeSaveSql(sqliteGetExerciseByTypeLatestQuery(rowid, date))
    //console.log("sqliteGetExerciseQuery", sqLiteCallback)
    if (!sqLiteCallback.isSuccessful) return null;

    if (sqLiteCallback.resultSets[0].rows.length <= 0) return null;
    let userExercise: ExerciseDataItem = sqLiteCallback.resultSets[0].rows.item(0)
    userExercise.exerciseSet = JSON.parse(sqLiteCallback.resultSets[0].rows.item(0).exerciseSet)
    return userExercise;
}

export const sqliteCreateExerciseSet = async (dataItem: ExerciseDataItem): Promise<number> => {
    if (dataItem.exerciseid <= 0 && dataItem.rowid <= 0) return -1

    const lastExcercise = await sqliteGetLastExercisePerType(dataItem.rowid, dataItem.date)
    if (lastExcercise == null) dataItem.increaseInExerciseSet = 1
    else if (calcWeight(lastExcercise) < calcWeight(dataItem)) dataItem.increaseInExerciseSet = 1
    else dataItem.increaseInExerciseSet = 0

    let sqLiteCallback = await fetchTypeSaveSql(sqliteCreateExerciseSetQuery(dataItem))
    //console.log("sqliteCreateExerciseSetQuery", sqLiteCallback)
    return (!sqLiteCallback.isSuccessful) ? -1 : sqLiteCallback.resultSets[0].insertId
}

export const sqliteUpdateExerciseSet = async (dataItem: ExerciseDataItem): Promise<boolean> => {
    if (dataItem.exerciseid <= 0) return false

    const lastExcercise = await sqliteGetLastExercisePerType(dataItem.rowid, dataItem.date)
    if (lastExcercise == null) dataItem.increaseInExerciseSet = 1
    else if (calcWeight(lastExcercise) < calcWeight(dataItem)) dataItem.increaseInExerciseSet = 1
    else dataItem.increaseInExerciseSet = 0

    // console.log("sqliteSetExercisesSetQuery", sqLiteCallback)
    if (dataItem.exerciseSet.length === 0) {
        let sqLiteCallback = await fetchTypeSaveSql(sqliteDeleteExerciseSetQuery(dataItem))
        return sqLiteCallback.isSuccessful
    } else {
        let sqLiteCallback = await fetchTypeSaveSql(sqliteUpdateExerciseSetQuery(dataItem))
        return sqLiteCallback.isSuccessful
    }
}

export const sqliteGetAllExerciseSetDates = async (): Promise<string[]> => {
    let sqLiteCallback = await fetchTypeSaveSql(sqliteGetAllExerciseSetDatesQuery())
    // console.log("sqliteGetAllExerciseSetDates", sqLiteCallback)
    if (!sqLiteCallback.isSuccessful) return [];

    if (sqLiteCallback.resultSets[0].rows.length <= 0) return [];
    const returnArray: string[] = [];
    for (let i = 0; i < sqLiteCallback.resultSets[0].rows.length; i++) {
        returnArray.push(sqLiteCallback.resultSets[0].rows.item(i).date)
    }
    return returnArray;
}

export const sqliteGetAllExercisesWithRecords = async (): Promise<SearchExerciseDataItem[]> => {
    let sqLiteCallback = await fetchTypeSaveSql(sqliteGetAllExercisesWithRecordsQuery())
    if (!sqLiteCallback.isSuccessful) return [];

    const returnArray: SearchExerciseDataItem[] = [];
    for (let i = 0; i < sqLiteCallback.resultSets[0].rows.length; i++) {
        returnArray.push(sqLiteCallback.resultSets[0].rows.item(i))
    }
    return returnArray;
}


export const sqliteGetRecordsPerExercise = async (exercise: SearchExerciseDataItem): Promise<RecordItem> => {
    let returnItem: RecordItem = {
        exerciseid: exercise.rowid,
        maxReps: 0,
        maxWeight: 0,
        totalReps: 0,
        totalSets: 0,
        totalWeight: 0,
        totalWorkouts: 0,
        lastExerciseDate: "0000-00-00"
    }
    const allExcercises = await fetchTypeSaveSql(sqliteGetAllExercisesPerTypeQuery(exercise.rowid))
    if (!allExcercises.isSuccessful) return returnItem;

    if (allExcercises.resultSets[0].rows.length <= 0) return returnItem;
    const exerciseDataItems: ExerciseDataItem[] = [];
    for (let i = 0; i < allExcercises.resultSets[0].rows.length; i++) {
        let userExercise: ExerciseDataItem = allExcercises.resultSets[0].rows.item(i)
        userExercise.exerciseSet = JSON.parse(allExcercises.resultSets[0].rows.item(i).exerciseSet)
        exerciseDataItems.push(userExercise)
    }

    returnItem.lastExerciseDate = exerciseDataItems[0].date
    returnItem.totalWorkouts = exerciseDataItems.length

    for (let exerciseDataItemsKey in exerciseDataItems) {
        returnItem.totalWeight += exerciseDataItems[exerciseDataItemsKey].exerciseSet.reduce((accumulatedWeightPerSet, nextSet) => {
            return accumulatedWeightPerSet + nextSet.reps * nextSet.weight
        }, 0)
        returnItem.totalSets += exerciseDataItems[exerciseDataItemsKey].exerciseSet.length
        returnItem.totalReps += exerciseDataItems[exerciseDataItemsKey].exerciseSet.reduce((accumulatedRepsPerSet, nextSet) => {
            returnItem.maxReps = (returnItem.maxReps > nextSet.reps) ? returnItem.maxReps : nextSet.reps
            returnItem.maxWeight = (returnItem.maxWeight > nextSet.weight) ? returnItem.maxWeight : nextSet.weight
            return accumulatedRepsPerSet + nextSet.reps
        }, 0)
    }
    return returnItem
}

export const sqliteCheckAndFill = async () => {
    let sqLiteCallback = await fetchTypeSaveSql(sqliteCheckMigrationsQuery())
    // console.log("fetchTypeSaveSql", sqLiteCallback)

    let actualMigration = -1;
    if (sqLiteCallback.resultSets[1]?.rows.length > 0) {
        actualMigration = sqLiteCallback.resultSets[1]?.rows.item(0).batch
    }

    while (actualMigration < migrations.length - 1) {
        actualMigration++
        sqLiteCallback = await fetchTypeSaveSql(migrations[actualMigration])
        // console.log(actualMigration, sqLiteCallback)
    }
}

const calcWeight = (exercise: ExerciseDataItem): number => {
    return exercise.exerciseSet.reduce((accumulatedWeightPerSet, nextSet) => {
        return accumulatedWeightPerSet + nextSet.reps * nextSet.weight
    }, 0)
}
