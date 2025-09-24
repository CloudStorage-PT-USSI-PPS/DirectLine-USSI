
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart } from "lucide-react";

export default function PerformanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <AreaChart className="h-7 w-7" />
            Dashboard Kinerja CS
          </h1>
          <p className="text-muted-foreground">
            Halaman ini akan menampilkan metrik kinerja dan rating kepuasan tim Customer Support.
          </p>
      </div>
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Fitur Dalam Pengembangan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Visualisasi data kinerja CS berdasarkan rating dari klien akan segera tersedia di sini.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
