import * as THREE from 'three'
import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Canvas, ThreeElements, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {TextureLoader} from 'three/src/loaders/TextureLoader'


function WallPlane(props: ThreeElements['mesh']) {

    return (
        <mesh {...props}>
            <boxGeometry args={[20, 4, 1]}/>
            <meshStandardMaterial color={'grey'}/>
        </mesh>
    );
}

function FloorPlane(props: ThreeElements['mesh']) {
    const colorMap = useLoader(TextureLoader, 'grid_texture.png')

    return (
        <mesh {...props}>
            <boxGeometry args={[20, 20, 1]}/>
            <meshStandardMaterial map={colorMap}/>
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
    const [coordinates, setCoordinates] = useState([0, 0, 0])
    useEffect(() => {
        const interval = setInterval(() => setCoordinates(Array.from({length: 3}, (element, index) => {
            if (index ===1)
                return 0;
            else
                return Math.floor(Math.random() * 5)
        })), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div className="App" style={{width: "100vw", height: "100vh"}}>
            <div>Real-time coordinates: {coordinates.toString()}</div>
            <Canvas style={{backgroundColor: "pink"}} camera={{position: [0, 0, 5], rotation: [0, 2, 0]}}>
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true}/>
                <ambientLight/>
                <pointLight position={[10, 10, 10]}/>
                {/*@ts-ignore*/}
                <Box position={coordinates}/>
                <WallPlane position={[-10, 0, 6]} rotation={[0, 3.14 / 2, 0]}/>
                <WallPlane position={[10, 0, 6]} rotation={[0, 3.14 / 2, 0]}/>
                <WallPlane position={[0, 0, -4]} rotation={[0, 0, 0]}/>
                <FloorPlane position={[0, -2, 6]} rotation={[3.14 / 2, 0, 0]}/>

            </Canvas>
        </div>
    );
}

export default App;
