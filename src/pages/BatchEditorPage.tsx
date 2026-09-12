import React from 'react';
import { BatchQueue } from '../components/editor/BatchQueue';
import { SEO } from '../components/common/SEO';

export const BatchEditorPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Batch Watermark Remover — Process Up to 50 Photos at Once"
        description="Bulk remove watermarks from up to 50 images at once with AI inpainting, then download the cleaned batch as a single ZIP file."
        canonicalPath="/editor/batch"
      />
      <BatchQueue />
    </div>
  );
};
