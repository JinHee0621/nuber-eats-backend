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

    private async sendEmail(subject:string, to:string, template:string, emailVars:EmailVar[]) {
        const form = new FormData();
        form.append("from", `Excited User <mailgun@${this.options.domain}>`);
        form.append("to", to);
        form.append("subject", subject);
        form.append("template", template);

        //@ts-ignore
        emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
        try{
            await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
                method : 'POST',
                headers: {
                    Authorization : `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },
                body : form
            });
        }catch(error) {
            console.log(error);
        }
    }

    sendVerificationEmail(email:string, code:string) {
        this.sendEmail("Verify Your Email", `${this.options.targetEmail}`, "nuber-eats-verify", [
            {"key" : "code", "value" : code},
            {"key" : "username", "value" : email}
        ]);
    }

}
