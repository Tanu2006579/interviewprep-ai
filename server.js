

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: 'interview-platform-secret-change-later',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database
const db = new sqlite3.Database(
    path.join(__dirname, 'database.db'),
    (err) => {
        if (err) {
            console.error('Database connection error:', err.message);
        } else {
            console.log('Connected to SQLite database.');
        }
    }
);

// Create database tables
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS interviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            domain TEXT,
            score REAL,
            student_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Add student_id to an existing interviews table if needed
    db.run(
        `ALTER TABLE interviews ADD COLUMN student_id TEXT`,
        (err) => {
            if (err && !err.message.includes('duplicate column name')) {
                console.error('Database update error:', err.message);
            }
        }
    );
});

// Check whether a student is logged in
function requireLogin(req, res, next) {
    if (!req.session.student) {
        return res.status(401).json({
            message: 'Please login first.'
        });
    }

    next();
}

// STUDENT REGISTRATION
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'Please fill in all fields.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must contain at least 8 characters.'
            });
        }

        const cleanName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanName) {
            return res.status(400).json({
                message: 'Please enter your full name.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO students
             (full_name, email, password_hash)
             VALUES (?, ?, ?)`,
            [cleanName, cleanEmail, passwordHash],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({
                            message: 'This email is already registered.'
                        });
                    }

                    return res.status(500).json({
                        message: 'Registration failed.'
                    });
                }

                const newStudentId = 'STU' + (1000 + this.lastID);

                db.run(
                    `UPDATE students SET student_id = ? WHERE id = ?`,
                    [newStudentId, this.lastID],
                    (updateErr) => {
                        if (updateErr) {
                            return res.status(500).json({
                                message: 'Could not generate Student ID.'
                            });
                        }

                        res.status(201).json({
                            message: 'Registration successful!',
                            studentId: newStudentId
                        });
                    }
                );
            }
        );

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong.'
        });
    }
});

// STUDENT LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Enter your email and password.'
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    db.get(
        `SELECT * FROM students WHERE email = ?`,
        [cleanEmail],
        async (err, student) => {
            if (err) {
                return res.status(500).json({
                    message: 'Login failed.'
                });
            }

            if (!student) {
                return res.status(401).json({
                    message: 'Invalid email or password.'
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                student.password_hash
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: 'Invalid email or password.'
                });
            }

            req.session.regenerate((sessionErr) => {
                if (sessionErr) {
                    return res.status(500).json({
                        message: 'Could not start your session.'
                    });
                }

                req.session.student = {
                    studentId: student.student_id,
                    fullName: student.full_name,
                    email: student.email
                };

                res.json({
                    message: 'Login successful!',
                    student: req.session.student
                });
            });
        }
    );
});

// GET LOGGED-IN STUDENT DETAILS
app.get('/api/me', requireLogin, (req, res) => {
    res.json({
        student: req.session.student
    });
});

// STUDENT LOGOUT
app.post('/api/logout', requireLogin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: 'Logout failed.'
            });
        }

        res.clearCookie('connect.sid');

        res.json({
            message: 'Logged out successfully.'
        });
    });
});



// SAVE INTERVIEW RESULT
app.post('/api/save-interview', requireLogin, (req, res) => {
    const { domain, score } = req.body;

    if (!domain || !Number.isFinite(Number(score))) {
        return res.status(400).json({
            message: 'Invalid interview result.'
        });
    }

    const query = `
        INSERT INTO interviews (domain, score, student_id)
        VALUES (?, ?, ?)
    `;

    db.run(
        query,
        [domain, Number(score), req.session.student.studentId],
        function(err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: 'Interview saved successfully!',
                id: this.lastID
            });
        }
    );
});
// GET ONLY THE LOGGED-IN STUDENT'S HISTORY
app.get('/api/history', requireLogin, (req, res) => {
    db.all(
        `SELECT * FROM interviews
         WHERE student_id = ?
         ORDER BY created_at DESC`,
        [req.session.student.studentId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                history: rows
            });
        }
    );
});

// DELETE ONE INTERVIEW HISTORY RECORD
app.delete('/api/history/:id', requireLogin, (req, res) => {
    const interviewId = req.params.id;

    db.run(
        `DELETE FROM interviews
         WHERE id = ? AND student_id = ?`,
        [interviewId, req.session.student.studentId],
        function(err) {
            if (err) {
                return res.status(500).json({
                    message: 'Could not delete interview history.'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Interview record not found.'
                });
            }

            res.json({
                message: 'Interview history deleted successfully!'
            });
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
