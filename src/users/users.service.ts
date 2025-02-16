import { CreateAccountInput } from './dtos/create-account.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { LoginInput } from './dtos/login.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) 
        private readonly verification: Repository<Verification>,
        private readonly jwtService: JwtService
    ) {}



    async createAccount({email, password, role}:CreateAccountInput) : Promise<{ok : boolean; error?: string}> {
        try{
            const exists = await this.users.findOne({where: {email}})
            if(exists) {
                return { ok: false, error: "There is a user with that email already"};
            }
            const user = await this.users.save(this.users.create({email, password, role}));
            await this.verification.save(this.verification.create({
                user
            }))
            return {ok: true};
        }catch(e) {
            return {ok: false, error: "Couldn't create account"};
        }
        // check new user
        // create user & hash the password

    }

    async login({email, password} : LoginInput) : Promise<{ok : boolean; error?: string; token?: string}> {
        try{
            const user = await this.users.findOne({ where: {email}, select : ['id','password']})
            if(!user) {
                return {
                    ok:false,
                    error: "User not found",
                }
            }
            const passwordCurrect = await user.checkPassword(password);
            if(!passwordCurrect) {
                return {
                    ok: false,
                    error: "Wrong password"
                }
            }

            //@ts-ignore
            const token = this.jwtService.sign(user.id);

            return {
                ok: true,
                token : token
            }
        }catch(error) {
            return {
                ok: false,
                error
            }
        }
    }

    async findById(id:number) : Promise<User>{
        //@ts-ignore
        return this.users.findOne({where: {id}});
    }

    async editProfile(userId:number, {email, password}:EditProfileInput) : Promise<EditProfileOutput> {
        try {
            const editUser  = await this.users.findOne({where: {id : userId}}); 
            if(email) {
                //@ts-ignore
                editUser.email = email;
                //@ts-ignore
                editUser.verified = false;
                //@ts-ignore
                await this.verification.save(this.verification.create({editUser}))
            }
            if(password) {
                //@ts-ignore
                editUser.password = password;
            }
            //@ts-ignore
            return this.users.save(editUser);
        } catch (error) {
            return {ok : false, error};
        }
    }

    async verifyEmail(code:string) : Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verification.findOne({where : {code}, relations : ['user']});
            if(verification) {
                verification.user.verified = true;
                this.users.save(verification.user);
                return { ok: true} ;
            }
            throw new Error();
        }catch(error) {
            console.log(error);
            return {ok:false, error};
        }

    }
}