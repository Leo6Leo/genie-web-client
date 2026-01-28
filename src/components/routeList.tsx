export const mainGenieRoute = '/genie'; // NOTE make sure this matches what is in the console-extensions.json file

export enum SubRoutes {
  AIandAutomation = 'ai-and-automation',
  Infrastructure = 'infrastructure',
  Insights = 'insights',
  Security = 'security',
  // Chat and sub routes
  Chat = 'chat',
  New = 'new',
  // Library
  Library = 'library',
  // Canvas
  Canvas = 'canvas',
  // Test routes for Dashboard CRD POC
  TestDashboard = 'test_dashboard',
  TestEditDashboard = 'test_edit_dashboard',
  // Dashboard view route - pattern: dashboard/:namespace/:name
  DashboardView = 'dashboard',
}

// Used only for navigation - make sure this nesting represents Routes.tsx
export const ChatNew = `${SubRoutes.Chat}/${SubRoutes.New}`;
