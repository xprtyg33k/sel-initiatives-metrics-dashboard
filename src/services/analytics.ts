import { Initiative, AnalysisResults, MetricResult, ChartData, TeamStats, Insight } from '@/types';
import { parseISO, format, differenceInDays, isValid, parse } from 'date-fns';

export class AnalyticsService {
  static processData(initiatives: Initiative[], fileName: string): AnalysisResults {
    // Filter out empty rows
    const validInitiatives = initiatives.filter(initiative => 
      initiative['Initiative Name'] && initiative['Initiative Name'].trim() !== ''
    );

    return {
      timestamp: new Date().toISOString(),
      sourceFile: fileName,
      metrics: this.calculateMetrics(validInitiatives),
      charts: this.generateChartData(validInitiatives),
      teamStats: this.calculateTeamStats(validInitiatives),
      insights: this.generateInsights(validInitiatives)
    };
  }

  private static calculateMetrics(initiatives: Initiative[]): AnalysisResults['metrics'] {
    return {
      throughput: this.calculateThroughput(initiatives),
      avgDaysInProgress: this.calculateAvgDaysInProgress(initiatives),
      initiativeAging: this.calculateInitiativeAging(initiatives),
      crossTeamDependencies: this.calculateCrossTeamDependencies(initiatives),
      sayDoRatio: this.calculateSayDoRatio(initiatives),
      strategicCoverage: this.calculateStrategicCoverage(initiatives),
      leadTime: this.calculateLeadTime(initiatives)
    };
  }

  private static calculateThroughput(initiatives: Initiative[]): MetricResult {
    const completed = initiatives.filter(i => i.Status === 'Completed').length;
    const started = initiatives.filter(i => 
      i['Start Date'] && this.isDateInCurrentMonth(i['Start Date'])
    ).length;

    return {
      value: `${completed} : ${started}`,
      description: completed > started ? 'Strong completion momentum' : 'More initiatives started than completed',
      changeType: completed >= started ? 'positive' : 'negative'
    };
  }

  private static calculateAvgDaysInProgress(initiatives: Initiative[]): MetricResult {
    const inProgressInitiatives = initiatives.filter(i => 
      i.Status === 'In Progress' && i['Days in \'In Progress\'']
    );

    if (inProgressInitiatives.length === 0) {
      return { value: 0, description: 'No initiatives in progress' };
    }

    const totalDays = inProgressInitiatives.reduce((sum, initiative) => {
      const days = parseFloat(initiative['Days in \'In Progress\'']) || 0;
      return sum + days;
    }, 0);

    const average = totalDays / inProgressInitiatives.length;

    return {
      value: Math.round(average * 10) / 10,
      description: average > 60 ? 'High cycle times may indicate complexity' : 'Healthy cycle times',
      changeType: average > 60 ? 'negative' : 'positive'
    };
  }

  private static calculateInitiativeAging(initiatives: Initiative[]): MetricResult {
    const staleInitiatives = initiatives.filter(initiative => {
      if (initiative.Status !== 'In Progress') return false;
      
      const lastUpdated = initiative['Last Updated'];
      if (!lastUpdated) return true; // No update date means stale
      
      const lastUpdateDate = this.parseDate(lastUpdated);
      if (!lastUpdateDate) return true;
      
      const daysSinceUpdate = differenceInDays(new Date(), lastUpdateDate);
      return daysSinceUpdate > 14;
    });

    return {
      value: staleInitiatives.length,
      description: `Initiatives without updates in 14+ days`,
      changeType: staleInitiatives.length > 5 ? 'negative' : staleInitiatives.length > 0 ? 'neutral' : 'positive'
    };
  }

  private static calculateCrossTeamDependencies(initiatives: Initiative[]): MetricResult {
    const blockedInitiatives = initiatives.filter(i => 
      i.Status === 'Blocked' && i['Blocker Description'] && 
      i['Blocker Description'].toLowerCase().includes('external') ||
      i['Blocker Description'].toLowerCase().includes('dependency') ||
      i['Blocker Description'].toLowerCase().includes('waiting')
    );

    return {
      value: blockedInitiatives.length,
      description: 'External dependencies causing delays',
      changeType: blockedInitiatives.length > 3 ? 'negative' : 'neutral'
    };
  }

  private static calculateSayDoRatio(initiatives: Initiative[]): MetricResult {
    const committedInitiatives = initiatives.filter(i => i['Committed Date']);
    const completedCommitted = committedInitiatives.filter(i => i.Status === 'Completed');
    
    if (committedInitiatives.length === 0) {
      return { value: '0%', description: 'No committed initiatives found' };
    }

    const ratio = (completedCommitted.length / committedInitiatives.length) * 100;

    return {
      value: `${Math.round(ratio)}%`,
      description: `${completedCommitted.length} of ${committedInitiatives.length} committed initiatives completed`,
      changeType: ratio >= 80 ? 'positive' : ratio >= 60 ? 'neutral' : 'negative'
    };
  }

  private static calculateStrategicCoverage(initiatives: Initiative[]): MetricResult {
    const initiativesWithStrategy = initiatives.filter(i => 
      i['Strategic Area'] && i['Strategic Area'].trim() !== ''
    );

    const coverage = (initiativesWithStrategy.length / initiatives.length) * 100;

    return {
      value: `${Math.round(coverage)}%`,
      description: coverage >= 80 ? 'Strong strategic alignment' : 'Limited strategic alignment',
      changeType: coverage >= 80 ? 'positive' : coverage >= 60 ? 'neutral' : 'negative'
    };
  }

  private static calculateLeadTime(initiatives: Initiative[]): MetricResult {
    const completedWithDates = initiatives.filter(i => 
      i.Status === 'Completed' && i['Start Date'] && i['Completion Date']
    );

    if (completedWithDates.length === 0) {
      return { value: 0, description: 'No completed initiatives with date data' };
    }

    const leadTimes = completedWithDates.map(initiative => {
      const startDate = this.parseDate(initiative['Start Date']);
      const endDate = this.parseDate(initiative['Completion Date']);
      
      if (!startDate || !endDate) return 0;
      return differenceInDays(endDate, startDate);
    }).filter(days => days > 0);

    if (leadTimes.length === 0) {
      return { value: 0, description: 'Unable to calculate lead time' };
    }

    const avgLeadTime = leadTimes.reduce((sum, days) => sum + days, 0) / leadTimes.length;

    return {
      value: Math.round(avgLeadTime),
      description: `Average days from start to completion`,
      changeType: avgLeadTime > 90 ? 'negative' : avgLeadTime > 60 ? 'neutral' : 'positive'
    };
  }

  private static generateChartData(initiatives: Initiative[]): AnalysisResults['charts'] {
    return {
      statusDistribution: this.generateStatusChart(initiatives),
      strategicArea: this.generateStrategicAreaChart(initiatives),
      teamWorkload: this.generateTeamWorkloadChart(initiatives),
      daysInProgress: this.generateDaysInProgressChart(initiatives)
    };
  }

  private static generateStatusChart(initiatives: Initiative[]): ChartData {
    const statusCounts = initiatives.reduce((acc, initiative) => {
      const status = initiative.Status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#95a5a6']
      }]
    };
  }

  private static generateStrategicAreaChart(initiatives: Initiative[]): ChartData {
    const areaCounts = initiatives.reduce((acc, initiative) => {
      const area = initiative['Strategic Area'] || 'Others';
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count descending
    const sortedAreas = Object.entries(areaCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // Top 10

    return {
      labels: sortedAreas.map(([area]) => area),
      datasets: [{
        label: 'Initiative Count',
        data: sortedAreas.map(([,count]) => count),
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#a8e6cf', '#ff8a80']
      }]
    };
  }

  private static generateTeamWorkloadChart(initiatives: Initiative[]): ChartData {
    const teamCounts = initiatives.reduce((acc, initiative) => {
      const owner = initiative.Owner || 'Unassigned';
      acc[owner] = (acc[owner] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by workload descending
    const sortedTeams = Object.entries(teamCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10); // Top 10

    return {
      labels: sortedTeams.map(([owner]) => owner),
      datasets: [{
        label: 'Total Initiatives',
        data: sortedTeams.map(([,count]) => count),
        backgroundColor: '#667eea'
      }]
    };
  }

  private static generateDaysInProgressChart(initiatives: Initiative[]): ChartData {
    const inProgressInitiatives = initiatives
      .filter(i => i.Status === 'In Progress' && i['Days in \'In Progress\''])
      .map(i => ({
        name: i['Initiative Name'].substring(0, 20) + (i['Initiative Name'].length > 20 ? '...' : ''),
        days: parseFloat(i['Days in \'In Progress\'']) || 0
      }))
      .sort((a, b) => b.days - a.days)
      .slice(0, 15); // Top 15

    return {
      labels: inProgressInitiatives.map(i => i.name),
      datasets: [{
        label: 'Days in Progress',
        data: inProgressInitiatives.map(i => i.days),
        backgroundColor: '#667eea'
      }]
    };
  }

  private static calculateTeamStats(initiatives: Initiative[]): TeamStats[] {
    const teamStats = initiatives.reduce((acc, initiative) => {
      const owner = initiative.Owner || 'Unassigned';
      
      if (!acc[owner]) {
        acc[owner] = { total: 0, blocked: 0, totalDays: 0, daysCount: 0 };
      }
      
      acc[owner].total++;
      
      if (initiative.Status === 'Blocked') {
        acc[owner].blocked++;
      }
      
      const days = parseFloat(initiative['Days in \'In Progress\'']) || 0;
      if (days > 0) {
        acc[owner].totalDays += days;
        acc[owner].daysCount++;
      }
      
      return acc;
    }, {} as Record<string, { total: number; blocked: number; totalDays: number; daysCount: number }>);

    return Object.entries(teamStats)
      .map(([name, stats]) => ({
        name,
        total: stats.total,
        blocked: stats.blocked,
        avgDays: stats.daysCount > 0 ? Math.round(stats.totalDays / stats.daysCount) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }

  private static generateInsights(initiatives: Initiative[]): Insight[] {
    const insights: Insight[] = [];
    
    // Completion momentum insight
    const completed = initiatives.filter(i => i.Status === 'Completed').length;
    const total = initiatives.length;
    if (completed / total > 0.3) {
      insights.push({
        title: '🎯 Strong Completion Momentum',
        description: `${completed} initiatives completed, showing excellent delivery execution and project closure discipline.`,
        type: 'positive'
      });
    }

    // Blocking issues insight
    const blocked = initiatives.filter(i => i.Status === 'Blocked').length;
    if (blocked > 0) {
      insights.push({
        title: '🔴 Dependency Bottlenecks',
        description: `${blocked} initiatives are blocked by external dependencies, requiring attention to unblock progress.`,
        type: 'negative'
      });
    }

    // Strategic alignment insight
    const withStrategy = initiatives.filter(i => i['Strategic Area'] && i['Strategic Area'].trim() !== '').length;
    const strategicCoverage = (withStrategy / total) * 100;
    if (strategicCoverage >= 80) {
      insights.push({
        title: '📊 Strategic Alignment Excellence',
        description: `${Math.round(strategicCoverage)}% strategic coverage shows strong alignment with company priorities.`,
        type: 'positive'
      });
    }

    // Team workload insight
    const teamStats = this.calculateTeamStats(initiatives);
    const highLoadTeams = teamStats.filter(t => t.total > 8);
    if (highLoadTeams.length > 0) {
      insights.push({
        title: '👥 Team Performance Variance',
        description: `Some teams show high workload concentration, which may impact delivery timelines and quality.`,
        type: 'neutral'
      });
    }

    return insights;
  }

  private static parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.trim() === '') return null;

    // Try different date formats
    const formats = [
      'M/d/yyyy',
      'MM/dd/yyyy',
      'd-MMM',
      'd-MMM-yyyy',
      'yyyy-MM-dd'
    ];

    for (const formatStr of formats) {
      try {
        const parsed = parse(dateStr, formatStr, new Date());
        if (isValid(parsed)) return parsed;
      } catch {
        continue;
      }
    }

    // Try native Date parsing as fallback
    const nativeDate = new Date(dateStr);
    return isValid(nativeDate) ? nativeDate : null;
  }

  private static isDateInCurrentMonth(dateStr: string): boolean {
    const date = this.parseDate(dateStr);
    if (!date) return false;
    
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
}
