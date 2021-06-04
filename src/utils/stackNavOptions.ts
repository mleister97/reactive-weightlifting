import {Platform} from "react-native";
import {colors} from "../constants/style";

export const stackNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? colors.white : colors.primary
};
