![React](https://img.shields.io/badge/React-18.0-green.svg) [![Ant Design](https://img.shields.io/badge/Ant%20Design-5.10.-brightgreen.svg)](https://spring.io/projects/spring-boot) [![wechat](https://img.shields.io/badge/公众号-古时的风筝-success.svg)]()


这是一个简易 VisualVM 项目的前端部分，对应的后端部分在另外一个仓库 [VisualVM 后端](https://github.com/huzhicheng/little-flower)，两个要结合起来使用。

![](https://hexo.moonkite.cn/blog/20231018174521.png)

## 如何启动？
1. 使用 npm 或 yarn 方式安装依赖包

    npm 方式
    ```bash
    npm install 
    ```
    或 yarn
    ```bash
    yarn install
    ```
2. 启动服务

    npm 
    ```bash
    npm run start
    ```

    或 yarn
    ```bash
    yarn start
    ```
    ![](https://hexo.moonkite.cn/blog/20231018172250.png)

3. 打包项目（本地启动不需要这一步）：
   
   **windows 环境**
   
   `set PUBLIC_URL=./ yarn build`
   
   **mac or linux**
   
   `PUBLIC_URL=./ yarn build`

## 使用方式

前提是后端服务已启动，后端启动方式[点此查看](https://github.com/huzhicheng/little-flower) 

1. 前端启动成功后，在浏览器访问 http://localhost:3000/jmx，注意相对路径 `/jmx`，这是在项目路由中设置的。
2. 在页面右侧会出现当前机器已启动的 JVM 进程；

    ![](https://hexo.moonkite.cn/blog/20231018173808.png)

3. 点击任意一个 JVM 后面的「连接」按钮，即可监控此 JVM ，可切换 tab 查看系统信息、JVM 信息、试试监控图表、垃圾收集信息，以及 domains 信息

    ![](https://hexo.moonkite.cn/blog/20231018174102.png)

    ![](https://hexo.moonkite.cn/blog/20231018174416.png)