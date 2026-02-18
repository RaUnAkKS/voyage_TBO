export interface VendorPackage {
    id: string;
    name: string;
    category: 'wedding' | 'event' | 'conference' | 'meeting';
    price: number;
    rating: number;
    image: string;
    services: string[];
    description: string;
}

export const VENDOR_PACKAGES: VendorPackage[] = [
    {
        id: 'pkg_1',
        name: 'Royal Palace Wedding',
        category: 'wedding',
        price: 5000,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
        services: ['Venue: Grand Palace', 'Catering for 500', 'Live Orchestra', 'Premium Decor'],
        description: 'A luxurious experience fit for royalty with complete event management.'
    },
    {
        id: 'pkg_2',
        name: 'Beachside Bliss',
        category: 'wedding',
        price: 3500,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=800',
        services: ['Venue: Private Beach', 'Seafood Buffet', 'DJ & Dance Floor', 'Floral Arch'],
        description: 'Romantic sunset wedding package with ocean views.'
    },
    {
        id: 'pkg_3',
        name: 'Garden Intimacy',
        category: 'wedding',
        price: 2000,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800',
        services: ['Venue: Botanical Garden', 'Organic Menu', 'Acoustic Band', 'Fairy Lights'],
        description: 'Perfect for intimate gatherings in a lush natural setting.'
    },
    {
        id: 'pkg_4',
        name: 'Urban Chic',
        category: 'wedding',
        price: 4200,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
        services: ['Venue: Rooftop Loft', 'Cocktail Bar', 'Modern Decor', 'Photography'],
        description: 'Contemporary city wedding with skyline views.'
    },
    {
        id: 'pkg_5',
        name: 'Corporate Summit',
        category: 'conference',
        price: 8000,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800',
        services: ['Venue: Convention Center', 'AV Equipment', 'Catering', 'Breakout Rooms'],
        description: 'Full-service conference package including tech support.'
    }
];
