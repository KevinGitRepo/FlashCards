import React, { useState } from "react";
import * as XLSX from 'xlsx';

export function NewData(props) {

    const [newTableName, setNewTableName] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleNewTable = (event) => {
        setNewTableName(event.target.value);
    }

    const handleSubmit = async () => {
        if (!selectedFile) {
            alert("Please enter a file");
            return;
        }

        if (!newTableName) {
            setNewTableName(selectedFile.name);
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const data = reader.result; // File data
            const excelWorkbook = XLSX.read(data, {type: 'array'});

            // Getting first sheet
            const sheet = excelWorkbook.Sheets[excelWorkbook.SheetNames[0]];

            // Converts sheet to JSON data format
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            try {
                props.setChosenTable(newTableName);
                const response = await fetch('http://localhost:5000/api/create_table', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({ tableName: newTableName, data: jsonData }),
                });

                props.setSentNewTable(response.ok);
            } catch (err) {
                console.error('Error fetching questions.', err);
            }
        }
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0])
    }

    return (
        <div>
            {!props.sentNewTable && 
                    <form onSubmit={handleSubmit}>
                        <label>
                            Enter a table name:
                            <input type="text" onChange={handleNewTable}/>
                        </label>
                        <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        />
                        <input type="submit" value="Submit"/>
                        <p>If no table name entered, file name will be table name.</p>
                    </form>
            }
        </div>
    );
}