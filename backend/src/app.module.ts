import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, 
    EventsModule, 
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}