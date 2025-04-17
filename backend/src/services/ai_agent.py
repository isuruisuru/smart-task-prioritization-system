from typing import List, Dict
from openai import OpenAI
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

class Task(BaseModel):
    title: str
    description: str
    due_date: str
    priority: str = None
    labels: List[str] = []

class TaskPrioritizer:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.system_prompt = """You are an AI task prioritization expert. Your role is to:
        1. Analyze task details and assign appropriate priority levels (High, Medium, Low)
        2. Generate relevant labels based on task content
        3. Consider due dates, task complexity, and importance in your analysis
        
        Respond in a structured format with priority and labels."""

    def prioritize_task(self, task: Task) -> Dict:
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": f"""
                    Task Title: {task.title}
                    Description: {task.description}
                    Due Date: {task.due_date}
                    
                    Please analyze this task and provide:
                    1. Priority level (High, Medium, Low)
                    2. Relevant labels
                    """}
                ],
                temperature=0.7,
                max_tokens=150
            )
            
            result = response.choices[0].message.content
            return self._parse_response(result)
        except Exception as e:
            print(f"Error in task prioritization: {str(e)}")
            return {"priority": "Medium", "labels": ["unprocessed"]}

    def _parse_response(self, response: str) -> Dict:
        priority = "Medium"
        labels = ["unprocessed", "unlabeled"]
        
        if "High" in response:
            priority = "High"
        elif "Low" in response:
            priority = "Low"
            
        # Extract labels (assuming they're comma-separated)
        if "labels:" in response.lower():
            labels_section = response.lower().split("labels:")[1]
            labels = [label.strip() for label in labels_section.split(",")]
            
        return {
            "priority": priority,
            "labels": labels
        }

    def process_tasks(self, tasks: List[Task]) -> List[Task]:
        processed_tasks = []
        for task in tasks:
            result = self.prioritize_task(task)
            task.priority = result["priority"]
            task.labels = result["labels"]
            processed_tasks.append(task)
        return processed_tasks