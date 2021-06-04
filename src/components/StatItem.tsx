import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {colors} from "../constants/style";

interface StatItemProps {
    title: string
    value: string
}


export const StatItem: React.FC<StatItemProps> = ({title, value}) => {
    return (
        <View style={styles.statItem}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    statItem: {
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
        margin: 6,
        marginBottom: 12,
        padding: 10,
        paddingVertical: 15,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.26,
        elevation: 6,
        borderRadius: 4
    },
    title: {
        textTransform: "uppercase",
        fontSize: 12,
        marginBottom: 6
    },
    value: {
        color: colors.primary,
        fontSize: 18
    }
});
