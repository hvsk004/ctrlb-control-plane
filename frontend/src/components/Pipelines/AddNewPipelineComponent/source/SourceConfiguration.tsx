import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const testData = {
    "title": "Azure Monitor Receiver Configuration",
    "type": "object",
    "properties": {
        "tenant_id": {
            "type": "string",
            "title": "Tenant ID"
        },
        "client_id": {
            "type": "string",
            "title": "Client ID"
        },
        "client_secret": {
            "type": "string",
            "title": "Client Secret"
        },
        "subscription_id": {
            "type": "string",
            "title": "Subscription ID"
        },
        "resource_groups": {
            "type": "array",
            "title": "Resource Groups",
            "items": {
                "type": "string"
            }
        },
        "collection_interval": {
            "type": "string",
            "title": "Collection Interval",
            "default": "300s"
        },
        "metrics": {
            "type": "array",
            "title": "Metric Declarations",
            "items": {
                "type": "object",
                "properties": {
                    "resource_type": {
                        "type": "string",
                        "title": "Azure Resource Type",
                        "default": "Microsoft.Compute/virtualMachines"
                    },
                    "namespace": {
                        "type": "string",
                        "title": "Metric Namespace"
                    },
                    "metric_names": {
                        "type": "array",
                        "title": "Metric Names",
                        "items": {
                            "type": "string"
                        }
                    },
                    "aggregation": {
                        "type": "string",
                        "title": "Aggregation Type",
                        "default": "Average",
                        "enum": ["Average", "Total", "Minimum", "Maximum", "Count"]
                    }
                },
                "required": ["resource_type", "metric_names"]
            }
        }
    },
    "required": ["tenant_id", "client_id", "client_secret", "subscription_id", "metrics"]
}

const SourceConfiguration = () => {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});

    // Handle input changes
    const handleInputChange = (fieldKey: string, value: any) => {
        console.log(`Updating ${fieldKey} with value:`, value);
        setFormData((prevData: any) => ({
            ...prevData,
            [fieldKey]: value,
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
                // Render nested fields for object type
                return (
                    <Card key={fieldKey} className="my-4">
                        <CardHeader>
                            <CardTitle className="text-md">{field.title || key}</CardTitle>
                        </CardHeader>
                        <CardContent>{renderFields(field.properties, fieldKey)}</CardContent>
                    </Card>
                );
            }

            if (field.type === 'array') {
                // Render fields for array type
                const itemType = field.items?.type;

                if (itemType === 'string') {
                    // Allow multiple string values
                    return (
                        <div key={fieldKey} className="mb-4 my-2">
                            <label className="block text-sm font-medium py-2 capitalize text-gray-700" htmlFor={fieldKey}>
                                {field.title || key} {isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <Input
                                id={fieldKey}
                                name={fieldKey}
                                placeholder="Enter comma-separated values"
                                value={(formData[fieldKey] || []).join(', ')}
                                onChange={(e) =>
                                    handleInputChange(
                                        fieldKey,
                                        e.target.value.split(',').map((item) => item.trim())
                                    )
                                }
                            />
                            {errors[fieldKey] && <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>}
                        </div>
                    );
                }

                if (itemType === 'enum') {
                    // Render multi-select dropdown for array of enums
                    return (
                        <div key={fieldKey} className="mb-4 my-2">
                            <label className="block text-sm font-medium py-2 capitalize text-gray-700" htmlFor={fieldKey}>
                                {field.title || key} {isRequired && <span className="text-red-500">*</span>}
                            </label>
                            <Select
                                onValueChange={(value) => {
                                    const currentValues = formData[fieldKey] || [];
                                    if (!currentValues.includes(value)) {
                                        handleInputChange(fieldKey, [...currentValues, value]);
                                    }
                                }}
                                value={formData[fieldKey] || []}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select multiple" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectGroup>
                                        {field.items?.enum?.map((option: string) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors[fieldKey] && <p className="text-red-500 text-sm mt-1">{errors[fieldKey]}</p>}
                        </div>
                    );
                }

                if (itemType === 'object') {
                    // Render nested fields for array of objects
                    return (
                        <div key={fieldKey} className="mb-4 my-2">
                            <label className="block text-sm font-medium py-2 capitalize text-gray-700" htmlFor={fieldKey}>
                                {field.title || key} {isRequired && <span className="text-red-500">*</span>}
                            </label>
                            {(formData[fieldKey] || [{}]).map((item: any, index: number) => (
                                <Card key={`${fieldKey}[${index}]`} className="my-2">

                                    <CardContent>
                                        {renderFields(field.items.properties, `${fieldKey}[${index}]`)}
                                    </CardContent>
                                </Card>
                            ))}
                            <div className='flex justify-end'>
                                <Button
                                    type="button"
                                    onClick={() =>
                                        handleInputChange(fieldKey, [...(formData[fieldKey] || []), {}])
                                    }
                                    className="mt-2 bg-blue-500 mb-3"
                                >
                                    Submit
                                </Button>
                            </div>

                        </div>
                    );
                }
            }

            if (field.enum) {
                // Render dropdown for fields with an enum
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
                            <SelectContent className="w-full">
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
                    </div>
                );
            }

            if (field.type === 'string') {
                // Render text input for string fields
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
                // Render checkbox for boolean fields
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
                // Render number input for integer fields
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
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SourceConfiguration;