const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// In-memory "database"
const users = [];

app.use(bodyParser.urlencoded({ extended: true }));

// Home route: form + table
app.get('/', (req, res) => {
  let tableRows = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.mobile}</td>
    </tr>
  `).join('');

  res.send(`
    <html>
      <head>
        <title>Simple Node App</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          input { margin: 5px 0; padding: 8px; width: 250px; }
          button { padding: 8px 15px; }
          table { border-collapse: collapse; margin-top: 20px; width: 100%; max-width: 400px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>User Entry</h1>
        <form method="POST" action="/add">
          <label>Name:<br>
            <input type="text" name="name" required />
          </label><br>
          <label>Mobile Number:<br>
            <input type="text" name="mobile" required pattern="\\d{10}" title="Enter 10 digit number" />
          </label><br>
          <button type="submit">Add User</button>
        </form>

        <h2>Stored Users</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Mobile Number</th></tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="2">No data yet</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `);
});

// Form submission route
app.post('/add', (req, res) => {
  const { name, mobile } = req.body;
  // Simple validation
  if (!name || !mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).send('Invalid input. Go back and enter valid name and 10-digit mobile number.');
  }

  // Store in memory
  users.push({ name, mobile });
  // Redirect back to home to show updated table
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
