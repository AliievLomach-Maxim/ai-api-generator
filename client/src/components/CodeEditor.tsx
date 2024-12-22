import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Code Editor</h2>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          defaultValue="// Write your API code here"
          theme="vs-dark"
        />
      </div>
    </div>
  );
}

export default CodeEditor;

