# Epafra Portfolio

A static-first professional portfolio with a PHP/MySQL contact endpoint for InfinityFree hosting.

## Update your content

Edit `data.js` to add or change skills, projects, certifications, and posts. The page renders those arrays automatically. Update the name, bio, links, email, and portrait in `index.html`.

## Run locally

The front end can be opened directly, but the contact form needs PHP. With PHP installed, run:

```powershell
php -S localhost:8080
```

Then open `http://localhost:8080`.

## Deploy to InfinityFree

1. Create an InfinityFree hosting account and a MySQL database.
2. In phpMyAdmin, select the new database and import `api/schema.sql`.
3. Copy `api/config.example.php` to `api/config.php` and replace every placeholder with the database host, name, username, and password shown by InfinityFree.
4. Upload the project files into `htdocs`. Do not upload secrets to a public repository.
5. Replace the placeholder email, social URLs, biography, and portrait in `index.html`.
6. Confirm that `https://your-domain.example/api/contact.php` returns a JSON method error when opened directly. Submit the form from the homepage to test the database connection.

InfinityFree uses the database host shown in its control panel, which is usually different from `localhost`. Keep `config.php` private and never paste those credentials into `data.js` or front-end code.