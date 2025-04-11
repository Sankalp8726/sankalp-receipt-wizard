
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
      // Optimized settings for smaller file size
      const canvas = await html2canvas(receiptRef.current, {
        scale: 1.5, // Reduced scale for smaller file size while maintaining quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      // Get the image data with reduced quality for smaller file size
      const imgData = canvas.toDataURL("image/jpeg", 0.6); // Using JPEG with 60% quality
      
      // Create PDF with compression
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true, // Enable compression
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF, scaled properly to fit A4
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      
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
      
      <Card className="p-6 shadow-lg bg-white">
        <div
          ref={receiptRef}
          className="relative bg-white p-6"
          style={{ 
            width: "210mm",
            height: "297mm", // Fixed height to exactly match A4
            margin: "0 auto",
            boxSizing: "border-box",
            overflow: "hidden" // Prevent content overflow
          }}
        >
          {/* Watermark - Moved forward with reduced opacity and z-index control */}
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"
            style={{ zIndex: 5 }} // Higher z-index to ensure visibility
          >
            <img
              src="/lovable-uploads/10c66dd0-997e-49cc-b00d-7a550af97b47.png"
              alt="Sankalp Library"
              className="w-3/4 max-w-md"
            />
          </div>
          
          <div className="relative" style={{ zIndex: 10 }}>
            {/* Header Section with gradient background */}
            <div className="text-center pb-4 mb-6 rounded-lg" style={{ 
              background: "linear-gradient(to right, #e6f2ff, #ffffff)",
              borderBottom: "2px solid #1a55a3",
              padding: "10px"
            }}>
              <h1 className="text-3xl font-bold text-blue-800">SANKALP LIBRARY DOMCHANCH</h1>
              <p className="text-gray-700 mt-1">City complex, Near SBI Domchanch</p>
              <p className="text-gray-700">Giridih Road Domchanch 825418</p>
              <p className="text-gray-700">7544032365, 9572939681</p>
            </div>
            
            {/* Receipt Title with better styling */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold px-6 py-2" style={{
                background: "linear-gradient(to right, #f0f8ff, #e6f2ff)",
                border: "2px solid #1a55a3",
                display: "inline-block",
                borderRadius: "8px",
                color: "#1a55a3"
              }}>RECEIPT</h2>
            </div>
            
            {/* Receipt Details with light background */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-3 rounded-md" style={{
              background: "linear-gradient(to right, #f8fbff, #ffffff)"
            }}>
              <div>
                <p className="text-lg"><strong className="text-blue-700">Date:</strong> {format(new Date(), "dd/MM/yyyy")}</p>
              </div>
              <div className="text-right">
                <p className="text-lg"><strong className="text-blue-700">Receipt No:</strong> {receiptNo}</p>
              </div>
            </div>
            
            {/* Student Details with enhanced styling */}
            <div className="space-y-4 mb-8 p-4 rounded-lg" style={{
              background: "linear-gradient(to right, #f0f4fa, #ffffff)",
              border: "1px solid #e1e7f0"
            }}>
              <h3 className="text-xl font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-3">Student Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-lg"><strong className="text-blue-700">Student Name:</strong> <span className="text-gray-800">{formData.studentName}</span></p>
                <p className="text-lg"><strong className="text-blue-700">Contact No:</strong> <span className="text-gray-800">{formData.contactNo}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-lg"><strong className="text-blue-700">Seat No:</strong> <span className="text-gray-800">{formData.seatNo}</span></p>
                <p className="text-lg"><strong className="text-blue-700">Hours Opted:</strong> <span className="text-gray-800">{formData.hoursOpted}</span></p>
              </div>
            </div>
            
            {/* Payment Info with enhanced styling - Removed extra text */}
            <div className="p-5 mb-10 rounded-lg shadow-sm" style={{
              background: "linear-gradient(to bottom, #f7faff, #ffffff)",
              border: "2px solid #d0def0"
            }}>
              <h3 className="text-xl font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">Payment Details</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-left py-3 text-lg text-blue-700">Description</th>
                    <th className="text-right py-3 text-lg text-blue-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 text-lg" style={{ color: "#333333" }}>
                      <span className="font-medium">Fees Paid for {formData.month}</span>
                    </td>
                    <td className="text-right py-4 text-lg font-medium" style={{ color: "#1a55a3" }}>₹ {formData.feesPaid}</td>
                  </tr>
                  <tr className="border-t border-blue-100">
                    <td className="py-4 text-lg font-semibold text-blue-800">Remaining Dues</td>
                    <td className="text-right py-4 text-lg font-semibold" style={{ color: formData.remainingDues === "0" ? "#10b981" : "#ef4444" }}>
                      ₹ {formData.remainingDues}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Signature - No background coloring */}
            <div className="flex justify-end mb-10">
              <div className="text-center p-2">
                <img
                  src="/lovable-uploads/07d267e5-cf72-4e86-a3e4-fc6dceda8603.png"
                  alt="Signature"
                  className="h-20 mb-2 mx-auto"
                />
                <p className="font-bold text-blue-800">SANKALP LIBRARY</p>
              </div>
            </div>
            
            {/* Notes - With enhanced styling */}
            <div className="pt-4 mb-6 rounded-lg p-4" style={{
              background: "linear-gradient(to right, #f0f8ff, #ffffff)",
              borderTop: "1px solid #d0def0"
            }}>
              <h4 className="font-semibold text-blue-800 mb-3">Important Notes:</h4>
              <ul className="list-disc pl-8 space-y-2">
                <li className="text-md text-gray-700">Keep the Receipt for future references</li>
                <li className="text-md text-gray-700">Fees once paid are non refundable</li>
                <li className="text-md text-gray-700">In case of any error contact Library desk</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;
