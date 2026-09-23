import 'server-only';

// ─────────────────────────────────────────────────────────────
// Page-level access + loading helpers for the Vetting & Screening routes.
// Every page goes through these so the capability check can never be
// forgotten, and so a missing migration renders a notice instead of a crash.
// ─────────────────────────────────────────────────────────────

import { notFound } from 'next/navigation';
import type { Capability } from '@/lib/permissions';
import { can, getScreeningActor, type ScreeningActor } from './access';
import { isMissingTableError, isScreeningConfigured } from './db';
import type { CaseEvaluation } from './engine';
import { loadEvaluation } from './load';
import type { CaseFile } from './types';

export type ScreeningAccess =
  | { kind: 'ok'; actor: ScreeningActor }
  | { kind: 'config' }
  | { kind: 'unauthenticated' }
  | { kind: 'denied'; actor: ScreeningActor };

/** Resolve whether the current admin may use the module with `cap`. */
export async function screeningAccess(cap: Capability = 'screening.view'): Promise<ScreeningAccess> {
  if (!isScreeningConfigured()) return { kind: 'config' };
  const actor = await getScreeningActor();
  if (!actor) return { kind: 'unauthenticated' };
  if (!can(actor, cap)) return { kind: 'denied', actor };
  return { kind: 'ok', actor };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

export interface CaseContext {
  kind: 'ok';
  actor: ScreeningActor;
  file: CaseFile;
  evaluation: CaseEvaluation;
  locked: boolean;
  /** May add or edit screening records (never true on a locked case). */
  canManage: boolean;
  canEvidence: boolean;
  canReview: boolean;
  canReopen: boolean;
}

export type CasePageResult =
  | CaseContext
  | { kind: 'config' }
  | { kind: 'unauthenticated' }
  | { kind: 'denied' }
  | { kind: 'migration' };

/**
 * Load everything a case page needs. Calls notFound() for unknown ids.
 * Non-'ok' results are rendered as notices by the case layout, so pages
 * simply return null for them.
 */
export async function loadCasePage(id: string): Promise<CasePageResult> {
  const access = await screeningAccess();
  if (access.kind !== 'ok') return access.kind === 'denied' ? { kind: 'denied' } : access;
  if (!isUuid(id)) notFound();

  let loaded: Awaited<ReturnType<typeof loadEvaluation>>;
  try {
    loaded = await loadEvaluation(id);
  } catch (error) {
    if (isMissingTableError(error)) return { kind: 'migration' };
    throw error;
  }
  if (!loaded) notFound();

  const { actor } = access;
  const locked = loaded.file.case.locked;
  return {
    kind: 'ok',
    actor,
    file: loaded.file,
    evaluation: loaded.evaluation,
    locked,
    canManage: can(actor, 'screening.manage') && !locked,
    canEvidence: can(actor, 'screening.evidence'),
    canReview: can(actor, 'screening.review'),
    canReopen: can(actor, 'screening.reopen'),
  };
}

export type SearchParams = Record<string, string | string[] | undefined>;

export function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
