import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents() {
    return this.eventsService.findAllEvents();
  }

  @Get(':id')
  getEventDetails(@Param('id') id: string) {
    return this.eventsService.findEventDetails(id);
  }
}