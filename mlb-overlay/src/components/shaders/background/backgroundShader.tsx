import ShaderToyCanvas from "../shadertoyCanvas/shadertoyCanvas";
import shaderString from "./backgroundShader.glsl?raw";
const BackgroundShader = () => {
    return (
        <ShaderToyCanvas
            fragmentShader={shaderString}
            width={window.innerWidth}
            height={window.innerHeight}
        />
    )
}
export default BackgroundShader;