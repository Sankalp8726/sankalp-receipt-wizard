
import { useRef } from "react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReceiptProps {
  formData: {
    studentName: string;
    contactNo: string;
    seatNo: string;
    hoursOpted: string;
    feesPaid: string;
    remainingDues: string;
    month: string;
  };
  receiptNo: string;
  onBack: () => void;
}

const Receipt = ({ formData, receiptNo, onBack }: ReceiptProps) => {
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your receipt...",
    });

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 4,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      
      // Calculate proportions to ensure content isn't shrunk
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      
      const fileName = `${formData.studentName.replace(/\s+/g, "_")}_${formData.seatNo}_${formData.month.replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Success!",
        description: "Receipt downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "There was an error generating the receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Form
        </Button>
        
        <Button
          onClick={downloadReceipt}
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          <Download className="h-4 w-4 mr-2" /> Download Receipt
        </Button>
      </div>
      
      <Card className="p-4 shadow-lg bg-white">
        <div
          ref={receiptRef}
          className="relative bg-white"
          style={{ 
            width: "210mm", // A4 width
            minHeight: "297mm", // A4 height
            margin: "0 auto",
            boxSizing: "border-box",
            backgroundImage: "linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "6mm", // Increased padding by approximately 5%
            position: "relative"
          }}
        >
          <div className="relative" style={{ 
            backgroundColor: "#ffffff", 
            padding: "12px", // Increased padding
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            height: "100%",
            display: "flex",
            flexDirection: "column" 
          }}>
            <div className="flex items-center pb-5 mb-5" style={{ 
              background: "linear-gradient(to right, #e6f2ff, #ffffff)",
              borderBottom: "2px solid #1a55a3",
              padding: "12px", // Increased padding
              borderRadius: "8px 8px 0 0"
            }}>
              <div className="flex-shrink-0 mr-5" style={{ width: "120px" }}>
                <img
                  src="/lovable-uploads/a8403452-0245-4847-a0f4-02e0be47efdc.png"
                  alt="Sankalp Library"
                  className="w-full object-contain"
                />
              </div>
              <div className="text-center flex-grow">
                <h1 className="text-3xl font-bold text-blue-800">SANKALP LIBRARY DOMCHANCH</h1>
                <p className="text-gray-700 text-sm mt-1">City complex, Near SBI Domchanch</p>
                <p className="text-gray-700 text-sm">Giridih Road Domchanch 825418</p>
                <p className="text-gray-700 text-sm">7544032365, 9572939681</p>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold px-5 py-1.5" style={{
                background: "linear-gradient(to right, #0EA5E9, #2563EB)",
                display: "inline-block",
                borderRadius: "6px",
                color: "white"
              }}>RECEIPT</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 rounded-md" style={{
              background: "linear-gradient(to right, #e6f2ff, #f0f8ff)",
              border: "1px solid #e1e7f0",
              borderRadius: "6px"
            }}>
              <div>
                <p className="text-sm"><strong className="text-blue-700">Date:</strong> {format(new Date(), "dd/MM/yyyy")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm"><strong className="text-blue-700">Receipt No:</strong> {receiptNo}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-4 p-4 rounded-lg" style={{
              background: "linear-gradient(90deg, hsla(221, 45%, 93%, 1) 0%, hsla(220, 78%, 95%, 1) 100%)",
              border: "1px solid #e1e7f0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}>
              <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-3">Student Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-sm"><strong className="text-blue-700">Student Name:</strong> <span className="text-gray-800">{formData.studentName}</span></p>
                <p className="text-sm"><strong className="text-blue-700">Contact No:</strong> <span className="text-gray-800">{formData.contactNo}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-sm"><strong className="text-blue-700">Seat No:</strong> <span className="text-gray-800">{formData.seatNo}</span></p>
                <p className="text-sm"><strong className="text-blue-700">Hours Opted:</strong> <span className="text-gray-800">{formData.hoursOpted}</span></p>
              </div>
            </div>
            
            <div className="p-4 mb-4 rounded-lg shadow-sm" style={{
              background: "linear-gradient(90deg, hsla(221, 45%, 93%, 1) 0%, hsla(220, 78%, 95%, 1) 100%)",
              border: "1px solid #d0def0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
              <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-3">Payment Details</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-2 text-sm text-blue-700">Description</th>
                    <th className="text-right py-2 text-sm text-blue-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 text-sm" style={{ color: "#333333" }}>
                      <span className="font-medium">Fees Paid for {formData.month}</span>
                    </td>
                    <td className="text-right py-3 text-sm font-medium" style={{ color: "#1a55a3" }}>₹ {formData.feesPaid}</td>
                  </tr>
                  <tr className="border-t border-blue-100">
                    <td className="py-3 text-sm font-semibold text-blue-800">Remaining Dues</td>
                    <td className="text-right py-3 text-sm font-semibold" style={{ color: formData.remainingDues === "0" ? "#10b981" : "#ef4444" }}>
                      ₹ {formData.remainingDues}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mb-4 mt-2">
              <div className="text-center">
                <img
                  src="/lovable-uploads/07d267e5-cf72-4e86-a3e4-fc6dceda8603.png"
                  alt="Signature"
                  className="h-16 mb-2 mx-auto" // Increased size slightly
                />
                <p className="font-bold text-blue-800 text-sm">SANKALP LIBRARY</p>
              </div>
            </div>
            
            <div className="mt-auto pt-2 mb-3 rounded-lg p-4" style={{
              background: "#f9fbff",
              borderTop: "1px solid #d0def0",
              borderRadius: "0 0 8px 8px"
            }}>
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Important Notes:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li className="text-xs text-gray-700">Keep the Receipt for future references</li>
                <li className="text-xs text-gray-700">Fees once paid are non refundable</li>
                <li className="text-xs text-gray-700">In case of any error contact Library desk</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;
