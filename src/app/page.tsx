'use client';

import React, { useState, useEffect } from 'react';
import { Initiative, AnalysisResults } from '@/types';
import { AnalyticsService } from '@/services/analytics';
import { StorageService } from '@/services/storage';
import { FileUpload } from '@/components/FileUpload';
import { Dashboard } from '@/components/Dashboard';
import { Download, RefreshCw, Trash2 } from 'lucide-react';
import { downloadFile } from '@/lib/utils';

export default function HomePage() {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedResults = StorageService.loadResults();
    if (savedResults) {
      setResults(savedResults);
    }
  }, []);

  const handleFileProcessed = async (data: Initiative[], fileName: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const analysisResults = AnalyticsService.processData(data, fileName);
      StorageService.saveResults(analysisResults);
      setResults(analysisResults);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportData = () => {
    if (results) {
      const exportData = StorageService.exportData();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(exportData, `initiative-dashboard-export-${timestamp}.json`);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
      StorageService.clearData();
      setResults(null);
    }
  };

  const handleRefresh = () => {
    const savedResults = StorageService.loadResults();
    setResults(savedResults);
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-5">
      <div className="max-w-7xl mx-auto">
        <FileUpload 
          onFileProcessed={handleFileProcessed} 
          isProcessing={isProcessing}
        />

        {results && (
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleClearData}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>
          </div>
        )}

        <Dashboard results={results} />
      </div>
    </div>
  );
}
