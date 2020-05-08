/////TODO: 1) Criar o group 
/////TODO: 2) Adicionar o group à cena
/////TODO: 3) Ter referência à camera
//TODO: 4) Atualizar camera no render()
//TODO: 5) Translate
//TODO: 6) Rotate around center
//TODO: 7) Dolly in/out
//TODO: 8) Rotate around eye

import { ConeBufferGeometry, BoxBufferGeometry, MeshStandardMaterial, Mesh, Group, Scene, Camera, Vector3, PerspectiveCamera } from "three"

//TODO: 9) Zoom
export class CameraSystem{
    private readonly focus:FocusMesh;
    private readonly eye:EyeMesh;
    private readonly group:Group;
    readonly camera:PerspectiveCamera;
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
        scene.add(this.group);
        this.camera = CameraSystem.createCamera(eyePos.x, eyePos.y, eyePos.z,
            focusPos.x, focusPos.y, focusPos.z,screenwidth, screenheight)
    }

    static createCamera(eyeX:number, eyeY:number, eyeZ:number, 
        lookX:number, lookY:number, lookZ:number,
        width:number, height:number):PerspectiveCamera{
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(eyeX, eyeY, eyeZ);
        camera.lookAt(lookX, lookY, lookZ);
        return camera;
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