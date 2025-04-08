
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
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      // Get the image data from the canvas
      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // A4 size dimensions in mm (210 × 297 mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF, adjusted to fit A4
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      
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
      
      <Card className="p-8 shadow-lg bg-white">
        <div
          ref={receiptRef}
          className="relative bg-white p-8 font-serif"
          style={{ 
            width: "210mm",
            minHeight: "297mm",
            margin: "0 auto",
            boxSizing: "border-box"
          }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
            <img
              src="/lovable-uploads/10c66dd0-997e-49cc-b00d-7a550af97b47.png"
              alt="Sankalp Library"
              className="w-2/3 max-w-md"
            />
          </div>
          
          <div className="relative z-10">
            {/* Header Section */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-blue-800">SANKALP LIBRARY DOMCHANCH</h1>
              <p className="text-gray-700">City complex, Near SBI Domchanch</p>
              <p className="text-gray-700">Giridih Road Domchanch 825418</p>
              <p className="text-gray-700">7544032365, 9572939681</p>
            </div>
            
            {/* Receipt Title */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold border-2 border-gray-800 inline-block px-4 py-1">RECEIPT</h2>
            </div>
            
            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div>
                <p><strong>Date:</strong> {format(new Date(), "dd/MM/yyyy")}</p>
              </div>
              <div className="text-right">
                <p><strong>Receipt No:</strong> {receiptNo}</p>
              </div>
            </div>
            
            {/* Student Details */}
            <div className="space-y-4 mb-12">
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Student Name:</strong> {formData.studentName}</p>
                <p><strong>Contact No:</strong> {formData.contactNo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Seat No:</strong> {formData.seatNo}</p>
                <p><strong>Hours Opted:</strong> {formData.hoursOpted}</p>
              </div>
            </div>
            
            {/* Payment Info - Styled as a box */}
            <div className="border-2 border-gray-300 p-4 mb-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Fees Paid for {formData.month}</td>
                    <td className="text-right py-2">₹ {formData.feesPaid}</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-2"><strong>Remaining Dues</strong></td>
                    <td className="text-right py-2">₹ {formData.remainingDues}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Signature */}
            <div className="flex justify-end mb-8">
              <div className="text-center">
                <img
                  src="/lovable-uploads/1f9caec6-7b30-47a2-bf30-1b00c63d55cd.png"
                  alt="Signature"
                  className="h-16 mb-2 mx-auto"
                />
                <p className="font-bold">SANKALP LIBRARY</p>
              </div>
            </div>
            
            {/* Notes */}
            <div className="border-t border-gray-300 pt-4 mb-8">
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>Keep the Receipt for future references</li>
                <li>Fees once paid are non refundable</li>
                <li>In case of any error contact Library desk</li>
              </ul>
            </div>
            
            {/* Footer */}
            <div className="text-right">
              <p className="font-bold">SANKALP LIBRARY</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;
