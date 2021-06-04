import React, {useEffect, useRef, useState} from "react";
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {ExpandExerciseItem} from "../components/ExpandExerciseItem";
import {useNavigation} from "@react-navigation/native";
import {FloatingAction} from "react-native-floating-action";
import {Ionicons} from "@expo/vector-icons";
import {colors} from "../constants/style";
import {LiftedWeightCard} from "../components/LiftedWeightCard";
import {useSelectedDate} from "../zustand/useSelectedDate";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import {CalendarModal} from "../components/CalendarModal";
import {sqliteGetUserExercisesByDate} from "../database/sqliteTypeSave";
import {Transition, Transitioning, TransitioningView} from "react-native-reanimated";
import {ExerciseDataItem} from "../database/databaseTypes";
import {useUpdateExercises} from "../zustand/useUpdateExercises";
import {ProfileScreenNavigationProp} from "../navigators/HomeNavigator";
import dayjs from "dayjs";

export const Exercises: React.FC = () => {

    const updateExercisesVersion = useUpdateExercises(s => s.updateExercisesVersion)
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const [calendarModalVisible, setCalendarModalVisible] = useState<boolean>(false)
    const [allExerciseData, setAllExerciseData] = useState<ExerciseDataItem[]>([])
    const selectedDate = useSelectedDate(state => state.selectedDate)

    const transitionRef = useRef<TransitioningView | null>(null)
    const transition = <Transition.Change interpolation="easeInOut"/>

    const liftedWeight = allExerciseData.reduce((accumulatedWeight, nextExercise) => {
        return accumulatedWeight + nextExercise.exerciseSet.reduce((accumulatedWeightPerSet, nextSet) => {
            return accumulatedWeightPerSet + nextSet.reps * nextSet.weight
        }, 0)
    }, 0)

    useEffect(() => {
        sqliteGetUserExercisesByDate(selectedDate).then(data => setAllExerciseData(data));
    }, [updateExercisesVersion, selectedDate])

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title="Choose date"
                          iconName='calendar'
                          onPress={() => setCalendarModalVisible(true)}
                    />
                </HeaderButtons>
            ),
            title: dayjs(selectedDate).format('DD.MM.YYYY')
        });
    }, [navigation, selectedDate]);

    const renderItem: ListRenderItem<ExerciseDataItem> = ({item}) => {
        return <ExpandExerciseItem onToggleExpanded={() => transitionRef.current?.animateNextTransition()} item={item}
                                   onPress={() => navigation.navigate('ModifyExercise', {
                                       exerciseId: item.exerciseid,
                                       searchExerciseId: item.rowid,
                                       exerciseName: item.title,
                                   })}/>;
    }

    return <>
        <CalendarModal modalVisible={calendarModalVisible} setModalVisible={setCalendarModalVisible}/>
        <View style={styles.container}>
            <LiftedWeightCard value={liftedWeight}/>
            <Transitioning.View ref={transitionRef} transition={transition} style={{flex: 1}}>
                <FlatList<ExerciseDataItem>
                    data={allExerciseData}
                    renderItem={renderItem}
                    keyExtractor={item => item.exerciseid + ''}
                    contentContainerStyle={styles.flatlistContainer}
                />
            </Transitioning.View>
            <FloatingAction
                actions={[{
                    name: "bt_fab_add",
                    icon: <Ionicons name="md-add" color={'white'} size={32}/>
                }]}
                onPressItem={name => {
                    navigation.navigate('ChooseExercise')
                }}
                color={colors.primary}
                overrideWithAction={true}
            />
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    flatlistContainer: {
        paddingBottom: 8
    }
});
