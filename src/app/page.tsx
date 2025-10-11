"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner"
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

export interface FlightProps {
  id: number;
  cp1: string;
  cp2: string;
  distance: string;
  frequency: string;
  identification: string;
  course: string;
  altitude: string;
  direction: string;
  velocity: string;
  temperature: string;
  th1: string;
  mh1: string;
  est: string;
  fuel: string;
  th2: string;
  mh2: string;
  act: string;
  ate: string;
  ata: string;
  rem1: string;

  tas: string;
  tc1: string;
  tc2: string;
  ch: string;
  leg: string;
  ete: string;
  eta: string;
  rem2: string;
}

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


    if (type === "number") {
      const regex = /^[0-9]*\.?[0-9]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

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

  const handleCalculateRow = (index: number) => {
    const currentRowData = flightProps[index];

    //Cálculo de TAS
    let calculatedTas = 0;

    if (headerData.cas && currentRowData.altitude) {
      const cas = Number(headerData.cas) || 0;
      const altitude = Number(currentRowData.altitude) || 0;

      calculatedTas = calculateTas(cas, altitude);
    } else {
      if (!headerData.cas) {
        toast.error("Por favor, ingresa el CAS en el encabezado.");
        return;
      } if (!currentRowData.altitude) {
        toast.error(`Por favor, ingresa la Altitud en la fila ${index + 1}.`);
        return;
      }
    }

    //cálculo de tc
    let calculatedTc = 0;

    if (currentRowData.direction && currentRowData.course && currentRowData.velocity && (calculatedTas != 0)) {
      const course = Number(currentRowData.course) || 0;
      const direction = Number(currentRowData.direction) || 0;
      const velocity = Number(currentRowData.velocity) || 0;

      calculatedTc = calculateTc(course, direction, velocity, calculatedTas);
    } else {
      if (!currentRowData.direction) {
        toast.error("Por favor, ingresa la Dirección del viento en la fila " + (index + 1) + ".");
        return;
      }
      if (!currentRowData.course) {
        toast.error("Por favor, ingresa el Curso en la fila " + (index + 1) + ".");
        return;
      }
      if (!currentRowData.velocity) {
        toast.error("Por favor, ingresa la Velocidad del viento en la fila " + (index + 1) + ".");
        return;
      }
      if (calculatedTas == 0) {
        toast.error("TAS = 0, por favor revisa los datos.");
        return;
      }

    }

    //cálculo de ch
    let calculatedCh = 0;
    if (currentRowData.course && calculatedTc) {
      const course = Number(currentRowData.course) || 0;
      const tc = calculatedTc;
      const mh = Number(currentRowData.mh1) || 0;
      const th = Number(currentRowData.th1) || 0;

      calculatedCh = calculateCh(course, tc, th, mh);
    }

    //cálculo de ete
    let calculatedEte = 0;
    if (currentRowData.distance && calculatedTas) {
      const distance = Number(currentRowData.distance) || 0;
      calculatedEte = calculateEte(distance, calculatedTas);
    }

    //cálculo de eta
    let calculatedEta = "";
    if (index == 0) {
      if(headerData.timeOff){
        calculatedEta = calculateEta(headerData.timeOff, calculatedEte);
      }else{
        toast.error("Por favor, ingresa el Time Off.");
        return;
      }
    } else {
      if(flightProps[index - 1].eta) {
        calculatedEta = calculateEta(flightProps[index - 1].eta, calculatedEte)
      } else {
        toast.error("No se pudo obtener el ETA de la fila anterior " + (index - 1) + ".");
        return;
      }
    }

    //rem1 es la resta de la distancia total menos la distancia recorrida (cada fila)
    let calculatedRem1 = 0;
    if (typeof totalDistance === 'undefined') {
      try {
        totalDistance = calculateTotalDistance(flightProps);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        } else {
          toast.error("Error desconocido al calcular la distancia total.");
          return;
        }
      }
    }
    if (index == 0) {
      calculatedRem1 = totalDistance - (Number(currentRowData.distance) || 0);
    } else {
      calculatedRem1 = (Number(flightProps[index - 1].rem1) || 0) - (Number(currentRowData.distance) || 0);
    }
    calculatedRem1 = round(calculatedRem1, 0);

    //rem2
    let currentRem2 = 0;
    let currentFuel = 0;

    if (headerData.gph) {
      const gph = Number(headerData.gph) || 0;
      currentFuel = calculateFuelUsed(gph, calculatedEte);

      if (index == 0) {
        if (headerData.initialFuel) {
          let initialFuel = Number(headerData.initialFuel) || 0;
          currentRem2 = initialFuel - currentFuel;
        } else {
          toast.error("Por favor, ingresa el Combustible Inicial.");
          return;
        }
      } else {
        if (flightProps[index - 1].rem2) {
          let initialFuel = Number(flightProps[index - 1].rem2) || 0;
          currentRem2 = initialFuel - currentFuel;
        } else {
          toast.error("No se pudo obtener el combustible restante de la fila anterior " + (index - 1) + ".");
        }
      }
      currentRem2 = round(currentRem2, 2);
    } else {
      toast.error("Por favor, ingresa el GPH");
      return;
    }

    const updatedProps = [...flightProps];
    updatedProps[index] = {
      ...updatedProps[index],
      tc1: calculatedTc.toFixed(0),
      tas: calculatedTas.toFixed(0),
      ch: calculatedCh.toFixed(0),
      leg: (index + 1).toString(),
      rem1: calculatedRem1.toFixed(0),
      ete: calculatedEte.toFixed(0),
      eta: calculatedEta,
      rem2: currentRem2.toFixed(2),
      fuel: currentFuel.toFixed(2),
    };
    setFlightProps(updatedProps);
  };

  const handleCalculateAllRows = () => {
    // 1. Calcula la distancia total una sola vez al principio.
    let totalDistance: number;
    try {
      totalDistance = calculateTotalDistance(flightProps);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return;
    }

    // 2. Crea un nuevo array que contendrá los resultados finales.
    const newCalculatedProps: FlightProps[] = [];

    // 3. Itera sobre las filas para calcular todo en secuencia.
    for (let i = 0; i < flightProps.length; i++) {
      const currentRowData = flightProps[i];

      // Obtenemos los datos de la fila anterior DESDE EL NUEVO ARRAY
      // para asegurarnos de que usamos los valores recién calculados.
      const previousRowData = i > 0 ? newCalculatedProps[i - 1] : null;

      // --- Aquí va la misma lógica de cálculo de 'handleCalculateRow' ---
      // --- pero adaptada para leer de 'previousRowData' cuando sea necesario ---

      // Valida que los campos necesarios existan antes de continuar
      if (!headerData.cas || !currentRowData.altitude || !currentRowData.course /* ...etc */) {
        toast.error(`Faltan datos en la fila ${i + 1} o en el encabezado.`);
        return; // Detiene el cálculo si falta un dato esencial
      }

      // Cálculo de TAS
      const cas = Number(headerData.cas) || 0;
      const altitude = Number(currentRowData.altitude) || 0;
      let notRoundedTas = (((cas * altitude * 0.02) + cas) / 1000) + cas;
      const calculatedTas = round(notRoundedTas, 0);

      // Cálculo de TC (WCA)
      const course = Number(currentRowData.course) || 0;
      const direction = Number(currentRowData.direction) || 0;
      const velocity = Number(currentRowData.velocity) || 0;
      const angle = direction - course;
      let notRoundedTc = (Math.sin(angle * Math.PI / 180) * velocity) / (calculatedTas / 60);
      const calculatedTc = round(notRoundedTc, 0);

      // Cálculo de CH
      const th1 = Number(currentRowData.th1) || 0;
      const mh1 = Number(currentRowData.mh1) || 0;
      const calculatedCh = round(course + calculatedTc + th1 + mh1, 0);

      // Cálculo de ETE
      const distance = Number(currentRowData.distance) || 0;
      let notRoundedEte = (distance * 60) / calculatedTas;
      const calculatedEte = round(notRoundedEte, 0);

      // Cálculo de ETA
      let startTime = i === 0 ? headerData.timeOff : previousRowData?.eta;
      if (!startTime) {
        toast.error(`Falta Time Off o el ETA de la fila ${i} no pudo ser calculado.`);
        return;
      }
      const timeParts = startTime.split(':');
      let initialHours = Number(timeParts[0]) || 0;
      let initialMinutes = Number(timeParts[1]) || 0;
      let totalMinutes = initialMinutes + calculatedEte;
      let finalHours = (initialHours + Math.floor(totalMinutes / 60)) % 24;
      let finalMinutes = totalMinutes % 60;
      const calculatedEta = `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;

      // Cálculo de Rem1 (Distancia restante)
      const prevRem1 = i === 0 ? totalDistance : Number(previousRowData?.rem1) || 0;
      const calculatedRem1 = round(prevRem1 - distance, 0);

      // Cálculo de Rem2 (Combustible restante)
      const gph = Number(headerData.gph) || 0;
      if (gph === 0) {
        toast.error("Por favor, ingresa el GPH.");
        return;
      }
      const fuelUsed = round(gph * (calculatedEte / 60), 2);
      const initialFuel = i === 0 ? Number(headerData.initialFuel) : Number(previousRowData?.rem2) || 0;
      if (initialFuel === 0 && i === 0) {
        toast.error("Por favor, ingresa el Combustible Inicial.");
        return;
      }
      const currentRem2 = round(initialFuel - fuelUsed, 2);

      // Añade la fila completamente calculada al nuevo array
      newCalculatedProps.push({
        ...currentRowData, // Mantiene los datos de input originales
        tas: calculatedTas.toFixed(0),
        tc1: calculatedTc.toFixed(0),
        ch: calculatedCh.toFixed(0),
        leg: (i + 1).toString(),
        ete: calculatedEte.toFixed(0),
        eta: calculatedEta,
        rem1: calculatedRem1.toFixed(0),
        fuel: fuelUsed.toFixed(2),
        rem2: currentRem2.toFixed(2),
      });
    }

    // 4. Llama a setFlightProps UNA SOLA VEZ con el array final.
    setFlightProps(newCalculatedProps);
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
                        <TableCell className="p-1"><Input type="number" name="mh1" value={props.mh1} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
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
