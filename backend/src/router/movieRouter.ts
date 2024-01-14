import express, {Router,Request,Response} from 'express';
const router:Router = express.Router();
import dbPool from '../dbConfig/dbConnection';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

router.post('/', (req:Request, res:Response) => {
    const {name, releasedate} = req.body;
    if(!name || !releasedate){
        return res.status(400).json({error:'Name and Release Date are required'});
    }
    const query:string = `INSERT INTO movie (name, releasedate) VALUES (?,?);`;
    dbPool.query<ResultSetHeader>(query,[name,releasedate], (error, results) => {
        if (error) {
            return res.status(500).json({error});
        }
        res.status(201).json({results});
    })
})

router.get('/', (req:Request, res:Response) => {
    const page:number = req.query.page?parseInt(req.query.page as string):1;
    const limit:number = req.query.limit?parseInt(req.query.limit as string):10;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const query:string = `SELECT * FROM movie LIMIT ?,?;SELECT COUNT(*) AS total FROM movie;`;
    dbPool.query<RowDataPacket[][]>(query,[startIndex,endIndex], (error, results) => {
        if (error) {
            return res.status(500).json({error:error});
        }
        res.status(200).json({results:results[0],total:results[1][0].total});
    })
})

router.put('/:id', (req:Request, res:Response) => {
    const {id} = req.params;
    const {name, releasedate} = req.body;
    if(!name || !releasedate){
        return res.status(400).json({error:'Name and Release Date are required'});
    }
    const query:string = `UPDATE movie SET name = ?, releasedate = ? WHERE id = ?;`;
    dbPool.query<ResultSetHeader>(query,[name,releasedate,id], (error, results) => {
        if (error) {
            return res.status(500).json({error:error});
        }
        res.status(200).json({results});
    })
});

router.delete('/:id', (req:Request, res:Response) => {
    const {id} = req.params;
    const query:string = `DELETE FROM movie WHERE id = ?;`;
    dbPool.query<ResultSetHeader>(query,[id], (error, results) => {
        if (error) {
            return res.status(500).json({error:error});
        }
        res.status(200).json({results});
    })
});


export default router;