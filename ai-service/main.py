
from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from pydantic import BaseModel
import joblib

from credibility_scoring import compute_credibility
from severity_estimation import compute_severity
from relevance_filter import is_weather_relevant  # ye line add karo

app = FastAPI(title="SIH Weather AI Service")

vectorizer = joblib.load("models/vectorizer.pkl")
model = joblib.load("models/classifier.pkl")

class ClassifyRequest(BaseModel):
    text: str

class ProcessRequest(BaseModel):
    text: str
    sourceType: str
    hasMedia: bool = False
    locationResolved: bool = False


class FilterRequest(BaseModel):  # ye class add karo
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
    return {"label": label, "confidence": confidence}

@app.post("/is-relevant")  # ye poora endpoint add karo
def check_relevance(request: FilterRequest):
    result = is_weather_relevant(request.text)
    return {"relevant": result}

@app.post("/process")
def process(request: ProcessRequest):
    text_vec = vectorizer.transform([request.text])
    event_label = model.predict(text_vec)[0]
    probabilities = model.predict_proba(text_vec)[0]
    classify_confidence = round(float(max(probabilities)), 3)

    credibility = compute_credibility(
        source_type=request.sourceType,
        has_media=request.hasMedia,
        location_resolved=request.locationResolved
    )

    severity = compute_severity(event_type=event_label, text=request.text)

    return {
        "eventType": event_label,
        "classifyConfidence": classify_confidence,
        "credibilityScore": credibility["credibilityScore"],
        "credibilityReasons": credibility["reasons"],
        "severity": severity
    }