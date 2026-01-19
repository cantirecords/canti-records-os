
import { Client, Project, PackageType, ProjectStatus, Service, Invoice, SplitSheet, Asset, LeadIntake, LegalTemplate, Message, TimelineEvent, AppPlan } from './types';

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Combo 1: The Foundation',
    price: 1200,
    description: 'Full audio production package from lyrics to master.',
    includes: ['Lyrics Writing', 'Instrumental Creation', 'Practice Period', 'Vocal Recording', 'Mixing & Mastering']
  },
  {
    id: 's2',
    name: 'Combo 2: The Rollout',
    price: 2500,
    description: 'Everything in Combo 1 plus visual production and distribution support.',
    includes: ['Everything in Combo 1', 'Music Video Production', 'Distribution Support', 'Social Media Rollout Plan']
  }
];

export const MOCK_PLANS: AppPlan[] = [
  {
    id: 'p-free',
    name: 'Standard Operator',
    price: '$0',
    features: ['Up to 5 Active Projects', 'Manual WhatsApp Logging', 'Standard Legal Templates', 'Basic Dashboard']
  },
  {
    id: 'p-pro',
    name: 'Studio Pro',
    price: '$49',
    features: ['Unlimited Projects', 'AI Conversation Summaries', 'Auto-Syncing CRM', 'Custom Invoicing Brading', 'Advanced Marketing Insights'],
    isPopular: true
  },
  {
    id: 'p-agency',
    name: 'Agency Elite',
    price: '$129',
    features: ['Multi-Operator Access', 'White-label Client Portal', 'Priority AI Processing', 'Direct Meta Ads Integration', 'Full Cloud Asset Hosting']
  }
];

export const LEGAL_TEMPLATES: LegalTemplate[] = [
  { id: 't1', title: 'Split Sheet Agreement', description: 'Define song ownership and publishing shares between collaborators.', icon: 'gavel' },
  { id: 't2', title: 'Master Recording License', description: 'Grant rights to use a finished master for specific media.', icon: 'description' },
  { id: 't3', title: 'Work For Hire', description: 'Agreement for session musicians or videographers where user owns the result.', icon: 'work' },
  { id: 't4', title: 'Marketing Agency Agreement', description: 'Retainer contract for Canti Media marketing services.', icon: 'campaign' }
];

export const MOCK_LEADS: LeadIntake[] = [
  { id: 'l1', name: 'Z-Diddy', source: 'Meta Ads (Insta)', date: '2023-08-20', platform: 'WhatsApp', status: 'Warm', initialBudget: 1500 },
  { id: 'l2', name: 'The Void', source: 'Referral', date: '2023-08-19', platform: 'Messenger', status: 'Converted' },
  { id: 'l3', name: 'Sara X', source: 'Meta Ads (FB)', date: '2023-08-18', platform: 'WhatsApp', status: 'Cold', initialBudget: 2500 }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Lil Echo',
    alias: 'Echo',
    email: 'echo@neonrecords.com',
    phone: '+1234567890',
    instagram: '@lil_echo_official',
    tiktok: '@echo_sounds',
    bio: 'Emerging trap artist from South London. Focused on heavy sub-basses and melodic hooks.',
    whatsappLink: 'https://wa.me/1234567890',
    source: 'Meta Ads',
    brand: 'Canti Records',
    genreTags: ['Hip-Hop', 'Trap'],
    status: ProjectStatus.ACTIVE,
    lastContactDate: '2023-08-15',
    avatarUrl: 'https://picsum.photos/seed/echo/200',
    conversations: [
      { id: 'm1', sender: 'client', text: 'Yo, I saw the ad for Combo 2. I need that for my next EP.', timestamp: '2023-08-10 10:00', platform: 'WhatsApp' },
      { id: 'm2', sender: 'operator', text: 'Safe Echo! Yeah, we can definitely make it happen. What genre are we looking at?', timestamp: '2023-08-10 10:05', platform: 'WhatsApp' },
      { id: 'm3', sender: 'client', text: 'Dark trap vibes. Hard sub bass. Check this demo link: [SoundCloud Link]', timestamp: '2023-08-10 10:15', platform: 'WhatsApp' },
      { id: 'm4', sender: 'operator', text: 'Dope. This fits the Canti Records sound perfectly. Let\'s get the lyrics started.', timestamp: '2023-08-10 11:00', platform: 'WhatsApp' },
      { id: 'm5', sender: 'client', text: 'When can we hit the studio?', timestamp: '2023-08-12 14:00', platform: 'Instagram' },
    ],
    timeline: [
      { id: 'e1', type: 'message', title: 'Initial Outreach', description: 'Lead converted from Instagram Ad to WhatsApp.', date: '2023-08-10', icon: 'campaign' },
      { id: 'e2', type: 'milestone', title: 'Contract Locked', description: 'Combo 2 Project structure agreed upon.', date: '2023-08-12', icon: 'gavel' },
      { id: 'e3', type: 'payment', title: 'Deposit Received', description: 'First 50% payment for Neon Nights EP.', date: '2023-08-13', icon: 'payments' },
      { id: 'e4', type: 'asset', title: 'V1 Instrumental Sent', description: 'Final HQ wav uploaded to vault.', date: '2023-08-14', icon: 'audio_file' },
    ]
  },
  {
    id: 'c2',
    name: 'Yung Wave',
    email: 'wavey@canti.media',
    phone: '+0987654321',
    instagram: '@yungwave_prod',
    bio: 'Experimental R&B producer and vocalist. High aesthetic focus.',
    whatsappLink: 'https://wa.me/0987654321',
    source: 'Referral',
    brand: 'Canti Media',
    genreTags: ['R&B', 'Soul'],
    status: ProjectStatus.ACTIVE,
    lastContactDate: '2023-08-14',
    avatarUrl: 'https://picsum.photos/seed/wave/200',
    conversations: [],
    timeline: []
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', clientId: 'c1', amount: 1500, status: 'Sent', dueDate: '2023-09-01', items: ['Combo 2 Deposit'], sentAt: '2023-08-10 14:00' },
  { id: 'INV-002', clientId: 'c2', amount: 600, status: 'Paid', dueDate: '2023-08-15', items: ['Combo 1 Partial'], viewedAt: '2023-08-11 09:30' },
  { id: 'INV-003', clientId: 'c1', amount: 500, status: 'Viewed', dueDate: '2023-08-10', items: ['Weekly Payment'], viewedAt: '2023-08-14 18:22' }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    clientId: 'c1',
    title: 'Neon Nights EP',
    type: PackageType.COMBO_2,
    status: ProjectStatus.ACTIVE,
    progress: 45,
    value: 2500,
    payments: [],
    checklist: [
      { id: '1', label: 'Lyrics Writing', isCompleted: true },
      { id: '2', label: 'Instrumental Creation', isCompleted: true },
      { id: '3', label: 'Practice Period', isCompleted: true },
      { id: '4', label: 'Studio Vocal Recording', isCompleted: false },
      { id: '5', label: 'Mixing & Mastering', isCompleted: false }
    ],
    startDate: '2023-08-12',
    targetDate: '2023-09-30',
    genre: 'Hip-Hop'
  }
];

export const MOCK_SPLITS: SplitSheet[] = [
  {
    id: 'split-1',
    projectId: 'p1',
    trackTitle: 'Neon Nights',
    status: 'Sent',
    participants: [
      { name: 'Lil Echo', role: 'Artist', share: 50 },
      { name: 'Canti Records', role: 'Producer', share: 50 }
    ],
    sentAt: '2023-08-14',
    viewedAt: '2023-08-15'
  }
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'a1', projectId: 'p1', name: 'Neon_Nights_V1.mp3', type: 'Demo', url: '#', uploadedAt: '2023-08-16', size: '8.4 MB' },
  { id: 'a2', projectId: 'p1', name: 'Final_Instrumental_HQ.wav', type: 'Instrumental', url: '#', uploadedAt: '2023-08-14', size: '42.1 MB' }
];

export const GENRES = ['Trap', 'Reggaeton', 'R&B', 'Pop', 'Soul', 'Drill', 'Hip-Hop'];
