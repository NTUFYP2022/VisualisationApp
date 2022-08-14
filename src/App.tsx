import * as THREE from 'three'
import React, {useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Canvas, ThreeElements, useFrame, useThree} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";

function WallPlane(props: ThreeElements['mesh']) {

    return (
        <mesh {...props}>
            <planeGeometry args={[4, 4]}/>
            <meshStandardMaterial color={'hotpink'}/>
        </mesh>
    );
}

function Box(props: ThreeElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!)
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    useFrame((state, delta) => (ref.current.rotation.x += 0.01))
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
        </mesh>
    )
}

function deg2rad(number: number) {
    return number * (Math.PI / 180);
}

function App() {
    return (
        <div className="App"  style={{ width: "100vw", height: "100vh" }}>
                <Canvas style={{backgroundColor:"pink"}} camera={{position: [0, 0, 5], rotation:[0,2,0]}}>
                    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                    <ambientLight/>
                    <pointLight position={[10, 10, 10]}/>
                    <Box position={[-1.2, 0, 0]}/>
                    <Box position={[1.2, 0, 0]}/>
                    <WallPlane position={[-2, 0,-2]} rotation={[0,3.14/4,0]}/>
                    <WallPlane position={[4, 0,-2]} rotation={[0,3.14/4,0]}/>
                    <WallPlane position={[1 , 0,-4]} rotation={[0,0 ,0]}/>
                </Canvas>
        </div>
    );
}

export default App;
