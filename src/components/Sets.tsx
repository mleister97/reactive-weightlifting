import React from "react";
import {ExerciseDataItemSetWithId, Set} from "./Set";
import {FlatList, ListRenderItem, StyleSheet} from "react-native";

interface SetsProps {
    sets: ExerciseDataItemSetWithId[]
    onPress(id: string): void
}

export const Sets: React.FC<SetsProps> = ({sets, onPress}) => {

    const renderDisplaySet: ListRenderItem<ExerciseDataItemSetWithId> = ({item, index}) => (
        <Set count={index + 1} reps={item.reps} weight={item.weight} id={item.id} onPress={() => onPress(item.id)}/>
    )

    return <FlatList<ExerciseDataItemSetWithId>
        data={sets}
        renderItem={renderDisplaySet}
        contentContainerStyle={styles.flatlistContainer}
        keyExtractor={(item) => "" + item.id}
        persistentScrollbar={true}
    />
}

const styles = StyleSheet.create({
    flatlistContainer: {
        paddingBottom: 8,
        paddingHorizontal: 5
    }
});
