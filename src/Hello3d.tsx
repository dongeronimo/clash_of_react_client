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


export default function Hello3d() {
  const [isRendering, setIsRendering] = React.useState<boolean>(false);
  let timeout:any;
  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);
  function createRenderer(gl: ExpoWebGLRenderingContext, width:number, height:number, sceneColor:number):Renderer{
    const renderer = new Renderer({gl});
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);
    return renderer;
  }
  //Os vetores e pontos da camera.
  const cameraWorldPosition = new Vector3();
  const cameraWorldDirection = new Vector3();
  const cameraLookAt = new Vector3();
  const vUp = new Vector3();
  const vRight = new Vector3();
  const cameraQuaternion = new Quaternion();
  let camera:PerspectiveCamera;
  //Cria a camera e seta os vetores com os valores iniciais
  function createCamera(eyeX:number, eyeY:number, eyeZ:number, lookX:number, lookY:number, lookZ:number,
                        width:number, height:number):PerspectiveCamera{
      const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
      camera.position.set(eyeX, eyeY, eyeZ);
      camera.lookAt(lookX, lookY, lookZ);

      cameraWorldPosition.set(eyeX, eyeY, eyeZ);
      camera.getWorldDirection(cameraWorldDirection);
      cameraLookAt.set(lookX, lookY, lookZ);
      camera.getWorldQuaternion(cameraQuaternion);
      setVUp();
      setVRight();
      return camera;
  }
  function setVUp(){
      vUp.set(0,1,0);
      vUp.applyQuaternion(cameraQuaternion);
  }
  function setVRight(){
      vRight.set(1,0,0);
      vRight.applyQuaternion(cameraQuaternion);
  }
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
                          camera.position.set(5,5,5);
                          camera.updateMatrix();
                      }
                  }}>
                      <View style={{padding:4, margin:2, backgroundColor:'beige', }}>
                          <Text>Run Test</Text>
                      </View>
                  </TouchableOpacity>
          </View>
          {isRendering &&
          <GLView
              style={{  backgroundColor:'green', height:400}}
              onLayout={(layout)=>{
                 console.log("onLayout", layout)
              }}
              onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
                  console.log("onContextCreate")
                  const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
                  const sceneColor = 0x6ad6f0;
                  const renderer = createRenderer(gl, width, height, sceneColor);
                  camera = createCamera(2,5,5, 0,0,0,width, height);

                  const scene = new Scene();
                  scene.fog = new Fog(sceneColor, 1, 10000);
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
                      camera.getWorldPosition(cameraWorldPosition);
                      camera.getWorldDirection(cameraWorldDirection);
                      camera.getWorldQuaternion(cameraQuaternion);

                      // printVector("camera world position", cameraWorldPosition);
                      // printVector("camera world direction", cameraWorldDirection);
                      // printVector("camera look at", cameraLookAt);
                      // printVector("view up", vUp);
                      // printVector("view right", vRight);
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