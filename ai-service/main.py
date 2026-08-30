
# # from dotenv import load_dotenv
# # load_dotenv()

# # from groq import Groq
# # from fastapi import FastAPI
# # from pydantic import BaseModel
# # import joblib
# # from groq import Groq
# # import os

# # from credibility_scoring import compute_credibility
# # from severity_estimation import compute_severity
# # from relevance_filter import is_weather_relevant  # ye line add karo

# # app = FastAPI(title="SIH Weather AI Service")

# # vectorizer = joblib.load("models/vectorizer.pkl")
# # model = joblib.load("models/classifier.pkl")

# # class ClassifyRequest(BaseModel):
# #     text: str

# # class ProcessRequest(BaseModel):
# #     text: str
# #     sourceType: str
# #     hasMedia: bool = False
# #     locationResolved: bool = False


# # class FilterRequest(BaseModel):  # ye class add karo
# #     text: str

# # class LocationExtractRequest(BaseModel):
# #     text: str

# # class SummarizeRequest(BaseModel):
# #     prompt: str

# # @app.get("/")
# # def root():
# #     return {"message": "SIH AI service running"}

# # @app.get("/health")
# # def health():
# #     return {"status": "ok"}

# # @app.post("/classify")
# # def classify(request: ClassifyRequest):
# #     text_vec = vectorizer.transform([request.text])
# #     label = model.predict(text_vec)[0]
# #     probabilities = model.predict_proba(text_vec)[0]
# #     confidence = round(float(max(probabilities)), 3)
# #     return {"label": label, "confidence": confidence}


# # groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# # @app.post("/summarize")
# # def summarize(request: SummarizeRequest):
# #     try:
# #         response = groq_client.chat.completions.create(
# #             model="llama3-8b-8192",
# #             messages=[
# #                 {"role": "user", "content": request.prompt}
# #             ],
# #             max_tokens=150,
# #             temperature=0.3
# #         )
# #         summary = response.choices[0].message.content.strip()
# #         return {"summary": summary}
# #     except Exception as e:
# #         print(f"[Summarize] Error: {e}")
# #         return {"summary": None}    

# # @app.post("/is-relevant")  # ye poora endpoint add karo
# # def check_relevance(request: FilterRequest):
# #     result = is_weather_relevant(request.text)
# #     return {"relevant": result}

# # @app.post("/extract-location")
# # def extract_location(request: LocationExtractRequest):
# #     try:
# #         import json
# #         response = groq_client.chat.completions.create(
# #             model="llama3-8b-8192",
# #             messages=[{
# #                 "role": "user",
# #                 "content": f"""Extract the primary city and state from this weather report. If found, also provide the approximate latitude and longitude for that city. Return ONLY a valid JSON object in this exact format: {{"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567}}. If no specific location is mentioned in India, return {{"city": null, "state": null, "lat": null, "lng": null}}. Do not return any other text or markdown formatting. Text: {request.text}"""
# #             }],
# #             max_tokens=150,
# #             temperature=0
# #         )
# #         content = response.choices[0].message.content.strip()
# #         # Try to parse the json response
# #         data = json.loads(content)
# #         return data
# #     except Exception as e:
# #         print(f"[Extract Location] Error: {e}")
# #         return {"city": None, "state": None, "lat": None, "lng": None}

# # @app.post("/classify-subtype")
# # def classify_subtype(request: ClassifyRequest):
# #     try:
# #         response = groq_client.chat.completions.create(
# #             model="llama3-8b-8192",
# #             messages=[{
# #                 "role": "user",
# #                 "content": f"""Classify this weather report into a specific subtype.

# # Text: {request.text}

# # Choose ONE from:
# # - urban_waterlogging
# # - river_flooding
# # - flash_flood
# # - agricultural_drought
# # - water_scarcity_drought
# # - heavy_rain
# # - light_rain
# # - electrical_thunderstorm
# # - severe_heatwave
# # - mild_heatwave
# # - dense_fog
# # - shallow_fog
# # - dust_storm_severe
# # - dust_storm_mild
# # - high_wind_storm
# # - cyclonic_wind
# # - forest_fire
# # - agricultural_fire
# # - severe_cold_wave
# # - mild_cold_wave
# # - tropical_cyclone
# # - other

# # Return ONLY the subtype label, nothing else."""
# #             }],
# #             max_tokens=20,
# #             temperature=0
# #         )
# #         subtype = response.choices[0].message.content.strip().lower()
# #         return {"subtype": subtype}
# #     except Exception as e:
# #         return {"subtype": "other"}

# # # @app.post("/estimate-severity")
# # # def estimate_severity(request: ClassifyRequest):
# # #     try:
# # #         response = groq_client.chat.completions.create(
# # #             model="llama3-8b-8192",
# # #             messages=[{
# # #                 "role": "user",
# # #                 "content": f"""Estimate severity for this weather report:

# # # Text: {request.text}

# # # Choose from:
# # # - low
# # # - medium
# # # - high

# # # Return ONLY one word: low, medium or high."""
# # #             }],
# # #             max_tokens=10,
# # #             temperature=0
# # #         )
# # #         severity = response.choices[0].message.content.strip().lower()
# # #         return {"severity": severity}
# # #     except Exception as e:
# # #         return {"severity": "low"}



# # @app.post("/process")
# # def process(request: ProcessRequest):
# #     text_vec = vectorizer.transform([request.text])
# #     event_label = model.predict(text_vec)[0]
# #     probabilities = model.predict_proba(text_vec)[0]
# #     classify_confidence = round(float(max(probabilities)), 3)

# #     credibility = compute_credibility(
# #         source_type=request.sourceType,
# #         has_media=request.hasMedia,
# #         location_resolved=request.locationResolved
# #     )

# #     severity = compute_severity(event_type=event_label, text=request.text)

# #     return {
# #         "eventType": event_label,
# #         "classifyConfidence": classify_confidence,
# #         "credibilityScore": credibility["credibilityScore"],
# #         "credibilityReasons": credibility["reasons"],
# #         "severity": severity
# #     }

# from dotenv import load_dotenv
# load_dotenv()

# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib
# import os

# from credibility_scoring import compute_credibility
# from severity_estimation import compute_severity, compute_severity_with_confidence
# from relevance_filter import is_weather_relevant, get_groq_client, rotate_key, GROQ_KEYS

# app = FastAPI(title="SIH Weather AI Service")

# vectorizer = joblib.load("models/vectorizer.pkl")
# model = joblib.load("models/classifier.pkl")

# class ClassifyRequest(BaseModel):
#     text: str

# class ProcessRequest(BaseModel):
#     text: str
#     sourceType: str
#     hasMedia: bool = False
#     locationResolved: bool = False

# class FilterRequest(BaseModel):
#     text: str

# class SummarizeRequest(BaseModel):
#     prompt: str

# class LocationExtractRequest(BaseModel):
#     text: str

# @app.get("/")
# def root():
#     return {"message": "SIH AI service running"}

# @app.get("/health")
# def health():
#     return {
#         "status": "ok",
#         "groq_keys_available": len(GROQ_KEYS),
#         "model_loaded": True
#     }

# @app.post("/classify")
# def classify(request: ClassifyRequest):
#     text_vec = vectorizer.transform([request.text])
#     label = model.predict(text_vec)[0]
#     probabilities = model.predict_proba(text_vec)[0]
#     confidence = round(float(max(probabilities)), 3)
#     return {"label": label, "confidence": confidence}

# @app.post("/is-relevant")
# def check_relevance(request: FilterRequest):
#     result = is_weather_relevant(request.text)
#     return {"relevant": result}

# @app.post("/summarize")
# def summarize(request: SummarizeRequest):
#     for attempt in range(max(len(GROQ_KEYS), 1)):
#         try:
#             client = get_groq_client()
#             if not client:
#                 return {"summary": None}
#             response = client.chat.completions.create(
#                 model="llama3-8b-8192",
#                 messages=[{"role": "user", "content": request.prompt}],
#                 max_tokens=150,
#                 temperature=0.3
#             )
#             return {"summary": response.choices[0].message.content.strip()}
#         except Exception as e:
#             if "rate_limit" in str(e) or "429" in str(e):
#                 rotate_key()
#                 continue
#             print(f"[Summarize] Error: {e}")
#             return {"summary": None}
#     return {"summary": None}

# @app.post("/extract-location")
# def extract_location(request: LocationExtractRequest):
#     import json
#     for attempt in range(max(len(GROQ_KEYS), 1)):
#         try:
#             client = get_groq_client()
#             if not client:
#                 return {"city": None, "state": None, "lat": None, "lng": None}
#             response = client.chat.completions.create(
#                 model="llama3-8b-8192",
#                 messages=[{
#                     "role": "user",
#                     "content": f"""Extract the primary Indian city and state from this weather report text.
# Return ONLY a valid JSON object in this exact format:
# {{"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567}}

# If no specific location is found, return:
# {{"city": null, "state": null, "lat": null, "lng": null}}

# Do not return any other text or markdown.
# Text: {request.text}"""
#                 }],
#                 max_tokens=100,
#                 temperature=0
#             )
#             content = response.choices[0].message.content.strip()
#             # Remove markdown code blocks if present
#             content = content.replace('```json', '').replace('```', '').strip()
#             data = json.loads(content)
#             return data
#         except Exception as e:
#             if "rate_limit" in str(e) or "429" in str(e):
#                 rotate_key()
#                 continue
#             print(f"[Extract Location] Error: {e}")
#             return {"city": None, "state": None, "lat": None, "lng": None}
#     return {"city": None, "state": None, "lat": None, "lng": None}

# @app.post("/classify-subtype")
# def classify_subtype(request: ClassifyRequest):
#     for attempt in range(max(len(GROQ_KEYS), 1)):
#         try:
#             client = get_groq_client()
#             if not client:
#                 return {"subtype": "other"}
#             response = client.chat.completions.create(
#                 model="llama3-8b-8192",
#                 messages=[{
#                     "role": "user",
#                     "content": f"""Classify this weather report into a specific subtype.
# Text: {request.text}

# Choose ONE from: urban_waterlogging, river_flooding, flash_flood, agricultural_drought, water_scarcity_drought, heavy_rain, light_rain, electrical_thunderstorm, severe_heatwave, mild_heatwave, dense_fog, shallow_fog, dust_storm_severe, dust_storm_mild, high_wind_storm, cyclonic_wind, forest_fire, agricultural_fire, severe_cold_wave, mild_cold_wave, tropical_cyclone, other

# Return ONLY the subtype label, nothing else."""
#                 }],
#                 max_tokens=20,
#                 temperature=0
#             )
#             subtype = response.choices[0].message.content.strip().lower()
#             return {"subtype": subtype}
#         except Exception as e:
#             if "rate_limit" in str(e) or "429" in str(e):
#                 rotate_key()
#                 continue
#             return {"subtype": "other"}
#     return {"subtype": "other"}

# @app.post("/process")
# def process(request: ProcessRequest):
#     text_vec = vectorizer.transform([request.text])
#     event_label = model.predict(text_vec)[0]
#     probabilities = model.predict_proba(text_vec)[0]
#     classify_confidence = round(float(max(probabilities)), 3)

#     credibility = compute_credibility(
#         source_type=request.sourceType,
#         has_media=request.hasMedia,
#         location_resolved=request.locationResolved
#     )

#     severity_result = compute_severity_with_confidence(
#         event_type=event_label,
#         text=request.text
#     )

#     return {
#         "eventType": event_label,
#         "classifyConfidence": classify_confidence,
#         "credibilityScore": credibility["credibilityScore"],
#         "credibilityReasons": credibility["reasons"],
#         "severity": severity_result["severity"],
#         "severityConfidence": severity_result["confidence"]
#     }


from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import joblib
import os

from credibility_scoring import compute_credibility
from severity_estimation import compute_severity, compute_severity_with_confidence
from relevance_filter import is_weather_relevant, get_groq_client, rotate_key, GROQ_KEYS

app = FastAPI(title="SIH Weather AI Service")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

MODEL = "qwen/qwen3.6-27b"

vectorizer = joblib.load("models/vectorizer.pkl")
model = joblib.load("models/classifier.pkl")

class ClassifyRequest(BaseModel):
    text: str

class ProcessRequest(BaseModel):
    text: str
    sourceType: str
    hasMedia: bool = False
    locationResolved: bool = False

class FilterRequest(BaseModel):
    text: str

class SummarizeRequest(BaseModel):
    prompt: str

class LocationExtractRequest(BaseModel):
    text: str

class EmbedRequest(BaseModel):
    text: str    

@app.get("/")
def root():
    return {"message": "SIH AI service running"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": MODEL,
        "groq_keys_available": len(GROQ_KEYS),
        "classifier_loaded": True
    }

@app.post("/classify")
def classify(request: ClassifyRequest):
    text_vec = vectorizer.transform([request.text])
    label = model.predict(text_vec)[0]
    probabilities = model.predict_proba(text_vec)[0]
    confidence = round(float(max(probabilities)), 3)
    return {"label": label, "confidence": confidence}

@app.post("/is-relevant")
def check_relevance(request: FilterRequest):
    result = is_weather_relevant(request.text)
    return {"relevant": result}

@app.post("/summarize")
def summarize(request: SummarizeRequest):
    import re
    for attempt in range(max(len(GROQ_KEYS), 1)):
        try:
            client = get_groq_client()
            if not client:
                return {"summary": None}
            response = client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": request.prompt}],
                max_tokens=200,
                temperature=0.3
            )
            content = response.choices[0].message.content
            if not content:
                return {"summary": None}
            # Remove <think> blocks completely
            content = re.sub(r'<think>[\s\S]*?</think>', '', content)
            content = content.strip()
            if len(content) > 15:
                return {"summary": content}
            return {"summary": None}
        except Exception as e:
            if "rate_limit" in str(e) or "429" in str(e):
                rotate_key()
                continue
            print(f"[Summarize] Error: {e}")
            return {"summary": None}
    return {"summary": None}

@app.post("/extract-location")
def extract_location(request: LocationExtractRequest):
    import json, re
    for attempt in range(max(len(GROQ_KEYS), 1)):
        try:
            client = get_groq_client()
            if not client:
                return {"city": None, "state": None, "lat": None, "lng": None}
            response = client.chat.completions.create(
                model=MODEL,
                messages=[{
                    "role": "user",
                    "content": f"""Extract the primary Indian city and state from this weather report.
Return ONLY a valid JSON object, no other text:
{{"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567}}

If no Indian location found:
{{"city": null, "state": null, "lat": null, "lng": null}}

Text: {request.text[:300]}"""
                }],
                max_tokens=100,
                temperature=0
            )
            content = response.choices[0].message.content.strip()
            # Remove <think> tags (qwen model adds these)
            content = re.sub(r'<think>.*?</think>', '', content, flags=re.DOTALL).strip()
            # Remove markdown
            content = content.replace('```json', '').replace('```', '').strip()
            # Find JSON object in response
            json_match = re.search(r'\{[^{}]+\}', content)
            if json_match:
                data = json.loads(json_match.group())
                return data
            return {"city": None, "state": None, "lat": None, "lng": None}
        except Exception as e:
            if "rate_limit" in str(e) or "429" in str(e):
                rotate_key()
                continue
            print(f"[Extract Location] Error: {e}")
            return {"city": None, "state": None, "lat": None, "lng": None}
    return {"city": None, "state": None, "lat": None, "lng": None}

@app.post("/classify-subtype")
def classify_subtype(request: ClassifyRequest):
    for attempt in range(max(len(GROQ_KEYS), 1)):
        try:
            client = get_groq_client()
            if not client:
                return {"subtype": "other"}
            response = client.chat.completions.create(
                model=MODEL,
                messages=[{
                    "role": "user",
                    "content": f"""Classify this weather report into a specific subtype.
Text: {request.text}

Choose ONE from: urban_waterlogging, river_flooding, flash_flood, agricultural_drought, water_scarcity_drought, heavy_rain, light_rain, electrical_thunderstorm, severe_heatwave, mild_heatwave, dense_fog, shallow_fog, dust_storm_severe, dust_storm_mild, high_wind_storm, cyclonic_wind, forest_fire, agricultural_fire, severe_cold_wave, mild_cold_wave, tropical_cyclone, other

Return ONLY the subtype label, nothing else."""
                }],
                max_tokens=20,
                temperature=0
            )
            subtype = response.choices[0].message.content.strip().lower()
            return {"subtype": subtype}
        except Exception as e:
            if "rate_limit" in str(e) or "429" in str(e):
                rotate_key()
                continue
            return {"subtype": "other"}
    return {"subtype": "other"}

@app.post("/embed")
def get_embedding(request: EmbedRequest):
    try:
        vector = embedding_model.encode(request.text).tolist()
        return {"embedding": vector, "dimensions": len(vector)}
    except Exception as e:
        print(f"[Embed] Error: {e}")
        return {"embedding": [], "dimensions": 0}    

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

    severity_result = compute_severity_with_confidence(
        event_type=event_label,
        text=request.text
    )

    return {
        "eventType": event_label,
        "classifyConfidence": classify_confidence,
        "credibilityScore": credibility["credibilityScore"],
        "credibilityReasons": credibility["reasons"],
        "severity": severity_result["severity"],
        "severityConfidence": severity_result["confidence"]
    }