import React, { useState } from 'react';
import axios from 'axios';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFileId(response.data);
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button className='button button1 upload-text' onClick={handleFileUpload}>Upload File</button>
      {fileId && (
        <div>
          <p>File uploaded with ID: {fileId}</p>
          <a href={`/api/download/${fileId}`}>Download File</a>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default UploadFile;
