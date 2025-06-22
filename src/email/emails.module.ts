import { Module } from "@nestjs/common";
import { EmailService } from "./emails.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    providers: [EmailService],
    exports: [EmailService],
    imports: [
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: {
            host: config.getOrThrow<string>('email.host'),
            port: Number(config.getOrThrow<string>('email.port')),
            secure: false,
            service: 'gmail',
            auth: {
              user: config.getOrThrow<string>('email.user'),
              pass: config.getOrThrow<string>('email.password'),
            },
            tls: {
              rejectUnauthorized: false,
              minVersion: 'TLSv1.2',
            },
          },
          defaults: {
            from: `"No Reply" <${config.getOrThrow<string>('email.from')}>`,
          },
        }),
      }),
    ]
  })
export class EmailModule {}