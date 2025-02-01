import { CreateAccountInput } from './dtos/create-account.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>
    ) {}

    async createAccount({email, password, role}:CreateAccountInput) : Promise<string | undefined> {
        try{
            const exists = await this.users.findOne({where: {email}})
            if(exists) {
                return "There is a user with that email already";
            }
            await this.users.save(this.users.create({email, password, role}));
        }catch(e) {
            return "Couldn't create account";
        }
        // check new user
        // create user & hash the password

    }
}