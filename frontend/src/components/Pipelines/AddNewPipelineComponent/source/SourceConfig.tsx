import { useState } from 'react';
import { JsonForms } from '@jsonforms/react';

import {
    materialCells,
    materialRenderers,
} from '@jsonforms/material-renderers';

import { Button } from '@/components/ui/button';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginBottom: '0.5rem',
                },
            },
        },
    },
});

const renderers = [
    ...materialRenderers,
];

const SourceConfig = ({ schema, name, type, description, features }: { schema: any, name: string, type: string, description: string, features: string[] }) => {
    const [data, setData] = useState<object>();
    const handleSubmit = () => {
        const updatedSources = [
            { name: name, display_name: description, supported_signals: features, type: type },
        ];
        localStorage.setItem("sources", JSON.stringify(updatedSources));
    };

    return (
        <ThemeProvider theme={theme}>
            <div className='mt-3'>
                <div className='text-2xl p-4 font-semibold bg-gray-100'>{schema.title}</div>
                <div className='p-3 '>
                    <div className='overflow-y-auto h-[45rem]'>
                        <JsonForms
                            data={data}
                            schema={schema}
                            renderers={renderers}
                            cells={materialCells}
                            onChange={({ data }) => setData(data)}
                        />
                        <div className='flex justify-end mb-10'>
                            <Button size={"lg"} className='bg-blue-500' onClick={handleSubmit}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </ThemeProvider>
    )
}

export default SourceConfig
