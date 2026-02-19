import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

export default function PhotoUpload({ onImageSelect }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ImageIcon size={20} className="text-primary" />
        Capture the Moment
      </h3>
      <p className="label">Upload a photo of your current location or inspiration</p>
      
      <div 
        className="upload-zone"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img src={preview} alt="Preview" className="preview-img" />
            <button 
              onClick={removeImage}
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '0.5rem', 
                padding: '0.4rem',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)'
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366f1'
            }}>
              <Upload size={32} />
            </div>
            <p style={{ margin: 0, fontWeight: 500 }}>Click to upload or drag and drop</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>PNG, JPG or GIF (max. 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
