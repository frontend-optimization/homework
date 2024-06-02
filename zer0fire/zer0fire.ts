// 指纹 ID 不登录也能追踪用户硅基
// FingerprintJS 开源 + 商用
// 帆布指纹技术：https://www.html5rocks.com/zh/tutorials/canvas/fundamentals/
// canvas 绘制同一元素，然后通过 toDataURL 转换为 base64 编码的图片数据
// 因为会通过设备、操作系统、浏览器等（系统字体、对抗锯齿、次像素渲染，甚至时间、memory 等），会有很多差异

// 指纹参数类型
type FingerprintOptions = {
  font?: string;
  rectStyle?: string | CanvasGradient | CanvasPattern;
  contentStyle?: string | CanvasGradient | CanvasPattern;
  textBaseline?: CanvasTextBaseline;
};

function bin2hex(s: string) {
  // 二进制转十六进制
  // 不足四位补 0
  let i: number = s.length,
    o = "";
  while (i >= s.length) {
    let start = i - 4 > 0 ? i - 4 : 0;
    let str = s.slice(start, i);
    str = str.length < 4 ? str.padStart(4, "0") : str;
    o += parseInt(str, 2).toString(16);
    i -= 4;
  }
  return o;
}

export function getFingerprintId(
  content: string,
  options?: FingerprintOptions
) {
  if (!content) {
    console.error("content is required");
    return null;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const txt = "geekbang";
  if (!ctx) return "";
  ctx.textBaseline = "top";
  ctx.font = '14px "Arial"';

  ctx.fillStyle = "#f60";
  // 先画一个 60x20 矩形内容
  ctx.fillRect(125, 1, 62, 20);
  // 把字填充到矩形中
  ctx.fillStyle = "#069";
  ctx.fillText(txt, 2, 15);

  // 转换 base54 并截取
  const b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
  const bin = atob(b64);
  const crc = bin2hex(bin.slice(-16, -12));
  return crc;
}

// WebVitals

// const timing = window.performance.timing
// 获取生命周期内所有节点的时间戳对象
const timing = new window.PerformanceNavigationTiming();
// 获取首字节时间
const ttfBTime = timing.responseStart - timing.requestStart;
// 首字节渲染时间
const fptTime = timing.responseEnd - timing.fetchStart;
// 页面完整加载时间
const loadPageTime = timing.loadEventEnd - timing.fetchStart;
// tcp连接时间
const tcpTime = timing.connectEnd - timing.connectStart;
// dns查询时间
const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;

performance.getEntriesByType("navigation"); // 相对时间值

function mapMetric(metric) {
  const isWebVital =
    ["FCP", "TTFB", "LCP", "CLS", "FID"].indexOf(metric.name) !== -1;
  return {
    [metric.name]: isWebVital,
  };
}

export class BaseTrace implements BaseTraceInterface {
  public perfData: TracePerf = {
    id: "",
  };
  createPerfReport() {
    const report = (metric) => {
      this.perfData = { ...this.perfData, ...mapMetric(metric) };
    };
    return report;
  }
}
