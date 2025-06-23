import { Module } from "@nestjs/common";
import { TaskService } from "./tasks.service";

@Module({
    providers: [TaskService],
    exports: [TaskService]
})
export class TaskModule{

}