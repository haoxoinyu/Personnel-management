
/**
 * 员工
 */
export class Employees {
  id: number;
  eno: number;
  cardid: string;
  name: string;
  gender: string;
  phone: number;
  incubatorEmployee?: any;
  startupEmployee?: any;
  company?: any;

  constructor(
    id: number,
    eno: number,
    cardid: string,
    name: string,
    gender: string,
    phone: number,
    incubatorEmployee?: any,
    startupEmployee?: any,
    company?: any
  ) {
    this.id = id;
    this.eno = eno;
    this.cardid = cardid;
    this.name = name;
    this.gender = gender;
    this.phone = phone;
    this.incubatorEmployee = incubatorEmployee;
    this.startupEmployee = startupEmployee;
    this.company = company;
  }
}
