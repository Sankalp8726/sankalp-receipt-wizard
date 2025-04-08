
import { useState } from "react";
import ReceiptForm from "@/components/ReceiptForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <img 
            src="/lovable-uploads/10c66dd0-997e-49cc-b00d-7a550af97b47.png" 
            alt="Sankalp Library Logo" 
            className="mx-auto h-32 mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            SANKALP LIBRARY RECEIPT GENERATOR
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate professional receipts for students with all payment details and library information.
          </p>
        </div>
        
        {!showForm ? (
          <Card className="max-w-lg mx-auto p-8 shadow-lg">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome to Sankalp Library Receipt System
              </h2>
              <p className="text-gray-600">
                Create and download professional receipts for library members quickly and easily.
              </p>
              <Button 
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-6 text-lg"
                onClick={() => setShowForm(true)}
              >
                Generate New Receipt
              </Button>
            </div>
          </Card>
        ) : (
          <ReceiptForm onBack={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
};

export default Index;
