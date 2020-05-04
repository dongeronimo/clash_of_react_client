import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
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
    SpotLight, Vector3,
} from 'three';
import {TouchableHighlight, View, Text, TouchableOpacity} from "react-native";
import CameraService from "./services/CameraService";
import RendererService from "./services/RendererService";


export default function Hello3d() {
  const [isRendering, setIsRendering] = React.useState<boolean>(false);
  const testeRotationAxis = new Vector3(0,1,0);
  let cameraService:CameraService;
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
                  <TouchableOpacity onPress={()=>{
                      console.log(`is rendering:${!isRendering}`)
                      clearTimeout(timeout);
                      setIsRendering(!isRendering);
                  }}>
                      <View style={{padding:4, margin:2, backgroundColor:'beige', }}>
                          <Text>{isRendering?"Turn Off":"Turn On"}</Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{
                      if(isRendering){
                          cameraService.rotateAroundLookUpPoint(5, testeRotationAxis);
                      }
                  }}>
                      <View style={{padding:4, margin:2, backgroundColor:'beige', }}>
                          <Text>Rotate around look at</Text>
                      </View>
                  </TouchableOpacity>
          </View>
          {isRendering &&
          <GLView
              style={{  backgroundColor:'green', height:400}}
              onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
                  const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
                  const renderer = RendererService.createRenderer(gl, width, height);
                  camera = CameraService.createCamera(2,5,5, 0,0,0,width, height);
                  cameraService = new CameraService(camera, new Vector3(0,0,0));
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

                  const cube = new IconMesh();
                  scene.add(cube);

                  function update() {
                      cube.rotation.y += 0.05;
                      cube.rotation.x += 0.025;
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

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        //map: new TextureLoader().load(require('./assets/icon.png')),
         color: 0xff0000
      })
    );
  }
}