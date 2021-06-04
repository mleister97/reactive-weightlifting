import React from "react"
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {colors} from "../constants/style";
import {ExerciseDataItemSet} from "../database/databaseTypes";

export interface ExerciseDataItemSetWithId extends ExerciseDataItemSet {
    id: string
}

export interface SetPropsWithCount extends ExerciseDataItemSetWithId {
    count: number
    onPress(): void
}

export const Set: React.FC<SetPropsWithCount> = ({count, reps, weight, onPress}) => {
    return <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text><Text style={styles.boldText}>{count}</Text></Text>
        <Text><Text style={styles.boldText}>{reps}</Text><Text> reps</Text></Text>
        <Text><Text style={styles.boldText}>{weight}</Text><Text> kgs</Text></Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderColor: colors.grey,
        borderWidth: 1,
        padding: 6,
        paddingVertical: 10,
        borderRadius: 4,
        marginVertical: 3
    },
    boldText: {
        fontWeight: "bold"
    }
});
