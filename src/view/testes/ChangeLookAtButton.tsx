import * as React from 'react';
import {TouchableHighlight, View, Text, TouchableOpacity} from "react-native";
import CameraService from "../../services/CameraService";
import {Camera, Vector3} from "three";

type TestRotateAroundLookAtButtonProps = {
    isRendering:boolean,
    cameraService:CameraService,
}
export default function TestChangeLookAtButton(props:TestRotateAroundLookAtButtonProps) {
    const cameraLookAtBuff = new Vector3()
    return(
        <TouchableOpacity onPress={()=>{
            if(props.isRendering){
                cameraLookAtBuff.copy(props.cameraService.cameraLookAt);
                cameraLookAtBuff.add(new Vector3(1,0,0));
                props.cameraService.setLookAt(cameraLookAtBuff);
            }
        }}>
            <View style={{padding:4, margin:2, backgroundColor:'beige', }}>
                <Text>Move look at</Text>
            </View>
        </TouchableOpacity>
    )
}