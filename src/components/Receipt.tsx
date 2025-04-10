
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
        scale: 4, // Higher scale for better quality
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
          {/* Watermark - Reduced opacity back to 15% for faded effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 z-0">
            <img
              src="/lovable-uploads/10c66dd0-997e-49cc-b00d-7a550af97b47.png"
              alt="Sankalp Library"
              className="w-3/4 max-w-md"
            />
          </div>
          
          <div className="relative z-10">
            {/* Header Section - Made more prominent */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-8">
              <h1 className="text-3xl font-bold text-blue-800">SANKALP LIBRARY DOMCHANCH</h1>
              <p className="text-gray-700 mt-2">City complex, Near SBI Domchanch</p>
              <p className="text-gray-700">Giridih Road Domchanch 825418</p>
              <p className="text-gray-700">7544032365, 9572939681</p>
            </div>
            
            {/* Receipt Title - More prominent */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold border-2 border-gray-800 inline-block px-6 py-2">RECEIPT</h2>
            </div>
            
            {/* Receipt Details - Better spacing */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div>
                <p className="text-lg"><strong>Date:</strong> {format(new Date(), "dd/MM/yyyy")}</p>
              </div>
              <div className="text-right">
                <p className="text-lg"><strong>Receipt No:</strong> {receiptNo}</p>
              </div>
            </div>
            
            {/* Student Details - Better spacing and larger text */}
            <div className="space-y-6 mb-12">
              <div className="grid grid-cols-2 gap-6">
                <p className="text-lg"><strong>Student Name:</strong> {formData.studentName}</p>
                <p className="text-lg"><strong>Contact No:</strong> {formData.contactNo}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <p className="text-lg"><strong>Seat No:</strong> {formData.seatNo}</p>
                <p className="text-lg"><strong>Hours Opted:</strong> {formData.hoursOpted}</p>
              </div>
            </div>
            
            {/* Payment Info - More prominent and better styled box */}
            <div className="border-2 border-gray-300 p-6 mb-16 rounded-md shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-400">
                    <th className="text-left py-3 text-lg">Description</th>
                    <th className="text-right py-3 text-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 text-lg">Fees Paid for {formData.month}</td>
                    <td className="text-right py-4 text-lg">₹ {formData.feesPaid}</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-4 text-lg"><strong>Remaining Dues</strong></td>
                    <td className="text-right py-4 text-lg">₹ {formData.remainingDues}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Signature - Using previously added signature image */}
            <div className="flex justify-end mb-12">
              <div className="text-center">
                <img
                  src="/lovable-uploads/07d267e5-cf72-4e86-a3e4-fc6dceda8603.png"
                  alt="Signature"
                  className="h-20 mb-2 mx-auto"
                />
                <p className="font-bold">SANKALP LIBRARY</p>
              </div>
            </div>
            
            {/* Notes - Styled better */}
            <div className="border-t border-gray-300 pt-6 mb-8">
              <ul className="list-disc pl-8 text-md text-gray-700 space-y-2">
                <li>Keep the Receipt for future references</li>
                <li>Fees once paid are non refundable</li>
                <li>In case of any error contact Library desk</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;
