import * as React from 'react';
import {TouchableHighlight, View, Text, TouchableOpacity} from "react-native";
import CameraService from "../../services/CameraService";
import {Camera, Vector3} from "three";

type TestRotateAroundLookAtButtonProps = {
    isRendering:boolean,
    cameraService:CameraService,
    lookAt:Vector3,
    setLookAt:(newLookAt:Vector3)=>void,
}
export default function TestChangeLookAtButton(props:TestRotateAroundLookAtButtonProps) {
    const cameraLookAtBuff = new Vector3()
    return(
        <TouchableOpacity onPress={()=>{
            if(props.isRendering){
                props.setLookAt(props.lookAt.add(new Vector3(1,0,0)));
                props.cameraService.rotateAroundLookUpPoint(0, new Vector3(0,1,0), props.lookAt)
            }
        }}>
            <View style={{padding:4, margin:2, backgroundColor:'beige', }}>
                <Text>Move look at</Text>
            </View>
        </TouchableOpacity>
    )
}