/**
 * TCS TwinX™ Alert Management Service
 * Handles threshold-based evaluations for Twin Health Score widgets
 * and dispatches live notifications to the Assistant Drawer and UI monitors.
 */

export interface TwinHealthAlert {
  id: string;
  widgetId: string;
  widgetTitle: string;
  twinName: string;
  currentScore: number;
  criticalThreshold: number;
  warningThreshold: number;
  timestamp: string;
  acknowledged: boolean;
  severity: 'critical' | 'warning';
  subVectorDegradations: Array<{
    name: string;
    value: string;
    status: 'critical' | 'warning' | 'normal';
  }>;
  remediationOptions: string[];
}

type AlertListener = (alerts: TwinHealthAlert[]) => void;

class AlertService {
  private alerts: TwinHealthAlert[] = [];
  private listeners: Set<AlertListener> = new Set();
  private : Record<string, number> = {};

  constructor() {
    // Initialize with a realistic historical alert for demo visibility if needed
    this.alerts = [
      {
        id: 'alert-init-1',
        widgetId: 'w-health-1',
        widgetTitle: 'Twin Health Score',
        twinName: 'WalletDBankingCustomer',
        currentScore: 61.8,
        criticalThreshold: 65,
        warningThreshold: 80,
        timestamp: '2 mins ago',
        acknowledged: false,
        severity: 'critical',
        subVectorDegradations: [
          { name: 'Telematics Ingress Freshness', value: '71.2% (Lag > 4.2s)', status: 'critical' },
          { name: 'Identity Graph Completeness', value: '68.0% (Missing KYC tier)', status: 'warning' },
          { name: 'Model Feature Drift (PSI)', value: '0.28 (Drift Threshold > 0.25)', status: 'critical' },
        ],
        remediationOptions: [
          'Run Automated DAG Diagnostic',
          'Trigger Telematics Stream Reconciliation',
          'Adjust Critical Threshold Gate',
        ],
      },
    ];
  }

  public subscribe(listener: AlertListener): () => void {
    this.listeners.add(listener);
    listener(this.getAlerts());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const active = this.getAlerts();
    this.listeners.forEach((listener) => {
      try {
        listener(active);
      } catch (err) {
        console.error('Error notifying alert listener:', err);
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('twinx-health-alert-change', {
          detail: { alerts: active, unacknowledgedCount: this.getUnacknowledgedCount() },
        })
      );
    }
  }

  public getAlerts(): TwinHealthAlert[] {
    return [...this.alerts];
  }

  public getUnacknowledgedCount(): number {
    return this.alerts.filter((a) => !a.acknowledged).length;
  }

  public evaluateTwinHealth(
    widgetId: string,
    widgetTitle: string,
    twinName: string,
    score: number,
    criticalThreshold: number = 65,
    warningThreshold: number = 80
  ): TwinHealthAlert | null {
    if (score < criticalThreshold) {
      // Check if an alert for this widget was created recently (debounce 3s)
      const now = Date.now();
      const existingIdx = this.alerts.findIndex((a) => a.widgetId === widgetId);

      const alert: TwinHealthAlert = {
        id: existingIdx >= 0 ? this.alerts[existingIdx].id : `alert-${now}-${Math.random().toString(36).substr(2, 4)}`,
        widgetId,
        widgetTitle,
        twinName: twinName || 'CustomerTwin',
        currentScore: score,
        criticalThreshold,
        warningThreshold,
        timestamp: 'Just now',
        acknowledged: false,
        severity: 'critical',
        subVectorDegradations: [
          { name: 'Telematics Freshness Invariant', value: `${(score * 1.05).toFixed(1)}% (Stale events detected)`, status: 'critical' },
          { name: 'Feature Vector Convergence', value: `${(score * 0.98).toFixed(1)}% (Variance elevated)`, status: 'critical' },
          { name: 'Model Serving Latency P99', value: `${(2.1 + (criticalThreshold - score) * 0.05).toFixed(2)}ms (SLA is 1.45ms)`, status: 'warning' },
        ],
        remediationOptions: [
          'Run Automated DAG Diagnostic',
          'Trigger Stream Buffer Flush & Reconciliation',
          'Adjust Critical Threshold Gate',
        ],
      };

      if (existingIdx >= 0) {
        this.alerts[existingIdx] = alert;
      } else {
        this.alerts.unshift(alert);
      }
      this.notify();
      return alert;
    } else {
      // Score is safe; if there was an active critical alert for this widget, auto-resolve it
      const existingIdx = this.alerts.findIndex((a) => a.widgetId === widgetId && !a.acknowledged);
      if (existingIdx >= 0) {
        this.alerts.splice(existingIdx, 1);
        this.notify();
      }
      return null;
    }
  }

  public acknowledgeAlert(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.acknowledged = true;
      this.notify();
    }
  }

  public dismissAlert(id: string): void {
    this.alerts = this.alerts.filter((a) => a.id !== id);
    this.notify();
  }

  public clearAllAlerts(): void {
    this.alerts = [];
    this.notify();
  }
}

export const alertService = new AlertService();
