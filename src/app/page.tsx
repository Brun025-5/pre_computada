"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import { useState } from "react";

interface Checkpoint {
  id: number;
}

export default function Home() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { id: 1 }
  ]);

  const agregarPunto = () => {
    const nuevoPunto: Checkpoint = { id: Date.now() };
    setCheckpoints(prevCheckpoints => [...prevCheckpoints, nuevoPunto]);
  };


  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Pre Computada</h1>
          <p className="text-slate-500">Introduce los datos para calcular.</p>
        </header>

        <div className="flex flex-col gap-5">
          <Button onClick={agregarPunto} className="w-fit">Agregar Punto</Button>
          <Card className="p-0">
            <CardContent className="px-0">
              <Table id="data-table">
                <TableHeader>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={3} colSpan={2}>Check Points</TableHead>
                    <TableHead className="text-center border-r bg-gray-200" colSpan={2}>VOR</TableHead>

                    <TableHead className="text-center border-r" rowSpan={3}>Course</TableHead>
                    <TableHead className="text-center border-r" rowSpan={3}>Altitud</TableHead>
                    <TableHead className="text-center border-r bg-gray-200" rowSpan={1} colSpan={2}>Wind</TableHead>
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

                    <TableHead className="text-center border-r">
                      <Input type="number" placeholder="4.2" />
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
                  {checkpoints.map((checkpoint) => (
                    // Usamos React.Fragment para agrupar las dos TableRow por cada punto
                    // La 'key' es crucial para que React identifique cada elemento de la lista
                    <React.Fragment key={checkpoint.id}>
                      <TableRow className="hover:bg-default border-b-0">
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell rowSpan={2}>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-default">
                        <TableCell colSpan={2}>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
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
