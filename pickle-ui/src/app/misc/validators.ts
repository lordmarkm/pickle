import { AbstractControl, ValidationErrors } from '@angular/forms';

export function timeRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('start')?.value;
  const end = group.get('end')?.value;

  if (!start || !end) return null;

  const to24Hr = (time: string): number => {
    const [h, m, period] = time.match(/(\d+):(\d+)\s?(am|pm)/i)?.slice(1) || [];
    let hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);
    if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const startMin = to24Hr(start);
  const endMin = to24Hr(end);

  return endMin > startMin ? null : { timeRange: true };
}
