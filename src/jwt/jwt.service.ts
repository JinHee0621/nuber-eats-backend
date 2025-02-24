import { Inject, Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { JwtModuleOptions } from './jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
    options: any;
    constructor(
        //@Inject(CONFIG_OPTIONS) private readonly options:JwtModuleOptions,
        private readonly configService : ConfigService
    ) {}
    sign(userId:number) : string {
        //@ts-ignore
        return jwt.sign({id: userId}, this.configService.get("PRIVATE_KEY"));
    }
    verify(token:string) {
        //@ts-ignore
        return jwt.verify(token, this.configService.get("PRIVATE_KEY"));
    }
}
