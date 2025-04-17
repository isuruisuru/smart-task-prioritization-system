from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from src.services.ai_agent import TaskPrioritizer, Task

app = FastAPI(title="Smart Task Prioritization System")
task_prioritizer = TaskPrioritizer()

@app.post("/prioritize-task", response_model=Task)
async def prioritize_single_task(task: Task):
    try:
        result = task_prioritizer.prioritize_task(task)
        task.priority = result["priority"]
        task.labels = result["labels"]
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/prioritize-tasks", response_model=List[Task])
async def prioritize_multiple_tasks(tasks: List[Task]):
    try:
        return task_prioritizer.process_tasks(tasks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 