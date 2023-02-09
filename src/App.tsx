import * as THREE from 'three'
import React, {Suspense, useEffect, useRef, useState} from 'react';
import './App.css';
import {Canvas, ThreeElements, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls, Text3D} from "@react-three/drei";
import {TextureLoader} from 'three/src/loaders/TextureLoader'
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
// @ts-ignore
import Roboto from './Roboto-Regular.ttf';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Button, Typography} from "@mui/material";
import {off, onChildAdded, ref, update} from "firebase/database";
import {fbDatabase} from "./firebaseApp";


const rows: GridRowsProp = [
    {id: 1, x: 0, y: 0, z: 0, time: new Date().toLocaleString(), timestamp: Date.now()},
    {id: 2, x: 0, y: 0, z: 0, time: new Date().toLocaleString(), timestamp: Date.now()},
    {id: 3, x: 0, y: 0, z: 0, time: new Date().toLocaleString(), timestamp: Date.now()},
    {id: 4, x: 0, y: 0, z: 0, time: new Date().toLocaleString(), timestamp: Date.now()},
    {id: 5, x: 0, y: 0, z: 0, time: new Date().toLocaleString(), timestamp: Date.now()},

];
const columns: GridColDef[] = [
    {field: 'x', headerName: 'X Coordinate', flex: 1},
    {field: 'y', headerName: 'Y Coordinate', flex: 1},
    {field: 'z', headerName: 'Z Coordinate', flex: 1},
    {field: 'time', headerName: 'Datetime', flex: 1},
    {field: 'timestamp', headerName: 'Timestamp', flex: 1},
];

function WallPlane(props: ThreeElements['mesh']) {

    return (
        <mesh {...props}>
            <boxGeometry args={[20, 4, 1]}/>
            <meshStandardMaterial color={'hotpink'}/>
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

const Box = ({x, y, z}: THREE.Vector3) => {
    const ref = useRef<THREE.Mesh>(null!)
    const vec = new THREE.Vector3(x, y, z);
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    const [waitFlag, setWaitFlag] = useState(false)
    useEffect(() => {
        setWaitFlag(true)
    }, [])
    useFrame((state, delta) => (ref.current.position.lerp(vec, 0.1)))

    // @ts-ignore
    return (
        <Suspense>
            <mesh
                ref={ref}
                scale={clicked ? 1.5 : 1}
                onClick={(event) => click(!clicked)}
                onPointerOver={(event) => hover(true)}
                onPointerOut={(event) => hover(false)}>
                <meshStandardMaterial color={hovered ? 'hotpink' : 'darkgrey'}/>
                {/*{waitFlag && <ChowChowModel/>}*/}
                {waitFlag && <boxGeometry args={[1, 1, 1]} />}
                {/* @ts-ignore*/}
                <Text3D font={'helvetiker_bold.typeface.json'} position={[-1, 1, 0]} bevelEnabled bevelSize={0.05}>
                    {x},{z}
                    <meshStandardMaterial color='#d1924e'/>
                </Text3D>
            </mesh>
        </Suspense>
    )
}

const ShibaModel = () => {
    const gltf = useLoader(GLTFLoader, "shiba/scene.gltf");
    return (
        <Suspense fallback={null}>
            <primitive object={gltf.scene} scale={2}/>
        </Suspense>
    );
};
const CatModel = () => {
    const gltf = useLoader(GLTFLoader, "cat/toon_cat_free.glb");
    // Here's the animation part
    // *************************
    let mixer: THREE.AnimationMixer
    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play();
        });
    }

    useFrame((state, delta) => {
        mixer?.update(delta)
    })
    // *************************
    return (
        <Suspense fallback={null}>
            <primitive object={gltf.scene} scale={0.008} position={[0, -2, 0]}/>
        </Suspense>
    );
};
const ChowChowModel = () => {
    const gltf = useLoader(GLTFLoader, "chowchow/chowchow_dog.glb");
    // Here's the animation part
    // *************************
    let mixer: THREE.AnimationMixer
    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip)
            action.play();
        });
    }

    useFrame((state, delta) => {
        mixer?.update(delta)
    })
    // *************************
    console.log(gltf)
    return (
        <>
            <primitive object={gltf.scene} scale={3} position={[0, -2, 0]}/>
        </>
    );
};
// @ts-ignore
const PawPrintModel = ({coordinates, text}) => {
    const gltf = useLoader(GLTFLoader, "paw_print/scene.gltf");
    const ref = useRef<THREE.Mesh>(null!)

    useEffect(() => {//@ts-ignore
        gltf.materials[Object.keys(gltf.materials)[0]].color = new THREE.Color(0.51, 0.373, 0.204)
    }, [])
    //@ts-ignore
    console.log(gltf)
    const vec = new THREE.Vector3(coordinates.x, -2,coordinates.z);
    const [waitFlag, setWaitFlag] = useState(false)
    useEffect(() => {
        setWaitFlag(true)
    }, [])
    useFrame((state, delta) => (ref.current.position.lerp(vec, 0.1)))

    return (
        <Suspense>
            <mesh ref={ref}>
                <primitive ref={ref} object={gltf.scene} scale={0.03}  rotation={[Math.PI/2,0,Math.PI]}/>
                {/*@ts-ignore*/}
            </mesh>
        </Suspense>
    );
};

// @ts-ignore
const PawPrintModel2 = ({coordinates, text}) => {
    const gltf = useLoader(GLTFLoader, "paw_print/scene.gltf");
    const ref = useRef<THREE.Mesh>(null!)

    useEffect(() => {//@ts-ignore
        gltf.materials[Object.keys(gltf.materials)[0]].color = new THREE.Color(0.51, 0.373, 0.204)
    }, [])
    //@ts-ignore
    console.log(gltf)
    const vec = new THREE.Vector3(coordinates.x, -2,coordinates.z);
    const [waitFlag, setWaitFlag] = useState(false)
    useEffect(() => {
        setWaitFlag(true)
    }, [])
    useFrame((state, delta) => (ref.current.position.lerp(vec, 0.1)))

    return (
        <Suspense>
            <mesh ref={ref}>
                <primitive ref={ref} object={gltf.scene} scale={0.03}  rotation={[Math.PI/2,0,Math.PI]}/>
                {/*@ts-ignore*/}
            </mesh>
        </Suspense>
    );
};

function App() {
    const [coordinates, setCoordinates] = useState([0, 0, 0])
    const [coordList, setCoordList] = useState(rows)
    const [pauseFlag, setPauseFlag] = useState(false)
    const [fbCoords, setFBCoords] = useState([0, 0, 0])
    const [fbCoordList, setFBCoordList] = useState(rows)

    const [firebaseFlag, setFirebaseFlag] = useState(false)

    function pauseMock() {
        console.log('pausing mock data')
        setPauseFlag(!pauseFlag);
    }

    function toggleFirebaseMock() {
        setFirebaseFlag(!firebaseFlag);
    }

    function writeMockData() {
        const timestamp = Date.now()
        const coordinates = Array.from({length: 3}, (element, index) => {
            if (index === 1)
                return 0;
            else
                return Math.floor(Math.random() * 10)
        })
        update(ref(fbDatabase, 'mock/' + 'mockData'), {[timestamp]: coordinates});
    }

    function resetMock() {
        console.log('clearing mock data')
        setCoordList(rows);
        setCoordinates([0, 0, 0])
    }

    useEffect(() => {
        const mockRef = ref(fbDatabase, `/mock/mockData`);
        onChildAdded(mockRef, (snapshot) => {
            const data = snapshot.val();
            const timestamp = Number(snapshot.key!);
            const newRow = {
                x: data[0],
                y: data[1],
                z: data[2],
                timestamp: timestamp,
                time: new Date(timestamp).toLocaleString(),
                id: Math.random().toString(16).slice(2)

            }
            setFBCoords(data)
            setFBCoordList(oldArr => [newRow, ...oldArr])
        })

        return () => {
            off(mockRef)
        }

    }, [])
    useEffect(() => {
        const interval = setInterval(() => {
            if (firebaseFlag)
                writeMockData();
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [firebaseFlag])
    useEffect(() => {
        const interval = setInterval(() => {
            const newArr = Array.from({length: 3}, (element, index) => {
                if (index === 1)
                    return 0;
                else
                    return Math.floor(Math.random() * 10)
            })
            const newRow = {
                x: newArr[0],
                y: newArr[1],
                z: newArr[2],
                timestamp: Date.now(),
                time: new Date().toLocaleString(),
                id: Math.random().toString(16).slice(2)
            }
            if (pauseFlag === false) {
                setCoordinates(newArr)
                setCoordList(oldArr => [newRow, ...oldArr]);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [pauseFlag]);
    return (

        <div className='App' style={{width: "100vw", height: "100vh"}}>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <Typography variant="h4">
                    FYP Location Tracking Visualisation
                </Typography>
                <div>
                    <Button style={{margin: '3px'}} variant="contained" onClick={resetMock}>Reset</Button>
                    <Button style={{margin: '3px'}} variant="contained" onClick={toggleFirebaseMock}>Mock
                        Firebase</Button>
                    <Button style={{margin: '3px'}} variant="contained"
                            onClick={pauseMock}>{pauseFlag ? 'Resume Mock' : 'Pause Mock'}</Button>
                </div>


            </div>
            <div style={{width: "100vw", height: "93vh", display: 'flex'}}>
                <div style={{width: '50%', overflowWrap: 'break-word',}}>
                    <DataGrid rows={firebaseFlag ? fbCoordList : coordList} columns={columns}
                              components={{Toolbar: GridToolbar}}/>
                </div>

                <div style={{flexGrow: 1}}><Canvas style={{backgroundColor: "pink"}}
                                                   camera={{position: [15, 10, 5], rotation: [1, 1, 1]}}>
                    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true}/>
                    <ambientLight/>
                    <pointLight position={[10, 10, 10]}/>
                    {/*@ts-ignore*/}
                    <Box x={firebaseFlag ? fbCoords[0] : coordinates[0]} y={firebaseFlag ? fbCoords[1] : coordinates[1]}
                         z={firebaseFlag ? fbCoords[2] : coordinates[2]}/>
                    {/*<PawPrintModel coordinates={firebaseFlag?fbCoordList[1] : coordList[1] } text={'1'}/>*/}
                    <WallPlane position={[-10.5, 0, 6]} rotation={[0, 3.14 / 2, 0]}/>
                    <WallPlane position={[10.5, 0, 6]} rotation={[0, 3.14 / 2, 0]}/>
                    <WallPlane position={[0, 0, -4.5]} rotation={[0, 0, 0]}/>
                    <FloorPlane position={[0, -2.5, 6]} rotation={[3.14 / 2, 0, 0]}/>
                </Canvas></div>

            </div>
        </div>
    );
}

export default App;
