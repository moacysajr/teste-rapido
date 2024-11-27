export interface TopService {
  name: string;
  bookings: number;
}

export interface RevenueData {
  total: string;
  averagePerBooking: string;
  weekly: {
    current: string;
    previous: string;
    change: string;
  };
  monthly: {
    current: string;
    previous: string;
    change: string;
  };
}

export interface AnalyticsData {
  totalBookings: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  revenue: RevenueData;
  services: {
    total: number;
    topFive: TopService[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    withPhone: number;
  };
  occupancy: {
    rate: string;
    availableSlots: number;
    totalSlots: number;
  };
  barbershops: {
    total: number;
  };
  averageBookingsPerDay: {
    thisMonth: string;
    lastMonth: string;
    change: string;
    weekdayDistribution: Record<string, number>;
  };
  peakDays: {
    weekly: string;
    monthly: string;
  };
  dateRanges: {
    today: string;
    weekStart: string;
    monthStart: string;
    lastWeekStart: string;
    lastMonthStart: string;
  };
}