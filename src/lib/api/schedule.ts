import type { Schedule } from '@/lib/types';

/**
 * Save the current schedule with a name. Implement to call your backend.
 * The list of saved schedules should be refetched or provided by the backend.
 */
export async function saveSchedule(_schedule: Schedule | null, _name: string): Promise<void> {
  // Replace with backend call, e.g. POST /api/schedules with body { schedule, name }.
}

/**
 * Delete a saved schedule by id. Implement to call your backend.
 */
export async function deleteSchedule(_id: string): Promise<void> {
  // Replace with backend call, e.g. DELETE /api/schedules/:id.
}
