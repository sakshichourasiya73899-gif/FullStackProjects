from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI(title="SIH Weather AI Service")

# Load once at startup — not inside endpoint (slow hoga warna)
vectorizer = joblib.load("models/vectorizer.pkl")
model = joblib.load("models/classifier.pkl")

class ClassifyRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "SIH AI service running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/classify")
def classify(request: ClassifyRequest):
    text_vec = vectorizer.transform([request.text])
    label = model.predict(text_vec)[0]
    probabilities = model.predict_proba(text_vec)[0]
    confidence = round(float(max(probabilities)), 3)

    return {
        "label": label,
        "confidence": confidence
    }