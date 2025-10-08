import React, { useState } from 'react';
import { CreditCard, Building2, User, FileText, AlertCircle } from 'lucide-react';

export default function BankAccountForm() {
    const [formData, setFormData] = useState({
        accountHolderName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        accountType: 'savings',
        panNumber: '',
        gstNumber: '',
        upiId: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.accountHolderName.trim()) {
            newErrors.accountHolderName = 'Account holder name is required';
        }

        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = 'Account number is required';
        } else if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
            newErrors.accountNumber = 'Account number must be between 9 and 18 digits';
        }

        if (formData.accountNumber !== formData.confirmAccountNumber) {
            newErrors.confirmAccountNumber = 'Account numbers do not match';
        }

        if (!formData.ifscCode.trim()) {
            newErrors.ifscCode = 'IFSC code is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
            newErrors.ifscCode = 'Invalid IFSC code format (e.g., SBIN0001234)';
        }

        if (!formData.bankName.trim()) {
            newErrors.bankName = 'Bank name is required';
        }

        if (!formData.panNumber.trim()) {
            newErrors.panNumber = 'PAN number is required';
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
            newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
        }

        if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
            newErrors.gstNumber = 'Invalid GST number format';
        }

        if (formData.upiId && !/@/.test(formData.upiId)) {
            newErrors.upiId = 'Invalid UPI ID format (e.g., username@bank)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            alert('Bank account details saved successfully!');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bank Account Details</h2>
                <p className="text-gray-600">Add your bank account information to receive payments for your freelance services</p>
            </div>

            <div className="space-y-6">
                <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Important Information</p>
                        <p>Please ensure all details match your official bank records. Incorrect information may delay your payments.</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Holder Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                placeholder="As per bank records"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.accountHolderName && (
                                <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="Enter account number"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.accountNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Account Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="confirmAccountNumber"
                                value={formData.confirmAccountNumber}
                                onChange={handleChange}
                                placeholder="Re-enter account number"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmAccountNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.confirmAccountNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmAccountNumber}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IFSC Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                placeholder="e.g., SBIN0001234"
                                maxLength="11"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.ifscCode && (
                                <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="savings">Savings Account</option>
                                <option value="current">Current Account</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                placeholder="e.g., State Bank of India"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.bankName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.bankName && (
                                <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Name
                            </label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleChange}
                                placeholder="e.g., Connaught Place"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">Tax & Payment Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                PAN Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleChange}
                                placeholder="e.g., ABCDE1234F"
                                maxLength="10"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${errors.panNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.panNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Required for TDS compliance</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                GST Number (Optional)
                            </label>
                            <input
                                type="text"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                placeholder="e.g., 22AAAAA0000A1Z5"
                                maxLength="15"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.gstNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">If registered for GST</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                UPI ID (Optional)
                            </label>
                            <input
                                type="text"
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleChange}
                                placeholder="e.g., yourname@paytm"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.upiId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.upiId && (
                                <p className="text-red-500 text-xs mt-1">{errors.upiId}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">For instant payment transfers</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-700">
                            I confirm that the information provided is accurate and belongs to me. I understand that providing false information may result in account suspension and legal action.
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Save Bank Details
                        </button>
                        <button
                            onClick={() => console.log('Cancel clicked')}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

