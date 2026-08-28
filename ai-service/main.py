
from dotenv import load_dotenv
load_dotenv()

from groq import Groq
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from groq import Groq
import os

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

class SummarizeRequest(BaseModel):
    prompt: str

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


groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.post("/summarize")
def summarize(request: SummarizeRequest):
    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=150,
            temperature=0.3
        )
        summary = response.choices[0].message.content.strip()
        return {"summary": summary}
    except Exception as e:
        print(f"[Summarize] Error: {e}")
        return {"summary": None}    

@app.post("/is-relevant")  # ye poora endpoint add karo
def check_relevance(request: FilterRequest):
    result = is_weather_relevant(request.text)
    return {"relevant": result}

@app.post("/classify-subtype")
def classify_subtype(request: ClassifyRequest):
    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{
                "role": "user",
                "content": f"""Classify this weather report into a specific subtype.

Text: {request.text}

Choose ONE from:
- urban_waterlogging
- river_flooding
- flash_flood
- agricultural_drought
- water_scarcity_drought
- heavy_rain
- light_rain
- electrical_thunderstorm
- severe_heatwave
- mild_heatwave
- dense_fog
- shallow_fog
- dust_storm_severe
- dust_storm_mild
- high_wind_storm
- cyclonic_wind
- forest_fire
- agricultural_fire
- severe_cold_wave
- mild_cold_wave
- tropical_cyclone
- other

Return ONLY the subtype label, nothing else."""
            }],
            max_tokens=20,
            temperature=0
        )
        subtype = response.choices[0].message.content.strip().lower()
        return {"subtype": subtype}
    except Exception as e:
        return {"subtype": "other"}

# @app.post("/estimate-severity")
# def estimate_severity(request: ClassifyRequest):
#     try:
#         response = groq_client.chat.completions.create(
#             model="llama3-8b-8192",
#             messages=[{
#                 "role": "user",
#                 "content": f"""Estimate severity for this weather report:

# Text: {request.text}

# Choose from:
# - low
# - medium
# - high

# Return ONLY one word: low, medium or high."""
#             }],
#             max_tokens=10,
#             temperature=0
#         )
#         severity = response.choices[0].message.content.strip().lower()
#         return {"severity": severity}
#     except Exception as e:
#         return {"severity": "low"}



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