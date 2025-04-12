"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentUploads = [
  {
    id: "1",
    source: "Epic",
    dataType: "Patient Records",
    records: 156,
    status: "Complete",
    date: "2023-04-12T09:45:00",
  },
  {
    id: "2",
    source: "Redox",
    dataType: "Lab Results",
    records: 89,
    status: "Complete",
    date: "2023-04-11T14:30:00",
  },
  {
    id: "3",
    source: "FHIR API",
    dataType: "Medications",
    records: 42,
    status: "Processing",
    date: "2023-04-11T11:15:00",
  },
  {
    id: "4",
    source: "Epic",
    dataType: "Imaging",
    records: 17,
    status: "Complete",
    date: "2023-04-10T16:20:00",
  },
  {
    id: "5",
    source: "Redox",
    dataType: "Clinical Notes",
    records: 64,
    status: "Failed",
    date: "2023-04-10T10:05:00",
  },
]

export function RecentUploads() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Data Type</TableHead>
          <TableHead className="text-right">Records</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentUploads.map((upload) => (
          <TableRow key={upload.id}>
            <TableCell className="font-medium">{upload.source}</TableCell>
            <TableCell>{upload.dataType}</TableCell>
            <TableCell className="text-right">{upload.records}</TableCell>
            <TableCell>
              <Badge
                variant={
                  upload.status === "Complete" ? "default" : upload.status === "Processing" ? "outline" : "destructive"
                }
              >
                {upload.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(upload.date).toLocaleDateString()}{" "}
              {new Date(upload.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
