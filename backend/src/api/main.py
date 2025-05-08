from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Smart Task Prioritization System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    title: str
    description: str
    due_date: Optional[str] = None

class TaskResponse(BaseModel):
    priority: str
    labels: List[str]

@app.post("/prioritize-task", response_model=TaskResponse)
async def prioritize_single_task(task: TaskRequest):
    try:
        # Simple priority logic based on due date
        priority = "medium"
        labels = []
        
        if task.due_date:
            # Add some basic priority logic here
            if "urgent" in task.title.lower() or "important" in task.title.lower():
                priority = "high"
            elif "low" in task.title.lower() or "minor" in task.title.lower():
                priority = "low"
            
            # Add some basic labels
            if "bug" in task.description.lower():
                labels.append("bug")
            if "feature" in task.description.lower():
                labels.append("feature")
            if "documentation" in task.description.lower():
                labels.append("documentation")
        
        return {
            "priority": priority,
            "labels": labels
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 