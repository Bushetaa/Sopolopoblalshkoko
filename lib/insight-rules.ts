export type InsightSeverity = 'info' | 'warning' | 'critical' | 'success';
export type InsightType = 'anomaly' | 'degradation' | 'improvement' | 'threshold' | 'recommendation' | 'security' | 'cost';

export interface Insight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  summary: string;
  detail: string;
  metric?: {
    label: string;
    value: string;
    unit: string;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
  };
  recommendation?: string;
  actionLabel?: string;
  actionPath?: string;
  isDismissed?: boolean;
}

export interface InsightRule {
  id: string;
  name: string;
  description: string;
  run: (data: any) => Insight | null;
}

export const INSIGHT_RULES: InsightRule[] = [
  {
    id: 'mfa-security',
    name: 'MFA Adoption Check',
    description: 'Checks if MFA adoption is below 60%',
    run: (data) => {
      // Mock check: in a real app, this would use actual user data
      const mfaAdoption = 42; // Mock value
      if (mfaAdoption < 60) {
        return {
          id: 'insight-mfa',
          type: 'security',
          severity: 'warning',
          title: 'Low MFA Adoption',
          summary: 'Less than 60% of your organization has MFA enabled.',
          detail: 'Security analysis shows that 58% of active users are still using single-factor authentication, increasing the risk of account takeover incidents.',
          metric: {
            label: 'MFA Adoption',
            value: '42',
            unit: '%',
            change: -5,
            trend: 'down'
          },
          recommendation: 'Enforce MFA for all administrative roles and send a reminder to all users.',
          actionLabel: 'Security Settings',
          actionPath: '/settings/security'
        };
      }
      return null;
    }
  },
  {
    id: 'response-time-spike',
    name: 'Response Time Spike',
    description: 'Detects unusual spikes in P99 latency',
    run: (data) => {
      const p99Spike = true; // Mock trigger
      if (p99Spike) {
        return {
          id: 'insight-latency',
          type: 'degradation',
          severity: 'critical',
          title: 'Latency Spike Detected',
          summary: 'P99 latency increased by 150% in the last 2 hours.',
          detail: 'Our anomaly detection engine identified a significant performance degradation in the /v1/orders/create endpoint across the EU-West region.',
          metric: {
            label: 'P99 Latency',
            value: '1.2',
            unit: 's',
            change: 150,
            trend: 'up'
          },
          recommendation: 'Investigate database connection pool exhaustion or recent deployment changes.',
          actionLabel: 'View Analytics',
          actionPath: '/analytics'
        };
      }
      return null;
    }
  },
  {
    id: 'traffic-growth',
    name: 'Traffic Growth',
    description: 'Detects significant week-over-week traffic growth',
    run: (data) => {
      const growth = 25; // Mock value
      if (growth > 20) {
        return {
          id: 'insight-traffic',
          type: 'improvement',
          severity: 'success',
          title: 'Significant Traffic Growth',
          summary: 'Traffic has increased by 25% compared to last week.',
          detail: 'Your API ecosystem is experiencing healthy organic growth. Most of the increase is coming from the new Mobile App integration.',
          metric: {
            label: 'Total Requests',
            value: '2.4',
            unit: 'M',
            change: 25,
            trend: 'up'
          },
          recommendation: 'Consider increasing rate limits for the Mobile App consumer to accommodate further growth.',
          actionLabel: 'Manage Consumers',
          actionPath: '/api-manager/consumers'
        };
      }
      return null;
    }
  }
];

export const runInsightRules = (data: any): Insight[] => {
  return INSIGHT_RULES
    .map(rule => rule.run(data))
    .filter((insight): insight is Insight => insight !== null);
};
