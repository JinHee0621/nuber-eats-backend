export interface MailModuleOptions {
    apiKey ?: string;
    domain ?: string;
    fromEmail ?: string;
    targetEmail ?: string;
}

export interface EmailVar {
    key ?: string;
    value ?: string;
}