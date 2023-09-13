// 静态物体场景
import * as THREE from 'three';
import {
    EXRLoader
} from 'three/addons/loaders/EXRLoader.js';
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

import * as AfterEffect from './untils/AfterEffect.js';
import Stats from 'three/addons/libs/stats.module.js';
import {
    getOptionFromUser,
    defaultOption
} from './untils/untils.js';





class StaticObjectScence {
    constructor(elment, obj = void 0, light = void 0, animation = () => {}, userInit = () => {}, option = {}, ) {
        //===========场景挂载的元素=============
        this.element = elment;
        if (!elment) {
            const body = document.querySelector("body");
            this.element = body;
            body.style.height = "100vh";
            body.style.width = "100vw";
        } else { // 如果是有元素的,设置定位为相对定位
            if (getComputedStyle(this.element).position !== "relative") {
                this.element.style.position = "relative";
            }
        }

        // 私有属性
        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.HDR = undefined;


        // 通过用户选项设置本类选项
        this.option = getOptionFromUser(option, defaultOption);
        // 选项逻辑处理
        this.option.cardmode = this.option.pickmode === 1 ? 1 : this.option.cardmode;

        this.userInit = userInit;
        this.animation = animation; // 动画函数
        this.selectObjectGroup = {}; // 被选中的物体对象.键是物体ID,值是物体对象本身.
        this.objectGroup = obj; // 场景物体组
        this.lightGroup = light; // 场景灯光组
        this.helperGroup = new THREE.Group(); // 辅助对象组

        this.init();
    }
    init() {
        this.initScence();
        this.initLight();
        this.initMesh();
        this.initCamera();
        this.initRender();
        // 高质量渲染
        if (this.option.hightQualityRender) {
            this.Antialias();
        }
        // 是否选择物体
        if (this.option.pickmode !== -1) {
            this.PickerInit();
        }
        this.initHelper();
        this.initRenderQueue();
        this.initEffectComposer();
        this.userInit(this);
    }
    initRenderQueue() {
        // 渲染队列
        this.renderQueue = [(_this) => {
            _this.composer.render();
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
    initEffectComposer() {
        this.composer = new AfterEffect.EffectComposer(this.renderer); // 后处理对象

        this.composer.addPass(new AfterEffect.RenderPass(this.scene, this.camera)); // 第一个渲染管线--渲染

        this.outLinePass = new AfterEffect.OutlinePass(new THREE.Vector2(this.width, this.height), this.scene, this.camera);
        // 一个模型对象
        if (this.option.pickShowoutline) {
            this.composer.addPass(this.outLinePass);
        }
        // const effectColorSpaceConversion = new ShaderPass(GammaCorrectionShader);
        // this.composer.addPass(effectColorSpaceConversion);
        // const effectFXAA = new ShaderPass(FXAAShader);
        // effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
        // this.composer.addPass(effectFXAA);

        // const glitchPass = new GlitchPass();
        // this.composer.addPass(glitchPass);

        this.composer.addPass(new AfterEffect.OutputPass());

        //=========
        //模型描边颜色，默认白色         
        this.outLinePass.visibleEdgeColor.set(this.option.outLine_option.visibleEdgeColor);
        this.outLinePass.edgeThickness = this.option.outLine_option.edgeThickness;
        this.outLinePass.edgeStrength = this.option.outLine_option.edgeStrength;
        this.outLinePass.pulsePeriod = this.option.outLine_option.pulsePeriod;
        this.outLinePass.selectedObjects = Object.values(this.selectObjectGroup);
    }
    // 静态方法:为物体设置高质量物理光照渲染属性
    static setMeshHightQualityRender(mesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.material.needsUpdate = true;
        mesh.material.shadowSide = 1;
    }
    initScence() {
        this.scene = new THREE.Scene();
        // 默认添加地面

        if (this.option.showland) {
            const land = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide, //两面可见
                shadowSide: THREE.BackSide,
                map: this.option.landTexture,
                roughness: 0.2,

            }));
            land.rotateX(-Math.PI / 2);
            land.receiveShadow = true;
            land.castShadow = true;
            land.material.envMap = this.HDR;
            land.material.needsUpdate = true;
            this.environmentGroup = new THREE.Group();
            this.environmentGroup.name = "environmentGroup";
            this.environmentGroup.add(land);
            this.scene.add(this.environmentGroup);
        }
        // 加载HDR贴图
        if (this.option.HDRurl) {
            const texture = new EXRLoader().load(this.option.HDRurl, function (texture) {
                texture.mapping = //THREE.EquirectangularReflectionMapping;
                THREE.EquirectangularRefractionMapping ;
            });
            this.scene.background = texture;
            this.scene.environment = texture;
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
                this.objectGroup.children[i]._selected = false; // 添加属性 是否选中
                // 接受投影
                this.objectGroup.children[i].castShadow = true;
                this.objectGroup.children[i].receiveShadow = true;
                // 
                this.objectGroup.children[i].material.envMap = this.scene.environment;
                // 更新材质
                this.objectGroup.children[i].material.needsUpdate = true;

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
        // 透明背景
        this.renderer.setClearColor(this.option.background_color, this.option.background_opacity);
        this.renderer.setClearAlpha(this.option.background_opacity);
        this.CSS2Renderer = new CSS2DRenderer(); // dom标签渲染器
        //渲染器使用阴影
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // PCF柔软阴影贴图
        // 曝光
        this.renderer.toneMapping = 4;
        this.renderer.toneMappingExposure = 1;
        //渲染器尺寸与挂载到dom
        this.renderer.setSize(this.width, this.height);
        this.CSS2Renderer.setSize(this.width, this.height);
        this.element.appendChild(this.renderer.domElement);
        const CSS2Element = this.CSS2Renderer.domElement;
        // 设置dom标签层
        CSS2Element.classList.add("ui-layer");
        this.element.appendChild(CSS2Element);

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
        const innergui = this.option.GUI(this);
        innergui.domElement.style.position = "absolute";

        innergui.domElement.classList.add("gui");
        this.element.appendChild(innergui.domElement);

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
            _this.element.addEventListener("click", function (event) {});
            var isClick = true;

            function _click(event, _this) {
                _this.mouse.x = event.offsetX / _this.width * 2 - 1;
                _this.mouse.y = -event.offsetY / _this.height * 2 + 1;
                _this.pick(_this);
            }

            function _handleClick(event) {
                _click(event, _this);
            }
            _this.element.addEventListener("mousedown", (event) => {
                _this.element.addEventListener("mouseup", _handleClick);
                let frame = 0;
                const timer = setInterval(function () {
                    isClick = true;
                    if (frame > 0) {
                        _this.element.removeEventListener("mouseup", _handleClick);
                        isClick = false;
                        clearInterval(timer);
                        frame = 0;
                    }
                    frame++;

                }, this.option.pickspeed);
            })

        })(this);
        // 选择器
        this.picker = new THREE.Raycaster();
    }

    pick(_this) {
        // 获取选中模型
        _this.picker.setFromCamera(new THREE.Vector2(_this.mouse.x, _this.mouse.y), _this.camera);
        const pickedObj = _this.picker.intersectObjects((_this.objectGroup === undefined || _this.objectGroup === null) ? [] : _this.objectGroup.children, false);

        if (pickedObj.length) {
            if (_this.option.pickmode === 0) {
                this.selectMesh(pickedObj[0].object);
                try {
                    _this.option.pickAction(pickedObj[0].object);
                } catch (e) {
                    if (e instanceof TypeError) {
                        console.warn("REMIND: param is a THREE.Mesh array.please check your code");
                    }
                    throw e;
                }
            } else {
                // 重映射数组.并全部设置.
                pickedObj.forEach((item, index) => {
                    pickedObj[index] = item.object;
                });
                const pickedObj_noRepeat = Array.from(new Set(pickedObj));
                // 不知道为什么.选择外部gltf模型会出现重复选择的情况.可能跟模型有关.不管怎么样,直接去重即可.
                pickedObj_noRepeat.forEach((item, index) => {
                    this.selectMesh(pickedObj_noRepeat[index]);
                })
                try {
                    _this.option.pickAction(pickedObj_noRepeat);
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.warn("REMIND: param is a THREE.Mesh object.please check your code");
                    }
                    throw error;
                }

            }
            this.outLinePass.selectedObjects = Object.values(_this.selectObjectGroup);
        } else { // 清空选择
            this.outLinePass.selectedObjects = [];
            for (let item in this.selectObjectGroup) {
                _this._setIsSelected(this.selectObjectGroup[item], false);
            }
            _this.selectObjectGroup = {};
        }
    }
    // 选择
    _setIsSelected(mesh, boolean) {
        if (boolean) {

            mesh.children[0].element.classList.add("card-selected");
            mesh._selected = true;
            this.selectObjectGroup[mesh.id] = mesh;
        } else {
            mesh.children[0].element.classList.remove("card-selected");
            mesh._selected = false;
            delete this.selectObjectGroup[mesh.id];
        }
    }
    selectMesh(mesh) {
        if (this.option.cardmode === 0) { // 只有一个
            if (Object.keys(this.selectObjectGroup).length) { // 选中不止一个
                if (this.selectObjectGroup[mesh.id] !== mesh) { // 点击的对象不是已经被激活的
                    // 删除所有激活样式
                    for (let item in this.selectObjectGroup) {
                        this._setIsSelected(this.selectObjectGroup[item], false);
                    }
                    this.selectObjectGroup = {};
                }
            }
        } else if (this.option.cardmode === 1) { // 可以有多个

        }
        this._setIsSelected(mesh, !mesh._selected);
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