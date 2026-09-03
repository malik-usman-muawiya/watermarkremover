export type PlanType = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  credits: number;
  maxCredits: number;
  apiKey?: string;
  avatar?: string;
  createdAt: string;
}

export type JobType = 'image' | 'video' | 'object' | 'batch';
export type JobStatus = 'queued' | 'preparing' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  userId: string;
  title: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  stageDescription?: string;
  originalUrl: string;
  resultUrl?: string;
  maskDataUrl?: string;
  inputSize: string;
  outputSize?: string;
  resolution?: string;
  durationSeconds?: number;
  createdAt: string;
  completedAt?: string;
  expiresAt: string; // ISO 24h retention
  creditsCost: number;
  error?: string;
}

export interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  resultUrl?: string;
  status: JobStatus;
  progress: number;
  error?: string;
}

export type ToolMode = 'brush' | 'box' | 'eraser' | 'pan';

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawStroke {
  tool: 'brush' | 'eraser';
  points: Point[];
  size: number;
}

export interface EditorHistoryStep {
  strokes: DrawStroke[];
  boxes: Rect[];
}

export interface SeoPageConfig {
  slug: string;
  title: string;
  h1: string;
  metaDesc: string;
  badge: string;
  subtitle: string;
  heroImage: {
    before: string;
    after: string;
    caption: string;
  };
  features: {
    title: string;
    desc: string;
    icon: string;
  }[];
  steps: {
    title: string;
    desc: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}
