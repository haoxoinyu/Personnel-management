

/**
 * 项目
 */
export class Project {
  id: number;
  num: number;
  // tslint:disable-next-line:variable-name
  startup: any;
  // tslint:disable-next-line:variable-name
  investors: any;
  // tslint:disable-next-line:variable-name
  incubator?: number;
  incubatorEmployee?: any;

  constructor(id: number, num: number, startup: any, investors: any, incubator?: number, incubatorEmployee?: any) {
    this.id = id;
    this.num = num;
    this.startup = startup;
    this.investors = investors;
    this.incubator = incubator;
    this.incubatorEmployee = incubatorEmployee;
  }
}
