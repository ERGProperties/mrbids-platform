import { AdminGuard } from "@/components/admin/AdminGuard"
import AdminAuctionsClient from "./AdminAuctionsClient"

export default function AdminAuctionsPage() {
  return (
    <AdminGuard>
      <AdminAuctionsClient />
    </AdminGuard>
  )
}
