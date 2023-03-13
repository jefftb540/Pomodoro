function zeroLeft(n: number) {
  return Math.floor(n).toString().padStart(2, '0');
}

export function secondsToMinutes(seconds: number): string {
  const min = zeroLeft((seconds / 60) % 60);
  const sec = zeroLeft((seconds % 60) % 60);
  return `${min}:${sec}`;
}

export function secondsToHours(seconds: number): string {
  const hour = zeroLeft(seconds / 3600);
  const min = zeroLeft((seconds / 60) % 60);
  const sec = zeroLeft((seconds % 60) % 60);
  return `${hour}:${min}:${sec}`;
}
