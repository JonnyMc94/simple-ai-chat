import timezone from 'moment-timezone';

export default async function getTime(timeZone="UTC") {
  if (!timezone.tz.names().includes(timeZone)) {
    return "Invalid timezone. Please use one of the following: " + timezone.tz.names().join(", ");
  }
  return new Date().toLocaleString('en-US', { timeZone: timeZone });
}
