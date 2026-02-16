'use client';

import { useState, useCallback } from 'react';
import { ScheduleView } from '@/components/schedule';
import { saveSchedule, deleteSchedule } from '@/lib/api/schedule';
import type { Schedule } from '@/lib/types';
import { SAMPLE_COURSES } from '@/lib/data/sampleData';

/** Build current schedule from sample courses for design. Replace with backend when ready. */
const INITIAL_SCHEDULE: Schedule = {
  id: 'current',
  name: 'Current schedule',
  courses: SAMPLE_COURSES,
};

export default function SchedulePage() {
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(INITIAL_SCHEDULE);
  const [savedSchedules, setSavedSchedules] = useState<ReadonlyArray<Schedule>>([]);

  const handleSaveSchedule = useCallback((name: string) => {
    if (!currentSchedule) return;
    saveSchedule(currentSchedule, name);
  }, [currentSchedule]);

  const handleDeleteSchedule = useCallback((id: string) => {
    deleteSchedule(id);
  }, []);

  return (
    <ScheduleView
      currentSchedule={currentSchedule}
      savedSchedules={savedSchedules}
      userProfile={null}
      onSaveSchedule={handleSaveSchedule}
      onDeleteSchedule={handleDeleteSchedule}
    />
  );
}
