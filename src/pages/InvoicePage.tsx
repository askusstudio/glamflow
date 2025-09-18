import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Plus, Trash2, Calendar, User, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  freelancerName: string;
  freelancerTitle: string;
  freelancerEmail: string;
  freelancerPhone: string;
  freelancerAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  services: ServiceItem[];
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
}

export default function InvoicePage() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    freelancerName: '',
    freelancerTitle: '',
    freelancerEmail: '',
    freelancerPhone: '',
    freelancerAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    services: [
      {
        id: '1',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    notes: 'Thank you for your business!',
    subtotal: 0,
    tax: 0,
    total: 0
  });

  const updateField = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setInvoiceData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const updateService = (id: string, field: keyof ServiceItem, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      services: prev.services.map(service => {
        if (service.id === id) {
          const updated = { ...service, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return service;
      })
    }));
  };

  const removeService = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.services.reduce((sum, service) => sum + service.amount, 0);
    const tax = subtotal * 0.18; // 18% GST for India
    const total = subtotal + tax;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  };

  React.useEffect(() => {
    calculateTotals();
  }, [invoiceData.services]);

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    setIsGenerating(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
      toast.success('Invoice PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
          <Button onClick={generatePDF} disabled={isGenerating} className="bg-pink-500 hover:bg-pink-600">
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="freelancerName">Full Name</Label>
                  <Input
                    id="freelancerName"
                    value={invoiceData.freelancerName}
                    onChange={(e) => updateField('freelancerName', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="freelancerTitle">Professional Title</Label>
                  <Input
                    id="freelancerTitle"
                    value={invoiceData.freelancerTitle}
                    onChange={(e) => updateField('freelancerTitle', e.target.value)}
                    placeholder="e.g., Makeup Artist, Hair Stylist"
                  />
                </div>
                <div>
                  <Label htmlFor="freelancerEmail">Email</Label>
                  <Input
                    id="freelancerEmail"
                    type="email"
                    value={invoiceData.freelancerEmail}
                    onChange={(e) => updateField('freelancerEmail', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="freelancerPhone">Phone</Label>
                  <Input
                    id="freelancerPhone"
                    value={invoiceData.freelancerPhone}
                    onChange={(e) => updateField('freelancerPhone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="freelancerAddress">Address</Label>
                  <Textarea
                    id="freelancerAddress"
                    value={invoiceData.freelancerAddress}
                    onChange={(e) => updateField('freelancerAddress', e.target.value)}
                    placeholder="Your business address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={invoiceData.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
                    placeholder="Client's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => updateField('clientEmail', e.target.value)}
                    placeholder="client@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clientAddress">Client Address</Label>
                  <Textarea
                    id="clientAddress"
                    value={invoiceData.clientAddress}
                    onChange={(e) => updateField('clientAddress', e.target.value)}
                    placeholder="Client's address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Invoice Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => updateField('dueDate', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Services
                  <Button onClick={addService} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoiceData.services.map((service) => (
                  <div key={service.id} className="border p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Service Item</span>
                      {invoiceData.services.length > 1 && (
                        <Button
                          onClick={() => removeService(service.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      placeholder="Service description"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={service.quantity}
                          onChange={(e) => updateService(service.id, 'quantity', parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                      <div>
                        <Label>Rate (₹)</Label>
                        <Input
                          type="number"
                          value={service.rate}
                          onChange={(e) => updateService(service.id, 'rate', parseFloat(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="text-right font-medium">
                      Amount: ₹{service.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={invoiceData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Additional notes or payment terms"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Invoice Preview */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-0">
                <div ref={invoiceRef} className="p-8 bg-white">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-4xl font-bold text-pink-500 mb-2">INVOICE</h1>
                      <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Date: {new Date(invoiceData.date).toLocaleDateString()}</p>
                      <p className="text-gray-600">Due: {new Date(invoiceData.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* From/To Section */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">From:</h3>
                      <div className="text-gray-700">
                        <p className="font-medium text-lg">{invoiceData.freelancerName || 'Your Name'}</p>
                        <p className="text-pink-500 font-medium">{invoiceData.freelancerTitle || 'Professional Title'}</p>
                        <div className="mt-2 space-y-1">
                          {invoiceData.freelancerEmail && (
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {invoiceData.freelancerEmail}
                            </p>
                          )}
                          {invoiceData.freelancerPhone && (
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {invoiceData.freelancerPhone}
                            </p>
                          )}
                          {invoiceData.freelancerAddress && (
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5" />
                              <span>{invoiceData.freelancerAddress}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">To:</h3>
                      <div className="text-gray-700">
                        <p className="font-medium text-lg">{invoiceData.clientName || 'Client Name'}</p>
                        <div className="mt-2 space-y-1">
                          {invoiceData.clientEmail && (
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {invoiceData.clientEmail}
                            </p>
                          )}
                          {invoiceData.clientAddress && (
                            <p className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5" />
                              <span>{invoiceData.clientAddress}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Table */}
                  <div className="mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 font-semibold text-gray-900">Description</th>
                          <th className="text-center py-3 font-semibold text-gray-900">Qty</th>
                          <th className="text-right py-3 font-semibold text-gray-900">Rate</th>
                          <th className="text-right py-3 font-semibold text-gray-900">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.services.map((service) => (
                          <tr key={service.id} className="border-b border-gray-100">
                            <td className="py-3 text-gray-700">{service.description || 'Service description'}</td>
                            <td className="py-3 text-center text-gray-700">{service.quantity}</td>
                            <td className="py-3 text-right text-gray-700">₹{service.rate.toFixed(2)}</td>
                            <td className="py-3 text-right text-gray-700">₹{service.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-80">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">Subtotal:</span>
                        <span className="text-gray-900">₹{invoiceData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">GST (18%):</span>
                        <span className="text-gray-900">₹{invoiceData.tax.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between py-2">
                        <span className="text-xl font-bold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-pink-500">₹{invoiceData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {invoiceData.notes && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
                      <p className="text-gray-700">{invoiceData.notes}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t">
                    <p>Thank you for choosing our services!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}