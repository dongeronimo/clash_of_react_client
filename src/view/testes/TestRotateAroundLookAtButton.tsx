import * as React from 'react';
import {TouchableHighlight, View, Text, TouchableOpacity} from "react-native";
import CameraService from "../../services/CameraService";
import {Vector3} from "three";
type TestRotateAroundLookAtButtonProps = {
    isRendering:boolean,
    cameraService:CameraService,
}
export default function TestRotateAroundLookAtButton(props:TestRotateAroundLookAtButtonProps) {
    const testeRotationAxis = new Vector3(0,1,0);
    return(
        <TouchableOpacity onPress={()=>{
            if(props.isRendering){
                props.cameraService.rotateAroundLookUpPoint(5, testeRotationAxis);
            }
        }}>
            <View style={{padding:4, margin:2, backgroundColor:'beige', }}>
                <Text>Rotate around look at</Text>
            </View>
        </TouchableOpacity>
    )
}