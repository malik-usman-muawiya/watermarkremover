import React from 'react';
import { BatchQueue } from '../components/editor/BatchQueue';

export const BatchEditorPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BatchQueue />
    </div>
  );
};
