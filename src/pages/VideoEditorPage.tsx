import React from 'react';
import { VideoEditor } from '../components/editor/VideoEditor';
import { SEO } from '../components/common/SEO';

export const VideoEditorPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="AI Video Watermark Remover — Clean Video Watermarks Online"
        description="Remove dynamic and static watermarks, subtitles, logos, and timestamps from MP4, WebM, and MOV videos online with AI inpainting."
        canonicalPath="/editor/video"
      />
      <VideoEditor />
    </div>
  );
};

