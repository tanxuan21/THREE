### StaticObjectScene(静态模型场景)
**本类实现对THREE的二次封装.用于展示静态模型.**
<font color='#909090' size=2>本文档不介绍THREE的下载和导入.移步教程:[THREE中文网](http://www.webgl3d.cn/pages/cd35b2/)中的`ES6import方式引入`</font>
引入本类:
```javascript
import { StaticObjectScence } from "... .../StaticObjectScence/StaticObjectScence.js"
```

创建场景示例:
```javascript
const scene = new StaticObjectScence(
    html element,
    THREE group with mesh, 
    THREE group with light, 
    animation function with parm _this, 
    option object,
);
scene.render();
```

参数列表(从左到右顺序):
* **1.html元素**
html元素可以用js创建,也可以通过选择器选择.默认在`body`上.
* **2.THREE网格组**
传递一个THREE.Group.
* **3.THREE灯光组**
传递一个THREE.Group.
* **4.动画函数 [param:this]**
动画函数有参数`_this`.`_this`是本对象引用.可以通过`_this`访问本对象的所有对象.
* **5.初始化函数[param:this]**
    在本类完成初始化后调用.参数是本对象引用.可以通过`_this`访问本对象的所有对象.也可以通过`_this`添加对象.
* **6.选项对象**

|       属性名       |       类型       |                                                            释义                                                            |   默认值   |
| :----------------: | :--------------: | :------------------------------------------------------------------------------------------------------------------------: | :--------: |
|     showStats      |     boolean      |                                    <font color='#909090' size=2>是否显示性能卡牌</font>                                    |   false    |
|        GUI         |     function     |                              <font color='#909090' size=2>创建GUI函数.默认参数`_this`</font>                               | ( ) => { } |
| hightQualityRender |     boolean      |                                   <font color='#909090' size=2>是否开启高质量渲染</font>                                   |    true    |
|   openAxesHelper   |     boolean      |                                    <font color='#909090' size=2>是否打开坐标辅助</font>                                    |   false    |
|      showland      |     boolean      |                                      <font color='#909090' size=2>是否打开地面</font>                                      |    true    |
|    landTexture     |  THREE.Texture   |                                        <font color='#909090' size=2>地面贴图</font>                                        | 内置棋盘格贴图 |
|  background_color  |   6位16进制数    |                                        <font color='#909090' size=2>背景颜色</font>                                        |  0xffffff  |
| background_opacity |  Number^[0,1]^   |                                       <font color='#909090' size=2>背景透明度</font>                                       |     0      |
|      pickmode      | Number^{-1,0,1}^ |               <font color='#909090' size=2>选择模式.为-1不选择;为0不选中被遮挡的物体;为1选中所有物体</font>                |     0      |
|     pickAction     |     function     | <font color='#909090' size=2>选择后的动作.注意,pickmode是0传递一个THREE.mesh,pickmode是 他值传递一个THREE.mesh数组.</font> | ( ) => { } |
|   createMeshCard   |     function     |                           <font color='#909090' size=2>创建mesh的标注卡片.参数是mesh本身.</font>                           | ( ) => { } |
        
主要需要你书写的就是上面的几个函数.
下面给出它们的模板:
[GUI文档](http://www.webgl3d.cn/pages/5005d5/)
```javascript
import {
    GUI
} from 'three/addons/libs/lil-gui.module.min.js';
function createGUI(_this){
    
}
export {
    createGUI
}
```
[网格模型文档](http://www.webgl3d.cn/pages/2e5d69/)
```javascript
import * as THREE from 'three';
function createMesh() {
    const meshGroup = new THREE.Group();
    ... ...
    return meshGroup;
}
export {
    createMesh
};
```
[灯光文档](http://www.webgl3d.cn/pages/b9504a/)
```javascript
import * as THREE from 'three';
function createLight() {
    const meshGroup = new THREE.Group();
    ... ...
    return meshGroup;
}
export {
    createLight
};
```
pickAction
```javascript
// pickmode = 0
(mesh)=>{
    // mesh是THREE.Mesh对象.正常操作就可以了.
    // 如果要操作mesh的卡片DOM对象,就使用:
    mesh.children[0].element //访问

    // 如果想要显示卡片,只需要加上类样式:

}
// pickmode = 1
(meshArry)=>{
    meshArry.forEach((mesh)=>{
        // 遍历得到的数组.
    })
}
```
createMeshCard
```javascript
(mesh)=>{
    const card = document.createElement("div");
    card.innerHTML = mesh.name;
    ... ...
    return card;
}
```

Animation 与 userInit
需要介绍本类的所有属性.这样方便对里面的THREE对象设置动画.
|属性名|简介|
|:---:|:---:|
element| THREE渲然的场景挂载到哪个元素
option| 选项对象
animation|  动画函数
objectGroup|   THREE.Mesh 网格物体组
lightGroup| THREE.Light 灯光组
helperGroup|    辅助器组,包括坐标系辅助器等.
scene|    THREE场景对象
environmentGroup| 环境对象组.包括HDR,地面或者你想要添加的网格,灯光对象等等
camera| THREE相机对象
renderer| THREE渲染器对象
CSS2Renderer| THREE dom元素渲染对象
OrbitControl| 轨道控制器对象
mouse| 鼠标位置对象.坐标系是[标准设备坐标系](http://www.webgl3d.cn/pages/41d16d/).
picker| 射线选择器.用于鼠标点击模型交互.
stats| 性能选项卡
axesHelper| 坐标辅助
renderQueue| 渲染队列.是一个函数数组(数组元素参数是`_this`),每帧遍历数组的元素并调用一次.可以在交互中途添加到这个队列实现交互式动画.




