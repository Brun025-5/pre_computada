import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Pre Computada</h1>
          <p className="text-slate-500">Introduce los datos para calcular.</p>
        </header>


        {/* Área Principal Derecha: La Tabla */}
        <div className="flex flex-col gap-5">
          <Card className="p-0">
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={2} colSpan={2}>Check Points</TableHead>
                    <TableHead className="text-center" colSpan={2}>VOR</TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r">Frecuencia</TableHead>
                    <TableHead className="text-center">Identificación</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow className="hover:bg-default">
                    <TableCell>
                      <Input id="checkpoint1" type="text" placeholder="CP1" />
                    </TableCell>
                    <TableCell>
                      <Input id="checkpoint2" type="text" placeholder="CP2" />
                    </TableCell>
                    <TableCell>
                      <Input id="frequency" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell>
                      <Input id="identification" type="number" placeholder="42.0" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={3}>Course</TableHead>
                    <TableHead className="text-center border-r" rowSpan={3}>Altitud</TableHead>
                    <TableHead className="text-center border-r" rowSpan={1} colSpan={2}>Wind</TableHead>
                    <TableHead className="text-center border-r" rowSpan={3}>CAS</TableHead>
                    <TableHead className="text-center" rowSpan={3}>TAS</TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={1}>Dirección</TableHead>
                    <TableHead className="text-center border-r" rowSpan={1}>Velocidad</TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" colSpan={2}>Temperatura</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow className="hover:bg-default">
                    <TableCell rowSpan={2}>
                      <Input id="course" type="number" placeholder="num" />
                    </TableCell>
                    <TableCell rowSpan={2}>
                      <Input id="altitude" type="number" placeholder="" />
                    </TableCell>
                    <TableCell rowSpan={1}>
                      <Input id="direction" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell rowSpan={1}>
                      <Input id="speed" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell rowSpan={2}>
                      <Input id="CAS" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell rowSpan={2}>
                      <Label id="TAS">TAS</Label>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-default">
                    <TableCell rowSpan={1} colSpan={2}>
                      <Input id="temperature" type="number" placeholder="[°]" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r">TC</TableHead>
                    <TableHead className="text-center border-r">TH</TableHead>                      
                    <TableHead className="text-center border-r">MH</TableHead>
                    <TableHead className="text-center">CM</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>  
                  <TableRow className="hover:bg-default">
                    <TableCell>
                      <Input id="TC" type="text" placeholder="x" />
                    </TableCell>
                    <TableCell>
                      <Input id="TH" type="text" placeholder="x" />
                    </TableCell>
                    <TableCell>
                      <Input id="MH" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell>
                      <Input id="CM" type="number" placeholder="42.0" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={3}>Distancia</TableHead>
                    <TableHead className="text-center border-r" rowSpan={3}>Altitud</TableHead>
                    <TableHead className="text-center border-r" rowSpan={1} colSpan={2}>Wind</TableHead>
                    <TableHead className="text-center border-r" rowSpan={3}>CAS</TableHead>
                    <TableHead className="text-center" rowSpan={3}>TAS</TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" rowSpan={1}>Dirección</TableHead>
                    <TableHead className="text-center border-r" rowSpan={1}>Velocidad</TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-default">
                    <TableHead className="text-center border-r" colSpan={2}>Temperatura</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow className="hover:bg-default">
                    <TableCell rowSpan={2}>
                      <Input id="course" type="number" placeholder="num" />
                    </TableCell>
                    <TableCell rowSpan={2}>
                      <Input id="altitude" type="number" placeholder="" />
                    </TableCell>
                    <TableCell rowSpan={1}>
                      <Input id="direction" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell rowSpan={1}>
                      <Input id="speed" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell rowSpan={2}>
                      <Input id="CAS" type="number" placeholder="42.0" />
                    </TableCell>
                    <TableCell rowSpan={2}>
                      <Label id="TAS">TAS</Label>
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-default">
                    <TableCell rowSpan={1} colSpan={2}>
                      <Input id="temperature" type="number" placeholder="[°]" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
