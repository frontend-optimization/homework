// 全链路日志基类
export type BaseTrace = {
  traceId: string; // 唯一ID，用户生成
  type: TraceTypes; // 日志类型
  createAt: string;
  updateAt: string;
};

// 日志类型
export enum TraceTypes {
  // PV UV
  PAGE_VIEW = "PageView",
  EVENT = "Event",
  // 性能
  PERF = "Perf",
  RESOURCE = "Resource",
  // 动作、行为类型
  ACTION = "Action",
  // 请求类型
  FETCH = "Fetch",
  CODE_ERROR = "CodeError",
  CONSOLE = "Console",
  CUSTOMER = "Customer",
}

// 浏览器类型
export enum BrowserType {
  MOBILE = "mobile",
  PC = "pc",
  WEBVIEW = "webview",
  MINI_PROGRAM = "miniProgram",
}

// 浏览器相关字段基类
export type BaseBrowserTrace = {
  ua: string;
  bt: BrowserType;
};

// 页面相关字段基类
export type BasePageTrace = {
  pid: string; // pid 是用户输入网址访问页面加载成功后，直到下一次重新刷新前，只生成一次 UUID
  title?: string;
  url: string;
};

// 用户相关字段基类
export type BaseUserTrace = {
  fpId: string; // 指纹id
  uid?: string | number;
  userName?: string;
  email?: string;
};

// 日志级别
export enum TraceLevelType {
  error = "error",
  warn = "warn",
  info = "info",
  debug = "debug",
}

// 客户端类型
export enum TraceClientTypes {
  ANDROID_H5 = "android",
  IOS_H5 = "ios",
  PC_H5 = "pc",
  BROWSER_H5 = "browser",
}

// 业务相关字段基类
export type BaseAppTrace = {
  appId: string;
  appName: string;
  clientType: TraceClientTypes;
  level: TraceLevelType;
};

export type BaseTraceInfo = BaseTrace &
  BaseBrowserTrace &
  BasePageTrace &
  BaseUserTrace &
  BaseAppTrace;


// 通用异常数据字段
export type TraceBaseData = {
  dataId: number;
  name: string;
  message: string;
  time: number;
  type: TraceDataTypes;
  level: TraceDataSeverity;
};

export declare enum TraceDataSeverity {
  Else = "else", // 其他
  Error = "error",
  Warning = "warning",
  Info = "info",
  Debug = "debug",
  Low = "low",
  Normal = "normal",
  High = "high",
  Critical = "critical",
}

declare enum TraceDataTypes {
  UNKNOWN = "unknown",
  JAVASCRIPT = "js",
  LOG = "log",
  HTTP = "http",
  VUE = "vue",
  REACT = "react",
  RESOURCE = "resource",
  PROMISE = "promise",
  ROUTE = "route",
  PERF = "perf",
}

// 代码异常错误信息
export type TraceDataCodeError = TraceBaseData & {
  stack: [];
};

// 网络请求类型
export type TraceDataFetch = TraceBaseData & {
  // 执行时间，用于统计耗时
  elapsedTime: number;
  method: "POST" | "GET";
  httpType: "fetch" | "xhr";
  url: string;
  body: string;
  status: number;
};

export type TraceDataPromise = TraceBaseData;
export type TraceDataResource = TraceBaseData;
export type TraceDataLog = TraceBaseData & {
  tag: string; // 可以当标签使用，也可以当作一段需要标记的字符串
};
// PV/UV
export type TraceDataPageView = TraceBaseData & {
  route: string;
};

// webVitals 性能收集信息对象
export type TracePerf = {
  id: string;
  LCP?: number;
  LCPRating?: TracePerfRating;
  FID?: number;
  FIDRating?: TracePerfRating;
  FCP?: number;
  FCPRating?: TracePerfRating;
  TTFB?: number;
  TTFBRating?: TracePerfRating;
  CLS?: number;
  CLSRating?: TracePerfRating;
  INP?: number;
  INPRating?: TracePerfRating;
};

// ***** 基类行为日志信息 ********
export type TraceBaseAction = {
  name: string;
  level: TraceDataSeverity;
  time: string;
  type: BreadcrumbTypes;
  category: BreadcrumbsCategorys;
};

// 行为日志
export type TraceAction = TraceBaseAction & {
  // 行为动作相关的信息，可以是dom，可以是错误信息，可以是自定义信息
  message?: string;
  // 请求参数
  request?: any;
  // 请求结果内容
  response?: any;
  // 错误堆栈信息
  stack?: string;
};

// 行为日志的类别：用户点击，请求，日志输出，组件生命周期
export enum BreadcrumbsCategorys {
  User = "user",
  Http = "http",
  Debug = "debug",
  Exception = "exception",
  Lifecycle = "lifecycle",
}

// 异常信息类别
export enum BreadcrumbTypes {
  ROUTE = "Route",
  CLICK = "UI.Click",
  CONSOLE = "Console",
  FETCH = "Fetch",
  UNHANDLEDREJECTION = "Unhandledrejection",
  RESOURCE = "Resource",
  CODE_ERROR = "Code Error",
  CUSTOMER = "customer",
}

// 一份错误信息的类型集合
export type TraceTypeData = TraceDataFetch | TraceDataCodeError | TraceDataPromise | TraceDataResource | TraceDataLog | TraceDataPageView

// 操作行为日志
export type TraceBreadcrumbs = TraceAction[]

// 完整的全链路日志
export type TraceData = BaseTraceInfo & {
  // 记录错误信息
  data?: TraceTypeData
  // 记录操作行为
  breadcrumbs?: TraceBreadcrumbs
  // 记录性能信息
  perf?: TracePerf[]
}
