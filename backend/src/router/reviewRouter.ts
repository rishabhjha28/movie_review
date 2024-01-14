import express, {Request,Response} from 'express';
const router = express.Router();
import dbPool from '../dbConfig/dbConnection';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

router.post('/:movie_id',(req:Request,res:Response) =>{
    const {movie_id} = req.params;
    const {reviewerName,rating,comment} = req.body;
    if(!rating || !comment){
        return res.status(400).json({error:'Rating and Comment are required'});
    }
    if(parseFloat(rating) < 1 || parseFloat(rating) > 10){
        return res.status(400).json({error:'Rating should be between 1 and 10'});
    }
    const query:string = `INSERT INTO review (movie_id, reviewername, rating, comment) VALUES (?,?,?,?);`;
    dbPool.query<ResultSetHeader>(query,[movie_id,reviewerName,rating,comment], (error, results) => {
        if (error) {
            return res.status(500).json({error});
        }
        res.status(201).json({results});
    })
})

router.delete('/:id', (req:Request, res:Response) => {
    const {id} = req.params;
    const query:string = `DELETE FROM review WHERE id = ?;`;
    dbPool.query<ResultSetHeader>(query,[id], (error, results) => {
        if (error) {
            return res.status(500).json({error:error});
        }
        res.status(200).json({results});
    })
});

router.put('/:id', (req:Request, res:Response) => {
    const {id} = req.params;
    const {reviewerName,rating,comment} = req.body;
    if(!rating || !comment){
        return res.status(400).json({error:'Rating and Comment are required'});
    }
    if(parseFloat(rating) < 1 || parseFloat(rating) > 10){
        return res.status(400).json({error:'Rating should be between 1 and 10'});
    }
    const query:string = `UPDATE review SET reviewername = ?, rating = ?, comment = ? WHERE id = ?;`;
    dbPool.query<ResultSetHeader>(query,[reviewerName,rating,comment,id], (error, results) => {
        if (error) {
            return res.status(500).json({error:error});
        }
        res.status(200).json({results});
    })
})

router.get('/:movie_id',(req:Request,res:Response) =>{
    const {movie_id} = req.params;
    const page:number = req.query.page?parseInt(req.query.page as string):1;
    const limit:number = req.query.limit?parseInt(req.query.limit as string):10;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const query:string = `SELECT * FROM review WHERE movie_id = ? LIMIT ?,?;SELECT COUNT(*) AS total FROM review WHERE movie_id = ?;`;
    dbPool.query<RowDataPacket[][]>(query,[movie_id,startIndex,endIndex,movie_id], (error, results) => {
        if (error) {
            return res.status(500).json({error:error});
        }
        res.status(200).json({results:results[0],total:results[1][0].total});
    })
})

export default router