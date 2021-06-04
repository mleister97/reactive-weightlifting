import React, {useEffect, useState} from "react";
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {StatItem} from "../components/StatItem";
import {Col, Grid, Row} from "react-native-easy-grid";
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {colors} from "../constants/style";
import {Ionicons} from "@expo/vector-icons";
import ExerciseIcon from "../components/ExerciseIcon";
import {RecordItem, SearchExerciseDataItem} from "../database/databaseTypes";
import {sqliteGetAllExercisesWithRecords, sqliteGetRecordsPerExercise} from "../database/sqliteTypeSave";
import dayjs from "dayjs";

const containerStyle = {
    height: 50,
    margin: 4
}

const dropdownStyle = {
    backgroundColor: '#fafafa'
}

const dropdownItemStyle: StyleProp<ViewStyle> = {
    justifyContent: "flex-start"

}

export const Records: React.FC = () => {
    const [recordItem, setRecordItem] = useState<RecordItem | null>(null)
    const [selectedExercise, setSelectedExercise] = useState<SearchExerciseDataItem | null>(null)
    const [exercisesList, setExercisesList] = useState<SearchExerciseDataItem[]>([])

    const dropdownItems: ItemType[] = exercisesList.map((e) => ({
        label: e.title,
        value: e.rowid,
        icon: () => <ExerciseIcon category={e.category} size={30} imageSize={23}/>
    }))

    sqliteGetAllExercisesWithRecords().then(d => setExercisesList(d))

    useEffect(() => {
        if (selectedExercise == null) return
        sqliteGetRecordsPerExercise(selectedExercise).then(d => setRecordItem(d))
    }, [selectedExercise])

    return <View style={styles.container}>
        <DropDownPicker
            items={dropdownItems}
            onChangeItem={(t: ItemType) => setSelectedExercise({title: t.label, category: "chest", rowid: t.value})}
            placeholder="Select an exercise"
            placeholderStyle={{color: colors.grey}}
            scrollViewProps={{
                persistentScrollbar: true
            }}
            dropDownMaxHeight={400}
            containerStyle={containerStyle}
            style={dropdownStyle}
            itemStyle={dropdownItemStyle}
            labelStyle={styles.dropdownLabelStyle}
            arrowColor={colors.grey}
            arrowSize={26}
            customArrowDown={(size, color) => <Ionicons name="chevron-down" size={size} color={color}/>}
            customArrowUp={(size, color) => <Ionicons name="chevron-up" size={size} color={color}/>}
        />

        {
            recordItem && recordItem.lastExerciseDate === "0000-00-00" &&
            <ScrollView>
                <Grid>
                    <Row>
                        <Col><StatItem title="Last workout" value={"No last workout!"}/></Col>
                    </Row>
                </Grid>
            </ScrollView>
        }

        {recordItem && recordItem.lastExerciseDate !== "0000-00-00" &&
        <ScrollView>
            <Grid>
                <Row>
                    <Col><StatItem title="Last workout" value={dayjs(recordItem.lastExerciseDate.toString()).format('DD.MM.YYYY')}/></Col>
                </Row>
                <Row>
                    <Col><StatItem title="Total workouts" value={recordItem.totalWorkouts.toString()}/></Col>
                    <Col><StatItem title="Total sets" value={recordItem.totalSets.toString()}/></Col>
                </Row>
                <Row>
                    <Col><StatItem title="Total reps" value={recordItem.totalReps.toString()}/></Col>
                    <Col><StatItem title="Total volume" value={recordItem.totalWeight.toString()}/></Col>
                </Row>
                <Row>
                    <Col><StatItem title="Max weight" value={recordItem.maxWeight.toString()}/></Col>
                    <Col><StatItem title="Max reps" value={recordItem.maxReps.toString()}/></Col>
                </Row>
            </Grid>
        </ScrollView>
        }
    </View>
}

const styles = StyleSheet.create({
    dropdownLabelStyle: {
        textAlignVertical: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
});
