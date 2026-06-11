import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This is critical! It allows Admin and Events to use Prisma.
})
export class PrismaModule {}