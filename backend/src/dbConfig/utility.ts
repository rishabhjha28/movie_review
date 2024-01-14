import dbConnection from './dbConnection';
interface QueryData {
    tableName: string;
    query: string;
}

const createTable = async (info:QueryData)=>{
    const {tableName,query} = info;
    dbConnection.query(query, (err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(`Created Table ${tableName}`);
        }
    });
}

export default createTable;