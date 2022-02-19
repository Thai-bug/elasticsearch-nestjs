export interface IUserService{
    getUser(id: number): Promise<any>;
}