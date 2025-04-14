export default function TreatmentEnginePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Treatment Recommendation Engine</h1>

      <div className="border rounded p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Patient: John Doe</h2>
        <p className="text-gray-600 mb-4">ID: patient-1</p>

        <h3 className="text-lg font-medium mb-2">Recommended Treatments:</h3>
        <ul className="space-y-2">
          <li className="border p-3 rounded">
            <div className="font-medium">Osimertinib</div>
            <div className="text-sm">EGFR Tyrosine Kinase Inhibitor</div>
            <div className="text-sm text-blue-600">FDA Approved</div>
          </li>
          <li className="border p-3 rounded">
            <div className="font-medium">Pembrolizumab</div>
            <div className="text-sm">PD-1 Inhibitor</div>
            <div className="text-sm text-blue-600">FDA Approved</div>
          </li>
        </ul>
      </div>

      <div className="text-sm text-gray-500">
        This is an AI-generated treatment recommendation and should be reviewed by a qualified healthcare professional.
      </div>
    </div>
  )
}
