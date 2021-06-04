import React, {useRef, useState} from "react";
import {FlatList, ListRenderItem, StyleSheet, TextInput, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import {SearchExerciseItem} from "../components/SearchExercisteItem";
import {Transition, Transitioning, TransitioningView} from "react-native-reanimated";
import {SearchExerciseDataItem} from "../database/databaseTypes";
import {colors} from "../constants/style";
import {useExercisesList} from "../zustand/useExercisesList";
import {ProfileScreenNavigationProp} from "../navigators/HomeNavigator";

const transition = <Transition.Change interpolation="easeInOut"/>

export const ChooseExercise = () => {
    const exercisesList = useExercisesList(e => e.exercisesList)
    const [exercises, setExercises] = useState<SearchExerciseDataItem[]>(exercisesList)
    const navigation = useNavigation<ProfileScreenNavigationProp>()

    const transitionRef = useRef<TransitioningView | null>(null)

    const renderItem: ListRenderItem<SearchExerciseDataItem> = ({item}) => {
        return <SearchExerciseItem item={item} onPress={() => navigation.navigate('ModifyExercise', {
            exerciseId: null,
            searchExerciseId: item.rowid,
            exerciseName: item.title
        })}/>
    }

    const filterExercises = (filter: string) => {
        setExercises(exercisesList.filter((ex) => ex.title.toLowerCase().startsWith(filter.toLowerCase())))
        transitionRef.current?.animateNextTransition()
    }

    return <View style={styles.container}>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} onChangeText={filterExercises} placeholder="Search exercises" placeholderTextColor={colors.grey} numberOfLines={1} />
            <View style={styles.searchIcon}>
            <Ionicons name="md-search" color={colors.grey} size={22}/>
            </View>
        </View>
        <Transitioning.View ref={transitionRef} transition={transition} style={{flex: 1}}>
            <FlatList<SearchExerciseDataItem>
                data={exercises}
                renderItem={renderItem}
                keyExtractor={item => item.rowid + ''}
            />
        </Transitioning.View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        flex: 1
    },
    input: {
        flexGrow: 1,
        fontSize: 16,
        padding: 8
    },
    searchIcon: {
        borderLeftColor: colors.grey,
        borderLeftWidth: 1,
        padding: 8
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.grey,
        marginHorizontal: 4,
        borderRadius: 4,
        // padding: 8,
        display: "flex",
        flexDirection: "row",
        marginBottom: 15
    }
});
