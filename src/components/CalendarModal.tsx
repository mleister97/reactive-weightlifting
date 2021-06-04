import React, {useCallback, useState} from "react";
import {Calendar, DateObject, DotMarking} from "react-native-calendars";
import {Dimensions, Modal, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {useSelectedDate} from "../zustand/useSelectedDate";
import {colors} from "../constants/style";
import dayjs from "dayjs";
import {sqliteGetAllExerciseSetDates} from "../database/sqliteTypeSave";

interface CalendarModalProps {
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const calendarTheme = {
    selectedDayBackgroundColor: colors.primary,
    todayTextColor: colors.primary,
    arrowColor: colors.primary
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const today =  dayjs().format('YYYY-MM-DD')

interface MarkedDates {
    [date: string]: DotMarking
}

export const CalendarModal: React.FC<CalendarModalProps> = ({modalVisible, setModalVisible}) => {
    const {selectedDate, setSelectedDate} = useSelectedDate()
    const [selectedDates, setSelectedDates] = useState<string[]>([])

    const handleDayPress = useCallback((dateObject: DateObject) => {
        setSelectedDate(dateObject.dateString)
        setModalVisible(false)
    }, [setSelectedDate, setModalVisible])

    sqliteGetAllExerciseSetDates().then(r => {
        setSelectedDates(r)
    });

    const createMarkedDatesArray: MarkedDates = selectedDates.reduce((acc, curr) => {
        acc[curr] = {marked: true, dotColor: colors.primary}
        return acc
    }, {[selectedDate]: {selected: true}} as MarkedDates)

    return (
        <Modal animationType="fade"
               transparent={true}
               visible={modalVisible}
               onRequestClose={() => setModalVisible(false)}>

            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}/>
            </TouchableWithoutFeedback>

            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Calendar
                        markedDates={createMarkedDatesArray}
                        theme={calendarTheme}
                        maxDate={today}
                        onDayPress={handleDayPress}
                        style={{
                            width: 0.8 * windowWidth,
                            height: 0.5 * windowHeight
                        }}
                        firstDay={1}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
});
