import { useCallback, useState } from 'react';
import { api } from '../api/client';
import LoadingSpinner from './LoadingSpinner';

export default function DocumentUpload({ onUploaded, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = useCallback(async (files) => {
    const pdfFiles = Array.from(files).filter((file) => file.type === 'application/pdf' || file.name.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      onError?.('Please upload PDF files only.');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      for (const file of pdfFiles) {
        const document = await api.uploadDocument(file, setProgress);
        onUploaded?.(document);
      }
    } catch (error) {
      onError?.(error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onUploaded, onError]);

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (!uploading) {
      handleUpload(event.dataTransfer.files);
    }
  };

  return (
    <div className="document-upload">
      <label
        htmlFor="pdf-upload"
        className={`dropzone ${isDragging ? 'dropzone--active' : ''} ${uploading ? 'dropzone--uploading' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf,application/pdf"
          multiple
          hidden
          disabled={uploading}
          onChange={(event) => {
            if (event.target.files?.length) {
              handleUpload(event.target.files);
              event.target.value = '';
            }
          }}
        />

        {uploading ? (
          <div className="dropzone__uploading">
            <LoadingSpinner size="sm" label={`Uploading... ${progress}%`} />
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <div className="dropzone__icon">📄</div>
            <p className="dropzone__title">Drop PDFs here</p>
            <p className="dropzone__subtitle">or click to browse · multiple files supported</p>
          </>
        )}
      </label>
    </div>
  );
}
