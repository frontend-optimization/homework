export class BaseTrace implements BaseTraceInterface {
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
}
