import { z } from 'zod';

export const DateStartEndSchema = z.object({
  start: z.string(
    {
      required_error: "Hora de início é obrigatória"
    }
  ),
  end: z.string({
    required_error: "Hora de término é obrigatória"
  }),
  isNextDay: z
    .boolean({
        required_error: "Confirme se o turno passa para o dia seguinte"
    })
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
  const regexExtractHourFirstTwoDigits = new RegExp(/^[0-9]{2}/);
  const regexExtractMinutesLastTwoDigits = new RegExp(/[0-9]{2}$/);
  const startHourCollectingFirstTwoDigts = parseInt( regexExtractHourFirstTwoDigits.exec(start)?.[0] ?? "0" );
  const startMinutesCollectingLastTwoDigts = parseInt(regexExtractMinutesLastTwoDigits.exec(start)?.[0] ?? "0" );
  const endHourCollectingFirstTwoDigts = parseInt( regexExtractHourFirstTwoDigits.exec(end)?.[0] ?? "0" );
  const endMinutesCollectingLastTwoDigts = parseInt( regexExtractMinutesLastTwoDigits.exec(end)?.[0] ?? "0");
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


export function handleisSameDate(
  date1: Date,
  date2: Date
) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
