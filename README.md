# Golden Ticket Web App
## -Bridger Hall

## Languages
 - Javascript
 - Python
 - Html
 - CSS

# Stack
 - Flask
   

#### Resource
**Ticket**
- entrant_name (a string value)
- entrant_age (an integer value)
- guest_name (a string value)
- random_token(an integer value)

**DataBase Schema**
`
"""CREATE TABLE IF NOT EXISTS TICKETS (
id INTEGER PRIMARY KEY AUTOINCREMENT,
entrant_name TEXT NOT NULL,
entrant_age INTEGER NOT NULL,
guest_name TEXT NOT NULL,
random_token INTEGER NOT NULL    
)"""
`

**REST endpoints**
|     Name       |    Method  |    Path  |
|----------------|------------|----------|
|  getTickets    |     GET    |  /tickets|
|  submitForm    |     POST   |  /tickets|
