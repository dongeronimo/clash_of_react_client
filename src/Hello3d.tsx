import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import * as React from 'react';
import {
    AmbientLight,
    BoxBufferGeometry, Camera,
    Fog,
    GridHelper,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight, Quaternion,
    Scene,
    SpotLight, Vector3, ConeGeometry, MeshBasicMaterial, Matrix4, Euler,Group
} from 'three';
import {View} from "react-native";
import CameraService from "./services/CameraService";
import RendererService from "./services/RendererService";
import TurnOnTurnOffButton from "./view/testes/TurnOnTurnOffButton";
import TestRotateAroundLookAtButton from "./view/testes/TestRotateAroundLookAtButton";
import TestChangeLookAtButton from "./view/testes/ChangeLookAtButton";


export default function Hello3d() {
  const [isRendering, setIsRendering] = React.useState<boolean>(false);
  const [cameraService, setCameraService] = React.useState<CameraService|null>(null);
  const [lookAt, setLookAt] = React.useState<Vector3>(new Vector3());

  let cube:IconMesh;
  let cone:ConeMesh
  //let cameraService: CameraService;
  let timeout:any;
  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  let camera:PerspectiveCamera;

  function printVector(text:string, vec:Vector3){
      console.log(`${text}: ${vec.x}, ${vec.y}, ${vec.z}`);
  }

  return (
      <View>
          <View style={{ height:22}}/>
          <View style={{display:'flex', flexDirection:'row'}}>
                  <TurnOnTurnOffButton isRendering={isRendering} timeout={timeout} setRendering={setIsRendering}/>
                  <TestRotateAroundLookAtButton isRendering={isRendering} cameraService={cameraService!!} lookAt={lookAt}/>
                  <TestChangeLookAtButton isRendering={isRendering} cameraService={cameraService!!} lookAt={lookAt} setLookAt={setLookAt}/>
          </View>
          {isRendering &&
          <GLView
              style={{  backgroundColor:'green', height:400}}
              onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
                  const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
                  const renderer = RendererService.createRenderer(gl, width, height);
                  camera = CameraService.createCamera(2,5,5, 0,0,0,width, height);
                  setCameraService(new CameraService(camera, new Vector3(0,0,0)))
                  setLookAt(new Vector3(0,0,0));
                  const scene = new Scene();
                  scene.fog = new Fog(RendererService.SCENE_COLOR, 1, 10000);
                  scene.add(new GridHelper(10, 10));

                  const ambientLight = new AmbientLight(0x101010);
                  scene.add(ambientLight);

                  const pointLight = new PointLight(0xffffff, 2, 1000, 1);
                  pointLight.position.set(0, 200, 200);
                  scene.add(pointLight);

                  const spotLight = new SpotLight(0xffffff, 0.5);
                  spotLight.position.set(0, 500, 100);
                  spotLight.lookAt(scene.position);
                  scene.add(spotLight);
                  
                  cube = new IconMesh();
                  //scene.add(cube);

                  cone = new ConeMesh();
                  //scene.add(cone);

                  cone.position.set(3,0,0);
                  
                  const myGroup = new Group();
                  myGroup.add(cube)
                  myGroup.add(cone);

                  scene.add(myGroup);
                  // cone.matrix.lookAt(new Vector3(0,0,100), cube.position, new Vector3(0,1,0))
                  // cone.updateMatrix()

                  function update() {
                    myGroup.rotation.y += 0.05
                    myGroup.position.x += 0.01
                      //  cube.rotation.y += 0.05;
                      //  cube.rotation.x += 0.025;
                  }

                  // Setup an animation loop
                  const render = () => {
                      timeout = requestAnimationFrame(render);
                      update();
                      renderer.render(scene, camera);
                      gl.endFrameEXP();
                  };
                  render();
              }}
          />}
      </View>

  );
}
class ConeMesh extends Mesh {
  constructor(){
    super( 
      new ConeGeometry(0.2, 0.6, 16), // 0.5, 0.4, 16),
      new MeshStandardMaterial({
        //map: new TextureLoader().load(require('./assets/icon.png')),
         color: 0xffff00
      }));
      // this.applyMatrix4(new Matrix4().makeRotationFromEuler(new Euler(
      //   0*Math.PI/180,
      //   0*Math.PI/180,
      //   90*Math.PI/180))) //new Vector3(Math.PI / 2, Math.PI, 0)))
  }
}
class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(0.5, 0.5, 0.5),
      new MeshStandardMaterial({
        //map: new TextureLoader().load(require('./assets/icon.png')),
         color: 0xff0000
      })
    );
  }
}