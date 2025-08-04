export interface Initiative {
  'Initiative Name': string;
  'Owner': string;
  'Strategic Area': string;
  'Status': 'Completed' | 'In Progress' | 'Blocked' | 'Planned' | '';
  'Start Date': string;
  'Committed Date': string;
  'Completion Date': string;
  'Days in \'In Progress\'': string;
  'Completion %': string;
  'Blocker Description': string;
  'Last Updated': string;
  'Notes / Comments': string;
}

export interface MetricResult {
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

export interface AnalysisResults {
  timestamp: string;
  sourceFile: string;
  metrics: {
    throughput: MetricResult;
    avgDaysInProgress: MetricResult;
    initiativeAging: MetricResult;
    crossTeamDependencies: MetricResult;
    sayDoRatio: MetricResult;
    strategicCoverage: MetricResult;
    leadTime: MetricResult;
  };
  charts: {
    statusDistribution: ChartData;
    strategicArea: ChartData;
    teamWorkload: ChartData;
    daysInProgress: ChartData;
  };
  teamStats: TeamStats[];
  insights: Insight[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor: string | string[];
    borderWidth?: number;
  }[];
}

export interface TeamStats {
  name: string;
  total: number;
  blocked: number;
  avgDays: number;
}

export interface Insight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}
