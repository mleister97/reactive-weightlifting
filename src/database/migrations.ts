import {Query} from "expo-sqlite";

const exercises = [
    "Incline Dumbbell Fly", "shoulders",
    "Arnold Dumbbell Press", "shoulders",
    "Push Press", "shoulders",
    "Front Dumbbell Raise", "shoulders",

    "Cable Overhead Extension", "triceps",
    "Close Grip Barbell Bench Press", "triceps",
    "Ring Dip", "triceps",
    "Parallel Bar Triceps Dip", "triceps",

    "Barbell Curl", "biceps",
    "Dumbbell Curl", "biceps",
    "EZ-Bar Curl", "biceps",
    "Cable Curl", "biceps",

    "Cable Crossover", "chest",
    "Flat Dumbbell Fly", "chest",
    "Decline Hammer Strengeth Chest Press", "chest",
    "Chest Press", "chest",

    "Barbell Row", "back",
    "Deadlift", "back",
    "Lat Pulldown", "back",
    "Machine Shrug", "back",

    "Leg Press", "legs",
    "Barbell Front Squat", "legs",
    "Romanian Deaflift", "legs",
    "Seated Calf Raise Machine", "legs",

    "Crunch", "abs",
    "Plank", "abs",
    "Side Plank", "abs",
    "Crunch Machine", "abs",
]

const exercises_user = [
    "1", "1", "[{\"weight\":80,\"reps\":5},{\"weight\":100,\"reps\":5},{\"weight\":120,\"reps\":5}]", "2021-04-14",
    "2", "1", "[{\"weight\":80,\"reps\":5},{\"weight\":100,\"reps\":5},{\"weight\":120,\"reps\":5}]", "2021-04-14",
    "3", "1", "[{\"weight\":80,\"reps\":5},{\"weight\":100,\"reps\":5},{\"weight\":120,\"reps\":5}]", "2021-04-13",
]

const generateValuesPlaceholder = (count: number, innercount: number = 1) => {
    const returnArray = []
    for (let i = 0; i < count / innercount; i++) {
        let innerString = "(?";
        for (let j = 1; j < innercount; j++) innerString += ",?"
        innerString += ")";
        returnArray.push(innerString)
    }
    return returnArray.join(",")
}

const migrationExercises: Query[] = [
    {
        sql: "CREATE TABLE IF NOT EXISTS `exercises` (`title` VARCHAR(256) NOT NULL, `category` VARCHAR(256) NOT NULL);",
        args: []
    },
    {
        sql: "INSERT INTO `exercises` (`title`, `category`) VALUES " + generateValuesPlaceholder(exercises.length, 2),
        args: exercises
    },
    {
        sql: "INSERT INTO `migrations` (`batch`) VALUES (?);",
        args: [0]
    },
]

const migrationUserExercises: Query[] = [
    {
        sql: "CREATE TABLE IF NOT EXISTS `exercises_user` (`exerciseid` NUMERIC NOT NULL, `increaseInExerciseSet` NUMERIC NOT NULL, `exerciseSet` TEXT NOT NULL, `date` TEXT NOT NULL);",
        args: []
    },
    {
        sql: "INSERT INTO `exercises_user` (`exerciseid`, `increaseInExerciseSet`, `exerciseSet`, `date`) VALUES " + generateValuesPlaceholder(exercises_user.length, 4),
        args: exercises_user
    },
    {
        sql: "INSERT INTO `migrations` (`batch`) VALUES (?);",
        args: [1]
    },
]

export const migrations: Query[][] = [
    migrationExercises,
    migrationUserExercises
]

export default migrations;
