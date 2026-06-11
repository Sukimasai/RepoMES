import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoothStatus, POStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async inputVendorToEvent(data: any) {
    const { eventId, vendorName, boothNumber, poAvailable, poLink, poStartDate, poEndDate, fandoms, merchList } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create/Find Vendor
      let vendor = await tx.vendor.findFirst({ where: { name: vendorName } });
      if (!vendor) vendor = await tx.vendor.create({ data: { name: vendorName } });

      // 2. Link Vendor to Event
      const vendorEvent = await tx.vendorEvent.create({
        data: {
          vendorId: vendor.id,
          eventId,
          boothNumber: boothNumber || 'TBA',
          boothStatus: boothNumber ? BoothStatus.CONFIRMED : BoothStatus.TBA,
          poAvailable,
          poLink,
        }
      });

      // 3. Setup PO Timeline
      if (poAvailable && poStartDate && poEndDate) {
        await tx.preOrder.create({
          data: {
            vendorId: vendor.id,
            eventId,
            poUrl: poLink,
            startDate: new Date(poStartDate),
            endDate: new Date(poEndDate),
            status: POStatus.ACTIVE
          }
        });
      }

      // 4. Handle Fandoms
      const createdFandoms = await Promise.all(
        fandoms.map(async (fName: string) => tx.fandom.upsert({
          where: { name: fName },
          update: {},
          create: { name: fName }
        }))
      );

      // 5. Handle Merchandise
      await Promise.all(
        merchList.map(async (mName: string) => tx.merchandise.create({
          data: {
            vendorId: vendor.id,
            name: mName,
            salesStatus: poAvailable ? "PO_OTS" : "OTS_ONLY",
            fandoms: { connect: createdFandoms.map(f => ({ id: f.id })) }
          }
        }))
      );

      return vendorEvent;
    });
  }
}