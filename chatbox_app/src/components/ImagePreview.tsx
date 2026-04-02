import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  preview: string;
  filename: string;
  onRemove: () => void;
}

const ImagePreview = ({ preview, filename, onRemove }: ImagePreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200"
    >
      <img
        src={preview}
        alt="Preview"
        className="w-12 h-12 rounded object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">{filename}</p>
        <p className="text-xs text-gray-500">Ready to send</p>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
    </motion.div>
  );
};

export default ImagePreview;
