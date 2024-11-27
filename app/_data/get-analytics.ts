// TODO: 
// 1 - Adicionar verificacao nos valores de variação de porcentagem para nao retornarem NaN e Inifinity
// 2 - Ver count de quantos users tem telefone
// 3 - Ver se é possível melhorar as métricas relacionadas a faturamento
// 4 - Adicionar dias de pico semanal e mensal
// 5 - No futuro poder ver quais bookings foram cancelados e remarcados
// 6 - Ver interações com mais de um barbeiro
// 7 - Analytics relacionados a serviços em específico

import { format, startOfDay, startOfWeek, startOfMonth, subWeeks, subMonths, differenceInDays } from 'date-fns'
import { db } from '../_lib/prisma'
import { AnalyticsData } from '../_types/analytics-data'
import { ptBR } from 'date-fns/locale'

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const thisWeekStart = startOfWeek(now);
    const thisMonthStart = startOfMonth(now);
    const lastWeekStart = subWeeks(thisWeekStart, 1);
    const lastMonthStart = subMonths(thisMonthStart, 1);

    const [
      totalBookingsToday,
      totalBookingsThisWeek,
      totalBookingsThisMonth,
      totalUsers,
      totalBarbershops,
      totalServices,
      bookingsWithServices,
      bookingsWithUsers,
      timeSlots,
      thisWeekBookings,
      lastWeekBookings,
      thisMonthBookings,
      lastMonthBookings,
      usersWithPhone
    ] = await Promise.all([
      db.booking.count({ where: { date: { gte: today } } }),
      db.booking.count({ where: { date: { gte: thisWeekStart } } }),
      db.booking.count({ where: { date: { gte: thisMonthStart } } }),
      db.user.count(),
      db.barbershop.count(),
      db.barbershopService.count(),
      db.booking.findMany({ include: { service: true } }),
      db.booking.findMany({ include: { user: true } }),
      db.timeSlot.findMany(),
      db.booking.findMany({ where: { date: { gte: thisWeekStart } }, include: { service: true } }),
      db.booking.findMany({ where: { date: { gte: lastWeekStart, lt: thisWeekStart } }, include: { service: true } }),
      db.booking.findMany({ where: { date: { gte: thisMonthStart } }, include: { service: true } }),
      db.booking.findMany({ where: { date: { gte: lastMonthStart, lt: thisMonthStart } }, include: { service: true } }),
      db.user.count({ where: { phone: { not: null } } })
    ]);

    // Helper function to calculate revenue
    const calculateRevenue = (bookings: any[]): number => 
      (bookings ?? []).reduce((sum, booking) => sum + Number(booking.service?.price || 0), 0);

    // Calculate additional metrics
    const totalRevenue = calculateRevenue(bookingsWithServices);
    const thisWeekRevenue = calculateRevenue(thisWeekBookings);
    const lastWeekRevenue = calculateRevenue(lastWeekBookings);
    const thisMonthRevenue = calculateRevenue(thisMonthBookings);
    const lastMonthRevenue = calculateRevenue(lastMonthBookings);

    const averageServicePrice =
      (bookingsWithServices?.length ?? 0) > 0
        ? totalRevenue / bookingsWithServices.length
        : 0;

    const serviceCounts = bookingsWithServices.reduce((acc, booking) => {
      if (booking.service?.name) {
        acc[booking.service.name] = (acc[booking.service.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, bookings: count })) || [];

    const uniqueCustomers = new Set(
      bookingsWithUsers.map((booking) => booking.userId)
    ).size;
    const repeatCustomers = Math.max(totalUsers - uniqueCustomers, 0);

    const totalTimeSlots = timeSlots.length || 0;
    const availableTimeSlots = timeSlots.filter((slot) => slot.isAvailable).length || 0;
    const occupancyRate =
      totalTimeSlots > 0
        ? ((totalTimeSlots - availableTimeSlots) / totalTimeSlots) * 100
        : 0;

    // Calculate average bookings per day
    const daysInThisMonth = differenceInDays(now, thisMonthStart) + 1;
    const daysInLastMonth = differenceInDays(thisMonthStart, lastMonthStart);
    const avgBookingsPerDayThisMonth =
      totalBookingsThisMonth / (daysInThisMonth || 1);
    const avgBookingsPerDayLastMonth =
      (lastMonthBookings?.length || 0) / (daysInLastMonth || 1);

    // Calculate weekday distribution
    const weekdayDistribution = thisMonthBookings.reduce((acc, booking) => {
      if (booking.date) {
        const dayOfWeek = format(new Date(booking.date), 'EEEE', { locale: ptBR });
        acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Find peak days
    const weeklyPeakDay = Object.entries(weekdayDistribution)
      .sort((a, b) => b[1] - a[1])?.[0]?.[0] || 'Não encontrado';

    const monthlyBookingCounts = thisMonthBookings.reduce((acc, booking) => {
      const day = format(new Date(booking.date), 'd');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyPeakDay = Object.entries(monthlyBookingCounts)
      .sort((a, b) => b[1] - a[1])?.[0]?.[0] || 'não encontrado';

    // Helper function to calculate percentage change
    const calculatePercentageChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? '100' : '0';
      const change = ((current - previous) / previous) * 100;
      return isFinite(change) ? change.toFixed(2) : '0';
    };

    return {
      totalBookings: {
        daily: totalBookingsToday || 0,
        weekly: totalBookingsThisWeek || 0,
        monthly: totalBookingsThisMonth || 0,
      },
      revenue: {
        total: totalRevenue.toFixed(2),
        averagePerBooking: averageServicePrice.toFixed(2),
        weekly: {
          current: thisWeekRevenue.toFixed(2),
          previous: lastWeekRevenue.toFixed(2),
          change: calculatePercentageChange(
            thisWeekRevenue,
            lastWeekRevenue
          ),
        },
        monthly: {
          current: thisMonthRevenue.toFixed(2),
          previous: lastMonthRevenue.toFixed(2),
          change: calculatePercentageChange(
            thisMonthRevenue,
            lastMonthRevenue
          ),
        },
      },
      services: {
        total: totalServices || 0,
        topFive: topServices || [],
      },
      customers: {
        total: totalUsers || 0,
        new: uniqueCustomers || 0,
        returning: repeatCustomers || 0,
        withPhone: usersWithPhone || 0,
      },
      occupancy: {
        rate: occupancyRate.toFixed(2),
        availableSlots: availableTimeSlots || 0,
        totalSlots: totalTimeSlots || 0,
      },
      barbershops: {
        total: totalBarbershops || 0,
      },
      averageBookingsPerDay: {
        thisMonth: avgBookingsPerDayThisMonth.toFixed(2),
        lastMonth: avgBookingsPerDayLastMonth.toFixed(2),
        change: calculatePercentageChange(
          avgBookingsPerDayThisMonth,
          avgBookingsPerDayLastMonth
        ),
        weekdayDistribution: weekdayDistribution || {},
      },
      peakDays: {
        weekly: weeklyPeakDay,
        monthly: monthlyPeakDay,
      },
      dateRanges: {
        today: format(today, "dd 'de' MMM',' yyyy", { locale: ptBR }),
        weekStart: format(thisWeekStart, "dd 'de' MMM',' yyyy", {
          locale: ptBR,
        }),
        monthStart: format(thisMonthStart, "dd 'de' MMM',' yyyy", {
          locale: ptBR,
        }),
        lastWeekStart: format(lastWeekStart, "dd 'de' MMM',' yyyy", {
          locale: ptBR,
        }),
        lastMonthStart: format(lastMonthStart, "dd 'de' MMM',' yyyy", {
          locale: ptBR,
        }),
      },
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
}
