import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import {
    GUI
} from 'three/addons/libs/lil-gui.module.min.js';
import {
    StaticObjectScence
} from './StaticObjectScence/StaticObjectScence.js';
// 引入gltf模型加载库GLTFLoader.js
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

const scene = new StaticObjectScence(
    document.querySelector(".con1"),
    // undefined,
    (() => {
        const meshGroup = new THREE.Group();
        let geometry = new THREE.TorusKnotGeometry(18, 8, 150, 20);
        let material = new THREE.MeshStandardMaterial({
            metalness: .5,
            roughness: .2,
            envMapIntensity: 1.0
        });

        const torusMesh = new THREE.Mesh(geometry, material);
        meshGroup.add(torusMesh);

        (new GLTFLoader()).load("../assets/wood_floor_deck_4k/wood_floor_deck_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 30;
            model.scale.set(bigger, bigger, bigger);
            model.position.set(0, 0, 100)
            StaticObjectScence.AddCard(model, undefined);
            meshGroup.add(model);
        });
        (new GLTFLoader()).load("../assets/concrete_cat_statue_4k.gltf/concrete_cat_statue_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 300;
            model.scale.set(bigger, bigger, bigger);
            StaticObjectScence.AddCard(model, undefined);
            
            meshGroup.add(model);
        });
        (new GLTFLoader()).load("../assets/chess_set_4k.gltf/chess_set_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 500;
            model.scale.set(bigger, bigger, bigger);
            model.position.set(50, 0, 0)
            StaticObjectScence.AddCard(model, undefined);
            meshGroup.add(model);
        });
        (new GLTFLoader()).load("../assets/brass_vase_03_4k.gltf/brass_vase_03_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 300;
            model.scale.set(bigger, bigger, bigger);
            model.position.set(100, 0, 100)
            StaticObjectScence.AddCard(model, undefined);
            meshGroup.add(model);
        });

        return meshGroup;
    })(),
    (function () {
        const lightGroup = new THREE.Group();
        return lightGroup;
    })(),
    undefined,
    undefined, {
        openAxesHelper: true,
        showStats: true,
        showland: false,
        pickmode: 1,
        pickShowoutline: true,
        cardmode: 1,
        outLine_option: {
            visibleEdgeColor: 0xff9900,
        },
        HDRurl: "../assets/blue_photo_studio_4k.exr",
        GUI: (_this) => {
            _this.guiParams = {
                roughness: 0.0,
                metalness: 0.0,
                exposure: 1.0,
            };

            const gui = new GUI();
            gui.add(_this.guiParams, "exposure", 0, 20, 0.01).onChange((value) => {
                _this.renderer.toneMappingExposure = value;
            })
            gui.add(_this.guiParams, 'roughness', 0, 1, 0.01).onChange((value) => {
                _this.objectGroup.children[0].material.roughness = value;
            });
            gui.add(_this.guiParams, 'metalness', 0, 1, 0.01).onChange((value) => {
                _this.objectGroup.children[0].material.metalness = value;
            });
            return gui;

        }
    }
)

scene.render();