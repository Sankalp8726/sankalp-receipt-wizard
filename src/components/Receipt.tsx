
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
      // Higher quality settings for better image
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      
      // Higher quality image data
      const imgData = canvas.toDataURL("image/jpeg", 0.95); // 95% quality JPEG
      
      // Create PDF with better quality settings
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image on the page
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      
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
            backgroundImage: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "5mm",
            position: "relative"
          }}
        >
          <div className="relative" style={{ 
            backgroundColor: "#ffffff", 
            padding: "10px", 
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            height: "100%"
          }}>
            {/* Header Section with logo on left side */}
            <div className="flex items-center pb-3 mb-4" style={{ 
              background: "linear-gradient(to right, #e6f2ff, #ffffff)",
              borderBottom: "2px solid #1a55a3",
              padding: "8px",
              borderRadius: "8px 8px 0 0"
            }}>
              <div className="flex-shrink-0 mr-4" style={{ width: "70px" }}>
                <img
                  src="/lovable-uploads/10c66dd0-997e-49cc-b00d-7a550af97b47.png"
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
            
            {/* Receipt Title with better styling */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold px-5 py-1" style={{
                background: "linear-gradient(to right, #f0f8ff, #e6f2ff)",
                border: "2px solid #1a55a3",
                display: "inline-block",
                borderRadius: "8px",
                color: "#1a55a3"
              }}>RECEIPT</h2>
            </div>
            
            {/* Receipt Details with light background */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-2 rounded-md" style={{
              background: "linear-gradient(to right, #f8fbff, #ffffff)",
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
            
            {/* Student Details with enhanced styling */}
            <div className="space-y-2 mb-4 p-3 rounded-lg" style={{
              background: "linear-gradient(90deg, hsla(216, 41%, 79%, 0.3) 0%, hsla(186, 33%, 94%, 0.3) 100%)",
              border: "1px solid #e1e7f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}>
              <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-1 mb-2">Student Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <p className="text-md"><strong className="text-blue-700">Student Name:</strong> <span className="text-gray-800">{formData.studentName}</span></p>
                <p className="text-md"><strong className="text-blue-700">Contact No:</strong> <span className="text-gray-800">{formData.contactNo}</span></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <p className="text-md"><strong className="text-blue-700">Seat No:</strong> <span className="text-gray-800">{formData.seatNo}</span></p>
                <p className="text-md"><strong className="text-blue-700">Hours Opted:</strong> <span className="text-gray-800">{formData.hoursOpted}</span></p>
              </div>
            </div>
            
            {/* Payment Info with enhanced styling */}
            <div className="p-3 mb-6 rounded-lg shadow-sm" style={{
              background: "linear-gradient(90deg, hsla(139, 70%, 75%, 0.2) 0%, hsla(63, 90%, 76%, 0.2) 100%)",
              border: "1px solid #d0def0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-1 mb-3">Payment Details</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-left py-2 text-md text-blue-700">Description</th>
                    <th className="text-right py-2 text-md text-blue-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 text-md" style={{ color: "#333333" }}>
                      <span className="font-medium">Fees Paid for {formData.month}</span>
                    </td>
                    <td className="text-right py-3 text-md font-medium" style={{ color: "#1a55a3" }}>₹ {formData.feesPaid}</td>
                  </tr>
                  <tr className="border-t border-blue-100">
                    <td className="py-3 text-md font-semibold text-blue-800">Remaining Dues</td>
                    <td className="text-right py-3 text-md font-semibold" style={{ color: formData.remainingDues === "0" ? "#10b981" : "#ef4444" }}>
                      ₹ {formData.remainingDues}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Signature - No background coloring */}
            <div className="flex justify-end mb-4">
              <div className="text-center">
                <img
                  src="/lovable-uploads/07d267e5-cf72-4e86-a3e4-fc6dceda8603.png"
                  alt="Signature"
                  className="h-16 mb-1 mx-auto"
                />
                <p className="font-bold text-blue-800">SANKALP LIBRARY</p>
              </div>
            </div>
            
            {/* Notes - With enhanced styling */}
            <div className="pt-2 mb-4 rounded-lg p-3" style={{
              background: "linear-gradient(to right, #f0f8ff, #ffffff)",
              borderTop: "1px solid #d0def0",
              borderRadius: "0 0 8px 8px"
            }}>
              <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li className="text-sm text-gray-700">Keep the Receipt for future references</li>
                <li className="text-sm text-gray-700">Fees once paid are non refundable</li>
                <li className="text-sm text-gray-700">In case of any error contact Library desk</li>
              </ul>
            </div>
            
            {/* Paper texture overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10" 
              style={{ 
                backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAMa0lEQVR4nO1dbVczNw69JCEvBJInEEIgEIb//6+6t3QKCYTgJCRkE0jw0g/SarU6luTx7M7QmfPh7M5Y1rEsWZZlTf/617++dV1X4f9HOGqaJvzcNE3N7+wU59fi7xXyav+n6fttntc0XDdw3XEzNmDc8ryu3/FznDc commentRedacted",
                mixBlendMode: "multiply",
                zIndex: 5
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;
