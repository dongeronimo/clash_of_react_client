import {PerspectiveCamera, Quaternion, Vector3} from "three";

export default class CameraService {
    readonly camera: PerspectiveCamera;
    readonly cameraLookAt = new Vector3();

    static createCamera(eyeX:number, eyeY:number, eyeZ:number, lookX:number, lookY:number, lookZ:number,
                        width:number, height:number):PerspectiveCamera{
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(eyeX, eyeY, eyeZ);
        camera.lookAt(lookX, lookY, lookZ);
        return camera;
    }

    constructor(camera: PerspectiveCamera, lookAt: Vector3) {
        this.camera = camera;
        this.cameraLookAt.copy(lookAt);
    }

    setLookAt = (lookAtPos:Vector3)=>{
        this.cameraLookAt.copy(lookAtPos);
        this.camera.lookAt(lookAtPos);

        const cameraWorldDirection = new Vector3();
        this.camera.getWorldDirection(cameraWorldDirection);
        this.printVector("Camera World Direction", cameraWorldDirection);
    }


    readonly rotateAroundLookUpPoint = (angleInDegs: number, axis: Vector3) => {
        this.printVector("Look At", this.cameraLookAt)
        //1)Preciso pegar o vetor entre o foco e o olho, indo do foco pro olho.
        const cameraWorldDirection = new Vector3();
        const cameraWorldPosition = new Vector3();
        this.camera.getWorldDirection(cameraWorldDirection);
        this.printVector("Camera World Direction", cameraWorldDirection);
        this.camera.getWorldPosition(cameraWorldPosition);
        this.printVector("Camera World Position", cameraWorldPosition);
        const invertedNormalizedCameraDirectionVector = cameraWorldDirection.multiplyScalar(-1);
        const distanceBetweenLookAndCamera = cameraWorldPosition.sub(this.cameraLookAt).length();
        console.log("distance ", distanceBetweenLookAndCamera);
        const invertedCameraDirection = invertedNormalizedCameraDirectionVector
            .multiplyScalar(distanceBetweenLookAndCamera);
        //2)Rotaciono o vetor da posicao da camera
        invertedCameraDirection.applyAxisAngle(axis,
            angleInDegs * Math.PI / 180);
        //3)Altera o eye
        this.camera.position.copy(invertedCameraDirection);
        //4)Refaz o lookat com o novo vetor
        this.camera.lookAt(this.cameraLookAt)
        this.camera.updateMatrix();
    }

    printVector(text: string, vec: Vector3) {
        console.log(`${text}: ${vec.x}, ${vec.y}, ${vec.z}`);
    }
}