CREATE DATABASE simplechat;

CREATE TABLE IF NOT EXISTS usersignalr(
    user_id SERIAL PRIMARY KEY, 
    name VARCHAR (50) NOT NULL
);