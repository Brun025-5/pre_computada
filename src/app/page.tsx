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

  let totalDistance: number;

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
    const { id, value, type } = e.target;

    if (type === "number") {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    setHeaderData(prev => ({ ...prev, [id]: value }));
  };

  const handleBodyChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;


    // if (type === "number") {
    //   const regex = /^[0-9]*\.?[0-9]*$/;
    //   if (!regex.test(value)) {
    //     return;
    //   }
    // }

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

  const calculateSingleLeg = (currentRow: FlightProps, previousRow: FlightProps | null, headerData: { cas: string; timeOff: string; gph: string; initialFuel: string }, totalDistance: number): FlightProps => {

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
      leg: (currentRow.id + 1).toString(),
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

      let calculatedLeg = calculateSingleLeg(currentRow, previousRow, headerData, totalDistance);

      calculatedLeg = {
        ...calculatedLeg,
        leg: (index + 1).toString(),
      };

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

        let calculatedLeg = calculateSingleLeg(currentRow, previousRow, headerData, totalDistance);
        calculatedLeg = {
          ...calculatedLeg,
          leg: (i + 1).toString(),
        };

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
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Pre Computada</h1>
          <p className="text-slate-500">Introduce los datos para calcular.</p>
        </header>

        <div className="flex flex-col gap-5">

          <div className="grid grid-cols-5 items-center gap-3">
            <div className="flex flex-row gap-3">
              <Button onClick={handleAddRow} size={"lg"} className="w-fit hover:cursor-pointer">Agregar Punto</Button>
              <Button onClick={handleCalculateAllRows} size={"lg"} className="w-fit hover:cursor-pointer">Calcular Todo</Button>
            </div>

            <div className="col-start-3 flex flex-col gap-2">
              <Label htmlFor="initialFuel">Combustible Inicial</Label>
              <Input type="number" id="initialFuel" value={headerData.initialFuel} onChange={handleHeaderChange} />
            </div>

            <div className="flex justify-end">
              <div className="flex flex-col gap-2 ">
                <Label>Time Off</Label>
                <Input type="time" id="timeOff" className="w-fit" value={headerData.timeOff} onChange={handleHeaderChange} />
              </div>

            </div>

            <div className="flex flex-col gap-2">
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

                    <TableHead className="text-center border-r">Dirección</TableHead>
                    <TableHead className="text-center border-r">Velocidad</TableHead>

                    <TableHead className="text-center border-r p-0">
                      <Input type="number" id="cas" value={headerData.cas} onChange={handleHeaderChange} className="font-normal" />
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
                  {flightProps.map((props, index) => (
                    <React.Fragment key={props.id}>
                      <TableRow className="hover:bg-default border-b-0">
                        <TableCell><Input name="cp1" value={props.cp1} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input name="cp2" value={props.cp2} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="frequency" value={props.frequency} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="identification" value={props.identification} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="course" value={props.course} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell rowSpan={2}><Input type="number" name="altitude" value={props.altitude} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input type="number" name="direction" value={props.direction} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input type="number" name="velocity" value={props.velocity} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell rowSpan={2}><span>{props.tas}</span></TableCell>
                        <TableCell><span>{props.tc1}</span></TableCell>
                        <TableCell className="p-1"><Input type="number" name="th1" value={props.th1} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell className="p-1"><Input type="number" name="mh1" min={-100} value={props.mh1} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell rowSpan={2}><span>{props.ch}</span></TableCell>
                        <TableCell><span>{props.leg}</span></TableCell>
                        <TableCell><Input type="number" name="est" value={props.est} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><span>{props.ete}</span></TableCell>
                        <TableCell><span>{props.eta}</span></TableCell>
                        <TableCell className="border-r"><span>{props.fuel}</span></TableCell>
                        <TableCell rowSpan={2}>
                          <div className={index > 0 ? "flex flex-col items-center gap-2" : ""}>
                            <Button size={"sm"} onClick={() => handleCalculateRow(index)}>
                              Calcular
                            </Button>
                            {index > 0 &&
                              <Button variant={"destructive"} size={"icon"} onClick={() => handleDeleteRow(props.id)}>
                                <LucideX />
                              </Button>
                            }
                          </div>
                        </TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-default">
                        <TableCell colSpan={2}><Input type="number" name="distance" value={props.distance} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell colSpan={2}><Input type="number" name="temperature" value={props.temperature} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><span>{props.tc2}</span></TableCell>
                        <TableCell className="p-1"><Input type="number" name="th2" value={props.th2} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell className="p-1"><Input type="number" name="mh2" value={props.mh2} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><span>{props.rem1}</span></TableCell>
                        <TableCell><Input type="number" name="act" value={props.act} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input type="number" name="ate" value={props.ate} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input type="number" name="ata" value={props.ata} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell className="border-r"><span>{props.rem2}</span></TableCell>
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
