import { z } from 'zod';

export const DateStartEndSchema = z.object({
  start: z.string().refine((value) => {
    value !== '';
  }, 'Hora de início é obrigatória, e deve ser no formato 24h. Ex: 00:00'),
  end: z.string().refine((value) => {
    value !== '';
  }, 'Hora de término é obrigatória, e deve ser no formato 24h. Ex: 00:00'),
  isNextDay: z
    .boolean()
    .refine(
      (value) => value !== null,
      'Confirme se o turno passa para o dia seguinte.'
    )
});

export type DateStartEndValues = z.infer<typeof DateStartEndSchema>;

export function handleDateStartEnd({
  start,
  end,
  isNextDay
}: DateStartEndValues) {
  const startHourCollectingFirstTwoDigts = parseInt(start.slice(0, 2));
  const startMinutesCollectingLastTwoDigts = parseInt(start.slice(3, 5));
  const endHourCollectingFirstTwoDigts = parseInt(end.slice(0, 2));
  const endMinutesCollectingLastTwoDigts = parseInt(end.slice(0, 2));
  if (isNextDay) {
    return {
      start: new Date(
        0,
        0,
        0,
        startHourCollectingFirstTwoDigts,
        startMinutesCollectingLastTwoDigts
      ),
      end: new Date(
        0,
        0,
        1,
        endHourCollectingFirstTwoDigts,
        endMinutesCollectingLastTwoDigts
      )
    };
  }
  return {
    start: new Date(
      0,
      0,
      0,
      startHourCollectingFirstTwoDigts,
      startMinutesCollectingLastTwoDigts
    ),
    end: new Date(
      0,
      0,
      0,
      endHourCollectingFirstTwoDigts,
      endMinutesCollectingLastTwoDigts
    )
  };
}
