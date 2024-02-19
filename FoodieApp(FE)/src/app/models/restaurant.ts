export interface Restaurant {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    rating: number;
    contact: Contact;
    cuisine: string[];
    menu: Menu[];
    reviews: Review[];
    features: Features;
    images: string;
    social_media: SocialMedia;
    payment_methods: string[];
    specials: Specials;
    health_safety: HealthSafety;
    favourite: boolean;
  }
  
  export interface Contact {
    
  }
  
  export interface Menu {
    name: string;
    price: number;
    rating: number;
    image: string;
  }
  export interface Review {
   
  }
  
  export interface Features {
   
  }
  
  export interface SocialMedia {
  
  }
  
  export interface Specials {
 
  }
  
  export interface HealthSafety {
   
  }