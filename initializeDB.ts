import db from "./src/models"

db.sequelize?.sync().then(() => {
  console.log("Database initialized successfully")
}).catch(e => {
  console.log("Error: Database didn't initialized", e)
})