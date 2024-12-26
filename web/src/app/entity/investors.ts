/**
 * 投资方
 */
export class Investors {
  id: number;
  num: number;
  name: string;
  phone: number;

  constructor(id: number, num: number, name: string, phone: number) {
    this.id = id;
    this.num = num;
    this.name = name;
    this.phone = phone;
  }
}
