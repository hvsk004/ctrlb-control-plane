import { withJsonFormsControlProps } from "@jsonforms/react";
import { ControlProps, rankWith, isObjectControl, schemaMatches, and } from "@jsonforms/core";
import { Button, Input, Typography, Box } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";

const KeyValueControl = ({ data, handleChange, path, visible = true, label }: ControlProps) => {
	if (!visible) return null;

	const entries = Object.entries(data || {});

	const updateKey = (oldKey: string, newKey: string) => {
		const updated = { ...data };
		const value = updated[oldKey];
		delete updated[oldKey];
		updated[newKey] = value;
		handleChange(path, updated);
	};

	const updateValue = (key: string, value: string) => {
		const updated = { ...data, [key]: value };
		handleChange(path, updated);
	};

	const removeEntry = (key: string) => {
		const updated = { ...data };
		delete updated[key];
		handleChange(path, updated);
	};

	const addEntry = () => {
		const updated = { ...data };
		let i = 1;
		let base = "key";
		while (updated[`${base}${i}`] !== undefined) i++;
		updated[`${base}${i}`] = "";
		handleChange(path, updated);
	};

	return (
		<div className="flex flex-col gap-2">
			{label && (
				<Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 500 }}>
					{label}
				</Typography>
			)}
			{entries.map(([key, value], index) => (
				<Box key={index} className="flex gap-2 items-center">
					<Input
						value={key}
						onChange={e => updateKey(key, e.target.value)}
						placeholder="Key"
						sx={{ fontSize: "0.8rem", minHeight: "32px", padding: "6px 8px" }}
					/>
					<Input
						value={value}
						onChange={e => updateValue(key, e.target.value)}
						placeholder="Value"
						sx={{ fontSize: "0.8rem", minHeight: "32px", padding: "6px 8px" }}
					/>
					<Button onClick={() => removeEntry(key)} variant="outlined" size="small">
						<Trash2 size={16} />
					</Button>
				</Box>
			))}
			<Button onClick={addEntry} variant="outlined" size="small" startIcon={<Plus size={16} />}>
				Add Entry
			</Button>
		</div>
	);
};

const keyValueTester = rankWith(
	5,
	and(
		isObjectControl,
		schemaMatches(
			schema =>
				schema?.type === "object" &&
				schema?.properties === undefined && // not a fixed shape object
				typeof schema?.additionalProperties === "object" &&
				schema?.additionalProperties?.type === "string",
		),
	),
);

export const customKeyValueRenderer = {
	tester: keyValueTester,
	renderer: withJsonFormsControlProps(KeyValueControl),
};

export default KeyValueControl;
