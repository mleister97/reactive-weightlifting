import React from "react";
import {TouchableOpacity} from "react-native";
import ExerciseIcon, {ExerciseIconProps} from "./ExerciseIcon";

interface TouchableExerciseIconProps extends ExerciseIconProps {
    onPress(): void
}

const TouchableExerciseIcon: React.FC<TouchableExerciseIconProps> = ({children, onPress, ...props}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <ExerciseIcon {...props} />
        </TouchableOpacity>
    )
}


export default TouchableExerciseIcon
