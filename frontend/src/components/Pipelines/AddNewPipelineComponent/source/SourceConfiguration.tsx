import { useState } from 'react';
import { testData } from '@/constants/test';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SourceConfiguration = () => {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({}); // State to store validation errors

    // Handle input changes
    const handleInputChange = (fieldKey: string, value: any) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [fieldKey]: value,
        }));
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [fieldKey]: '', // Clear the error when the user starts typing
        }));
    };

    // Validate input on blur
    const handleValidation = (fieldKey: string, value: any, type: string, isRequired: boolean) => {
        if (isRequired && !value) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [fieldKey]: 'This field is required.',
            }));
            return;
        }

        if (type === 'string' && typeof value !== 'string') {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [fieldKey]: 'This field must be a string.',
            }));
        } else if (type === 'integer' && (isNaN(value) || !Number.isInteger(Number(value)))) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [fieldKey]: 'This field must be an integer.',
            }));
        } else {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [fieldKey]: '', // Clear the error if validation passes
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all required fields before submission
        const newErrors: any = {};
        Object.keys(testData.properties).forEach((key) => {
            const field = (testData.properties as Record<string, any>)[key];
            if (field.required && !formData[key]) {
                newErrors[key] = 'This field is required.';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        console.log(formData);
    };

    // Recursive function to render fields dynamically
    const renderFields = (fields: any, parentKey = '') => {
        return Object.keys(fields).map((key) => {
            const field = fields[key];
            const fieldKey = parentKey ? `${parentKey}.${key}` : key;
            const isRequired = field.required === true;

            if (field.type === 'object' && field.properties) {
                // Render nested fields
                return (
                    <Card key={fieldKey} className=" my-4">
                        <CardHeader>
                            <CardTitle className='text-md'>{field.title || key}</CardTitle>
                        </CardHeader>
                        <CardContent>{renderFields(field.properties, fieldKey)}</CardContent>
                    </Card>
                );
            }

            // Render dropdown for fields with an enum
            if (field.enum) {
                return (
                    <div key={fieldKey} className="mb-4 my-2">
                        <label className="block text-sm font-medium py-2 capitalize text-gray-700" htmlFor={fieldKey}>
                            {field.title || key} {isRequired && <span className="text-red-500">*</span>}
                        </label>
                        <Select
                            onValueChange={(value) => handleInputChange(fieldKey, value)}
                            value={formData[fieldKey] || field.default || ''}

                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                                <SelectGroup>
                                    {field.enum.map((option: string) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors[fieldKey] && <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>}
                        {errors[fieldKey] && <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>}
                    </div>
                );
            }

            // Render individual fields
            if (field.type === 'string') {
                return (
                    <div key={fieldKey} className="mb-4 my-2">
                        <label className="block text-sm font-medium py-2 capitalize text-gray-700" htmlFor={fieldKey}>
                            {field.title || key} {isRequired && <span className="text-red-500">*</span>}
                        </label>
                        <Input
                            id={fieldKey}
                            name={fieldKey}
                            value={formData[fieldKey] || field.default || ''}
                            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                            onBlur={(e) => handleValidation(fieldKey, e.target.value, 'string', isRequired)}
                        />
                        {errors[fieldKey] && <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>}
                    </div>
                );
            }

            if (field.type === 'boolean') {
                return (
                    <div key={fieldKey} className="mb-4 my-2 flex py-2 items-center space-x-2">
                        <Checkbox
                            id={fieldKey}
                            name={fieldKey}
                            checked={formData[fieldKey] || field.default || false}
                            onCheckedChange={(checked) => handleInputChange(fieldKey, checked)}
                        />
                        <label htmlFor={fieldKey} className="text-sm capitalize font-medium text-gray-700">
                            {field.title || key} {isRequired && <span className="text-red-500">*</span>}
                        </label>
                    </div>
                );
            }

            if (field.type === 'integer') {
                return (
                    <div key={fieldKey} className="mb-4 my-2">
                        <label className="block text-sm font-medium py-2 capitalize text-gray-700" htmlFor={fieldKey}>
                            {field.title || key} {isRequired && <span className="text-red-500">*</span>}
                        </label>
                        <Input
                            type="number"
                            id={fieldKey}
                            name={fieldKey}
                            value={formData[fieldKey] || field.default || 0}
                            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                            onBlur={(e) => handleValidation(fieldKey, e.target.value, 'integer', isRequired)}
                        />
                        {errors[fieldKey] && <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>}
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <div className="overflow-y-auto h-[50rem]">
            <Card>
                <CardHeader>
                    <CardTitle>{testData.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {renderFields(testData.properties)}
                        <div className='flex justify-end'>
                            <Button type="submit" className="my-6 bg-blue-500">
                                Submit Configuration
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SourceConfiguration;