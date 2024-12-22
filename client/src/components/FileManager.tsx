import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

interface FileItemProps {
  name: string;
  type: 'file' | 'folder';
  onMove: (item: { name: string; type: string }, targetFolder: string) => void;
}

interface FolderProps {
  name: string;
  children: React.ReactNode;
  onDrop: (item: { name: string; type: string }, targetFolder: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ name, type, onMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FILE',
    item: { name, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 border rounded ${isDragging ? 'opacity-50' : ''}`}
    >
      {type === 'folder' ? '📁' : '📄'} {name}
    </div>
  );
};

const Folder: React.FC<FolderProps> = ({ name, children, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FILE',
    drop: (item: { name: string; type: string }) => onDrop(item, name),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`p-2 border rounded mb-2 ${isOver ? 'bg-blue-100' : ''}`}>
      <h3 className="font-bold">📁 {name}</h3>
      <div className="pl-4">{children}</div>
    </div>
  );
};

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<{ root: FileItem[] }>({
    root: [
      { name: 'api', type: 'folder', children: [
        { name: 'users.ts', type: 'file' },
        { name: 'posts.ts', type: 'file' },
      ]},
      { name: 'config.ts', type: 'file' },
      { name: 'README.md', type: 'file' },
    ],
  });

  const moveFile = (item: { name: string; type: string }, targetFolder: string) => {
    // Implement file moving logic here
    console.log(`Moving ${item.name} to ${targetFolder}`);
  };

  const renderFiles = (files: FileItem[]): React.ReactNode => {
    return files.map((file) => {
      if (file.type === 'folder') {
        return (
          <Folder key={file.name} name={file.name} onDrop={moveFile}>
            {file.children && renderFiles(file.children)}
          </Folder>
        );
      } else {
        return <FileItem key={file.name} name={file.name} type={file.type} onMove={moveFile} />;
      }
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">File Manager</h2>
        {renderFiles(files.root)}
      </div>
    </DndProvider>
  );
}

export default FileManager;

