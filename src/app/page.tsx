"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dir } from "console";
import React from "react";
import { useState } from "react";

interface FlightProps {
  id: number;
  cp1: string;
  cp2: string;
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
  // Calculated fields
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
  cp1: '', cp2: '', frequency: '', identification: '', course: '', altitude: '',
  direction: '', velocity: '', temperature: '', th1: '', mh1: '', est: '',
  fuel: '', th2: '', mh2: '', act: '', ate: '', ata: '', rem1: '',
  tas: '', tc1: '', tc2: '', ch: '', leg: '', ete: '', eta: '', rem2: ''
};

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

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

  const agregarPunto = () => {
    setFlightProps(prev => [...prev, { ...initialFlightState, id: Date.now() }]);
  };

  const handleCalculateRow = (index: number) => {
    const currentRowData = flightProps[index];

    console.log("Calculando datos solo para la fila:", index);
    console.log(currentRowData);

    //cálculo de leg y rem
    let currentFuel = 0;
    if(index == 0){
      if(headerData.initialFuel){
        currentFuel = Number(headerData.initialFuel) || 0;
      }else{
        alert("Por favor, ingresa el Combustible Inicial.");
      }
    }else{
      const previousFuel = flightProps[index - 1].fuel;
    }

    //Cálculo de TAS
    let calculatedTas = 0;

    if(headerData.cas && currentRowData.altitude){
      const cas = Number(headerData.cas) || 0;
      const altitude = Number(currentRowData.altitude) || 0; 

      let notRoundedTas = (((cas * altitude * 0.02) + cas)/1000) + cas
      
      calculatedTas = round(notRoundedTas, 0);
      console.log("TAS calculado: ", calculatedTas);
    }else{
      if(!headerData.cas){
        alert("Por favor, ingresa el CAS en el encabezado.");
        return;
      }if(!currentRowData.altitude){
        alert("Por favor, ingresa la Altitud en la fila " + (index + 1) + ".");
        return;
      }
    }
    
    //cálculo de tc
    let calculatedTc = 0;

    if(currentRowData.direction && currentRowData.course && currentRowData.velocity && (calculatedTas != 0)){
      const course = Number(currentRowData.course) || 0;
      const direction = Number(currentRowData.direction) || 0;
      const velocity = Number(currentRowData.velocity) || 0;
      
      const angle = direction - course;

      let notRoundedTc = (Math.sin(angle * Math.PI/180) * velocity)/(calculatedTas/60);
      calculatedTc = round(notRoundedTc, 0);
    }else{
      if(!currentRowData.direction){
        alert("Por favor, ingresa la Dirección del viento en la fila " + (index + 1) + ".");
        return;
      }
      if(!currentRowData.course){
        alert("Por favor, ingresa el Curso en la fila " + (index + 1) + ".");
        return;
      }
      if(!currentRowData.velocity){
        alert("Por favor, ingresa la Velocidad del viento en la fila " + (index + 1) + ".");
        return;
      }
      if(calculatedTas == 0){
        alert("TAS = 0, por favor revisa los datos.");
        return;
      }

    }
    
    //cálculo de ch

    let calculatedCh = 0;
    if(currentRowData.course && calculatedTc){
      const course = Number(currentRowData.course) || 0;
      const tc = Number(currentRowData.tc1) || 0;
      const mh = Number(currentRowData.mh1) || 0;
      const th = Number(currentRowData.th1) || 0;

      calculatedCh = round(course + tc + mh + th, 0);
    }


    
    // ...haz lo mismo para los demás valores que necesites...

    // Ejemplo de un cálculo simple
    const calculatedValue = 10; // Reemplaza esto con tu lógica real

    // 3. Actualiza el estado de forma inmutable
    const updatedProps = [...flightProps];
    updatedProps[index] = {
      ...updatedProps[index],
      tc1: calculatedTc.toFixed(0),
      tas: calculatedTas.toFixed(0),
      ch: calculatedCh.toFixed(0),
      // ...actualiza otros campos calculados...
    };
    setFlightProps(updatedProps);
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
            <Button onClick={agregarPunto} className="w-fit hover:cursor-pointer">Agregar Punto</Button>

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
              <Label>GPH</Label>
              <Input type="number" id="gph" value={headerData.gph} onChange={handleHeaderChange} />
            </div>
          </div>

          <Card className="p-0">
            <CardContent className="px-0">
              <Table id="data-table">
                <TableHeader>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={3} colSpan={2}>Check Points</TableHead>
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
                  </TableRow>

                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={2}>Frecuencia</TableHead>
                    <TableHead className="text-center border-r" rowSpan={2}>Identificación</TableHead>

                    <TableHead className="text-center border-r">Dirección</TableHead>
                    <TableHead className="text-center border-r">Velocidad</TableHead>

                    <TableHead className="text-center border-r p-0">
                      <Input type="number" id="cas" value={headerData.cas} onChange={handleHeaderChange} />
                    </TableHead>

                    <TableHead className="text-center border-r" rowSpan={2}>-L<br />+R<br />WCA</TableHead>
                    <TableHead className="text-center border-r" rowSpan={2}>-E<br />+W<br />Var.</TableHead>
                    <TableHead className="text-center border-r" rowSpan={2}>+Dev.</TableHead>

                    <TableHead className="text-center border-r">Leg</TableHead>
                    <TableHead className="text-center border-r">Est.</TableHead>

                  </TableRow>

                  <TableRow className="hover:bg-default">
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
                        <TableCell><Input type="number" name="fuel" value={props.fuel} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                      </TableRow>

                      <TableRow className="hover:bg-default">
                        <TableCell colSpan={2} className="text-center"> <Button variant={"default"} className="hover:cursor-pointer" onClick={() => handleCalculateRow(index)}>Calcular</Button> </TableCell>
                        <TableCell colSpan={2}><Input type="number" name="temperature" value={props.temperature} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><span>{props.tc2}</span></TableCell>
                        <TableCell className="p-1"><Input type="number" name="th2" value={props.th2} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell className="p-1"><Input type="number" name="mh2" value={props.mh2} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><span>{props.rem1}</span></TableCell>
                        <TableCell><Input type="number" name="act" value={props.act} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input type="number" name="ate" value={props.ate} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input type="number" name="ata" value={props.ata} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                        <TableCell><Input type="number" name="rem2" value={props.rem2} onChange={(e) => handleBodyChange(index, e)} /></TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>

              </Table>
            </CardContent>
          </Card>

          {/* <div className="p-4 bg-gray-100 rounded-md mt-4">
              <h3 className="font-bold">Estado Actual (Header):</h3>
              <pre>{JSON.stringify(headerData, null, 2)}</pre>
              <h3 className="font-bold mt-2">Estado Actual (Tabla):</h3>
              <pre>{JSON.stringify(flightProps, null, 2)}</pre>
          </div> */}

        </div>
      </div>
    </main>
  );
}
