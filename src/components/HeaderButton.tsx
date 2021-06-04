import React from 'react';
import {HeaderButton as ReactNavigationHeaderButton} from 'react-navigation-header-buttons';
import {Ionicons} from '@expo/vector-icons';
import {colors} from "../constants/style";
import {isAndroid} from "../utils/platform";

const HeaderButton = (props: any) => {
    return (
        <ReactNavigationHeaderButton
            {...props}
            IconComponent={Ionicons}
            iconSize={23}
            color={isAndroid() ? colors.white : colors.primary}
        />
    );
};

export default HeaderButton;
