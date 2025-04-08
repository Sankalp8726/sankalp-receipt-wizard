
import { useState } from "react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import Receipt from "./Receipt";

interface FormData {
  studentName: string;
  contactNo: string;
  seatNo: string;
  hoursOpted: string;
  feesPaid: string;
  remainingDues: string;
  month: string;
}

interface ReceiptFormProps {
  onBack: () => void;
}

const ReceiptForm = ({ onBack }: ReceiptFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    contactNo: "",
    seatNo: "",
    hoursOpted: "",
    feesPaid: "",
    remainingDues: "0",
    month: format(new Date(), "MMMM yyyy"),
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "studentName",
      "contactNo",
      "seatNo",
      "hoursOpted",
      "feesPaid",
      "month",
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in all required fields.`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const generateReceiptNo = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    // This would be replaced with a database sequence in a real application
    const sequence = Math.floor(1000 + Math.random() * 9000);
    
    return `${year}/${month}/${sequence}`;
  };

  return (
    <>
      {!showPreview ? (
        <Card className="max-w-2xl mx-auto p-8 shadow-lg">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-semibold text-gray-800">
              Generate Receipt
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number *</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seatNo">Seat Number *</Label>
                <Input
                  id="seatNo"
                  name="seatNo"
                  value={formData.seatNo}
                  onChange={handleChange}
                  placeholder="Enter seat number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hoursOpted">Hours Opted *</Label>
                <Input
                  id="hoursOpted"
                  name="hoursOpted"
                  value={formData.hoursOpted}
                  onChange={handleChange}
                  placeholder="Enter hours opted"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feesPaid">Fees Paid (₹) *</Label>
                <Input
                  id="feesPaid"
                  name="feesPaid"
                  value={formData.feesPaid}
                  onChange={handleChange}
                  placeholder="Enter fees paid"
                  type="number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remainingDues">Remaining Dues (₹)</Label>
                <Input
                  id="remainingDues"
                  name="remainingDues"
                  value={formData.remainingDues}
                  onChange={handleChange}
                  placeholder="Enter remaining dues"
                  type="number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="month">Month of Fees Paid *</Label>
                <Input
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  placeholder="e.g., April 2024"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-8"
              >
                Preview Receipt
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Receipt
          formData={formData}
          receiptNo={generateReceiptNo()}
          onBack={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default ReceiptForm;
