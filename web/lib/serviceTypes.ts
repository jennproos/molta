import type {PortableTextBlock} from 'next-sanity';

export interface PastrySize {
  _key: string;
  name: string;
  price: number;
  description?: string;
}

export interface PastryOption {
  _key: string;
  name: string;
  flavorOptions?: string[];
}

export interface PastryBoxData {
  description: PortableTextBlock[];
  oneTimePurchaseAvailable: boolean;
  frequencyOptions: string[];
  sizes: PastrySize[];
  maxPastryTypesPerBox: number;
  pastryOptions: PastryOption[];
  deliveryFee?: number;
  dietaryNote?: string;
}

export interface Sandwich {
  _key: string;
  name: string;
  classicName?: string;
  ingredients?: string[];
  price: number;
}

export interface SandwichServiceData {
  description: PortableTextBlock[];
  groupOrderNote?: string;
  sandwiches: Sandwich[];
  modificationNote?: string;
  dietaryNote?: string;
  deliveryFee?: number;
}

export interface BreadProduct {
  _key: string;
  name: string;
  category: 'bread' | 'englishMuffins';
  price: number;
  description?: string;
}

export interface BreadSubscriptionData {
  description: PortableTextBlock[];
  frequencyOptions: string[];
  products: BreadProduct[];
  deliveryFee?: number;
  pickupLocation?: string;
  pickupWindow?: string;
}

export interface Testimonial {
  _id: string;
  customerName: string;
  quote: string;
}
