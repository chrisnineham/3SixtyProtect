import type { QueueKpis } from '@/lib/screening/queries';
import { KpiTile } from './primitives';

/** The seven operational KPIs; each tile filters the queue. */
export function ScreeningKpis({ kpis }: { kpis: QueueKpis }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
      <KpiTile label="Active screenings" value={kpis.active} href="/admin/vetting" />
      <KpiTile label="Awaiting candidate" value={kpis.awaitingCandidate} href="/admin/vetting?filter=awaiting_candidate" />
      <KpiTile label="Awaiting references" value={kpis.awaitingReferences} href="/admin/vetting?filter=awaiting_reference" />
      <KpiTile label="Verification required" value={kpis.verificationRequired} href="/admin/vetting?filter=verification_required" />
      <KpiTile label="Discrepancies" value={kpis.discrepancies} href="/admin/vetting?filter=discrepancies" attention />
      <KpiTile label="Ready for review" value={kpis.readyForReview} href="/admin/vetting?filter=ready" />
      <KpiTile label="Completed" value={kpis.completed} href="/admin/vetting?filter=completed" />
    </div>
  );
}
