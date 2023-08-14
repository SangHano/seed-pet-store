const client = require('./db.js');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS pets_products; 
      DROP TABLE IF EXISTS pets;
      DROP TABLE IF EXISTS owners;  
       
    `);
    console.log('TABLES DROPPED!');
  } catch(error) {
    console.log(error);
  }
}


const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE owners(
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(30) NOT NULL
      );

      CREATE TABLE pets(
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(20) NOT NULL,
        Type VARCHAR(20) NOT NULL,
        Owner_Id INTEGER REFERENCES owners(Id)
      );
      
      CREATE TABLE pets_products(
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(20) NOT NULL,
        pet_Id INTEGER REFERENCES pets(Id)
      );
      CREATE TABLE products(
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(20) NOT NULL,
        pet_product_id INTEGER REFERENCES pets_products(Id)
      );
    `);

    console.log('TABLES CREATED!');
  } catch(error) {
    console.log(error);
  }
}

const createOwner = async(ownersName) => {
  try {
    await client.query(`
      INSERT INTO owners (Name)
      VALUES ('${ownersName}');
    `);

    console.log('OWNER CREATED');
  } catch(error) {
    console.log(error)
  }
}
const createPet = async(petsName, petsType, ownerID) =>{
  try{
    await client.query(`
   INSERT INTO pets (Name, Type, Owner_Id)
   VALUES ($1, $2, $3);
`, [petsName, petsType, ownerID]);
    
    console.log('PETS CREATED');
  } catch(error) {
    console.log(error)
  }
}
const createPetsProducts = async(petsProductName, petID) => {
  try {
    await client.query(`
      INSERT INTO pets_products (Name, pet_Id)
      VALUES ($1, $2);
    `, [petsProductName, petID]);
    console.log('PET PRODUCT CREATED');
  } catch(error) {
    console.log(error);
  }
}
const createProducts = async(productName, petsProductID) => {
  try {
    await client.query(`
      INSERT INTO products (Name, pet_product_id)
      VALUES ($1, $2);
    `, [productName, petsProductID]);
    console.log('PRODUCT CREATED');
  } catch(error) {
    console.log(error);
  }
}
const syncAndSeed = async() => {
  try {
    await client.connect();
    console.log('CONNECTED TO THE DB!');

    await dropTables();
    await createTables();
    


    await createOwner('Greg');
    await createOwner('Min');
    await createOwner('Jacky');

    await createPet('Momo', 'Turtle', 1);
    await createPet('Thor', 'Dog', 2);
    await createPet('King', 'Dog', 3);

    await createPetsProducts('Dog Toy', 1);
    await createPetsProducts('Cat Toy', 2);
    await createPetsProducts('Turlte Toy', 3);

    await createProducts('Bones',1)
    await createProducts('Teaser',2)
    await createProducts('Rubber Ducks',3)
    

  } catch(error) {
    console.log(error);
  }
}

syncAndSeed();