import React from "react";
import {Badge} from "../components/Badge";
import {exerciseCategoryColors} from "../constants/style";

export const getBadgeForExerciseCategory = (category: keyof typeof exerciseCategoryColors) => {
    return <Badge text={category} color={exerciseCategoryColors[category]} />
}
