import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUpload, FaFileCsv, FaFilePdf } from 'react-icons/fa';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const UploadSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const UploadArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    border-color: #2196F3;
    background: #f5f9ff;
  }
`;

const UploadIcon = styled(FaUpload)`
  font-size: 48px;
  color: #2196F3;
  margin-bottom: 10px;
`;

const FileTypeIcon = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 10px 0;
`;

const FileType = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
`;

const Instructions = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ProgressBar = styled.div`
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  margin: 10px 0;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: #4CAF50;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const StatusText = styled.div`
  color: ${props => props.error ? '#f44336' : '#666'};
  margin: 10px 0;
`;

const Button = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;

  &:hover {
    background: #1976D2;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

function BankLink() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a CSV or PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setStatus('Uploading...');
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // Here you would typically send the file to your backend
      // For now, we'll simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus('File uploaded successfully! Processing transactions...');
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus('Transactions processed successfully!');
      setFile(null);
      setUploadProgress(0);
    } catch (err) {
      setError('Error uploading file. Please try again.');
      setUploadProgress(0);
    }
  };

  return (
    <Container>
      <Title>Upload Bank Statements</Title>
      
      <UploadSection>
        <UploadArea onClick={() => document.getElementById('fileInput').click()}>
          <UploadIcon />
          <h3>Drag and drop your bank statement here</h3>
          <p>or click to browse files</p>
          <FileTypeIcon>
            <FileType>
              <FaFileCsv /> CSV
            </FileType>
            <FileType>
              <FaFilePdf /> PDF
            </FileType>
          </FileTypeIcon>
        </UploadArea>

        <input
          id="fileInput"
          type="file"
          accept=".csv,.pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {file && (
          <div>
            <p>Selected file: {file.name}</p>
            <Button onClick={handleUpload}>Upload Statement</Button>
          </div>
        )}

        {uploadProgress > 0 && (
          <div>
            <ProgressBar>
              <Progress progress={uploadProgress} />
            </ProgressBar>
            <StatusText error={!!error}>
              {error || status}
            </StatusText>
          </div>
        )}

        <Instructions>
          <h4>Instructions:</h4>
          <ul>
            <li>Download your bank statements in CSV or PDF format from your bank's website</li>
            <li>Upload the statement file here</li>
            <li>Our system will automatically process and categorize your transactions</li>
            <li>You can then view and manage your transactions in the Transactions tab</li>
          </ul>
        </Instructions>
      </UploadSection>
    </Container>
  );
}

export default BankLink; 