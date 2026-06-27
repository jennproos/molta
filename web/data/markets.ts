export interface Market {
  month: string;
  day: number;
  name: string;
  location: string;
  time: string;
}

export const markets: Market[] = [
  { month: 'JUL', day: 11, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'JUL', day: 18, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'JUL', day: 25, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'AUG', day: 1,  name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'AUG', day: 8,  name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'AUG', day: 15, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'AUG', day: 22, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'AUG', day: 29, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'SEPT', day: 12, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'SEPT', day: 19, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
  { month: 'SEPT', day: 26, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm' },
];
