import React from 'react';
import {View, Text} from 'react-native';

type ExampleComponentProps = {
    value: number,
}

export default function ExampleComponent(props:ExampleComponentProps){
    return(
        <View><Text>Valor = {props.value}</Text></View>
    )
}

