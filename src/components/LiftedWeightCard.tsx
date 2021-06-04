import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from "../constants/style";

interface LiftedWeightCardProps {
    value: number
}

export const LiftedWeightCard: React.FC<LiftedWeightCardProps> = ({value}) => {
    return (
        <View style={styles.card}>
            <Image style={styles.bicepsLeft} source={require('./../assets/images/biceps.png')}/>
            <Text style={styles.text}>{value} KGs lifted</Text>
            <Image style={styles.bicepsRight} source={require('./../assets/images/biceps.png')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    bicepsLeft: {
        height: 24,
        width: 24,
        transform: [{rotateY: '180deg'}]
    },
    bicepsRight: {
        height: 24,
        width: 24,
    },
    text: {
        fontWeight: "bold",
        color: colors.white,
        fontSize: 18
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 6,
        marginHorizontal: 4,
        height: "6.5%",
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.26,
        elevation: 4,
        backgroundColor: colors.primary,
        borderRadius: 4,
    }
});
