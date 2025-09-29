import { FlightProps } from '@/app/page';

export function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function calculateTas(cas: number, altitude: number): number {
  if (cas <= 0) return 0;
  const notRoundedTas = (((cas * altitude * 0.02) + cas) / 1000) + cas;
  return round(notRoundedTas, 0);
}
//----
export function calculateTc(course: number, windDirection: number, windVelocity: number, tas: number): number {
  if (tas <= 0) return 0;
  const angle = windDirection - course;
  const notRoundedWca = (Math.sin(angle * Math.PI / 180) * windVelocity) / (tas / 60);
  return round(notRoundedWca, 0);
}
//----
export function calculateCh(course: number, tc: number, th: number, mh: number): number {
    return round(course + tc + th + mh, 0);
}
//----
export function calculateEte(distance: number, tas: number): number {
    if (tas <= 0) return 0;
    const notRoundedEte = (distance * 60) / tas;
    return round(notRoundedEte, 0);
}
//---
export function calculateEta(startTime: string, eteMinutes: number): string {
    const timeParts = startTime.split(':');
    const initialHours = Number(timeParts[0]) || 0;
    let initialMinutes = Number(timeParts[1]) || 0;

    let totalMinutes = initialMinutes + eteMinutes;
    const finalHours = (initialHours + Math.floor(totalMinutes / 60)) % 24;
    const finalMinutes = totalMinutes % 60;

    return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
}

export function calculateFuelUsed(gph: number, eteMinutes: number): number {
    if (gph <= 0) return 0;
    const fuel = gph * (eteMinutes / 60);
    return round(fuel, 2);
}

export function calculateTotalDistance(flightProps: FlightProps[]): number {
  let finalDistance = 0;
  flightProps.forEach((prop, index) => {
    if (prop.distance) {
      finalDistance += Number(prop.distance) || 0;
    } else {
      throw new Error("Distancia no ingresada en la fila " + (index + 1));
    }
  })
  return finalDistance;
}