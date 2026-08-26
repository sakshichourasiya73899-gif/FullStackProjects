from groq import Groq
import os

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def is_weather_relevant(text: str) -> bool:
    try:
        response = client.chat.completions.create(
            model="groq/compound-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a filter for a weather disaster monitoring system in India. Answer only YES or NO."
                },
                {
                    "role": "user",
                    "content": f"""Is this text about weather, natural disaster, or its impact on people/infrastructure in India?
                    
Text: {text}

Answer YES if it mentions: flood, rain, storm, heatwave, drought, fog, cyclone, landslide, wildfire, earthquake, cold wave, snowfall, or their effects on citizens (school closed, road blocked, people displaced, crop damage, power outage etc.)

Answer NO if it's about: politics, crime, sports, business, entertainment, accidents unrelated to weather.

Answer only YES or NO."""
                }
            ],
            max_tokens=5,
            temperature=0
        )
        
        answer = response.choices[0].message.content.strip().upper()
        return answer == "YES"
    except Exception as e:
        print(f"[relevance_filter] Groq API error: {e}")
        return True  # error pe default include karo