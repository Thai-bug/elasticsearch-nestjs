import { IUserService } from "@Interfaces/Services/IUserService";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService implements IUserService {
  async getUser(id: number): Promise<any> {
    return {
      id: id,
      name: "John Doe",
      email: ""
    };
  }
}