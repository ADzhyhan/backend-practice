START TRANSACTION;
  CREATE TABLE "user" (
    id serial PRIMARY KEY,
    fname varchar NOT NULL,
    lname varchar NOT NULL,
    active boolean NOT NULL
  ); 
COMMIT;