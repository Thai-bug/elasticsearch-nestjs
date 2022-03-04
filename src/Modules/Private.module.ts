import { PrivateController } from "@Controllers/Private.controller";
import { CacheModule, Module } from "@nestjs/common";
import { AuthModule } from "./Auth.module";
import { UsersModule } from "./User.module";

@Module({
  imports:[
    CacheModule.register(),
    AuthModule,
    UsersModule
  ],
  exports: [AuthModule],
  providers:[],
  controllers:[PrivateController]
})
export class PrivateModule{}