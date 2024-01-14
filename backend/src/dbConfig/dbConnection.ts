import mysql, { ConnectionOptions } from 'mysql2';
import createTable from './utility';

const access: ConnectionOptions = { 
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
};

const dbConnection = mysql.createPool(access);
dbConnection.getConnection((err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Connected to Database');
        const createMovieTableQuery:string = `CREATE TABLE IF NOT EXISTS movie (id int NOT NULL AUTO_INCREMENT,name varchar(200) NOT NULL,releasedate date NOT NULL,averagerating DECIMAL(3,2) DEFAULT 0 check(averagerating>=0.00 and averageRating<=10.00) ,PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
        createTable({tableName:'movie',query:createMovieTableQuery})
        .then(() => {
            const createReviewTableQuery:string = `CREATE TABLE IF NOT EXISTS review (id int NOT NULL AUTO_INCREMENT,movie_id int NOT NULL,reviewername varchar(45) DEFAULT NULL,rating varchar(45) NOT NULL CHECK(rating>=0.00 and rating<=10.00),comment varchar(45) NOT NULL,PRIMARY KEY (id),KEY movie_id_idx (movie_id),CONSTRAINT movie_id FOREIGN KEY (movie_id) REFERENCES movie (id) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
            createTable({tableName:'review',query:createReviewTableQuery})
        }).catch((err) => {
            console.log(err);
        });
    }
})

export default dbConnection;