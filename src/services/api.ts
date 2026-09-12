import { Job, JobType } from '../types';

const JOBS_STORAGE_KEY = 'cleanmark_jobs_history';

// Initial mock jobs
const INITIAL_JOBS: Job[] = [
  {
    id: 'job-9841',
    userId: 'usr-1',
    title: 'Product_Catalog_Watermark_Removal.png',
    type: 'image',
    status: 'completed',
    progress: 100,
    originalUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    resultUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    inputSize: '2.4 MB',
    outputSize: '2.1 MB',
    resolution: '1920x1080',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 4000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    creditsCost: 1
  },
  {
    id: 'job-9840',
    userId: 'usr-1',
    title: 'Commercial_B-Roll_Logo_Clean.mp4',
    type: 'video',
    status: 'completed',
    progress: 100,
    originalUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    resultUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    inputSize: '28.5 MB',
    outputSize: '26.8 MB',
    durationSeconds: 15,
    resolution: '1080p 60fps',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 24000).toISOString(),
    expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
    creditsCost: 5
  },
  {
    id: 'job-9839',
    userId: 'usr-1',
    title: 'Landscape_Tourist_Object_Erasure.jpg',
    type: 'object',
    status: 'completed',
    progress: 100,
    originalUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    resultUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    inputSize: '4.8 MB',
    outputSize: '4.5 MB',
    resolution: '3840x2160',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000 + 6000).toISOString(),
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    creditsCost: 1
  }
];

export const ApiService = {
  getJobs(): Job[] {
    const saved = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_JOBS;
    }
  },

  saveJob(job: Job): void {
    const jobs = this.getJobs();
    const existingIndex = jobs.findIndex(j => j.id === job.id);
    if (existingIndex >= 0) {
      jobs[existingIndex] = job;
    } else {
      jobs.unshift(job);
    }
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  },

  deleteJob(id: string): void {
    const jobs = this.getJobs().filter(j => j.id !== id);
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  },

  clearAllJobs(): void {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify([]));
  },

  createJob(type: JobType, title: string, originalUrl: string, creditsCost: number, inputSize = '2.5 MB'): Job {
    const newJob: Job = {
      id: `job-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: 'usr-1',
      title,
      type,
      status: 'processing',
      progress: 10,
      stageDescription: 'Queued for AI worker inference...',
      originalUrl,
      inputSize,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24hr auto deletion policy
      creditsCost
    };
    this.saveJob(newJob);
    return newJob;
  }
};
