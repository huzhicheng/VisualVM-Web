import React, { useState, useEffect } from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import {
  Tabs,
  Row,
  Col,
  Statistic,
  List,
  Typography,
  Tag
} from "antd";
import { TagOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { setAttachJvm, setRightLicense } from '../stores/globalSlice';
import { api, getData } from "../request";
import "../styles/style.scss";

const { TabPane } = Tabs;

const garbageCollector = {
  Copy: "Serial",
  "PS Scavenge": "Parallel Scavenge",
  ParNew: "ParNew",
  "G1 Young Generation": "G1",
  MarkSweepCompact: "Serial Old",
  "PS MarkSweep": "Parallel Old",
  ConcurrentMarkSweep: "CMS",
  "G1 Old Generation": "G1"
};

export default function Home() {

  /**
   * 实时折线图指标
   */
  const scales = {
    cpu: {
      time: {
        alias: "时间",
        type: "time",
        mask: "HH:mm:ss",
        tickCount: 6,
        nice: false
      },
      load: {
        alias: "使用率",
        min: 5,
        max: 100,
        formatter: text => {
          return `${text.toFixed(2)}%`;
        }
      },
      type: {
        type: "cat"
      }
    },
    heapMemory: {
      time: {
        alias: "时间",
        type: "time",
        mask: "HH:mm:ss",
        tickCount: 6,
        nice: false
      },
      size: {
        alias: "用量",
        // max:1000000000,
        // min:5,
        formatter: text => {
          return `${text.toFixed(2)}M`;
        }
      },
      type: {
        type: "cat"
      }
    },
    class: {
      time: {
        alias: "时间",
        type: "time",
        mask: "HH:mm:ss",
        tickCount: 6,
        nice: false
      },
      size: {
        alias: "数量",
        // max:1000000000,
        min: 0,
        formatter: text => {
          return `${text}`;
        }
      },
      type: {
        type: "cat"
      }
    }
  };
  const [systemInfo, setSystemInfo] = useState({});
  const [jvmInfo, setJvmInfo] = useState({});
  const [heapMemoryInfo, setHeapMemoryInfo] = useState({});
  const [metaspaceInfo, setMetaspaceInfo] = useState({});
  const [classInfo, setClassInfo] = useState({});
  const [threadInfo, setThreadInfo] = useState({});
  const [garbageCollectorInfo, setGarbageCollectorInfo] = useState([]);
  const [cpuData, setCpuData] = useState([]);
  const [heapMemoryData, setHeapMemoryData] = useState([]);
  const [metaspaceData, setMetaspaceData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [threadData, setThreadData] = useState([]);

  const isAttachJvm = useSelector((state) => state.global.isAttachJvm);
  useEffect(() => {

    console.log("home执行吗")
    loadData();
  }, [isAttachJvm]);


  // let globalStore = store.global;
  const loadData = () => {

    setInterval(() => {

      console.log(`home 获取的 ${isAttachJvm}`)

      if (isAttachJvm) {
        getData(api.overview, {}).then(res => {
          if (res.success) {
            setSystemInfo(res.data.systemInfo);
            setJvmInfo(res.data.jvmInfo);
            setHeapMemoryInfo(res.data.heapMemoryUsage);
            setMetaspaceInfo(res.data.metaSpace);
            setClassInfo(res.data.classLoadingInfo);
            setThreadInfo(res.data.threadInfo);
            setGarbageCollectorInfo(res.data.garbageCollectorInfo);
            buildCpuData(res.data.systemInfo);
            buildHeapMemoryData(res.data.heapMemoryUsage);
            buildMetaspaceData(res.data.metaSpace);
            buildClassData(res.data.classLoadingInfo);
            buildThreadData(res.data.threadInfo);
          }
        });
      }
    }, 2000);
  };

  /**
   * 构造 cpu 曲线
   */
  const buildCpuData = (currentCpuData) => {
    setCpuData(() => {
      if (cpuData.length >= 100) {
        // 移除前两个数据
        cpuData.shift();
        cpuData.shift();
      }

      var now = new Date();
      var time = now.getTime();

      // 添加新数据到现有数据数组

      cpuData.push({
        time: time,
        load: isNaN(currentCpuData.systemCpuLoad) ? 0.00 : currentCpuData.systemCpuLoad * 100,
        type: "系统 CPU 使用率"
      });
      cpuData.push({
        time: time,
        load: currentCpuData.processCpuLoad * 100,
        type: "当前 jvm CPU 使用率"
      });

      return [...cpuData]; // 返回新的数组以触发状态更新
    });
  };

  /**
   * 构造 heapMemoryUsage 曲线
   */
  const buildHeapMemoryData = (currentHeapMemoryUsage) => {
    setHeapMemoryData(() => {
      if (heapMemoryData.length >= 200) {
        heapMemoryData.shift();
        heapMemoryData.shift();
      }

      var now = new Date();
      var time = now.getTime();
      heapMemoryData.push({
        time: time,
        size: currentHeapMemoryUsage.committed / 1024 / 1024,
        type: "Heap 大小"
      });
      heapMemoryData.push({
        time: time,
        size: currentHeapMemoryUsage.used / 1024 / 1024,
        type: "Heap 使用量"
      });
      return [...heapMemoryData];
    });
  };

  /**
   * 构造 MetaspaceUsage 曲线
   */
  const buildMetaspaceData = (currentMetaSpace) => {
    setMetaspaceData(() => {
      if (metaspaceData.length >= 200) {
        metaspaceData.shift();
        metaspaceData.shift();
      }

      var now = new Date();
      var time = now.getTime();
      metaspaceData.push({
        time: time,
        size: currentMetaSpace.committed / 1024 / 1024,
        type: "metaspace 大小"
      });
      metaspaceData.push({
        time: time,
        size: currentMetaSpace.used / 1024 / 1024,
        type: "metaspace 使用量"
      });
      return [...metaspaceData];
    });
  };

  /**
   * 构造 classes 曲线
   */
  const buildClassData = (currentClassData) => {
    setClassData(() => {
      if (classData.length >= 200) {
        classData.shift();
        classData.shift();
      }

      var now = new Date();
      var time = now.getTime();
      // classData.push({
      //   time: time,
      //   size: classInfo.totalLoadedClassCount,
      //   type: "总数"
      // });
      classData.push({
        time: time,
        size: currentClassData.loadedClassCount,
        type: "已加载类"
      });
      classData.push({
        time: time,
        size: currentClassData.unloadedClassCount,
        type: "未加载类"
      });
      return [...classData];
    });
  };

  /**
   * 构造 thread 曲线
   */
  const buildThreadData = (currentThreadInfo) => {
    setThreadData(() => {
      if (threadData.length >= 200) {
        threadData.shift();
        threadData.shift();
      }

      var now = new Date();
      var time = now.getTime();
      threadData.push({
        time: time,
        size: currentThreadInfo.liveThreadCount,
        type: "活动线程"
      });
      threadData.push({
        time: time,
        size: currentThreadInfo.daemonThreadCount,
        type: "守护线程"
      });

      return [...threadData];
    });
  };


  const inputArgs = jvmInfo.inputArguments || [];
  const systemProperties = jvmInfo.systemProperties || [];
  return (
    <div className="home">

      <Tabs type="card">
        <TabPane tab="系统信息" key="1">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="系统名称" value={systemInfo.name} />
            </Col>
            <Col span={6}>
              <Statistic title="系统架构" value={systemInfo.arch} />
            </Col>
            <Col span={6}>
              <Statistic title="系统版本" value={systemInfo.version} />
            </Col>
            <Col span={6}>
              <Statistic
                title="可用处理器个数"
                value={systemInfo.availableProcessors}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="物理内存 (G)"
                value={
                  systemInfo.totalPhysicalMemorySize / 1024 / 1024 / 1024
                }
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="系统 CPU 使用"
                value={isNaN(systemInfo.systemCpuLoad) ? 0 : systemInfo.systemCpuLoad * 100}
                suffix="%"
                precision={2}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="当前 JVM CPU 使用率"
                value={systemInfo.processCpuLoad * 100}
                suffix="%"
                precision={2}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="最后一分钟 CPU 平均负载"
                value={systemInfo.systemLoadAverage}
                precision={2}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="已提交内存(MB)"
                value={systemInfo.committedVirtualMemorySize / 1024 / 1024}
                precision={2}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="空闲内存 (MB)"
                value={systemInfo.freePhysicalMemorySize / 1024 / 1024}
                precision={2}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="交换内存空间 (MB)"
                value={systemInfo.totalSwapSpaceSize / 1024 / 1024}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="空闲交换空间 (MB)"
                value={systemInfo.freeSwapSpaceSize / 1024 / 1024}
                precision={2}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="JVM 信息" key="2">
          <Row gutter={16}>
            <Col span={12}>
              <List
                bordered
                dataSource={inputArgs}
                renderItem={item => (
                  <List.Item>
                    <Typography.Text mark>
                      <TagOutlined />
                    </Typography.Text>{" "}
                    {item}
                  </List.Item>
                )}
              />
            </Col>

            <Col span={12}>
              <List
                bordered
                dataSource={systemProperties}
                renderItem={item => (
                  <List.Item>
                    {/* <List.Item.Meta
                        title={item.name}
                        description={item.value}
                      /> */}
                    {item.name}={item.value}
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="实时监控" key="3">
          <Row gutter={16}>
            <Col span={12}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="CPU" key="1">
                  <div className="chart-header">
                    <Tag color="#108ee9">
                      系统 CPU: {(isNaN(systemInfo.systemCpuLoad) ? 0.00 : systemInfo.systemCpuLoad * 100).toFixed(2)}%
                    </Tag>

                    <Tag color="#108ee9">
                      JVM CPU: {(systemInfo.processCpuLoad * 100).toFixed(2)}%
                    </Tag>
                  </div>
                  <Chart autoFit
                    height={400}
                    data={cpuData}
                    scale={scales.cpu}
                    forceFit
                    onGetG2Instance={g2Chart => { }}
                  >
                    <Tooltip />
                    {cpuData.length !== 0 ? <Axis /> : ""}
                    <Legend />
                    <Geom
                      type="line"
                      position="time*load"
                      color={["type", ["#ff7f0e", "#2ca02c"]]}
                      shape="smooth"
                      size={2}
                    />
                  </Chart>


                </TabPane>
              </Tabs>
            </Col>

            <Col span={12}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Heap" key="1">
                  <div className="chart-header">
                    <Tag color="#108ee9">
                      max:
                      {(heapMemoryInfo.max / 1024 / 1024).toFixed(
                        2
                      )}
                      M
                    </Tag>
                    <Tag color="#108ee9">
                      init:
                      {(heapMemoryInfo.init / 1024 / 1024).toFixed(
                        2
                      )}
                      M
                    </Tag>

                    <Tag color="#108ee9">
                      committed:
                      {(
                        heapMemoryInfo.committed /
                        1024 /
                        1024
                      ).toFixed(2)}
                      M
                    </Tag>
                    <Tag color="#108ee9">
                      used:
                      {(heapMemoryInfo.used / 1024 / 1024).toFixed(
                        2
                      )}
                      M
                    </Tag>
                  </div>
                  <Chart autoFit
                    height={400}
                    data={heapMemoryData}
                    scale={scales.heapMemory}
                    forceFit
                    onGetG2Instance={g2Chart => { }}
                  >
                    <Tooltip />
                    {heapMemoryData.length !== 0 ? <Axis /> : ""}
                    <Legend />
                    <Geom
                      type="line"
                      position="time*size"
                      color={["type", ["#ff7f0e", "#2ca02c"]]}
                      shape="smooth"
                      size={2}
                    />
                  </Chart>
                </TabPane>

                <TabPane tab="Metaspace" key="2">
                  <div className="chart-header">
                    <Tag color="#108ee9">
                      init:
                      {(metaspaceInfo.init / 1024 / 1024).toFixed(
                        2
                      )}
                      M
                    </Tag>

                    <Tag color="#108ee9">
                      committed:
                      {(
                        metaspaceInfo.committed /
                        1024 /
                        1024
                      ).toFixed(2)}
                      M
                    </Tag>
                    <Tag color="#108ee9">
                      used:
                      {(metaspaceInfo.used / 1024 / 1024).toFixed(
                        2
                      )}
                      M
                    </Tag>
                  </div>
                  <Chart autoFit
                    height={400}
                    data={metaspaceData}
                    scale={scales.heapMemory}
                    forceFit
                    onGetG2Instance={g2Chart => { }}
                  >
                    <Tooltip />
                    {metaspaceData.length !== 0 ? <Axis /> : ""}
                    <Legend />
                    <Geom
                      type="line"
                      position="time*size"
                      color={["type", ["#ff7f0e", "#2ca02c"]]}
                      shape="smooth"
                      size={2}
                    />
                  </Chart>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="类加载" key="1">
                  <div className="chart-header">
                    <Tag color="#108ee9">
                      总数: {classInfo.totalLoadedClassCount}
                    </Tag>

                    <Tag color="#108ee9">
                      已加载类: {classInfo.loadedClassCount}
                    </Tag>

                    <Tag color="#108ee9">
                      未加载类: {classInfo.unloadedClassCount}
                    </Tag>
                  </div>
                  <Chart autoFit
                    height={400}
                    data={classData}
                    scale={scales.class}
                    forceFit
                    onGetG2Instance={g2Chart => { }}
                  >
                    <Tooltip />
                    {classData.length !== 0 ? <Axis /> : ""}
                    <Legend />
                    <Geom
                      type="line"
                      position="time*size"
                      color={["type", ["#ff7f0e", "#2ca02c"]]}
                      shape="smooth"
                      size={2}
                    />
                  </Chart>
                </TabPane>
              </Tabs>
            </Col>

            <Col span={12}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="线程" key="1">
                  <div className="chart-header">
                    <Tag color="#108ee9">
                      total started:{" "}
                      {threadInfo.totalStartedThreadCount}
                    </Tag>

                    <Tag color="#108ee9">
                      活动线程: {threadInfo.liveThreadCount}
                    </Tag>

                    <Tag color="#108ee9">
                      活动线程峰值:{" "}
                      {threadInfo.livePeakThreadCount}
                    </Tag>

                    <Tag color="#108ee9">
                      守护线程数: {threadInfo.daemonThreadCount}
                    </Tag>
                  </div>
                  <Chart autoFit
                    height={400}
                    data={threadData}
                    scale={scales.class}
                    forceFit
                    onGetG2Instance={g2Chart => { }}
                  >
                    <Tooltip />
                    {threadData.length !== 0 ? <Axis /> : ""}
                    <Legend />
                    <Geom
                      type="line"
                      position="time*size"
                      color={["type", ["#ff7f0e", "#2ca02c"]]}
                      shape="smooth"
                      size={2}
                    />
                  </Chart>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="垃圾收集器" key="4">
          {garbageCollectorInfo.map(item => {
            return (
              <Tag key={item.name} color="#108ee9">
                {item.name}({garbageCollector[item.name]}) : 已收集{" "}
                {item.collectionCount} 次
              </Tag>
            );
          })}
        </TabPane>
      </Tabs>
    </div>
  );

}

