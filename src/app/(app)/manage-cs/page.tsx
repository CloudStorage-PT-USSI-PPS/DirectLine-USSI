
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ManageCsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7" />
            Manajemen Akun CS
          </h1>
          <p className="text-muted-foreground">
           Halaman ini akan berisi fitur untuk mengelola akun tim Customer Support (CRUD).
          </p>
      </div>
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Fitur Dalam Pengembangan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fungsionalitas untuk menambah, mengubah, dan menghapus akun CS akan segera tersedia di sini.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
