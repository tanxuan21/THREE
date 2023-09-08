import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js

import {
    StaticObjectScence
} from './StaticObjectScence/StaticObjectScence.js';

const scene = new StaticObjectScence(
    undefined,
    (() => {
        const meshGroup = new THREE.Group();
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshPhongMaterial({
                color: 0xff00ff,
            })
        );
        meshGroup.add(cube);
        return meshGroup;
    })(),
    (function () {
        const lightGroup = new THREE.Group();
        const pointLight = new THREE.PointLight(0xffffff, 2, 0, 0);
        // 光源辅助观察
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 20);
        //点光源位置
        pointLight.position.set(100, 100, 10);
        lightGroup.add(pointLight);
        lightGroup.add(pointLightHelper);
        //环境光:没有特定方向，整体改变场景的光照明暗
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        lightGroup.add(ambient);

        //光源也要设置投影
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.set(2 ** 11, 2 ** 11);
        pointLight.shadow.radius = 3;
        return lightGroup;
    })(),
    (_this)=>{
        _this.objectGroup.children.forEach((mesh)=>{
            mesh.rotateX(0.03);
        })
    },
    (_this) => {
        console.log("执行用户初始化.");
        console.log(_this);
        _this.renderQueue.push((_this)=>{
            _this.objectGroup.children.forEach((mesh)=>{
                mesh.rotateZ(0.2);
            })
        })
    },{
        showStats:true,
        pickmode:0,
        pickAction:(mesh)=>{
            mesh.children[0].element.classList.add( "card-selected");
            mesh.rotateY(Math.PI/3)
        }
    }
)

scene.render();