import React, {useEffect} from 'react';
import {registerRootComponent} from "expo";
import {NavigationContainer} from "@react-navigation/native";
import {BottomNavigator} from "./navigators/BottomNavigator";
import {StatusBar} from "react-native";
import {useExercisesList} from "./zustand/useExercisesList";
import {sqliteCheckAndFill, sqliteGetAllExercises} from "./database/sqliteTypeSave";

export default function App() {
    const setExercisesList = useExercisesList(e => e.setExercisesList)
    useEffect(() => {
        sqliteCheckAndFill().then(d => {
            sqliteGetAllExercises().then(d => setExercisesList(d))
        })
    }, [])

    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content"/>
            <BottomNavigator/>
        </NavigationContainer>
    );
}

registerRootComponent(App);
