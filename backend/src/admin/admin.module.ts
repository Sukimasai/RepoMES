import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Imports Prisma so the service can use it
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}