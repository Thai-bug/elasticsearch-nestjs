import { Controller, Get } from "@nestjs/common";
import { UserService } from "src/Services/UserService";

@Controller('/api/v1/users')
export class UserController{
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): any {
    return this.userService.getUser(1);
  }
}