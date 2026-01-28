import type { CSSProperties, ReactNode } from 'react';
import './dashboard-renderer.css';

export interface DashboardGridProps {
  /** Number of grid columns (default: 12) */
  columns?: number;
  /** Child panel components */
  children: ReactNode;
}

/**
 * CSS Grid container for dashboard panels.
 * Panels position themselves using grid-column and grid-row styles.
 */
export const DashboardGrid: React.FC<DashboardGridProps> = ({
  columns = 12,
  children,
}) => {
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div className="dashboard-renderer__grid-container">
      <div className="dashboard-grid" style={gridStyle}>
        {children}
      </div>
    </div>
  );
};
