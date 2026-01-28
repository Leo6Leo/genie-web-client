import type { PanelComponent } from '../../types/dashboard';

/**
 * Mock NGUI specs for testing dashboard rendering.
 * These specs are interpreted by @rhngui/patternfly-react-renderer's DynamicComponent.
 *
 * Supported components:
 * - data-view (table): Table with fields and data arrays
 * - one-card: Card with image and fields
 * - chart-bar, chart-line, chart-pie, chart-donut: Charts with data series
 * - image: Simple image display
 * - set-of-cards: Multiple cards in a grid
 */

// Mock table data for Table component type
const mockTableSpec = {
  component: 'data-view',
  id: 'mock-pods-table',
  title: 'Pod Status',
  fields: [
    {
      name: 'Name',
      data_path: 'pods.name',
      data: ['pod-frontend-1', 'pod-backend-1', 'pod-db-1'],
    },
    {
      name: 'Status',
      data_path: 'pods.status',
      data: ['Running', 'Running', 'Pending'],
    },
    {
      name: 'CPU',
      data_path: 'pods.cpu',
      data: ['250m', '500m', '100m'],
    },
    {
      name: 'Memory',
      data_path: 'pods.memory',
      data: ['512Mi', '1Gi', '256Mi'],
    },
  ],
  perPage: 10,
  enableFilters: false,
  enablePagination: false,
  enableSort: true,
};

// Mock metric display for Metric component type - using one-card
const mockMetricSpec = {
  component: 'one-card',
  id: 'mock-cluster-health',
  title: 'Cluster Health',
  fields: [
    {
      name: 'Health Score',
      data_path: 'cluster.health',
      data: ['87%'],
    },
    {
      name: 'Status',
      data_path: 'cluster.status',
      data: ['Healthy'],
    },
    {
      name: 'Nodes',
      data_path: 'cluster.nodes',
      data: ['5 Ready'],
    },
  ],
};

// Mock chart for Chart component type - using line chart
const mockChartSpec = {
  component: 'chart-line',
  id: 'mock-cpu-chart',
  title: 'CPU Usage Over Time',
  data: [
    {
      name: 'CPU %',
      data: [
        { x: '10:00', y: 45 },
        { x: '10:05', y: 52 },
        { x: '10:10', y: 48 },
        { x: '10:15', y: 65 },
        { x: '10:20', y: 58 },
        { x: '10:25', y: 42 },
        { x: '10:30', y: 55 },
      ],
    },
    {
      name: 'Memory %',
      data: [
        { x: '10:00', y: 60 },
        { x: '10:05', y: 62 },
        { x: '10:10', y: 68 },
        { x: '10:15', y: 72 },
        { x: '10:20', y: 70 },
        { x: '10:25', y: 65 },
        { x: '10:30', y: 67 },
      ],
    },
  ],
};

// Mock alert list for Alert component type - using set-of-cards
const mockAlertSpec = {
  component: 'set-of-cards',
  id: 'mock-alerts',
  title: 'Recent Alerts',
  fields: [
    {
      name: 'Alert',
      data_path: 'alerts.title',
      data: ['High memory usage detected', 'Scaling event completed'],
    },
    {
      name: 'Severity',
      data_path: 'alerts.severity',
      data: ['Warning', 'Info'],
    },
    {
      name: 'Time',
      data_path: 'alerts.time',
      data: ['5 min ago', '15 min ago'],
    },
  ],
};

// Mock log viewer for Log component type - using data-view (table format for logs)
const mockLogSpec = {
  component: 'data-view',
  id: 'mock-logs-table',
  title: 'Application Logs',
  fields: [
    {
      name: 'Timestamp',
      data_path: 'logs.timestamp',
      data: [
        '2024-01-15T10:30:00Z',
        '2024-01-15T10:30:01Z',
        '2024-01-15T10:30:02Z',
        '2024-01-15T10:30:05Z',
        '2024-01-15T10:30:10Z',
      ],
    },
    {
      name: 'Level',
      data_path: 'logs.level',
      data: ['INFO', 'INFO', 'INFO', 'WARN', 'INFO'],
    },
    {
      name: 'Message',
      data_path: 'logs.message',
      data: [
        'Starting application...',
        'Connected to database',
        'Listening on port 8080',
        'High latency detected: 250ms',
        'Request processed successfully',
      ],
    },
  ],
  perPage: 10,
  enableFilters: false,
  enablePagination: false,
  enableSort: false,
};

// Mock resource list for Resource component type - using one-card
const mockResourceSpec = {
  component: 'one-card',
  id: 'mock-resource-summary',
  title: 'Resource Summary',
  fields: [
    {
      name: 'Pods',
      data_path: 'resources.pods',
      data: ['24 Running'],
    },
    {
      name: 'Deployments',
      data_path: 'resources.deployments',
      data: ['8 Available'],
    },
    {
      name: 'Services',
      data_path: 'resources.services',
      data: ['12 Active'],
    },
    {
      name: 'ConfigMaps',
      data_path: 'resources.configmaps',
      data: ['15'],
    },
  ],
};

// Default placeholder for Custom or unknown component types - using one-card
const mockDefaultSpec = {
  component: 'one-card',
  id: 'mock-placeholder',
  title: 'Panel Placeholder',
  fields: [
    {
      name: 'Status',
      data_path: 'placeholder.status',
      data: ['Awaiting data'],
    },
    {
      name: 'Message',
      data_path: 'placeholder.message',
      data: ['Panel content will be rendered here'],
    },
  ],
};

/**
 * Get mock NGUI spec based on panel component type
 */
export function getMockNguiSpec(
  component: PanelComponent
): Record<string, unknown> {
  switch (component.type) {
    case 'Table':
      return mockTableSpec;
    case 'Metric':
      return mockMetricSpec;
    case 'Chart':
      return mockChartSpec;
    case 'Alert':
      return mockAlertSpec;
    case 'Log':
      return mockLogSpec;
    case 'Resource':
      return mockResourceSpec;
    case 'Custom':
    default:
      return mockDefaultSpec;
  }
}
