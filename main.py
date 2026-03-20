from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import sqlite3
import os

app = FastAPI()

# Setup templates and static files directories
os.makedirs("static", exist_ok=True)
os.makedirs("templates", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Database setup
DATABASE = "database.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

class TaskItem(BaseModel):
    title: str
    completed: bool = False

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/tasks")
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return [{"id": task["id"], "title": task["title"], "completed": bool(task["completed"])} for task in tasks]

@app.post("/api/tasks")
def create_task(task: TaskItem):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tasks (title, completed) VALUES (?, ?)", (task.title, task.completed))
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return {"id": task_id, "title": task.title, "completed": task.completed}

@app.put("/api/tasks/{task_id}")
def update_task(task_id: int, task: TaskItem):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE tasks SET title = ?, completed = ? WHERE id = ?", (task.title, task.completed, task_id))
    conn.commit()
    conn.close()
    return {"id": task_id, "title": task.title, "completed": task.completed}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"status": "success"}
