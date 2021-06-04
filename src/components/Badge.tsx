import React from "react";
import {StyleSheet, Text, View} from "react-native";

interface BadgeProps {
    text: string
    color: string
}

export const Badge: React.FC<BadgeProps> = ({ text, color }) => {
    return <View style={styles.badgeContainer}>
        <View style={[styles.miniBadge, { backgroundColor: color}]} />
        <Text style={styles.text}>{ text }</Text>
    </View>
}

const miniSize = 8;

const styles = StyleSheet.create({
    badgeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    miniBadge: {
        width: miniSize,
        height: miniSize,
        borderRadius: miniSize / 2,
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    text: {
        paddingLeft: 6
    }
});
