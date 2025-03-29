import { useMemo, useState } from 'react';
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
                    marginBottom: '0.5rem', // Adjust spacing between fields
                },
            },
        },
    },
});

const Schema = {
    "title": "Filelog Receiver Configuration",
    "type": "object",
    "properties": {
        "include": {
            "type": "array",
            "title": "Include File Paths",
            "items": {
                "type": "string"
            }
        },
        "exclude": {
            "type": "array",
            "title": "Exclude File Paths",
            "items": {
                "type": "string"
            }
        },
        "start_at": {
            "type": "string",
            "title": "Start At",
            "enum": ["beginning", "end"],
            "default": "end"
        },
        "poll_interval": {
            "type": "string",
            "title": "Poll Interval",
            "default": "200ms"
        },
        "fingerprint_size": {
            "type": "integer",
            "title": "Fingerprint Size",
            "default": 100
        },
        "max_log_size": {
            "type": "integer",
            "title": "Max Log Size",
            "default": 0
        },
        "encoding": {
            "type": "string",
            "title": "Encoding",
            "default": "utf-8"
        },
        "operators": {
            "type": "array",
            "title": "Processors",
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "title": "Operator Type"
                    },
                    "id": {
                        "type": "string",
                        "title": "Operator ID"
                    },
                    "regex": {
                        "type": "string",
                        "title": "Regex Pattern"
                    },
                    "parse_from": {
                        "type": "string",
                        "title": "Parse From Field"
                    }
                },
                "required": ["type", "id"]
            }
        }
    },
    "required": ["include"]
}


const classes = {
    container: {
        padding: '1em',
        width: '100%',
    },
    title: {
        textAlign: 'center',
        padding: '0.25em',
    },
    dataContent: {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '0.25em',
        backgroundColor: '#cecece',
        marginBottom: '1.5em',
    },
    resetButton: {
        margin: 'auto !important',
        display: 'block !important',
    },
    demoform: {
        margin: 'auto',
        padding: '1rem',
    },
};

const renderers = [
    ...materialRenderers,
];

const Source = () => {
    const [data, setData] = useState<object>();
    const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);


    const handleSubmit = () => {
        // handle form submission logic
        console.log(stringifiedData)
        console.log('Submitting form data:', data);
    };
    return (
        <ThemeProvider theme={theme}>
            <div className='mt-3'>
                <div className='text-2xl p-4 font-semibold bg-gray-100'>{Schema.title}</div>
                <div className='p-3 '>
                    <div className='overflow-y-auto h-[45rem]' style={classes.demoform}>
                        <JsonForms
                            data={data}
                            schema={Schema}
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

export default Source
