import ClientMonitor from "skywalking-client-js";
import { BreadcrumbTypes, BreadcrumbsCategorys, TraceAction, TraceBreadcrumbs, TraceDataLog, TraceDataSeverity } from "./type";

export class BaseTrace implements BaseTraceInterface {
  public breadcrumb: TraceBreadcrumbs = []; // 记录用户行为
  public maxBreadcrumb = 10; // 最大记录条数


  public init () {
    ClientMonitor.register({
      collector: "http://localhost:12800",
      service: "ai-zhenxiang",
      pagePath: "/column/intro/123",
      serviceVersion: "v1.0.0",
      enableSPA: true, // spa
      vue: Vue, // Vue 对象
      jsError: false,
      resourceErrors: false
    });
  }

  public saveBreadcrumb(data: TraceBreadcrumbs) {
    this.breadcrumb.push(data);
    if (this.breadcrumb.length > this.maxBreadcrumb) {
      this.breadcrumb.shift()
    }
  }

  public onGlobalClick(){
    const _t = this
    window.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const innerHTML = target.innerHTML;
      const bc: TraceAction = {
        name: 'click',
        level: TraceDataSeverity.Normal,
        type: BreadcrumbTypes.CLICK,
        category: BreadcrumbsCategorys.User,
        message: innerHTML,
        time: getTimestamp(),
      }
    })
  }

  public log(log: TraceDataLog) {
    this.saveBreadcrumb({
      name: 'custome-log',
      level: log.level,
      type: dataType2BreadcrumbType[log.type],
      category: dataCategory2BreadcrumbCategory[log.type],
      message: log.message,
      time: getTimeStamp();
    });

    this.send(log);
  }

  // 普通日志函数
  // 记录普通日志，可以用来调试业务日志，自定义catch日志
  // message: 记录日志信息。
  // tag: 区分不同的日志而提供的打标签的功能
  public info(message: string, tag?: string){
    this.log({
      name: 'custome-log',
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Info,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ''}`),
      tag
    })
  }

  // 记录业务逻辑中需要重点关注的地方。主要预警数据校验失败这类场景。
  public warn(message: string, tag?: string){ 
    this.log({
      name: 'custome-log',
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Warning,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ''}`),
      tag
    })
  }

  // 捕获并记录业务员逻辑中出现的代码异常，能够详细记录异常信息
  // 包括但不局限于JSON解析异常，以及通过 try catch 捕获的异常
  // 通常来说，在代码中出现了这类错误，肯定是业务出现了一些问题
  public error(message: string, tag?: string){
    this.log({
      name: 'custome-log',
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Error,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ''}`),
      tag
    })
  }

  public saveError(event: ErrorEvent){
    const target = event.target || event.srcElement;
    const isResTarget = isResourceTarget(target as HTMLElement);
    const nodeName = (target as HTMLElement).nodeName;
    
    if (!isResTarget){
      // ...
      this.resources.push(traceData)
      this.breadcrumb.push({
        name: event.error.name,
        type: BreadcrumbTypes.CODE_ERROR,
        category: BreadcrumbsCategorys.Exception,
        level: TraceDataSeverity.Error,
        message: event.message,
        stack: event.error.stack,
        time: getTimestamp()
      })
    } else {
      // ...
      this.resources.push(traceData);
      this.breadcrumb.push({
        name: traceData.name,
        type: BreadcrumbTypes.RESOURCE,
        category: BreadcrumbsCategorys.Exception,
        level: TraceDataSeverity.Warning,
        message: event.message,
        time: getTimestamp()
      })
    }
  }
}
