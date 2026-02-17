import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import llm_service
import os
import json
from datetime import datetime

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Option(BaseModel):
    text: str

class Question(BaseModel):
    text: str
    options: List[str]

class ExplainRequest(BaseModel):
    idea: str
    question: str
    options: List[str]

class ExplainResponse(BaseModel):
    question_explanation: str
    option_explanations: Dict[str, str]

class Answer(BaseModel):
    question: str
    selected_option: str

class QuestionRequest(BaseModel):
    idea: str
    history: List[Answer]
    total_questions: int
    current_phase: str

class PromptRequest(BaseModel):
    idea: str
    answers: List[Answer]
    selected_phases: List[str]

@app.get("/")
def read_root():
    return {"status": "Project Prompt Generator Backend is running"}

@app.post("/generate-question", response_model=Question)
async def generate_question_endpoint(request: QuestionRequest):
    try:
        # Check if we have reached the limit (although frontend should handle this, backend verification is good)
        if len(request.history) >= request.total_questions:
             raise HTTPException(status_code=400, detail="Question limit reached")

        if len(request.history) >= request.total_questions:
             raise HTTPException(status_code=400, detail="Question limit reached")

        question_data = await llm_service.generate_next_question(request.idea, request.history, request.current_phase)
        return question_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explain-question", response_model=ExplainResponse)
async def explain_question_endpoint(request: ExplainRequest):
    try:
        explanation = await llm_service.generate_explanation(request.idea, request.question, request.options)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-prompt")
async def generate_prompt_endpoint(request: PromptRequest):
    try:
        prompt = await llm_service.generate_final_prompt(request.idea, request.answers, request.selected_phases)
        return {"prompt": prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Save/Load Functionality
SAVES_DIR = "saves"
os.makedirs(SAVES_DIR, exist_ok=True)

class SaveRequest(BaseModel):
    id: str
    idea: str
    total_questions: int
    history: List[Answer]
    current_phase: str
    selected_phases: List[str]
    final_prompt: str = "" 

@app.post("/save-progress")
async def save_progress_endpoint(request: SaveRequest):
    try:
        filename = f"{request.id}.json"
        filepath = os.path.join(SAVES_DIR, filename)
        
        data = request.dict()
        data["timestamp"] = datetime.now().isoformat()
        
        with open(filepath, "w") as f:
            json.dump(data, f, indent=4)
            
        return {"message": "Progress saved", "id": request.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/list-saves")
async def list_saves_endpoint():
    try:
        saves = []
        if not os.path.exists(SAVES_DIR):
             return {"saves": []}

        for filename in os.listdir(SAVES_DIR):
            if filename.endswith(".json"):
                filepath = os.path.join(SAVES_DIR, filename)
                try:
                    with open(filepath, "r") as f:
                        data = json.load(f)
                        # Estimate progress safely
                        hist_len = len(data.get('history', []))
                        total = data.get('total_questions', 20) 
                        progress_display = f"{hist_len}/{total}"
                        
                        saves.append({
                            "id": data.get("id", filename.replace(".json", "")),
                            "idea": data.get("idea", "Untitled Project"),
                            "timestamp": data.get("timestamp", ""),
                            "progress": progress_display
                        })
                except:
                    continue 
        
        saves.sort(key=lambda x: x["timestamp"], reverse=True)
        return {"saves": saves}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/load-progress/{save_id}")
async def load_progress_endpoint(save_id: str):
    try:
        filepath = os.path.join(SAVES_DIR, f"{save_id}.json")
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Save file not found")
            
        with open(filepath, "r") as f:
            data = json.load(f)
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/delete-save/{save_id}")
async def delete_save_endpoint(save_id: str):
    try:
        filepath = os.path.join(SAVES_DIR, f"{save_id}.json")
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Save file not found")
            
        os.remove(filepath)
        return {"message": "Save deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
