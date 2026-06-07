export interface Doctor {
  id: string;
  name: string;
  specialty: string; // e.g., "OTOLARYNGOLOGIST", "PULMONOLOGIST", "OBSTETRICS & GYNECOLOGY"
  department: string; // e.g., "Sp.THT-KL", "Sp.P", "Sp.OG"
  schedule: {
    [day: string]: string; // Day: "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu" -> schedule hours e.g., "09:00 - 13:00"
  };
  image_url?: string;
  avatarUrl?: string; // or base64
  active?: boolean;
}

export interface YearStats {
  year: string;
  outpatient: number;
  inpatient: number;
  surgical: number;
  emergency: number;
  mcu: number;
}

export interface HospitalFacility {
  id: string;
  title: string;
  category: "Layanan Kontinu" | "Poli Spesialis" | "Rawat Inap" | "Fasilitas Medis" | "Peralatan Canggih";
  description: string;
  imageUrl?: string;
  specs?: string[];
}

export interface CoverSlide {
  tagline: string;
  title: string;
  description: string;
  image: string;
}

export interface ExcellenceItem {
  title: string;
  description: string;
  image: string;
}

export interface ClinicSlide {
  title: string;
  description: string;
  schedule: string;
  amenities: string[];
  image1?: string;
  image2?: string;
  image3?: string;
}

export interface EquipmentItem {
  name: string;
  description: string;
  image: string;
}

export interface PlanSlide {
  title: string;
  description: string;
  image: string;
  timeline?: {
    year: string;
    title: string;
    points: string | string[];
    position: "top" | "bottom";
  }[];
}

export interface SocialsSlide {
  phone: string;
  instagram: string;
  facebook: string;
  website: string;
  igWidget?: string;
  googleWidget?: string;
}

export interface SlideConfigItem {
  id: string;        // unique identifier (e.g. "cover", "excellence", "doctor-OTOLARYNGOLOGIST")
  label: string;     // display label
  enabled: boolean;  // visible in slideshow?
  isDynamic?: boolean; // true for doctor-specialty slides (cannot be individually reordered, managed as a group)
}
export interface PartnerSlide {
  id: string;
  title: string;
  subtitle?: string;
  logos: string[];
}

export interface DatabaseState {
  doctors: Doctor[];
  stats: YearStats[];
  statsMeta?: {
    subtitle: string;
    title: string;
    description: string;
  };
  facilities: HospitalFacility[];
  cover?: CoverSlide;
  excellence?: ExcellenceItem[];
  clinic?: ClinicSlide;
  equipments?: EquipmentItem[];
  plan?: PlanSlide;
  socials?: SocialsSlide;
  slideConfig?: SlideConfigItem[];
  partners?: PartnerSlide[];
}

