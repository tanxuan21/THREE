// https://blog.csdn.net/a13602955218/article/details/85222993

/*效果合成对象*/
import {
    EffectComposer
} from '../../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';


/*普通WebGL renderer*/
import {
    RenderPass
} from '../../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';

/*输出.使用它可以解决outline造成的色彩空间不正确的问题.*/
import {
    OutputPass
} from '../../../../node_modules/three/examples/jsm/postprocessing/OutputPass.js';




/*选中的对象添加描边效果.*/
import {
    OutlinePass
} from '../../../../node_modules/three/examples/jsm/postprocessing/OutlinePass.js';

/*抗锯齿效果*/
import {
    FXAAShader
} from '../../../../node_modules/three/examples/jsm/shaders/FXAAShader.js';

/*伽马矫正.也可以解决outline造成的色彩空间不正确的问题*/
import {
    GammaCorrectionShader
} from '../../../../node_modules/three/examples/jsm/shaders/GammaCorrectionShader.js';

/*故障效果.注意眼睛不要瞎*/
import {
    GlitchPass
} from '../../../../node_modules/three/examples/jsm/postprocessing/GlitchPass.js';

/* 添加亮度
Strength:光的强度
kernelSize:光的偏移
sigma:光的锐利程度 必须小数
Resolution:光的精确度，值越低，光的方块化越严重
*/
import {
    BloomPass
} from '../../../../node_modules/three/examples/jsm/postprocessing/BloomPass.js';
/* @{ShaderPass}自定义着色器.参数:
参数：
THREE.MirrorShader:创建镜面效果
THREE.HueSaturationShader:改变颜色的色调和饱和度
THREE.VignetteShader:添加晕映效果
THREE.ColorCorrectionShader:调整颜色的分布
THREE.RGBShiftShader:将红绿蓝三种颜色分开
THREE.BrightnessContrastShader:改变亮度和对比度
THREE.ColorifyShader:将某种颜色覆盖到整个屏幕
THREE.SepiaShader:创建类似于乌贼墨的效果
THREE.KaleidoShader:类似于万花筒的效果
THREE.LuminosityShader:提高亮度
THREE.TechnicolorShader:模拟类似老电影里面的两条彩色效果
THREE.HorizontalBlurShader和THREE.VerticalBlurShader:可以向水平和垂直方向创建模糊效果
THREE.HorizontalTiltShiftShader和THREE.VerticalTileShiftShader:可以在水平和垂直方向创建倾斜平移的效果
THREE.TriangleBlurShader:基于三角形的方法创造一种模糊效果
THREE.BleachBypassShader:创造一种镀银的效果
THREE.EdgeShader:找到图片的边界并显示
THREE.FXAAShader:添加抗锯齿的效果
THREE.FocusShader:创建中间比较尖锐，周围比较模糊的效果。
*/

import {
    ShaderPass
} from '../../../../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';

export {
    ShaderPass,
    RenderPass,
    EffectComposer,
    OutlinePass,
    FXAAShader,
    GammaCorrectionShader,
    GlitchPass,
    OutputPass,
    BloomPass,
}