import { AnalysisResults } from '@/types';

const STORAGE_KEY = 'initiative_dashboard_results';
const RESULTS_HISTORY_KEY = 'initiative_dashboard_history';

export class StorageService {
  static saveResults(results: AnalysisResults): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Save current results
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
      
      // Save to history
      this.addToHistory(results);
    } catch (error) {
      console.error('Failed to save results to localStorage:', error);
    }
  }

  static loadResults(): AnalysisResults | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load results from localStorage:', error);
      return null;
    }
  }

  static addToHistory(results: AnalysisResults): void {
    if (typeof window === 'undefined') return;
    
    try {
      const history = this.getHistory();
      const newEntry = {
        timestamp: results.timestamp,
        sourceFile: results.sourceFile,
        metrics: results.metrics
      };
      
      // Keep only last 10 entries
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      localStorage.setItem(RESULTS_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }

  static getHistory(): Array<{
    timestamp: string;
    sourceFile: string;
    metrics: AnalysisResults['metrics'];
  }> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(RESULTS_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  static clearData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(RESULTS_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  static exportData(): string {
    if (typeof window === 'undefined') return '{}';
    
    try {
      const results = this.loadResults();
      const history = this.getHistory();
      
      return JSON.stringify({
        current: results,
        history: history
      }, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '{}';
    }
  }
}
