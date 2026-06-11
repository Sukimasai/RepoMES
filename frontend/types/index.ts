// types/index.ts

export interface Event {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface Fandom {
  id: string;
  name: string;
}

export interface Merchandise {
  id: string;
  name: string;
  type: string;
  salesStatus: string;
  fandoms: Fandom[];
}

export interface PreOrder {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Vendor {
  id: string;
  name: string;
  merchandises: Merchandise[];
  preOrders: PreOrder[];
}

export interface VendorEvent {
  id: string;
  eventId: string;
  vendorId: string;
  boothNumber: string | null;
  boothStatus: string;
  poAvailable: boolean;
  poLink: string | null;
  vendor: Vendor;
}

export interface EventDetailResponse {
  event: Event;
  vendors: VendorEvent[];
}