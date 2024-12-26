/**
 * 创业公司
 */
export class Startup {
  id: number;
  sno: number;
  name: string;
  phone: number;

  constructor(id: number, sno: number, name: string, phone: number) {
    this.id = id;
    this.sno = sno;
    this.name = name;
    this.phone = phone;
  }
}
