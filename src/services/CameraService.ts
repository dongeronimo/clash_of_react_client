import {PerspectiveCamera, Quaternion, Vector3} from "three";

export default class CameraService {
    readonly cameraWorldPosition = new Vector3();
    readonly cameraWorldDirection = new Vector3();
    readonly cameraLookAt = new Vector3();
    readonly vUp = new Vector3();
    readonly vRight = new Vector3();
    readonly cameraQuaternion = new Quaternion();
    readonly camera: PerspectiveCamera;

    static createCamera(eyeX:number, eyeY:number, eyeZ:number, lookX:number, lookY:number, lookZ:number,
                        width:number, height:number):PerspectiveCamera{
        const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
        camera.position.set(eyeX, eyeY, eyeZ);
        camera.lookAt(lookX, lookY, lookZ);

        return camera;
    }

    printVector(text: string, vec: Vector3) {
        console.log(`${text}: ${vec.x}, ${vec.y}, ${vec.z}`);
    }

    constructor(camera: PerspectiveCamera, lookAt: Vector3) {
        this.camera = camera;
        this.updateInnerState();
    }

    setLookAt = (lookAtPos:Vector3)=>{
        this.cameraLookAt.copy(lookAtPos);
        this.camera.lookAt(lookAtPos);
        this.camera.updateMatrix();
        this.updateInnerState();
    }

    private updateInnerState = () => {
        this.camera.getWorldPosition(this.cameraWorldPosition);
        this.camera.getWorldDirection(this.cameraWorldDirection);
        this.cameraQuaternion.copy(this.camera.quaternion);
        this.cameraLookAt.copy(this.cameraLookAt);
        this.setVRight();
        this.setVUp();
    }

    readonly rotateAroundLookUpPoint = (angleInDegs: number, axis: Vector3) => {
        //1)Preciso pegar o vetor entre o foco e o olho, indo do foco pro olho.
        const invertedNormalizedCameraDirectionVector = this.cameraWorldDirection.multiplyScalar(-1);
        const distanceBetweenLookAndCamera = this.cameraWorldPosition.sub(this.cameraLookAt).length();
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
        this.updateInnerState();
    }

    private setVUp() {
        this.vUp.set(0, 1, 0);
        this.vUp.applyQuaternion(this.cameraQuaternion);
    }

    private setVRight() {
        this.vRight.set(1, 0, 0);
        this.vRight.applyQuaternion(this.cameraQuaternion);
    }


}