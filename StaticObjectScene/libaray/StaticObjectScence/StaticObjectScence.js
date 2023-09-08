// 静态物体场景
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
// 引入CSS2模型对象CSS2DObject
import {
    CSS2DObject
} from 'three/addons/renderers/CSS2DRenderer.js';
// 引入CSS2渲染器CSS2DRenderer
import {
    CSS2DRenderer
} from 'three/addons/renderers/CSS2DRenderer.js';

// 引入dat.gui.js的一个类GUI

import Stats from 'three/addons/libs/stats.module.js';
class StaticObjectScence {
    constructor(elment, obj = void 0, light = void 0, animation = () => {},userInit = ()=>{}, option = {},) {
        this.element = elment; // 场景挂载的元素
        if (!elment) {
            const body = document.querySelector("body");
            this.element = body;
            body.style.height = "100vh";
            body.style.width = "100vw";
        } else { // 如果是有元素的,记得设置定位为相对定位
            if (getComputedStyle(this.element).position !== "relative") {
                this.element.style.position = "relative";
            }

        }
        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.userInit = userInit;
        this.option = { // 场景选项卡
            showStats: option.showStats === undefined ? false : option.showStats, // 显示性能卡牌
            GUI: option.GUI ? option.GUI : () => {}, // GUI
            hightQualityRender: option.hightQualityRender === undefined ? true : option.hightQualityRender, // 高质量渲染
            allowPick: option.allowPick === undefined ? true : option.allowPick, // 允许选中物体
            openAxesHelper: option.openAxesHelper === undefined ? false : option.openAxesHelper, // 打开坐标显示器
            showland: option.showland === undefined ? true : option.showland, // 地面默认打开
            landTexture: option.landTexture === undefined ?
                (new THREE.TextureLoader()).load("data:image/jpeg;base64,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") : option.landTexture, // 默认加载棋盘格地面.
            background_color: option.background_color === undefined ? 0x000000 : option.background_color, // 背景颜色
            background_opacity: option.background_opacity === undefined ? 0 : option.background_opacity, // 背景透明度
            pickmode: option.pickmode === undefined ? 0 : option.pickmode, // 选择模式.为0只选中第一个.为其他值选中与一串
            pickAction: option.pickAction === undefined ? () => {} : option.pickAction, // 选择后的动作.注意,pickmode是0传递一个mesh,pickmode是其他值传递一个数组.
            createMeshCard: option.createMeshCard, // 创建mesh的标注卡片.参数是mesh本身.
        }

        this.animation = animation; // 动画函数

        this.objectGroup = obj; // 场景物体组
        this.lightGroup = light; // 场景灯光组
        this.helperGroup = new THREE.Group(); // 辅助对象组

        this.init(); // 初始化THREE对象
        // console.log(this);
    }
    init() {
        this.initScence();
        this.initLight();
        this.initMesh();
        this.initCamera();
        this.initRender();
        if (this.option.hightQualityRender) {
            this.Antialias();
        }
        if (this.option.pickmode !== -1) {
            this.PickerInit();
        }
        this.helperGroup
        this.initHelper();
        this.initRenderQueue();
        this.userInit(this);
    }
    initRenderQueue() {
        // 渲染队列
        this.renderQueue = [(_this) => {
            _this.renderer.render(_this.scene, _this.camera);
        }, (_this) => {
            _this.CSS2Renderer.render(_this.scene, _this.camera);
        }];
        if (this.option.showStats) {
            this.renderQueue.push((_this) => {
                _this.stats.update();
            })
        }
        if (this.animation) {
            this.renderQueue.push(this.animation);
        }
    }
    initScence() {
        this.scene = new THREE.Scene();
        // 默认添加地面

        if (this.option.showland) {
            const land = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshLambertMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide, //两面可见
                shadowSide: THREE.BackSide,
                map: this.option.landTexture,
            }));
            land.rotateX(-Math.PI / 2);
            land.receiveShadow = true;
            land.castShadow = true;
            this.environmentGroup = new THREE.Group();
            this.environmentGroup.name = "environmentGroup";
            this.environmentGroup.add(land);
            this.scene.add(this.environmentGroup);
        }


    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 1, 3000);
        this.camera.position.set(400, 400, 400);
        if (this.objectGroup) {
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        } else {
            this.camera.lookAt(this.mesh.position); //指向mesh对应的位置
        }

    }
    initMesh() {
        if (!this.objectGroup) {
            console.warn(this.element);
            console.warn("there's no THREE mesh object,expect param THREE Group object with THREE mesh object");
            const geometry = new THREE.BoxGeometry(100, 100, 100);
            //创建一个材质对象Material
            const material = new THREE.MeshBasicMaterial({
                color: 0xff0000, //0xff0000设置材质颜色为红色
                transparent: true, //开启透明
                opacity: 0.5, //设置透明度
            });
            // 两个参数分别为几何体geometry、材质material
            this.mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
            this.mesh.position.set(0, 10, 0);
            this.scene.add(this.mesh);
        } else {
            // 添加物体卡片
            for (let i = 0; i < this.objectGroup.children.length; i++) {
                StaticObjectScence.AddCard(this.objectGroup.children[i], this.option.createMeshCard);
            }
            this.scene.add(this.objectGroup);
        }

    }
    initLight() {
        
        if (this.lightGroup) {
            this.scene.add(this.lightGroup)
        } else {
            console.warn(this.element);
            console.warn("there's no THREE light object,expect param THREE Group object with THREE light object");
        }
    }
    initRender() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true, // 为了设置背景颜色
        });
        this.CSS2Renderer = new CSS2DRenderer(); // dom标签渲染器
        //渲染器使用阴影
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // PCF柔软阴影贴图
        //渲染器尺寸与挂载到dom
        this.renderer.setSize(this.width, this.height);
        this.CSS2Renderer.setSize(this.width, this.height);
        this.element.appendChild(this.renderer.domElement);
        const CSS2Element = this.CSS2Renderer.domElement;
        // 设置dom标签层
        CSS2Element.classList.add("ui-layer");
        this.element.appendChild(CSS2Element);
        // 设置相机控件轨道控制器OrbitControls
        this.OrbitControl = new OrbitControls(this.camera, this.renderer.domElement);
        // onresize 事件会在窗口被调整大小时发生
        ((_this) => {
            window.addEventListener("resize", function () {
                // 重置渲染器输出画布canvas尺寸
                _this.renderer.setSize(_this.element.clientWidth, _this.element.clientHeight);
                _this.CSS2Renderer.setSize(_this.element.clientWidth, _this.element.clientHeight);
                // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
                _this.camera.aspect = _this.element.clientWidth / _this.element.clientHeight;
                // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
                // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
                // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
                _this.camera.updateProjectionMatrix();
                _this.width = _this.element.clientWidth;
                _this.height = _this.element.clientHeight;
            })
        })(this);
        // 透明背景
        this.renderer.setClearColor(this.option.background_color, this.option.background_opacity);
        this.renderer.setClearAlpha(this.option.background_opacity);
    }
    initHelper() {
        if (this.option.showStats) {
            //创建stats对象
            this.stats = new Stats();
            //stats.domElement:web页面上输出计算结果,一个div元素，
            this.element.appendChild(this.stats.domElement);
            this.stats.domElement.style.position = "absolute";
        }
        if (this.option.openAxesHelper) {
            // AxesHelper：辅助观察的坐标系
            this.axesHelper = new THREE.AxesHelper(150);
            this.helperGroup.add(this.axesHelper);
            this.scene.add(this.helperGroup);
        }
        this.option.GUI(this)
    }
    Antialias() {
        this.renderer.antialias = true;
        //解决加载gltf格式模型纹理贴图和原图不一样问题
        //新版本，加载gltf，不需要执行下面代码解决颜色偏差
        //this.renderer.outputColorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间

        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    PickerInit() {
        this.mouse = {
            x: 0,
            y: 0,
        };
        // 绑定鼠标事件.
        ((_this) => {
            _this.element.addEventListener("click", function (event) {
                _this.mouse.x = event.offsetX / _this.width * 2 - 1;
                _this.mouse.y = -event.offsetY / _this.height * 2 + 1;
                _this.pick(_this);
            })
        })(this);
        // 选择器
        this.picker = new THREE.Raycaster();
    }
    pick(_this) {
        _this.picker.setFromCamera(new THREE.Vector2(_this.mouse.x, _this.mouse.y), _this.camera);
        const pickedObj = _this.picker.intersectObjects((_this.objectGroup === undefined || _this.objectGroup === null) ? [] : _this.objectGroup.children, false);
        if (pickedObj.length) {
            if (_this.option.pickmode === 0) {
                _this.option.pickAction(pickedObj[0].object);
            } else {
                _this.option.pickAction(pickedObj);
            }
        }

    }
    /* 静态方法:为某元素添加卡片标签.参数:
    /  @param {mesh} THREE网格对象
    /  @param {dom} 创建dom函数.返回dom元素.参数是mesh.
    /  如果mesh本来就有卡片(在这个类里对应在object里就创建好了卡片的情况.),那么就不添加.
    /    mesh没有卡片,根据createdom函数创建
    */
    static AddCard(mesh, createdom, ) {
        let cardElement;
        const name = mesh.name ? mesh.name + "-card" : mesh.id + "-card";
        if (createdom === undefined) {
            cardElement = document.createElement('div');
            if (!mesh.name) {
                cardElement.innerHTML = `<span>ObjectID:${mesh.id}</span>`;
            } else {
                cardElement.innerHTML = `<span>${mesh.name}</span>`;
            }
            cardElement.classList.add("card");
            cardElement.style.transform = "scale(.1)";
            cardElement.style.pointerEvents = "auto"; // 这个让标签可以响应鼠标事件.
        } else {
            // 没有卡片
            if (!mesh.getObjectByName(name)) {
                cardElement = createdom(mesh);
            }

        }
        const card = new CSS2DObject(cardElement);
        card.name = name;
        mesh.add(card);
    }
    render() {
        ((_this) => {
            const render = () => {
                _this.renderQueue.forEach((item) => {
                    item(_this);
                })
                requestAnimationFrame(render);
            };
            requestAnimationFrame(render);
        })(this);
    }
}
export {
    StaticObjectScence
};