import { Inject, Injectable } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interface';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options:MailModuleOptions,
    ) {
        //this.sendEmail('test', `nuber-eats-verify`);
    }

    async sendEmail(subject:string, template:string, emailVars:EmailVar[]) : Promise<boolean> { //template:string,
        const form = new FormData();
        form.append("from", `Excited User <mailgun@${this.options.domain}>`);
        form.append("to", 'to'); // need to Email address
        form.append("subject", subject);
        form.append("template", template);

        //@ts-ignore
        emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
        try{
            await got.post(`https://api.mailgun.net/v3/${this.options.domain}/messages`, 
            {
                headers: {
                    Authorization : `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },
                body : form
            });
            return true;
        }catch(error) {
            console.log(error);
            return false;
        }
    }

    sendVerificationEmail(email:string, code:string) { //`${this.options.targetEmail}`,
        this.sendEmail("Verify Your Email",  'verify-email', [
            {"key" : "code", "value" : code},
            {"key" : "username", "value" : email}
        ]);
    }

}
