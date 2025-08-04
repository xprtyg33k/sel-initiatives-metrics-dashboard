'use client';

import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { Initiative, ValidationResult } from '@/types';
import { ValidationService } from '@/services/validation';

interface FileUploadProps {
  onFileProcessed: (data: Initiative[], fileName: string) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileProcessed, isProcessing }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setValidationResult({
        isValid: false,
        errors: [{ row: 0, column: 'file', message: 'Please select a CSV file' }]
      });
      return;
    }

    setFileName(file.name);
    setValidationResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validation = ValidationService.validateCSVStructure(results.data);
        setValidationResult(validation);

        if (validation.isValid) {
          onFileProcessed(results.data as Initiative[], file.name);
        }
      },
      error: (error) => {
        setValidationResult({
          isValid: false,
          errors: [{ row: 0, column: 'file', message: `Parse error: ${error.message}` }]
        });
      }
    });
  }, [onFileProcessed]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  }, [handleFiles]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : validationResult?.isValid
            ? 'border-green-300 bg-green-50'
            : validationResult && !validationResult.isValid
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white hover:border-primary-400 hover:bg-primary-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          ) : validationResult?.isValid ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : validationResult && !validationResult.isValid ? (
            <AlertCircle className="w-12 h-12 text-red-500" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            {isProcessing ? (
              <p className="text-lg font-medium text-gray-900">Processing your data...</p>
            ) : validationResult?.isValid ? (
              <div>
                <p className="text-lg font-medium text-green-700">File validated successfully!</p>
                <p className="text-sm text-gray-600">Click here to upload a different file</p>
              </div>
            ) : validationResult && !validationResult.isValid ? (
              <div>
                <p className="text-lg font-medium text-red-700">Validation failed</p>
                <p className="text-sm text-gray-600">Please fix the errors and try again</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900">Upload your CSV file</p>
                <p className="text-sm text-gray-600">Drag and drop or click to browse</p>
              </div>
            )}
          </div>

          {fileName && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{fileName}</span>
            </div>
          )}
        </div>
      </div>

      {validationResult && !validationResult.isValid && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {error.row > 0 ? `Row ${error.row}, ` : ''}
                  {error.column !== 'file' && error.column !== 'headers' ? `Column "${error.column}": ` : ''}
                  {error.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {validationResult?.isValid && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              CSV file validated successfully! Your data is being processed...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
