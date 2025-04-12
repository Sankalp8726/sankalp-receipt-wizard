
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
      // Higher quality settings for better image resolution
      const canvas = await html2canvas(receiptRef.current, {
        scale: 4, // Increased scale for higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      // Higher quality image data
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // 100% quality JPEG
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: false, // Disable compression for better quality
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Position the image at top of the page (0mm from top)
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
      <div className="flex justify-between items-center mb-4">
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
            width: "210mm",
            height: "297mm", // Full A4 size
            margin: "0 auto",
            boxSizing: "border-box",
            backgroundImage: "linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "5mm",
            position: "relative"
          }}
        >
          <div className="relative" style={{ 
            backgroundColor: "#ffffff", 
            padding: "15px", 
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            height: "100%"
          }}>
            {/* Header Section with logo on left side - Logo is now bigger */}
            <div className="flex items-center pb-3 mb-5" style={{ 
              background: "linear-gradient(to right, #e6f2ff, #ffffff)",
              borderBottom: "2px solid #1a55a3",
              padding: "10px",
              borderRadius: "8px 8px 0 0"
            }}>
              <div className="flex-shrink-0 mr-5" style={{ width: "150px" }}> {/* Increased width for bigger logo */}
                <img
                  src="/lovable-uploads/1f9caec6-7b30-47a2-bf30-1b00c63d55cd.png"
                  alt="Sankalp Library"
                  className="w-full object-contain"
                />
              </div>
              <div className="text-center flex-grow">
                <h1 className="text-2xl font-bold text-blue-800">SANKALP LIBRARY DOMCHANCH</h1>
                <p className="text-gray-700 text-sm">City complex, Near SBI Domchanch</p>
                <p className="text-gray-700 text-sm">Giridih Road Domchanch 825418</p>
                <p className="text-gray-700 text-sm">7544032365, 9572939681</p>
              </div>
            </div>
            
            {/* Receipt Title with consistent blue gradient */}
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold px-6 py-2" style={{
                background: "linear-gradient(to right, #0EA5E9, #2563EB)",
                display: "inline-block",
                borderRadius: "8px",
                color: "white"
              }}>RECEIPT</h2>
            </div>
            
            {/* Receipt Details with consistent gradient */}
            <div className="grid grid-cols-2 gap-5 mb-6 p-4 rounded-md" style={{
              background: "linear-gradient(to right, #e6f2ff, #f0f8ff)",
              border: "1px solid #e1e7f0",
              borderRadius: "6px"
            }}>
              <div>
                <p className="text-md"><strong className="text-blue-700">Date:</strong> {format(new Date(), "dd/MM/yyyy")}</p>
              </div>
              <div className="text-right">
                <p className="text-md"><strong className="text-blue-700">Receipt No:</strong> {receiptNo}</p>
              </div>
            </div>
            
            {/* Student Details with consistent blue gradient styling and increased spacing */}
            <div className="space-y-3 mb-6 p-5 rounded-lg" style={{
              background: "linear-gradient(to right, #e6f2ff, #f0f8ff)",
              border: "1px solid #e1e7f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">Student Information</h3>
              <div className="grid grid-cols-2 gap-5">
                <p className="text-md"><strong className="text-blue-700">Student Name:</strong> <span className="text-gray-800">{formData.studentName}</span></p>
                <p className="text-md"><strong className="text-blue-700">Contact No:</strong> <span className="text-gray-800">{formData.contactNo}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-5 mt-4"> {/* Added spacing between rows */}
                <p className="text-md"><strong className="text-blue-700">Seat No:</strong> <span className="text-gray-800">{formData.seatNo}</span></p>
                <p className="text-md"><strong className="text-blue-700">Hours Opted:</strong> <span className="text-gray-800">{formData.hoursOpted}</span></p>
              </div>
            </div>
            
            {/* Payment Info with consistent blue gradient styling and increased spacing */}
            <div className="p-5 mb-8 rounded-lg shadow-sm" style={{
              background: "linear-gradient(to right, #e6f2ff, #f0f8ff)",
              border: "1px solid #d0def0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">Payment Details</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-left py-2 text-md text-blue-700">Description</th>
                    <th className="text-right py-2 text-md text-blue-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 text-md" style={{ color: "#333333" }}>
                      <span className="font-medium">Fees Paid for {formData.month}</span>
                    </td>
                    <td className="text-right py-4 text-md font-medium" style={{ color: "#1a55a3" }}>₹ {formData.feesPaid}</td>
                  </tr>
                  <tr className="border-t border-blue-100">
                    <td className="py-4 text-md font-semibold text-blue-800">Remaining Dues</td>
                    <td className="text-right py-4 text-md font-semibold" style={{ color: formData.remainingDues === "0" ? "#10b981" : "#ef4444" }}>
                      ₹ {formData.remainingDues}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Signature with more spacing */}
            <div className="flex justify-end mb-8"> {/* Increased bottom margin */}
              <div className="text-center">
                <img
                  src="/lovable-uploads/07d267e5-cf72-4e86-a3e4-fc6dceda8603.png"
                  alt="Signature"
                  className="h-16 mb-2 mx-auto" /* Increased margin below signature */
                />
                <p className="font-bold text-blue-800">SANKALP LIBRARY</p>
              </div>
            </div>
            
            {/* Notes - With consistent blue gradient styling */}
            <div className="pt-4 mb-4 rounded-lg p-4" style={{
              background: "linear-gradient(to right, #e6f2ff, #f0f8ff)",
              borderTop: "1px solid #d0def0",
              borderRadius: "0 0 8px 8px"
            }}>
              <h4 className="font-semibold text-blue-800 mb-3">Important Notes:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-sm text-gray-700">Keep the Receipt for future references</li>
                <li className="text-sm text-gray-700">Fees once paid are non refundable</li>
                <li className="text-sm text-gray-700">In case of any error contact Library desk</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;
