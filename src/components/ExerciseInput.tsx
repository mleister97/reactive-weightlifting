import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import React from "react";
import {colors} from "../constants/style";

interface ExerciseInputProps {
    title: string
    value: number | null
    stepSize: number
    onChangeValue: React.Dispatch<React.SetStateAction<number | null>>

}

export const ExerciseInput: React.FC<ExerciseInputProps> = ({ title, onChangeValue, stepSize, value}) => {

    const reduceValue = () => {
        onChangeValue((prevValue) => {
            let newValue = (prevValue ?? 0) - stepSize
            if (newValue < 0) newValue = 0
            return newValue
        })
    }

    const increaseValue = () => {
        onChangeValue((prevValue) => {
            return (prevValue ?? 0) + stepSize
        })
    }

    const changeValue = (value: string) => {
        let numericValue: number | null = parseInt(value.replace(/[^0-9]/g, ''))
        if (isNaN(numericValue)) numericValue = null;
        onChangeValue(numericValue)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{ title }</Text>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.button} onPress={reduceValue}>
                    <FontAwesome name="minus" size={22} color={colors.black}/>
                </TouchableOpacity>
                <TextInput style={styles.input} value={value?.toString() ?? ""} onChangeText={changeValue} keyboardType="numeric" textAlign="center"/>
                <TouchableOpacity style={styles.button} onPress={increaseValue}>
                    <FontAwesome name="plus" size={22} color={colors.black}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        marginBottom: 8
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.grey,
        marginHorizontal: 8,
        padding: 4,
        flexGrow: 1,
        borderRadius: 4,
        fontSize: 20,
        fontWeight: "bold"
    },
    inputContainer: {
        flexDirection: "row",
    },
    button: {
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.grey,
        borderRadius: 4,
        padding: 8,
        height: 40,
        width: 40
    }
});
