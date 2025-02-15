import React, {useState, useEffect} from "react";

export function Menu(props) {
    const [newTableName, setNewTableName] = useState(null);
    const [sentNewTable, setSentNewTable] = useState(false);

    useEffect(() => {

    }, [sentNewTable]);

    const handleTablePick = async (tableName) => {
        try {
            props.setChosenTable(tableName);
            const response = await fetch('http://localhost:5000/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ tableName: tableName }),
            });

            const resData = await response.json();
            props.setCards(resData);
        } catch (err) {
            console.error('Error fetching questions.', err);
        }
        
    };

    const handleNewTable = (event) => {
        setNewTableName(event.target.value);
    }

    const handleSubmit = async (tableName) => {
        setSentNewTable(true);
        try {
            props.setChosenTable(tableName);
            await fetch('http://localhost:5000/api/create_table', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ tableName: tableName }),
            });
        } catch (err) {
            console.error('Error fetching questions.', err);
        }
    }

    return (
        <div>
            <div>
                {!props.chosenTable ? (
                    <h1>Select a Table: </h1>
                ) : (
                    <h1>Flashcards for {props.chosenTable}</h1>
                )}
            </div>
            
            <div>
                {!props.chosenTable && 
                    props.data.map((item, index) => (
                        <button key={index} onClick={() => handleTablePick(item)}>{item}</button>
                    ))
                }
            </div>
            <div>
                {!sentNewTable && 
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name for new table:
                            <input type="text" value={newTableName} onChange={handleNewTable}/>
                        </label>
                        <input type="submit" value="Submit"/>
                    </form>
                }
            </div>
        </div>
    )
}