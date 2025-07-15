import React, { useEffect, useRef } from 'react';

interface ShaderToyCanvasProps {
    fragmentShader: string;
    width?: number;
    height?: number;
    uniforms?: { [key: string]: any };
}

const ShaderToyCanvas: React.FC<ShaderToyCanvasProps> = ({
    fragmentShader,
    width = 800,
    height = 600,
    uniforms = {}
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const animationFrameRef = useRef<number>(0);

    const vertexShaderSource = `
        attribute vec4 position;
        void main() {
            gl_Position = position;
        }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    };

    const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
        const program = gl.createProgram();
        if (!program) return null;
        
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        
        return program;
    };

    const render = () => {
        const gl = glRef.current;
        const program = programRef.current;
        
        if (!gl || !program) return;

        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);
        
        // Set uniforms
        const timeLocation = gl.getUniformLocation(program, 'iTime');
        const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
        
        if (timeLocation) {
            gl.uniform1f(timeLocation, performance.now() / 1000);
        }
        
        if (resolutionLocation) {
            gl.uniform3f(resolutionLocation, width, height, 1.0);
        }

        // Set custom uniforms
        Object.entries(uniforms).forEach(([name, value]) => {
            const location = gl.getUniformLocation(program, name);
            if (location) {
                if (typeof value === 'number') {
                    gl.uniform1f(location, value);
                } else if (Array.isArray(value)) {
                    if (value.length === 2) gl.uniform2f(location, value[0], value[1]);
                    else if (value.length === 3) gl.uniform3f(location, value[0], value[1], value[2]);
                    else if (value.length === 4) gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                }
            }
        });
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        animationFrameRef.current = requestAnimationFrame(render);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        glRef.current = gl;

        // Create vertex shader
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        if (!vertexShader) return;

        // Wrap fragment shader with ShaderToy compatibility
        const wrappedFragmentShader = `#version 100
            precision mediump float;
            uniform float iTime;
            uniform vec3 iResolution;
            ${Object.keys(uniforms).map(name => `uniform float ${name};`).join('\n')}
            
            ${fragmentShader}
            
            void main() {
                mainImage(gl_FragColor, gl_FragCoord.xy);
            }
        `;

        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, wrappedFragmentShader);
        if (!fragShader) return;

        // Create program
        const program = createProgram(gl, vertexShader, fragShader);
        if (!program) return;

        programRef.current = program;

        // Create vertex buffer for fullscreen quad
        const vertices = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.clearColor(0, 0, 0, 1);

        // Start render loop
        render();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [fragmentShader, width, height, uniforms]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
        />
    );
};

export default ShaderToyCanvas;