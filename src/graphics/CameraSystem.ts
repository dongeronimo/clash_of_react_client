/////TODO: 1) Criar o group 
/////TODO: 2) Adicionar o group à cena
/////TODO: 3) Ter referência à camera
/////TODO: 4) Atualizar camera no render()
/////TODO: 5) Translate
/////TODO: 6) Rotate around center
//TODO: 7) Dolly in/out
//TODO: 8) Rotate around eye
//TODO: 9) Zoom
//TODO: 10) Validate if it works when starting position not [0,0,0]
import { ConeBufferGeometry, BoxBufferGeometry, MeshStandardMaterial, Mesh, Group, Scene, Camera, Vector3, PerspectiveCamera, Object3D } from "three"


export class CameraSystem{
    private readonly focusObject:FocusMesh;
    private readonly eyeObject:EyeMesh;
    private readonly cameraGroup:Group;
    readonly camera:PerspectiveCamera;
    private readonly worldEyePos:Vector3;
    private readonly worldFocusPos:Vector3;
    private distance:number;
    constructor(scene:Scene, focusPos:Vector3, eyePos:Vector3, 
        screenwidth:number, screenheight:number){
            this. focusObject = new FocusMesh();
            this.focusObject.position.copy(focusPos);
            this.worldFocusPos = new Vector3();
            this.worldFocusPos.copy(focusPos)
            
            this.eyeObject = new EyeMesh();
            this.eyeObject.position.copy(eyePos);
            this.worldEyePos = new Vector3();
            this.worldEyePos.copy(eyePos);
            this.eyeObject.lookAt(focusPos);

            this.cameraGroup = new Group();
            this.cameraGroup.add(this.focusObject);
            this.cameraGroup.add(this.eyeObject);
            this.distance = this.focusObject.position.distanceTo(this.eyeObject.position);
            scene.add(this.cameraGroup);
            
            this.camera = CameraSystem.createCamera(eyePos.x, eyePos.y, eyePos.z,
            focusPos.x, focusPos.y, focusPos.z,screenwidth, screenheight)
        
    }
    private createFocusObject(focusPos:Vector3):[FocusMesh, Vector3]{
        const focusObject = new FocusMesh();
        focusObject.position.copy(focusPos);
        const worldFocusPos = focusPos;
        focusObject.updateMatrix();
        return [focusObject, worldFocusPos]
    }
    private createEyeObject(eyePos:Vector3, focusPos:Vector3):[EyeMesh, Vector3]{
        const eyeObject = new EyeMesh();
        eyeObject.position.copy(eyePos);
        eyeObject.lookAt(focusPos);
        eyeObject.updateMatrix();
        const worldEyePos = eyePos;
        return [eyeObject, worldEyePos];
    }
    private createGroup(focusObject:Object3D, eyeObject:Object3D, scene:Scene):[Group, number]{
        if(!focusObject)throw new Error("focusObject is null");
        if(!eyeObject)throw new Error("eyeObject is null");
        if(!scene)throw new Error("scene is null")
        const cameraGroup = new Group();
        cameraGroup.add(focusObject);
        cameraGroup.add(eyeObject);
        const distance = focusObject.position.distanceTo(eyeObject.position);
        scene.add(this.cameraGroup);
        return [cameraGroup, distance];
    }
    static createCamera(eyeX:number, eyeY:number, eyeZ:number, 
        lookX:number, lookY:number, lookZ:number,
        width:number, height:number):PerspectiveCamera{
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(eyeX, eyeY, eyeZ);
        camera.lookAt(lookX, lookY, lookZ);
        return camera;
    }
    update(){
        //Pega as posiçoes do objeto do foco e do objeto do olho
        this.eyeObject.getWorldPosition(this.worldEyePos);
        this.cameraGroup.getWorldPosition(this.worldFocusPos);
        this.distance = this.worldEyePos.distanceTo(this.worldFocusPos);
        //Aplica essas posiçoes à camera
        this.camera.position.copy(this.worldEyePos);
        this.camera.lookAt(this.worldFocusPos)
        this.camera.updateMatrix()
    }
    moveTo(x:number, y:number, z:number){
        //Se o grupo se move todos os objetos nele se movem..
        this.cameraGroup.position.set(x, y, z);
        this.update();
    }    
    rotateAroundCenter(rotationAxis:Vector3, angle:number){
        //Se o grupo rotaciona todos os objetos ao redor do grupo rotacionam.
        this.cameraGroup.rotateOnAxis(rotationAxis, angle);
        this.update();
    }
    
    dolly(distance:number){
        const invertedCameraDirectionVector = new Vector3();
        this.camera.getWorldDirection(invertedCameraDirectionVector);
        invertedCameraDirectionVector.multiplyScalar(-1* distance);
        this.eyeObject.position.copy(invertedCameraDirectionVector);
        this.update();
        // console.log(this.focusObject.position)
        // console.log(this.eyeObject.position)
        // const invertedCameraDirectionVector = new Vector3();
        // this.camera.getWorldDirection(invertedCameraDirectionVector);
        // invertedCameraDirectionVector.multiplyScalar(-1);
        // invertedCameraDirectionVector.multiplyScalar(distance);
        // this.eyeObject.position.copy(invertedCameraDirectionVector);
        // this.update();
        
        // const _eyePos = new Vector3()
        // this.eye.position.copy(_eyePos);
        // const _focusPos = new Vector3();
        // this.focus.position.copy(_focusPos);
        // const oldDistance = _eyePos.distanceTo(_focusPos);
        // console.log(oldDistance)
    }
    getPosition():Vector3{
        return this.worldFocusPos;
    }
    getDistance():number{
        return this.distance;
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