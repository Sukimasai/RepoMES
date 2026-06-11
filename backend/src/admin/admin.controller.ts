import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('vendor-event')
  async assignVendor(@Body() body: any) {
    return this.adminService.inputVendorToEvent(body);
  }
}