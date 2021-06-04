import React from "react";
import {Image, StyleSheet, View} from "react-native";
import {exerciseCategoryColors, exerciseCategoryImages} from "../constants/style";
import {ExerciseCategory} from "../database/databaseTypes";

export interface ExerciseIconProps {
    category: ExerciseCategory
    size?: number
    imageSize?: number
}

const ExerciseIcon: React.FC<ExerciseIconProps> = ({category, size = 40, imageSize = 25}) => {

    const exerciseBackgroundColor = exerciseCategoryColors[category]
    const exerciseCategoryImage = exerciseCategoryImages[category]

    return (
        <View style={[styles.exerciseCategoryImageContainer, {backgroundColor: exerciseBackgroundColor, width: size, height: size, borderRadius: size / 2}]}>
            <Image source={exerciseCategoryImage} style={{width: imageSize, height: imageSize}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    exerciseCategoryImageContainer: {
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default ExerciseIcon
