import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAllEvents() {
    return this.prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    });
  }

  async findEventDetails(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');

    const vendors = await this.prisma.vendorEvent.findMany({
      where: { eventId },
      include: {
        vendor: {
          include: {
            merchandises: { include: { fandoms: true } },
            preOrders: { where: { eventId } }
          }
        }
      }
    });

    return { event, vendors };
  }
}