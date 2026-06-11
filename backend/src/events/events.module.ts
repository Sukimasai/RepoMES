import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Imports Prisma so the service can use it
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}