import 'server-only';

import { cache } from 'react';
import { SCREENING_POLICY } from './config';
import { screeningDb } from './db';
import { evaluateCase } from './engine';
import { getAdminUsers, getCaseFile, listAuditEvents, listCases } from './queries';

// Per-request memoised loaders so the case layout and the page it wraps
// share a single database round-trip.

export const loadCaseFile = cache(async (id: string) => getCaseFile(screeningDb(), id));

export const loadEvaluation = cache(async (id: string) => {
  const file = await loadCaseFile(id);
  return file ? { file, evaluation: evaluateCase(file, SCREENING_POLICY) } : null;
});

export const loadCases = cache(async () => listCases(screeningDb()));

export const loadAdminUsers = cache(async () => getAdminUsers(screeningDb()));

export const loadAuditEvents = cache(async (caseId: string) => listAuditEvents(screeningDb(), caseId));
