import {ExpoWebGLRenderingContext} from "expo-gl";
import {Renderer} from "expo-three";

export default class RendererService{
    static readonly SCENE_COLOR = 0x6ad6f0;
    static createRenderer(gl: ExpoWebGLRenderingContext,
                          width:number,
                          height:number):Renderer{
        const renderer = new Renderer({gl});
        renderer.setSize(width, height);
        renderer.setClearColor(this.SCENE_COLOR);
        return renderer;
    }
}