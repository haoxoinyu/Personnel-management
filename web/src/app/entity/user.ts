/**
 * 用户
 */
export class User {
  id: number;
  name: string;
  username: string;
  password: string | undefined;

  /**
   * 构造函数
   * @param id id
   * @param username 用户名
   * @param name 姓名
   * @param password 密码
   */
  constructor(id: number, username: string, name: string, password: string | undefined) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
  }
}
