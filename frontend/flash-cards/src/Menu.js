import React, {useState, useEffect} from "react";
import { NewData } from "./NewData";

export function Menu(props) {
    const [sentNewTable, setSentNewTable] = useState(false);

    useEffect(() => {
        props.setData(props.data);
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
            <NewData sentNewTable={sentNewTable}
                     setChosenTable={props.setChosenTable}
                     setSentNewTable={setSentNewTable}/>
        </div>
    )
}