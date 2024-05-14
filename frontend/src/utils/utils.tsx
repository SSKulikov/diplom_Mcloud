import dayjs from "dayjs";
dayjs().format();

// приводит размер Byte к ед.измерения
export function sizeValidator(size: number) {
  const units = ["KB", "MB", "GB", "TB"];
  let rez = size / 1024;

  let count = 0;
  while (rez > 1024) {
    count += 1;
    rez = rez / 1024;
  }

  return Math.round(rez) + " " + units[count];
}
// перевод дат в дд.мм.гг
export function timeConverter(time: string) {
  if (time) {
    const day = dayjs(time);
    return day.format("DD-MM-YY HH:mm:ss");
  }
  return "нет данных";
}
