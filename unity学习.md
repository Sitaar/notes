# 目录学习

Prefabs：预制体（重复使用的物体）

Materials：材料

Physics Material：物理材料

Scenes：场景（多页面、多关卡）

Script：脚本

Fonts：字体

# 快捷键

选中相机-cmd+shift+F：视角和编辑器一致（GameObject ->Align with view）

# Volume后处理

相机中 Rendering -- post processing可以关闭后处理效果

URP-HighFidelity-Renderer文件中 也可以关闭 后处理效果

## Tonemapping

色调映射

Mode: neutral（自然）

## ColorAdjustments

**Contrast**:  色调范围

**Saturation**：色调强度

## Bloom

高光溢出

Threshold（阀值）如果场景中物体的亮度超过这个阀值才会发生高光溢出

Intensity(强度)发生高光溢出的强度

## Vignette

渐晕

Intensity 设置屏幕上的渐晕数量。
Smoothness 设置渐晕边框的平滑度。

# 场景使用方法

## 一般步骤

### 保存其他场景的内容

### 创建新场景

### 布置场景

### 灯光渲染

+ 针对需要灯光渲染的场景，（窗口=》渲染=〉灯光=》生成）

### 生成设置

+ 根据场景出现的顺序生成场景序列，（文件=〉生成设置=》添加=〉排序）

### 代码切换

+ 在切换的条件处，新增脚本

```c#
//场景管理器的库
using UnityEngine.SceneManagement;

//切换生效：下一个场景
SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
```

## SceneManager API

```c#
//回到当前场景的开始处
SceneManager.LoadScene(SceneManager.GetActiveScene().name);
```

# 生命周期

## Start

Start将在MonoBehavior创建后在该帧Update之前，在该Monobehavior.enabled == true的情况下执行。

*初始化函数，在游戏开始时系统自动调用。一般用来创建变量之类的东西。*

## Awake 

在加载脚本实例时调用

Awake在MonoBehavior创建后就立刻调用

*初始化函数，在所有Awake函数运行完之后（一般是这样，但不一定），在所有Update函数前系统自动条用。一般用来给变量赋值。*



Start仅在Update函数第一次被调用前调用。Start在behaviour的生命周期中只被调用一次。它和Awake的不同是Start只在脚本实例被启用时调用。
你可以按需调整延迟初始化代码。Awake总是在Start之前执行。这允许你协调初始化顺序。

## Update



# 旋转Quaternion API

## Quaternion.Euler(z,x,y)

绕z/x/y轴旋转

# 时间DateTime API

## 命名空间  using System

## 时间类

### DateTime

```c#
DateTime time = DateTime.Now
time.Hour
time.TimeOfDay
```

### TimeSpan

时间间隔

```c#
TimeSpan time = DateTime.Now.TimeOfDay;
// Debug.Log((float)time.TotalHours); 12:30表示为12.5
// Debug.Log(time.Hours); 12:30表示为12
```

# 预制体

1、新建物体==》拖入asset    手动生成预制体

2、代码示例化预制体

```c#
public Transform pointPrefab;//将预制体物体放入
Transform point = Instantiate(pointPrefab);//实例化预制体

//可以调整预制体的 position scale Parent等
```

# 数组

```c#
Transform[] points;//声明

points.Length//长度

points = new Transform[resolution];//占位

points[i] = point;//赋值
```

# 数学公式

Mathf.**

```c#
position.y = Mathf.Sin(Mathf.PI*(position.x+Time.time));//y = sin(pi*x+t)
```

# Time时间类

## Time.time

从游戏开发到现在的时间，会随着游戏的暂停而停止计算

## Time.deltaTime

从上一帧到当前帧时间，以秒为单位

# 着色器

Graph Color.shader文件

```D
Shader "Custom/Graph Color"
{
    Properties
    {
        // _Color ("Color", Color) = (1,1,1,1)
        // _MainTex ("Albedo (RGB)", 2D) = "white" {}
        _Glossiness ("Smoothness", Range(0,1)) = 0.5
        _Metallic ("Metallic", Range(0,1)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 200

        CGPROGRAM
        #pragma surface surf Standard fullforwardshadows

        #pragma target 3.0

        // sampler2D _MainTex;

        struct Input
        {
            // float2 uv_MainTex;
            float3 worldPos;
        };

        half _Glossiness;
        half _Metallic;
        // fixed4 _Color;

        UNITY_INSTANCING_BUFFER_START(Props)

        UNITY_INSTANCING_BUFFER_END(Props)

        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            // fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            // o.Albedo = c.rgb;
            o.Albedo.rg = IN.worldPos.xy*0.5+0.5;//x坐标复制给红色变量
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            // o.Alpha = c.a;
            o.Alpha = 1;
        }
        ENDCG
    }
    FallBack "Diffuse"
}

```

# Forward

```c#
transform.forward = new Vector3(1,0,0);//自身向右旋转90度 rotation new Vector3(0,90,0);

transform.position +=Vector3.forward ; //物体沿着世界坐标Z轴前进；
```

Vector3

```c#
//弧线插值，球形插值 ：用于平滑方向的旋转
//从 a 到 b 以步长为t 在中间插值
Vector3.Slerp(a, b, t);

//线性插值：用于平滑直线运动
Vector3.Lerp(a,b,t);
```

