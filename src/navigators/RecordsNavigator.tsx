import React from "react";
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {stackNavOptions} from "../utils/stackNavOptions";
import {Records} from "../screens/Records";

export type RecordsStackParamList = {
    Records: undefined
}

const Stack = createStackNavigator<RecordsStackParamList>();

export const RecordsNavigator: React.FC = () => {
    return <Stack.Navigator screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        ...stackNavOptions,
    }}>
        <Stack.Screen name="Records" component={Records}/>
    </Stack.Navigator>
}

