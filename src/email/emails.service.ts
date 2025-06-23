import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import { join } from "path";
import { MailerService } from '@nestjs-modules/mailer'
@Injectable()
export class EmailService{

    constructor(
        private readonly mailService: MailerService,
        private readonly config: ConfigService
    ){}

    async sendVerificationEmail(email: string, token: string) {
        const encodedEmail = encodeURIComponent(email)
        const encodedToken = encodeURIComponent(token)
    
        const url = `${this.config.getOrThrow<string>('app.host')}/auth/verify-email/confirm?code=${encodedToken}&email=${encodedEmail}`
        const templatePath = join(__dirname, 'templates', 'verify.email.html')
        let templateHtml: string
        try {
          templateHtml = readFileSync(templatePath, 'utf8')
        } catch (error) {
          console.error(`Failed to read email template at ${templatePath}:`, error)
          throw new Error('Could not load verification email template')
        }
        const html = templateHtml.replace('{{VERIFICATION_LINK}}', url)
    
        await this.mailService.sendMail({
          to: email,
          subject: 'Email Verification',
          html,
        })
    }

    async sendResetPassword(email: string,generatedPassword: string){
          const templatePath = join(__dirname, 'templates', 'reset-password.email.html')

          let templateHtml: string
          try {
            templateHtml = readFileSync(templatePath, 'utf8')
          } catch (error) {
            console.error(`Failed to read email template at ${templatePath}:`, error)
            throw new Error('Could not load reset email template')
          }

          const html = templateHtml.replace('{{AUTO_GENERATED_PASSWORD}}', generatedPassword)

          await this.mailService.sendMail({
            to: email,
            subject: 'Email Reset Password',
            html
          })
    }

      async sendConfirmDeletedAccount(email: string, token: string){
        const encodedEmail = encodeURIComponent(email)
        const encodedToken = encodeURIComponent(token)
    
        const url = `${this.config.getOrThrow<string>('app.host')}/auth/deleted-email/confirm?code=${encodedToken}&email=${encodedEmail}`
        const templatePath = join(__dirname, 'templates', 'confirm-delete-account.email.html')
        let templateHtml: string
        try {
          templateHtml = readFileSync(templatePath, 'utf8')
        } catch (error) {
          console.error(`Failed to read email template at ${templatePath}:`, error)
          throw new Error('Could not load deleted email template')
        }
        const html = templateHtml.replace('{{CONFIRM_DELETE_LINK}}', url)
    
        await this.mailService.sendMail({
          to: email,
          subject: 'Email deleted',
          html
        })
      }

}