export type TicketWindowId = 'early' | 'new_day' | 'last_chance';

export interface TicketWindow {
  id: TicketWindowId;
  name: string;
  startDate: Date;
  endDate: Date;
  prices: { individual: number; team: number };
}

export const TICKET_WINDOWS: TicketWindow[] = [
  {
    id: 'early',
    name: 'Early Bird',
    startDate: new Date('2026-09-26T00:00:00+05:30'),
    endDate: new Date('2026-09-28T23:59:59+05:30'),
    prices: { individual: 99, team: 399 }
  },
  {
    id: 'new_day',
    name: 'New Day',
    startDate: new Date('2026-09-30T00:00:00+05:30'),
    endDate: new Date('2026-10-02T23:59:59+05:30'),
    prices: { individual: 129, team: 499 }
  },
  {
    id: 'last_chance',
    name: 'Last Chance',
    startDate: new Date('2026-10-03T00:00:00+05:30'),
    endDate: new Date('2026-10-06T23:59:59+05:30'),
    prices: { individual: 179, team: 699 }
  }
];

export const getWindowStatus = (w: TicketWindow, now: Date) => {
  if (now < w.startDate) return 'upcoming';
  if (now > w.endDate) return 'expired';
  return 'active';
};

export const formatTimeLeft = (targetDate: Date, now: Date) => {
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return '00:00:00:00';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
};
