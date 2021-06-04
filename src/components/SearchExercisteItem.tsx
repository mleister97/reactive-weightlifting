import React from "react";
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Col, Grid, Row} from "react-native-easy-grid";
import {SearchExerciseDataItem} from "../database/databaseTypes";
import ExerciseIcon from "./ExerciseIcon";

interface ExerciseItemProps {
    item: SearchExerciseDataItem

    onPress(): void
}

export const SearchExerciseItem: React.FC<ExerciseItemProps> = ({item, onPress}) => {
    return <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.6}>
        <Grid style={{overflow: "hidden"}}>
            <Row style={styles.headContainer}>
                <ExerciseIcon category={item.category} />
                <Col style={styles.exerciseTextContainer}>
                    <Text style={styles.exerciseHeading} numberOfLines={1}>{item.title}</Text>
                </Col>
            </Row>
        </Grid>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    exerciseTextContainer: {
        flexGrow: 8,
        marginLeft: 15,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    exerciseCols: {
        alignItems: "center"
    },
    container: {
        margin: 4,
        backgroundColor: '#fff',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.26,
        elevation: 4,
        borderRadius: 4
    },
    headContainer: {
        padding: 8
    },
    exerciseHeading: {
        fontSize: 16,
        fontWeight: "bold"
    }
});
