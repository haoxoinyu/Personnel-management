/**
 * 孵化公司
 */
export class Incubator {
  id: number;
  ino: number;
  name: string;
  // tslint:disable-next-line:variable-name
  legal_name: string;
  address: string;
  phone: number;

  // tslint:disable-next-line:variable-name
  constructor(id: number, ino: number, name: string, legal_name: string, address: string, phone: number) {
    this.id = id;
    this.ino = ino;
    this.name = name;
    this.legal_name = legal_name;
    this.address = address;
    this.phone = phone;
  }
}
