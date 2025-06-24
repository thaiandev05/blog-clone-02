import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TaskService{

    constructor(
        private readonly prisma: PrismaService
    ){}

    @Cron('0 0 * * *')// check every day at midnight
    checkAveryDayExpridedDeleted() {
      this.prisma.users.deleteMany({
        where: {
          isDeleted: true,
          deletedAt: {
            lt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),// delete user after 15 days
          },
        },
      })


      this.prisma.post.deleteMany({
        where: {
          isDelete: true,
          deletedAt: {
            lt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),// delete user after 15 days
          },
        },
      })
    }

}