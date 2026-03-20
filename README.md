# Gorgeous To-Do List

**🚀 Live Demo: [https://to-do-1-tj9a.onrender.com](https://to-do-1-tj9a.onrender.com)**

A full-stack, aesthetically pleasing To-Do List web application featuring a modern glassmorphism design, dark mode, and seamless task management. Built with Python, FastAPI, and Vanilla JavaScript.

## Features ✨
- **Glassmorphism UI**: A beautiful, modern interface with blurred translucent cards and animated neon gradients.
- **RESTful API**: Fast and robust backend built on FastAPI and Pydantic.
- **SQLite Database**: Lightweight, embedded SQL database handling persistence seamlessly.
- **Vanilla Frontend**: No heavy frontend frameworks required. Relies on clean HTML5, CSS3 Custom Properties, and ES6+ JavaScript.
- **Full CRUD Support**: Create, read, update, and delete tasks instantly without refreshing the page.
- **Inline Task Editing**: Edit tasks directly by double-clicking the pen icon, updating seamlessly via asynchronous fetching.

## Tech Stack 🛠️
- **Backend**: Python 3, FastAPI, Uvicorn, Jinja2, Pydantic, SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Google Fonts (Inter)

## Getting Started 🚀

### Prerequisites
Make sure you have [Python 3.8+](https://www.python.org/downloads/) installed. 

### Installation

1. Clone this repository to your local machine:
```bash
git clone https://github.com/sumith-06/TO-DO.git
cd TO-DO
```

2. (Optional) Create a virtual environment:
```bash
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate
```

3. Install the required dependencies:
```bash
pip install -r requirements.txt
```

### Running the Application

1. Start the local ASGI server using Uvicorn:
```bash
python -m uvicorn main:app --reload --port 8000
```
*Note: The `--reload` flag automatically reloads the server if you modify the code.*

2. Open your web browser and navigate to:
```
http://localhost:8000
```

*The application will automatically create an empty SQLite `database.db` the first time you interact with the tasks.*

## Project Structure 📁
```text
📦 TO-DO
 ┣ 📂 static
 ┃ ┣ 📜 script.js       # Client-side validation and DOM manipulation
 ┃ ┗ 📜 style.css       # Styling rules and glassmorphism layout
 ┣ 📂 templates
 ┃ ┗ 📜 index.html      # The Jinja2 templated main webpage structure
 ┣ 📜 main.py           # The FastAPI backend API routes and setup
 ┣ 📜 requirements.txt  # Project PIP dependencies
 ┗ 📜 .gitignore        # Ignored files for version control
```

