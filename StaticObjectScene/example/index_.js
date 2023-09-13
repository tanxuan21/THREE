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
} from './StaticObjectScence/untils/untils.js';
import
RefractionMaterial
from './StaticObjectScence/shader/reflectionMaterial.js';

function makeRefractionMaterial() {
    var mat = new THREE.MeshBasicMaterial( { 
            color: 0xffffff,
            
            refractionRatio: .8
               // The refractionRatio must have value in the range 0 to 1.
               // The default value, very close to 1, give almost invisible glass.
      } );
    if (1)
       mat.reflectivity = .99; // determines the fraction of light that is transmitted
    console.log(mat);
    return mat;
}


const scene = new StaticObjectScence(
    document.querySelector(".con1"),

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

        // 创建材质
        const glassMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            //transparent: true, // 透明度设置为 true
            //opacity: .3, // 设置透明度
            // roughness: 0,
            // metalness: 0,
            //envMapIntensity: 1,
            // flatShading:true,
            //transmission: 0.95, // 折射度，表示光线经过材料时的衰减程度
            //clearcoat: 1,
            //clearcoatRoughness: 0,
            refractionRatio: .3, // 折射率，控制光的折射程度
            reflectivity:2,
        });
        const size = {
            width:500,height:700,
        };
        const ratio = 100;
        // const glassMaterial = new RefractionMaterial({
        //     envMap: new THREE.WebGLRenderTarget(size.width * ratio, size.height * ratio),
        //     backfaceMap: new THREE.WebGLRenderTarget(size.width * ratio, size.height * ratio),
        //     resolution: [size.width * ratio, size.height * ratio],
        //   });
        // 创建物体
        const glassGeometry = new THREE.SphereGeometry(10, 20, 20);
        const glass = new THREE.Mesh(glassGeometry, makeRefractionMaterial());
        StaticObjectScence.setMeshHightQualityRender(glass);
        glass.position.set(50, 0, 50);
        meshGroup.add(glass);
        // https://fiime.cn/blog/331840 折射

        // (new GLTFLoader()).load("../assets/chess_set_4k.gltf/chess_set_4k.gltf", function (gltf) {
        //     const model = gltf.scene.children[0];
        //     const bigger = 500;
        //     model.scale.set(bigger, bigger, bigger);
        //     model.position.set(50, 0, 0)
        //     StaticObjectScence.AddCard(model, undefined);
        //     StaticObjectScence.setMeshHightQualityRender(model);
        //     meshGroup.add(model);
        // });
        // (new GLTFLoader()).load("../assets/brass_vase_03_4k.gltf/brass_vase_03_4k.gltf", function (gltf) {
        //     const model = gltf.scene.children[0];
        //     const bigger = 300;
        //     model.scale.set(bigger, bigger, bigger);
        //     model.position.set(100, 0, 100)
        //     StaticObjectScence.AddCard(model, undefined);
        //     StaticObjectScence.setMeshHightQualityRender(model);
        //     meshGroup.add(model);
        // });
        // (new GLTFLoader()).load("../assets/wood_floor_deck_4k/wood_floor_deck_4k.gltf", function (gltf) {
        //     const model = gltf.scene.children[0];
        //     const bigger = 30;
        //     model.scale.set(bigger, bigger, bigger);
        //     model.position.set(0, 30, 100)
        //     StaticObjectScence.AddCard(model, undefined);
        //     StaticObjectScence.setMeshHightQualityRender(model);
        //     meshGroup.add(model);
        // });
        return meshGroup;
    })(),
    (function () {
        const lightGroup = new THREE.Group();
        const pointLight = new THREE.PointLight(0xffffff, 2, 0, .1);
        // 光源辅助观察
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 20);
        //点光源位置
        pointLight.position.set(100, 100, 10);

        
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
        showland: false,
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