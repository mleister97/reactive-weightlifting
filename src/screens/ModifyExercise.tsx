import React, {useEffect, useRef, useState} from "react";
import {StyleSheet, View} from "react-native";
import {HomeStackParamList, ProfileScreenNavigationProp} from "../navigators/HomeNavigator";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {ExerciseInput} from "../components/ExerciseInput";
import {Button} from "../components/Button";
import {Sets} from "../components/Sets";
import {colors} from "../constants/style";
import {useUpdateExercises} from "../zustand/useUpdateExercises";
import {ExerciseDataItemSetWithId} from "../components/Set";
import {uniqueId} from "../utils/idGenerator";
import {ExerciseDataItem, ExerciseDataItemSet} from "../database/databaseTypes";
import {sqliteCreateExerciseSet, sqliteGetExercise, sqliteUpdateExerciseSet} from "../database/sqliteTypeSave";
import {Transition, Transitioning, TransitioningView} from "react-native-reanimated";
import {useSelectedDate} from "../zustand/useSelectedDate";

export const ModifyExercise: React.FC = () => {

    const updateExercises = useUpdateExercises(s => s.updateExercises)
    const [sets, setSets] = useState<ExerciseDataItemSetWithId[]>([])
    const [exerciseInformation, setExerciseInformation] = useState<ExerciseDataItem | null>(null)
    const route = useRoute<RouteProp<HomeStackParamList, 'ModifyExercise'>>()
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const { exerciseName, searchExerciseId} = route.params
    const exerciseId = useRef<number | null>(route.params.exerciseId)
    const [weight, setWeight] = useState<number | null>(null)
    const [reps, setReps] = useState<number | null>(null)
    const [modifySetId, setModifySetId] = useState<string | null>(null)
    const transitionRef = useRef<TransitioningView | null>(null)
    const transition = <Transition.Change interpolation="easeInOut"/>
    const selectedDate = useSelectedDate(state => state.selectedDate)
    const isSetSelected = modifySetId != null
    const isInCreateMode = exerciseId.current === null
    const isInEditMode = !isInCreateMode

    useEffect(() => {
        if (isInEditMode) {
            sqliteGetExercise(exerciseId.current!).then((data) => {
                if (data == null) return
                const exerciseDataItemSetWithId: ExerciseDataItemSetWithId[] = data.exerciseSet.map((s) => {
                    return {
                        reps: s.reps,
                        weight: s.weight,
                        id: uniqueId()
                    }
                })

                setSets(exerciseDataItemSetWithId)
                setExerciseInformation(data)

                if (data.exerciseSet.length >= 1) {
                    setWeight(data.exerciseSet[data.exerciseSet.length - 1].weight)
                    setReps(data.exerciseSet[data.exerciseSet.length - 1].reps)
                }
            })
        }

        return updateExercises
    }, [])

    const animateSetList = () => {
        transitionRef.current?.animateNextTransition()
    }

    const buildExerciseDataItem = (sets: ExerciseDataItemSet[]): ExerciseDataItem => {
        return {
            rowid: searchExerciseId ?? 0,
            increaseInExerciseSet: 0,
            title: exerciseInformation?.title ?? "",
            category: exerciseInformation?.category ?? "shoulders",
            exerciseSet: sets,
            exerciseid: exerciseId.current ?? 0,
            date: exerciseInformation?.date ?? selectedDate
        }
    }

    const pressedSet = (id: string) => {
        const selectedSet = sets.find(s => s.id === id)
        if (!selectedSet) return
        setWeight(selectedSet.weight)
        setReps(selectedSet.reps)
        setModifySetId(id)
    }

    const saveSet = () => {
        if (weight == null || reps == null) return
        const newSet: ExerciseDataItemSetWithId = {
            weight: weight,
            reps: reps,
            id: uniqueId()
        }

        setSets(prev => {
            const exerciseSet = [...prev, newSet]
            const exerciseDataItem = buildExerciseDataItem(exerciseSet)
            if (exerciseId.current === null) sqliteCreateExerciseSet(exerciseDataItem).then(id => exerciseId.current = id)
            else sqliteUpdateExerciseSet(exerciseDataItem).then()
            return exerciseSet
        })

        animateSetList()
    }


    const updateSet = () => {
        if (modifySetId == null || weight == null || reps == null) return

        setSets(prev => {
            const updateIndex = prev.findIndex(s => s.id === modifySetId)
            const updatedSets = [...prev]
            const updatedSet: ExerciseDataItemSetWithId = {
                weight: weight,
                reps: reps,
                id: uniqueId()
            }
            if (updateIndex !== -1) updatedSets[updateIndex] = updatedSet

            const exerciseDataItem = buildExerciseDataItem(updatedSets)
            sqliteUpdateExerciseSet(exerciseDataItem).then()

            return updatedSets
        })

        animateSetList()
        setModifySetId(null)
    }

    const deleteSet = () => {
        if (modifySetId == null) return
        setSets(prev => {
            const exerciseSet = prev.filter(e => e.id !== modifySetId)
            const exerciseDataItem = buildExerciseDataItem(exerciseSet)
            sqliteUpdateExerciseSet(exerciseDataItem).then()
            return exerciseSet
        })
        if (sets.length === 0)
            exerciseId.current = null;
        animateSetList()
        setModifySetId(null)
    }

    const clearValues = () => {
        setWeight(null)
        setReps(null)
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: exerciseName
        });
    }, [navigation, exerciseName]);

    return <View style={styles.container}>
        <View>
            <ExerciseInput title="Weight (kgs)" value={weight} onChangeValue={setWeight} stepSize={2.5}/>
            <ExerciseInput title="Reps" value={reps} onChangeValue={setReps} stepSize={1}/>
            <View style={styles.buttonContainer}>
                {!isSetSelected && <Button title="SAVE" onPress={saveSet}/>}
                {!isSetSelected && <Button title="CLEAR" onPress={clearValues}/>}
                {isSetSelected && <Button title="UPDATE" onPress={updateSet} backgroundColor={colors.update}/>}
                {isSetSelected && <Button title="DELETE" onPress={deleteSet} backgroundColor={colors.delete}/>}
            </View>
        </View>
        <Transitioning.View ref={transitionRef} transition={transition} style={styles.sets}>
            <Sets onPress={pressedSet} sets={sets}/>
        </Transitioning.View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: "80%",
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
        flex: 1
    },
    buttonContainer: {
        flexDirection: "row",
        marginBottom: 15
    },
    sets: {
        flex: 1
    },
});
