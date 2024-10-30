import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Folder, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fetchFiles, FileItem } from '../../api/files';
import { setSelectedFolder } from '../../store/slices/filesSlice';
import type { RootState } from '../../store/store';
import DownloadModal from '../Modals/DownloadModal';

const FileItemComponent: React.FC<{ item: FileItem; onClick: () => void }> = ({ item, onClick }) => {
  const getIcon = () => {
    return item.type === 'Folder' ? 
      <Folder className="text-blue-500" size={40} /> : 
      <FileText className="text-orange-500" size={40} />;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="file-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2">
        {getIcon()}
        <span className="text-sm text-gray-700 text-center break-words w-full">
          {item.name}
        </span>
      </div>
    </motion.div>
  );
};

const FileGrid: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const loading = useSelector((state: RootState) => state.files.loading);
  const selectedFolder = useSelector(
    (state: RootState) => state.files.selectedFolder
  );

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await fetchFiles(selectedFolder);
        setFiles(data);
      } catch (error) {
        console.error('Error loading files:', error);
      }
    };

    loadFiles();
  }, [selectedFolder]);

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        <div className="folder-grid">
          {files.map((file) => (
            <FileItemComponent
              key={file.id}
              item={file}
              onClick={() => {
                if (file.type === 'Folder') {
                  dispatch(setSelectedFolder(file.id.toString()));
                } else {
                  setSelectedFile(file);
                }
              }}
            />
          ))}
        </div>
      </AnimatePresence>

      <DownloadModal
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
      />
    </>
  );
};

export default FileGrid;