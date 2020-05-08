import {PerspectiveCamera, Quaternion, Vector3} from "three";

export default class CameraService {
    readonly camera: PerspectiveCamera;
    // readonly cameraLookAt = new Vector3();

    static createCamera(eyeX:number, eyeY:number, eyeZ:number, lookX:number, lookY:number, lookZ:number,
                        width:number, height:number):PerspectiveCamera{
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(eyeX, eyeY, eyeZ);
        camera.lookAt(lookX, lookY, lookZ);
        return camera;
    }

    constructor(camera: PerspectiveCamera, lookAt: Vector3) {
        this.camera = camera;
        // this.cameraLookAt.copy(lookAt);
    }

    // setLookAt = (lookAtPos:Vector3)=>{
    //     this.cameraLookAt.copy(lookAtPos);
    //     this.camera.lookAt(lookAtPos);
    // }


    readonly rotateAroundLookUpPoint = (angleInDegs: number, axis: Vector3, lookAt:Vector3) => {

        //Pega a pos da camera
        const cameraWorldPosition = new Vector3();
        this.camera.getWorldPosition(cameraWorldPosition);
        //Vetor do look at pra camera
        const lookAtToEyeVector = cameraWorldPosition.sub(lookAt);
        this.printVector("lookAtEyeVector", lookAtToEyeVector);
        console.log("distance", lookAtToEyeVector.length())
        //Rotacao
        lookAtToEyeVector.applyAxisAngle(axis, angleInDegs * Math.PI / 180);
        //Altera o eye
        this.camera.position.copy(lookAtToEyeVector);
        this.camera.updateMatrix();
        //Aplica o lookAt
        this.camera.lookAt(lookAt);
        this.camera.updateMatrix();
        // //1)Preciso pegar o vetor entre o foco e o olho, indo do foco pro olho.
        // const cameraWorldDirection = new Vector3();
        // const cameraWorldPosition = new Vector3();
        // this.camera.getWorldDirection(cameraWorldDirection);
        // this.camera.getWorldPosition(cameraWorldPosition);
        // const invertedNormalizedCameraDirectionVector = cameraWorldDirection.multiplyScalar(-1);
        // const distanceBetweenLookAndCamera = cameraWorldPosition.sub(this.cameraLookAt).length();
        // console.log("distance ", distanceBetweenLookAndCamera);
        // const invertedCameraDirection = invertedNormalizedCameraDirectionVector
        //     .multiplyScalar(distanceBetweenLookAndCamera);
        // //2)Rotaciono o vetor da posicao da camera
        // invertedCameraDirection.applyAxisAngle(axis,
        //     angleInDegs * Math.PI / 180);
        // //3)Altera o eye
        // this.camera.position.copy(invertedCameraDirection);
        // //4)Refaz o lookat com o novo vetor
        // this.camera.lookAt(this.cameraLookAt)
        // this.camera.updateMatrix();
    }

    printVector(text: string, vec: Vector3) {
        console.log(`${text}: ${vec.x}, ${vec.y}, ${vec.z}`);
    }
}