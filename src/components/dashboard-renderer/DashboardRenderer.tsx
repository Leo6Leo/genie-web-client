import type { AladdinDashboard } from '../../types/dashboard';
import { DashboardToolbar } from './DashboardToolbar';
import { DashboardGrid } from './DashboardGrid';
import { DashboardPanel } from './DashboardPanel';
import { DashboardPanelContent } from './DashboardPanelContent';
import './dashboard-renderer.css';

export interface DashboardRendererProps {
  /** The dashboard resource to render */
  dashboard: AladdinDashboard;
}

/**
 * Main dashboard renderer component.
 * Renders the toolbar and grid with all panels.
 */
export const DashboardRenderer: React.FC<DashboardRendererProps> = ({
  dashboard,
}) => {
  const { spec, metadata } = dashboard;
  const { layout } = spec;
  const columns = layout.columns ?? 12;
  const panels = layout.panels ?? [];

  return (
    <div className="dashboard-renderer">
      <DashboardToolbar
        spec={spec}
        name={metadata?.name ?? ''}
        namespace={metadata?.namespace ?? ''}
      />
      <DashboardGrid columns={columns}>
        {panels.map((panel) => (
          <DashboardPanel
            key={panel.id}
            title={panel.title}
            position={panel.position}
          >
            <DashboardPanelContent panel={panel} />
          </DashboardPanel>
        ))}
      </DashboardGrid>
    </div>
  );
};
