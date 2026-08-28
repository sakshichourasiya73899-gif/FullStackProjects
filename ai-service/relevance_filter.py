# from groq import Groq
# import os

# client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# def is_weather_relevant(text: str) -> bool:
#     try:
#         response = client.chat.completions.create(
#             model="groq/compound-mini",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": "You are a filter for a weather disaster monitoring system in India. Answer only YES or NO."
#                 },
#                 {
#                     "role": "user",
#                     "content": f"""Is this text about weather, natural disaster, or its impact on people/infrastructure in India?
                    
# Text: {text}

# Answer YES if it mentions: flood, rain, storm, heatwave, drought, fog, cyclone, landslide, wildfire, earthquake, cold wave, snowfall, or their effects on citizens (school closed, road blocked, people displaced, crop damage, power outage etc.)

# Answer NO if it's about: politics, crime, sports, business, entertainment, accidents unrelated to weather.

# Answer only YES or NO."""
#                 }
#             ],
#             max_tokens=5,
#             temperature=0
#         )
        
#         answer = response.choices[0].message.content.strip().upper()
#         return answer == "YES"
#     except Exception as e:
#         print(f"[relevance_filter] Groq API error: {e}")
#         return True  # error pe default include karo

from groq import Groq
import os

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

SYSTEM_PROMPT = """
You are the first-stage relevance filter for an AI-powered
National Weather and Disaster Ground Intelligence Platform in India.

Your job is to determine whether a text report contains potentially
useful real-world information about:

1. A weather event
2. A natural hazard
3. The impact of such an event on people, infrastructure, environment,
   transportation, agriculture, or daily life
4. A possible emerging disaster situation

Answer ONLY with YES or NO.

Return YES when the text describes or provides evidence of:

- Heavy rain or extreme rainfall
- Flooding or waterlogging
- Cyclones or severe storms
- Strong winds or thunderstorms
- Heatwaves or extreme temperatures
- Drought or water scarcity
- Fog affecting visibility or transportation
- Landslides
- Wildfires or forest fires
- Earthquakes
- Snowfall, avalanches, or cold waves
- Lightning incidents
- Weather-related damage
- Roads or bridges blocked due to natural events
- Homes, buildings, crops, or infrastructure damaged
- Power outages caused by severe weather
- School closures or transportation disruption caused by weather
- People displaced or stranded due to natural hazards
- Unusual environmental conditions that may indicate a developing event

IMPORTANT:
Do not require exact disaster keywords.

For example:

"Water has entered several homes in Guwahati"
→ YES

"Roads near the railway station are completely submerged"
→ YES

"Thousands of people are without electricity after strong winds"
→ YES

"Farmers are reporting severe crop damage because there has been no rain"
→ YES

Return NO when the text is unrelated to weather, natural hazards,
environmental disasters, or their real-world impact.

Examples:

"The cricket match was cancelled because of poor performance"
→ NO

"Political leaders discussed the state budget"
→ NO

"A car accident blocked the highway"
→ NO

"The company reported higher profits this quarter"
→ NO

If the text contains a possible real-world weather or disaster signal,
prefer YES because later stages of the system will classify and verify it.

Answer ONLY with exactly:
YES
or
NO
"""


def is_weather_relevant(text: str) -> bool:
    try:
        response = client.chat.completions.create(
            model="groq/compound-mini",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            max_tokens=5,
            temperature=0
        )

        answer = (
            response.choices[0]
            .message.content
            .strip()
            .upper()
        )

        return answer == "YES"

    except Exception as e:
        print(f"[relevance_filter] Groq API error: {e}")

        # Better to keep the report rather than lose
        # potentially important disaster information
        return True