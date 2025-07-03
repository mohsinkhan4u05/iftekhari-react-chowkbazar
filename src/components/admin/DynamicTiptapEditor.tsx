import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import with no SSR
const TiptapEditor = dynamic(() => import('./TiptapEditor'), {
  ssr: false,
  loading: () => (
    <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
          Loading rich text editor...
        </div>
      </div>
    </div>
  ),
});

// Fallback simple textarea editor
const SimpleEditor = ({ content, onChange }: { content: string; onChange: (content: string) => void }) => {
  return (
    <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl">
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-4 py-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Simple text editor (Rich text editor failed to load)
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-6 min-h-[400px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-0 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
        placeholder="Start writing your content..."
      />
    </div>
  );
};

interface DynamicTiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function DynamicTiptapEditor({ content, onChange }: DynamicTiptapEditorProps) {
  const [editorError, setEditorError] = useState(false);

  if (editorError) {
    return <SimpleEditor content={content} onChange={onChange} />;
  }

  return (
    <div className="space-y-4">
      <TiptapEditor 
        content={content} 
        onChange={onChange}
        onError={() => setEditorError(true)}
      />
    </div>
  );
}
