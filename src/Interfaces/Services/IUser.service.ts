import { User } from "@Entities/User.entity";

export interface IUserService{
    getUser(id: number): Promise<User>;

    login(options: any): Promise<User | null>;
}