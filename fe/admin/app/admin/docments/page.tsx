// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { DocumentsTable } from "@/components/admin/documents-table"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, Filter } from "lucide-react"

// export default function DocumentsPage() {
//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold tracking-tight">Quản lý tài liệu</h1>
//       </div>
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input type="search" placeholder="Tìm kiếm tài liệu..." className="pl-8 w-full" />
//         </div>
//         <div className="flex gap-2">
//           <Select defaultValue="all">
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Trạng thái" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Tất cả</SelectItem>
//               <SelectItem value="pending">Chờ duyệt</SelectItem>
//               <SelectItem value="approved">Đã duyệt</SelectItem>
//               <SelectItem value="rejected">Từ chối</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button variant="outline" className="gap-1">
//             <Filter className="h-4 w-4" />
//             Lọc
//           </Button>
//         </div>
//       </div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Danh sách tài liệu</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <DocumentsTable />
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
