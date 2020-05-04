import * as React from 'react';
import {TouchableHighlight, View, Text, TouchableOpacity} from "react-native";
type TurnOnTurnOffButtonProps = {
    isRendering:boolean,
    timeout:any,
    setRendering:(flag:boolean)=>void
}
export default function TurnOnTurnOffButton(props:TurnOnTurnOffButtonProps) {
    return(
    <TouchableOpacity onPress={()=>{
        console.log(`is rendering:${!props.isRendering}`)
        clearTimeout(props.timeout);
        props.setRendering(!props.isRendering);
    }}>
        <View style={{padding:4, margin:2, backgroundColor:'beige', }}>
            <Text>{props.isRendering?"Turn Off":"Turn On"}</Text>
        </View>
    </TouchableOpacity>
    );
}