"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner"
import { FlightProps } from "@/types"
import React, { useState } from "react";

import {
  calculateTas,
  calculateTc,
  calculateCh,
  calculateEte,
  calculateEta,
  calculateFuelUsed,
  calculateTotalDistance,
  round
} from "@/lib/calculations";

const initialFlightState: FlightProps = {
  id: 0,
  cp1: '', cp2: '', distance: '', frequency: '', identification: '', course: '', altitude: '',
  direction: '', velocity: '', temperature: '', th1: '', mh1: '', est: '',
  fuel: '', th2: '', mh2: '', act: '', ate: '', ata: '', rem1: '',
  tas: '', tc1: '', tc2: '', ch: '', leg: '', ete: '', eta: '', rem2: ''
};


export default function Home() {

  const [headerData, setHeaderData] = useState({
    initialFuel: '',
    timeOff: '',
    gph: '',
    cas: ''
  });

  const [flightProps, setFlightProps] = useState<FlightProps[]>([
    { ...initialFlightState, id: Date.now() }
  ]);

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setHeaderData(prev => ({ ...prev, [id]: value }));
  };

  const handleLegChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedProps = [...flightProps];
    updatedProps[index] = { ...updatedProps[index], [name]: value };
    setFlightProps(updatedProps);
  };

  const handleAddRow = () => {
    setFlightProps(prev => [...prev, { ...initialFlightState, id: Date.now() }]);
  };

  const handleDeleteRow = (idToDelete: number) => {
    const updatedFlightProps = flightProps.filter(prop => prop.id !== idToDelete);
    setFlightProps(updatedFlightProps);
  };

  const calculateSingleLeg = (legIndex: number, currentRow: FlightProps, previousRow: FlightProps | null, headerData: { cas: string; timeOff: string; gph: string; initialFuel: string }, totalDistance: number): FlightProps => {

    if (!headerData.cas) throw new Error("Por favor, ingresa el CAS.");
    if (!currentRow.altitude) throw new Error("Falta la Altitud.");
    if (!currentRow.course) throw new Error("Falta el Curso.");
    if (!currentRow.direction) throw new Error("Falta la Dirección del viento.");
    if (!currentRow.velocity) throw new Error("Falta la Velocidad del viento.");

    const cas = Number(headerData.cas);
    const altitude = Number(currentRow.altitude);
    const course = Number(currentRow.course);
    const direction = Number(currentRow.direction);
    const velocity = Number(currentRow.velocity);
    const distance = Number(currentRow.distance);
    const th1 = Number(currentRow.th1);
    const mh1 = Number(currentRow.mh1);

    const calculatedTas = calculateTas(cas, altitude);
    if (calculatedTas === 0) throw new Error("El TAS no puede ser 0. Revisa los datos.");

    const calculatedTc = calculateTc(course, direction, velocity, calculatedTas);
    const calculatedCh = calculateCh(course, calculatedTc, th1, mh1);
    const calculatedEte = calculateEte(distance, calculatedTas);

    const startTime = previousRow ? previousRow.eta : headerData.timeOff;
    if (!startTime) throw new Error("Falta Time Off o el ETA de la fila anterior.");
    const calculatedEta = calculateEta(startTime, calculatedEte);

    const prevRem1 = previousRow ? Number(previousRow.rem1) : totalDistance;
    const calculatedRem1 = round(prevRem1 - distance, 0);

    const gph = Number(headerData.gph);
    if (!gph) throw new Error("Por favor, ingresa el GPH.");
    const fuelUsed = calculateFuelUsed(gph, calculatedEte);
    const initialFuel = previousRow ? Number(previousRow.rem2) : Number(headerData.initialFuel);
    if (!initialFuel) throw new Error("Falta el Combustible Inicial o el restante de la fila anterior.");
    const currentRem2 = round(initialFuel - fuelUsed, 2);

    return {
      ...currentRow,
      tas: calculatedTas.toFixed(0),
      tc1: calculatedTc.toFixed(0),
      ch: calculatedCh.toFixed(0),
      leg: (legIndex + 1).toString(),
      rem1: calculatedRem1.toFixed(0),
      ete: calculatedEte.toFixed(0),
      eta: calculatedEta,
      rem2: currentRem2.toFixed(2),
      fuel: fuelUsed.toFixed(2),
    };
  };

  const handleCalculateRow = (index: number) => {
    try {
      const totalDistance = calculateTotalDistance(flightProps);
      const currentRow = flightProps[index];
      const previousRow = index > 0 ? flightProps[index - 1] : null;

      const calculatedLeg = calculateSingleLeg(index, currentRow, previousRow, headerData, totalDistance);

      const updatedLegs = [...flightProps];
      updatedLegs[index] = calculatedLeg;
      setFlightProps(updatedLegs);
      toast.success(`Fila ${index + 1} calculada.`);

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleCalculateAllRows = () => {
    try {
      const totalDistance = calculateTotalDistance(flightProps);
      const newCalculatedProps: FlightProps[] = [];

      for (let i = 0; i < flightProps.length; i++) {
        const currentRow = flightProps[i];
        const previousRow = i > 0 ? newCalculatedProps[i - 1] : null;

        const calculatedLeg = calculateSingleLeg(i, currentRow, previousRow, headerData, totalDistance);

        newCalculatedProps.push(calculatedLeg);
      }

      setFlightProps(newCalculatedProps);
      toast.success("¡Todos los puntos han sido calculados!");

    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error en el cálculo: ${error.message}`);
      }
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-fit mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Pre Computada</h1>
          <p className="text-slate-500">Introduce los datos para calcular.</p>
        </header>

        <div className="flex flex-col gap-5">

          <div className="lg:grid lg:grid-cols-5 lg:items-center lg:gap-3 flex flex-col gap-5">
            <div className="flex flex-row gap-3">
              <Button onClick={handleAddRow} size={"lg"} className="w-fit hover:cursor-pointer">Agregar Punto</Button>
              <Button onClick={handleCalculateAllRows} size={"lg"} className="w-fit hover:cursor-pointer">Calcular Todo</Button>
            </div>

            <div className="lg:col-start-3 flex flex-col gap-2 w-fit">
              <Label htmlFor="initialFuel">Combustible Inicial</Label>
              <Input type="number" id="initialFuel" value={headerData.initialFuel} onChange={handleHeaderChange} />
            </div>

            <div className="lg:flex lg:justify-end">
              <div className="flex flex-col gap-2 ">
                <Label>Time Off</Label>
                <Input type="time" id="timeOff" className="w-fit" value={headerData.timeOff} onChange={handleHeaderChange} />
              </div>

            </div>

            <div className="flex flex-col gap-2 w-fit">
              <Label>GPH / LPH</Label>
              <Input type="number" id="gph" value={headerData.gph} onChange={handleHeaderChange} />
            </div>
          </div>

          <Card className="p-0">
            <CardContent className="px-0">
              <Table id="data-table">
                <TableHeader>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={2} colSpan={2}>Check Points</TableHead>
                    <TableHead className="text-center border-r bg-gray-200" colSpan={2}>VOR</TableHead>

                    <TableHead className="text-center border-r" rowSpan={3}>Course</TableHead>
                    <TableHead className="text-center border-r" rowSpan={3}>Altitud</TableHead>
                    <TableHead className="text-center border-r bg-gray-200" rowSpan={1} colSpan={2}>Aire</TableHead>
                    <TableHead className="text-center border-r">CAS</TableHead>

                    <TableHead className="text-center border-r" >TC</TableHead>
                    <TableHead className="text-center border-r" >TH</TableHead>
                    <TableHead className="text-center border-r" >MH</TableHead>
                    <TableHead className="text-center border-r" rowSpan={3}>CH</TableHead>

                    <TableHead className="text-center border-r bg-gray-200">Dist.</TableHead>
                    <TableHead className="text-center border-r bg-gray-200">GS</TableHead>

                    <TableHead className="text-center border-r" rowSpan={2}>ETE</TableHead>

                    <TableHead className="text-center border-r" rowSpan={2}>ETA</TableHead>

                    <TableHead className="text-center border-r" rowSpan={2}>Fuel</TableHead>

                    <TableHead className="text-center" rowSpan={3}>Acc.</TableHead>

                  </TableRow>

                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={2}>Frec.</TableHead>
                    <TableHead className="text-center border-r" rowSpan={2}>Id.</TableHead>

                    <TableHead className="text-center border-r">Dir.</TableHead>
                    <TableHead className="text-center border-r">Vel.</TableHead>

                    <TableHead className="text-center border-r p-0">
                      <Input type="number" id="cas" value={headerData.cas} onChange={handleHeaderChange} className="font-normal w-15" />
                    </TableHead>

                    <TableHead className="text-center border-r" rowSpan={2}>-L<br />+R<br />WCA</TableHead>
                    <TableHead className="text-center border-r" rowSpan={2}>-E<br />+W<br />Var.</TableHead>
                    <TableHead className="text-center border-r" rowSpan={2}>+Dev.</TableHead>

                    <TableHead className="text-center border-r">Leg</TableHead>
                    <TableHead className="text-center border-r">Est.</TableHead>

                  </TableRow>

                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" colSpan={2}>Distancia</TableHead>

                    <TableHead className="text-center border-r" colSpan={2}>Temperatura</TableHead>

                    <TableHead className="text-center border-r">TAS</TableHead>

                    <TableHead className="text-center border-r">Rem</TableHead>
                    <TableHead className="text-center border-r">Act</TableHead>

                    <TableHead className="text-center border-r">ATE</TableHead>
                    <TableHead className="text-center border-r">ATA</TableHead>
                    <TableHead className="text-center border-r">Rem</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {flightProps.map((leg, index) => (
                    <React.Fragment key={leg.id}>
                      <TableRow className="hover:bg-default border-b-0 text-center">
                        <TableCell><Input name="cp1" value={leg.cp1} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><Input name="cp2" value={leg.cp2} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="frequency" value={leg.frequency} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="identification" value={leg.identification} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="course" value={leg.course} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="altitude" value={leg.altitude} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><Input type="number" name="direction" value={leg.direction} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><Input type="number" name="velocity" value={leg.velocity} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell rowSpan={2}><span>{leg.tas}</span></TableCell>
                        <TableCell><span>{leg.tc1}</span></TableCell>
                        <TableCell><Input type="number" name="th1" value={leg.th1} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><Input type="number" name="mh1" min={-100} value={leg.mh1} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell rowSpan={2}><span>{leg.ch}</span></TableCell>
                        <TableCell><span>{leg.leg}</span></TableCell>
                        <TableCell><Input type="number" name="est" value={leg.est} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><span>{leg.ete}</span></TableCell>
                        <TableCell><span>{leg.eta}</span></TableCell>
                        <TableCell className="border-r"><span>{leg.fuel}</span></TableCell>
                        <TableCell rowSpan={2}>
                          <div className={index > 0 ? "flex flex-col items-center gap-2" : ""}>
                            <Button size={"sm"} onClick={() => handleCalculateRow(index)}>
                              Calcular
                            </Button>
                            {index > 0 &&
                              <Button variant={"destructive"} size={"icon"} onClick={() => handleDeleteRow(leg.id)}>
                                <LucideX />
                              </Button>
                            }
                          </div>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-default text-center">
                        <TableCell colSpan={2}><Input type="number" name="distance" value={leg.distance} onChange={(e) => handleLegChange(index, e)} className="w-20" /></TableCell>
                        <TableCell colSpan={2}><Input type="number" name="temperature" value={leg.temperature} onChange={(e) => handleLegChange(index, e)} className="w-20" /></TableCell>
                        <TableCell><span>{leg.tc2}</span></TableCell>
                        <TableCell><Input type="number" name="th2" value={leg.th2} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><Input type="number" name="mh2" value={leg.mh2} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><span>{leg.rem1}</span></TableCell>
                        <TableCell><Input type="number" name="act" value={leg.act} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><Input type="number" name="ate" value={leg.ate} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell><Input type="number" name="ata" value={leg.ata} onChange={(e) => handleLegChange(index, e)} className="w-15" /></TableCell>
                        <TableCell className="border-r"><span>{leg.rem2}</span></TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>

              </Table>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}
