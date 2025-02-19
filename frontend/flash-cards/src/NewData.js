import React, { useState } from "react";
import * as XLSX from 'xlsx';

export function NewData(props) {

    const [newTableName, setNewTableName] = useState("");
    const [newTableBool, setNewTableBool] = useState(false);

    const handleNewTable = (event) => {
        setNewTableName(event.target.value);
    }

    function correctTableName(tableName) {
        const regex = /^[a-zA-Z0-9_]+$/;
        return regex.test(tableName);
    }

    const handleSubmit = async (event) => {
        const file = event.target.files[0];
        const tableName = newTableName === "" ? file.name.substring(0, file.name.indexOf('.')) : newTableName;

        if (!correctTableName(tableName)) {
            alert("Enter a valid table name. A-Z, 0-9 characters only.");
            return;
        }

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            const data = reader.result; // File data
            const excelWorkbook = XLSX.read(data, {type: 'array'});

            // Getting first sheet
            const sheet = excelWorkbook.Sheets[excelWorkbook.SheetNames[0]];

            // Converts sheet to JSON data format
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            try {
                
                const response = await fetch('http://localhost:5000/api/create_table', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({ tableName: tableName, data: jsonData }),
                });
                props.setChosenTable(tableName);
                setNewTableBool(response.ok);
            } catch (err) {
                console.error('Error fetching questions.', err);
            }
        }
    }

    return (
        <div>
            {!newTableBool && 
                <div>
                    <label>
                        Enter a table name:
                        <input type="text" onChange={handleNewTable}/>
                    </label>
                    <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleSubmit}
                    />
                    <input type="submit" value="Submit" onClick={handleSubmit}/>
                    <p>If no table name entered, file name will be table name.</p>
                </div>
            }
        </div>
    );
}