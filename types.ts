
export enum ProjectStatus {
  LEAD = 'Lead',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold'
}

export enum PackageType {
  COMBO_1 = 'Combo 1',
  COMBO_2 = 'Combo 2',
  CUSTOM = 'Custom'
}

export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
  date?: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  description: string;
}

export type DocStatus = 'Draft' | 'Sent' | 'Viewed' | 'Paid' | 'Overdue' | 'Signed';

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  status: DocStatus;
  dueDate: string;
  items: string[];
  sentAt?: string;
  viewedAt?: string;
}

export interface SplitSheet {
  id: string;
  projectId: string;
  trackTitle: string;
  status: 'Draft' | 'Sent' | 'Signed';
  participants: {
    name: string;
    role: string;
    share: number; // percentage
  }[];
  sentAt?: string;
  viewedAt?: string;
}

export interface Asset {
  id: string;
  projectId: string;
  name: string;
  type: 'Instrumental' | 'Vocal Stems' | 'Demo' | 'Master' | 'Video' | 'Art';
  url: string;
  uploadedAt: string;
  size: string;
}

export interface Message {
  id: string;
  sender: 'client' | 'operator';
  text: string;
  timestamp: string;
  platform: 'WhatsApp' | 'Messenger' | 'Instagram' | 'Email';
}

export interface TimelineEvent {
  id: string;
  type: 'message' | 'milestone' | 'payment' | 'document' | 'asset';
  title: string;
  description: string;
  date: string;
  icon: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  type: PackageType;
  status: ProjectStatus;
  progress: number; 
  value: number;
  payments: Payment[];
  checklist: ChecklistItem[];
  startDate: string;
  targetDate: string;
  genre: string;
}

export interface Client {
  id: string;
  name: string;
  alias?: string;
  email: string;
  phone: string;
  instagram?: string;
  tiktok?: string;
  bio?: string;
  whatsappLink: string;
  source: string;
  brand: 'Canti Records' | 'Canti Media';
  genreTags: string[];
  status: ProjectStatus;
  lastContactDate: string;
  avatarUrl: string;
  conversations: Message[];
  timeline: TimelineEvent[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  includes: string[];
}

export interface LeadIntake {
  id: string;
  name: string;
  source: string;
  date: string;
  platform: 'WhatsApp' | 'Messenger' | 'SMS';
  status: 'Cold' | 'Warm' | 'Converted' | 'Lost';
  initialBudget?: number;
}

export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AppPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface OSConfig {
  aiEnabled: boolean;
  autoSync: boolean;
  notifications: boolean;
  cloudBackup: boolean;
  marketingIntegration: boolean;
}
