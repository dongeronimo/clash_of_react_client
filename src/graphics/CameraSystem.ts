/////TODO: 1) Criar o group 
/////TODO: 2) Adicionar o group à cena
/////TODO: 3) Ter referência à camera
/////TODO: 4) Atualizar camera no render()
/////TODO: 5) Translate
/////TODO: 6) Rotate around center
//TODO: 7) Dolly in/out
//TODO: 8) Rotate around eye
//TODO: 9) Zoom

import { ConeBufferGeometry, BoxBufferGeometry, MeshStandardMaterial, Mesh, Group, Scene, Camera, Vector3, PerspectiveCamera } from "three"


export class CameraSystem{
    private readonly focus:FocusMesh;
    private readonly eye:EyeMesh;
    private readonly group:Group;
    readonly camera:PerspectiveCamera;
    private distance:number;
    constructor(scene:Scene, focusPos:Vector3, eyePos:Vector3, 
        screenwidth:number, screenheight:number){
        this.focus = new FocusMesh();
        this.focus.position.copy(focusPos);
        this.eye = new EyeMesh();
        this.eye.position.copy(eyePos);
        this.eye.lookAt(focusPos);
        this.group = new Group();
        this.group.add(this.focus);
        this.group.add(this.eye);
        this.eye.updateMatrix();
        this.focus.updateMatrix();
        scene.add(this.group);
        this.camera = CameraSystem.createCamera(eyePos.x, eyePos.y, eyePos.z,
            focusPos.x, focusPos.y, focusPos.z,screenwidth, screenheight)
        this.distance = this.focus.position.distanceTo(this.eye.position);
        this.cameraWorldPosition.copy(eyePos);
        this.cameraWorldLookAtPosition.copy(focusPos);
    }

    static createCamera(eyeX:number, eyeY:number, eyeZ:number, 
        lookX:number, lookY:number, lookZ:number,
        width:number, height:number):PerspectiveCamera{
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(eyeX, eyeY, eyeZ);
        camera.lookAt(lookX, lookY, lookZ);
        return camera;
    }
    private readonly cameraWorldPosition = new Vector3();
    private readonly cameraWorldLookAtPosition = new Vector3();
    update(){
        this.fillCameraWorldPositionAndCameraWorldLookAtPosition();
        this.setCameraObjectUsingWorldPositionAndLookAtPosition();
    }
    private fillCameraWorldPositionAndCameraWorldLookAtPosition(){
        this.eye.getWorldPosition(this.cameraWorldPosition);
        this.group.getWorldPosition(this.cameraWorldLookAtPosition);
    }
    private setCameraObjectUsingWorldPositionAndLookAtPosition(){
        this.camera.position.copy(this.cameraWorldPosition);
        this.camera.lookAt(this.cameraWorldLookAtPosition);
        this.camera.updateMatrix();
    }
    moveTo(x:number, y:number, z:number){
        this.group.position.set(x, y, z);
        this.update();
    }    
    getPosition():Vector3{
        return this.cameraWorldLookAtPosition;
    }
    rotateAroundCenter(rotationAxis:Vector3, angle:number){
        this.group.rotateOnAxis(rotationAxis, angle);
        this.update();
    }
    getDistance():number{
        return this.cameraWorldLookAtPosition.distanceTo(this.cameraWorldPosition);
    }
    
    dolly(distance:number){
        console.log(this.focus.position)
        console.log(this.eye.position)
        const invertedCameraDirectionVector = new Vector3();
        this.camera.getWorldDirection(invertedCameraDirectionVector);
        invertedCameraDirectionVector.multiplyScalar(-1);
        invertedCameraDirectionVector.multiplyScalar(distance);
        this.eye.position.copy(invertedCameraDirectionVector);
        this.update();
        
        // const _eyePos = new Vector3()
        // this.eye.position.copy(_eyePos);
        // const _focusPos = new Vector3();
        // this.focus.position.copy(_focusPos);
        // const oldDistance = _eyePos.distanceTo(_focusPos);
        // console.log(oldDistance)
    }
}


class FocusMesh extends Mesh {
    constructor(){
        super(
            new BoxBufferGeometry(0.5,0.5, 0.5),
            new MeshStandardMaterial({
                 color: 0xff0000
              }));
    }
}
class EyeMesh extends Mesh {
    constructor(){
        super(
            new BoxBufferGeometry(0.5,0.5, 0.5),
            new MeshStandardMaterial({
                 color: 0x00ff00
              }));
        this.visible = false;
    }
}

export function printVector(text:string, vec:Vector3){
    console.log(`${text}: ${vec.x}, ${vec.y}, ${vec.z}`);
}