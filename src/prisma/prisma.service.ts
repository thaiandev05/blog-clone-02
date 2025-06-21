import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy{

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      omit: { users: { password: true } },//có nghĩa là mặc định, trường password sẽ bị loại bỏ khỏi kết quả truy vấn cho model User . Đây là một cách để đảm bảo rằng mật khẩu của người dùng không bị lộ ra ngoài khi truy vấn dữ liệu.
    })
  }

  async onModuleInit(){
    await this.$connect()
  }
  async onModuleDestroy(){
    await this.$disconnect()
  }
}