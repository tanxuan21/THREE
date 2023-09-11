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

import {
    getOptionFromUser,
    defaultOption
} from './StaticObjectScence/untils.js';
const scene = new StaticObjectScence(
    document.querySelector(".con1"),
    // undefined,
    (() => {
        const meshGroup = new THREE.Group();
        for (let i = 0; i < 2; i++) {
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(20, 20, 20),
                new THREE.MeshPhongMaterial({
                    color: 0xff00ff,
                })
            );
            meshGroup.add(cube);
            cube.position.set(50 * i - 250, 20, -100);
            cube.name = `Cube${i}`;
        }
        (new GLTFLoader()).load("../assets/concrete_cat_statue_4k.gltf/concrete_cat_statue_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 300;
            model.scale.set(bigger, bigger, bigger);
            StaticObjectScence.AddCard(model, undefined);
            StaticObjectScence.setMeshHightQualityRender(model);
            
            meshGroup.add(model);
        });
        (new GLTFLoader()).load("../assets/chess_set_4k.gltf/chess_set_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 500;
            model.scale.set(bigger, bigger, bigger);
            model.position.set(50, 0, 0)
            StaticObjectScence.AddCard(model, undefined);
            StaticObjectScence.setMeshHightQualityRender(model);
            meshGroup.add(model);
        });
        (new GLTFLoader()).load("../assets/brass_vase_03_4k.gltf/brass_vase_03_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 300;
            model.scale.set(bigger, bigger, bigger);
            model.position.set(100, 0, 100)
            StaticObjectScence.AddCard(model, undefined);
            StaticObjectScence.setMeshHightQualityRender(model);
            meshGroup.add(model);
        });
        (new GLTFLoader()).load("../assets/wood_floor_deck_4k/wood_floor_deck_4k.gltf", function (gltf) {
            const model = gltf.scene.children[0];
            const bigger = 30;
            model.scale.set(bigger, bigger, bigger);
            model.position.set(0, 30, 100)
            StaticObjectScence.AddCard(model, undefined);
            StaticObjectScence.setMeshHightQualityRender(model);
            meshGroup.add(model);
        });
        return meshGroup;
    })(),
    (function () {
        const lightGroup = new THREE.Group();
        const pointLight = new THREE.PointLight(0xffffff, 2, 0, .1);
        // 光源辅助观察
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 20);
        //点光源位置
        pointLight.position.set(100, 100, 10);
        
        console.log(pointLight.shadow);
        lightGroup.add(pointLight);
        lightGroup.add(pointLightHelper);
        //环境光:没有特定方向，整体改变场景的光照明暗
        const ambient = new THREE.AmbientLight(0xffffbb, .1);
        lightGroup.add(ambient);

        //光源也要设置投影
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.set(2 ** 12, 2 ** 12);
        pointLight.shadow.radius = 30;
        // pointLight.shadow.blurSamples = 1;
        pointLight.shadow.needsUpdate = true;

        return lightGroup;
    })(),
    (_this) => {
        _this.lightGroup.children.forEach((mesh) => {
            const time = Date.now() * 0.0005;
            mesh.position.set(Math.cos(time) * 100, 140, Math.sin(time) * 100);
        })

    },
    (_this) => {
        console.log("执行用户初始化.");
        _this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        _this.renderer.toneMappingExposure = .9;
        
        _this.renderQueue.push((_this) => {
            _this.objectGroup.children.forEach((mesh) => {
                //mesh.rotateZ(0.02);
            })
        })

    }, {
        showStats: true,
        pickmode: 1,
        pickShowoutline: true,
        cardmode: 1,
        outLine_option: {
            visibleEdgeColor: 0xffffff,
        },
        HDRurl: "../assets/blue_photo_studio_4k.exr",
        GUI: (_this) => {
            _this.guiParams = {
                "exposure": 1,
            }
            const gui = new GUI();
            gui.add(_this.guiParams, "exposure", 0, 20, 0.01).onChange((value) => {
                _this.renderer.toneMappingExposure = value;
            });
            return gui;
        }
    }
)

scene.render();