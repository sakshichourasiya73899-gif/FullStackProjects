# # from groq import Groq
# # import os

# # client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# # def is_weather_relevant(text: str) -> bool:
# #     try:
# #         response = client.chat.completions.create(
# #             model="groq/compound-mini",
# #             messages=[
# #                 {
# #                     "role": "system",
# #                     "content": "You are a filter for a weather disaster monitoring system in India. Answer only YES or NO."
# #                 },
# #                 {
# #                     "role": "user",
# #                     "content": f"""Is this text about weather, natural disaster, or its impact on people/infrastructure in India?
                    
# # Text: {text}

# # Answer YES if it mentions: flood, rain, storm, heatwave, drought, fog, cyclone, landslide, wildfire, earthquake, cold wave, snowfall, or their effects on citizens (school closed, road blocked, people displaced, crop damage, power outage etc.)

# # Answer NO if it's about: politics, crime, sports, business, entertainment, accidents unrelated to weather.

# # Answer only YES or NO."""
# #                 }
# #             ],
# #             max_tokens=5,
# #             temperature=0
# #         )
        
# #         answer = response.choices[0].message.content.strip().upper()
# #         return answer == "YES"
# #     except Exception as e:
# #         print(f"[relevance_filter] Groq API error: {e}")
# #         return True  # error pe default include karo

# # from groq import Groq
# # import os

# # client = Groq(
# #     api_key=os.environ.get("GROQ_API_KEY")
# # )

# # SYSTEM_PROMPT = """
# # You are the first-stage relevance filter for an AI-powered
# # National Weather and Disaster Ground Intelligence Platform in India.

# # Your job is to determine whether a text report contains potentially
# # useful real-world information about:

# # 1. A weather event
# # 2. A natural hazard
# # 3. The impact of such an event on people, infrastructure, environment,
# #    transportation, agriculture, or daily life
# # 4. A possible emerging disaster situation

# # Answer ONLY with YES or NO.

# # Return YES when the text describes or provides evidence of:

# # - Heavy rain or extreme rainfall
# # - Flooding or waterlogging
# # - Cyclones or severe storms
# # - Strong winds or thunderstorms
# # - Heatwaves or extreme temperatures
# # - Drought or water scarcity
# # - Fog affecting visibility or transportation
# # - Landslides
# # - Wildfires or forest fires
# # - Earthquakes
# # - Snowfall, avalanches, or cold waves
# # - Lightning incidents
# # - Weather-related damage
# # - Roads or bridges blocked due to natural events
# # - Homes, buildings, crops, or infrastructure damaged
# # - Power outages caused by severe weather
# # - School closures or transportation disruption caused by weather
# # - People displaced or stranded due to natural hazards
# # - Unusual environmental conditions that may indicate a developing event

# # IMPORTANT:
# # Do not require exact disaster keywords.

# # For example:

# # "Water has entered several homes in Guwahati"
# # → YES

# # "Roads near the railway station are completely submerged"
# # → YES

# # "Thousands of people are without electricity after strong winds"
# # → YES

# # "Farmers are reporting severe crop damage because there has been no rain"
# # → YES

# # Return NO when the text is unrelated to weather, natural hazards,
# # environmental disasters, or their real-world impact.

# # Examples:

# # "The cricket match was cancelled because of poor performance"
# # → NO

# # "Political leaders discussed the state budget"
# # → NO

# # "A car accident blocked the highway"
# # → NO

# # "The company reported higher profits this quarter"
# # → NO

# # If the text contains a possible real-world weather or disaster signal,
# # prefer YES because later stages of the system will classify and verify it.

# # Answer ONLY with exactly:
# # YES
# # or
# # NO
# # """


# # def is_weather_relevant(text: str) -> bool:
# #     try:
# #         response = client.chat.completions.create(
# #             model="groq/compound-mini",
# #             messages=[
# #                 {
# #                     "role": "system",
# #                     "content": SYSTEM_PROMPT
# #                 },
# #                 {
# #                     "role": "user",
# #                     "content": text
# #                 }
# #             ],
# #             max_tokens=5,
# #             temperature=0
# #         )

# #         answer = (
# #             response.choices[0]
# #             .message.content
# #             .strip()
# #             .upper()
# #         )

# #         return answer == "YES"

# #     except Exception as e:
# #         print(f"[relevance_filter] Groq API error: {e}")

# #         # Better to keep the report rather than lose
# #         # potentially important disaster information
# #         return True



# import os

# # Multiple Groq keys — ek limit ho toh dusra use karo
# GROQ_KEYS = [
#     os.environ.get("GROQ_API_KEY_1"),
#     os.environ.get("GROQ_API_KEY_2"),
#     os.environ.get("GROQ_API_KEY_3"),
#     os.environ.get("GROQ_API_KEY"),  # backward compatibility
# ]
# GROQ_KEYS = [k for k in GROQ_KEYS if k]  # None values hata do

# current_key_index = 0

# def get_groq_client():
#     from groq import Groq
#     global current_key_index
#     if not GROQ_KEYS:
#         return None
#     return Groq(api_key=GROQ_KEYS[current_key_index % len(GROQ_KEYS)])

# def rotate_key():
#     global current_key_index
#     current_key_index += 1
#     print(f"[Groq] Rotating to key index {current_key_index % max(len(GROQ_KEYS), 1)}")

# # Fast keyword check — Groq call bachata hai (majority cases yahi handle ho jaate hain)
# DEFINITE_WEATHER = [
#     'flood', 'rain', 'storm', 'cyclone', 'drought', 'heatwave',
#     'earthquake', 'landslide', 'wildfire', 'forest fire', 'cold wave',
#     'snowfall', 'waterlogging', 'fog', 'dust storm', 'lightning',
#     'thunder', 'evacuation', 'relief camp', 'rescue', 'displaced',
#     'imd', 'submerged', 'inundated', 'cloudburst', 'avalanche',
#     'water entered', 'road blocked', 'power outage', 'crop damage',
#     'school closed', 'stranded', 'rooftop', 'relief', 'flooding'
# ]

# DEFINITE_NOT_WEATHER = [
#     'stock market', 'sensex', 'nifty', 'ipo', 'bollywood',
#     'cricket score', 'ipl match', 'box office', 'election result',
#     'murder case', 'court verdict', 'startup funding', 'quarterly results'
# ]

# SYSTEM_PROMPT = """
#  You are the first-stage relevance filter for an AI-powered
# National Weather and Disaster Ground Intelligence Platform in India.

# Your job is to determine whether a text report contains potentially
#  useful real-world information about:

# 1. A weather event
#  2. A natural hazard
# 3. The impact of such an event on people, infrastructure, environment,
#    transportation, agriculture, or daily life
#  4. A possible emerging disaster situation

# Answer ONLY with YES or NO.
#  Return YES when the text describes or provides evidence of:

# - Heavy rain or extreme rainfall
# - Flooding or waterlogging
# - Cyclones or severe storms
# - Strong winds or thunderstorms
# - Heatwaves or extreme temperatures
# - Drought or water scarcity
# - Fog affecting visibility or transportation
# - Landslides
# - Wildfires or forest fires
# - Earthquakes
# - Snowfall, avalanches, or cold waves
# - Lightning incidents
# - Weather-related damage
# - Roads or bridges blocked due to natural events
#  - Homes, buildings, crops, or infrastructure damaged
#  - Power outages caused by severe weather
#  - School closures or transportation disruption caused by weather
#  - People displaced or stranded due to natural hazards
# - Unusual environmental conditions that may indicate a developing event

#  IMPORTANT:
#  Do not require exact disaster keywords.

#  For example:

#  "Water has entered several homes in Guwahati"
# → YES
#  "Roads near the railway station are completely submerged"
#  → YES

#  "Thousands of people are without electricity after strong winds"
#  → YES

# "Farmers are reporting severe crop damage because there has been no rain"
#  → YES

# Return NO when the text is unrelated to weather, natural hazards,
#  environmental disasters, or their real-world impact.

# Examples:

#  "The cricket match was cancelled because of poor performance"
#  → NO

#  "Political leaders discussed the state budget"
#  → NO

# "A car accident blocked the highway"
#  → NO

# "The company reported higher profits this quarter"
#  → NO

# If the text contains a possible real-world weather or disaster signal,
# prefer YES because later stages of the system will classify and verify it.

#  Answer ONLY with exactly:
# YES
#  or
#  NO
# """

# def is_weather_relevant(text: str) -> bool:
#     text_lower = text.lower()

#     # Definite weather — Groq call ki zarurat nahi
#     if any(kw in text_lower for kw in DEFINITE_WEATHER):
#         return True

#     # Definite not weather — Groq call ki zarurat nahi
#     if any(kw in text_lower for kw in DEFINITE_NOT_WEATHER):
#         return False

#     # Unclear cases — Groq use karo
#     return _groq_classify(text)

# def _groq_classify(text: str) -> bool:
#     if not GROQ_KEYS:
#         return True

#     for attempt in range(len(GROQ_KEYS)):
#         try:
#             client = get_groq_client()
#             response = client.chat.completions.create(
#                 model="llama3-8b-8192",  # compound-mini exist nahi karta, ye use karo
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": "You filter content for a weather disaster monitoring system in India. Answer only YES or NO. Prefer YES when unsure — missing a disaster is worse than a false positive."
#                     },
#                     {
#                         "role": "user",
#                         "content": f"Is this about weather, natural disaster, or impact on people in India?\n\n{text[:400]}\n\nYES or NO:"
#                     }
#                 ],
#                 max_tokens=3,
#                 temperature=0
#             )
#             answer = response.choices[0].message.content.strip().upper()
#             return "YES" in answer
#         except Exception as e:
#             error_str = str(e)
#             if "rate_limit" in error_str or "429" in error_str or "quota" in error_str:
#                 rotate_key()
#                 continue
#             print(f"[Groq relevance] Error: {e}")
#             return True

#     return True  # all keys exhausted — include by default


import os

GROQ_KEYS = [
    os.environ.get("GROQ_API_KEY_1"),
    os.environ.get("GROQ_API_KEY_2"),
    os.environ.get("GROQ_API_KEY_3"),
    os.environ.get("GROQ_API_KEY"),
]
GROQ_KEYS = [k for k in GROQ_KEYS if k]

MODEL = "qwen/qwen3.6-27b"
current_key_index = 0

def get_groq_client():
    from groq import Groq
    global current_key_index
    if not GROQ_KEYS:
        return None
    return Groq(api_key=GROQ_KEYS[current_key_index % len(GROQ_KEYS)])

def rotate_key():
    global current_key_index
    current_key_index += 1
    print(f"[Groq] Rotating to key index {current_key_index % max(len(GROQ_KEYS), 1)}")

DEFINITE_WEATHER = [
    'flood', 'rain', 'storm', 'cyclone', 'drought', 'heatwave',
    'earthquake', 'landslide', 'wildfire', 'forest fire', 'cold wave',
    'snowfall', 'waterlogging', 'fog', 'dust storm', 'lightning',
    'thunder', 'evacuation', 'relief camp', 'rescue', 'displaced',
    'imd', 'submerged', 'inundated', 'cloudburst', 'avalanche',
    'water entered', 'road blocked', 'power outage', 'crop damage',
    'school closed', 'stranded', 'rooftop', 'flooding', 'cyclonic',
    'heat stroke', 'cold snap', 'frost', 'hailstorm', 'sandstorm',
    'squall', 'tornado', 'tsunami', 'tremor', 'seismic', 'drought',
    'water shortage', 'river overflow', 'dam overflow', 'river breach',
    'flood', 'flooding', 'waterlogging', 'waterlogged',
    'rainfall', 'heavy rain', 'moderate rain', 'monsoon',
    'thunderstorm', 'lightning strike', 'hailstorm', 'cloudburst',
    'cyclone', 'cyclonic storm', 'storm surge',
    'drought', 'water shortage', 'groundwater',
    'heatwave', 'heat wave', 'heat stroke', 'heat alert',
    'cold wave', 'cold snap', 'frost', 'snowfall', 'avalanche',
    'fog alert', 'dense fog', 'visibility reduced',
    'dust storm', 'sandstorm',
    'wildfire', 'forest fire',
    'earthquake', 'tremor', 'seismic', 'landslide', 'mudslide',
    'imd warning', 'imd alert', 'imd forecast',
    'ndma alert', 'ndrf deployed',
    'river overflow', 'river breach', 'dam overflow',
    'flash flood', 'urban flood',
    'crop damage', 'crop loss', 'agricultural drought',
    'school closed due to', 'relief camp', 'rescue operation weather',
    'weather warning', 'red alert', 'orange alert', 'yellow alert'
]

DEFINITE_NOT_WEATHER = [
    'stock market', 'sensex', 'nifty', 'ipo', 'bollywood',
    'cricket score', 'ipl match', 'box office', 'election result',
    'murder case', 'court verdict', 'startup funding', 'quarterly results',
    'share price', 'celebrity', 'film release','water supply cut', 'dry spell', 'water scarcity',
    'water shortage', 'drought', 'crop loss', 'crop damage',
    'hailstorm', 'hail', 'cold wave', 'heat stroke',
    # Weather-related impacts and emergencies

'road blocked',
'roads blocked',
'highway blocked',
'bridge damaged',
'bridge washed away',
'roads washed away',

'traffic disrupted',
'traffic disruption',
'traffic jam due to flooding',
'transport disrupted',
'transport disruption',
'public transport disrupted',

'power outage',
'power cut',
'electricity outage',
'electricity disruption',
'power lines damaged',
'electricity poles damaged',

'houses damaged',
'homes damaged',
'homes flooded',
'houses flooded',
'water entering homes',
'buildings damaged',
'property damage',
'infrastructure damage',

'people displaced',
'families displaced',
'residents evacuated',
'people evacuated',
'evacuation underway',
'evacuation ordered',

'rescue operation',
'rescue operations',
'search and rescue',
'emergency response',
'disaster response',
'rescue teams deployed',

'relief camps',
'temporary shelters',
'emergency shelters',
'people moved to shelters',

'schools closed',
'colleges closed',
'offices closed',
'government offices closed',

'flight cancelled',
'flights cancelled',
'flight delayed',
'airport operations affected',

'train delayed',
'trains delayed',
'train services disrupted',
'railway services disrupted',

'visibility disruption',
'poor visibility affecting traffic',

'communication disrupted',
'mobile network disrupted',
'internet services disrupted',

'water supply disrupted',
'water supply cut',
'drinking water shortage',

'emergency declared',
'weather emergency',
'disaster emergency',
'emergency situation',

'disaster alert',
'weather alert',
'evacuation alert',
'warning issued',
'red alert',
'orange alert',
'severe weather warning',

'authorities issued an alert',
'authorities warned',
'emergency teams deployed',

'citizens advised to stay indoors',
'people advised to stay indoors',

'casualties reported',
'injuries reported',
'people injured',
'deaths reported',

'crop damage',
'crop loss',
'agricultural damage',
'livestock affected',
'River water level',
 'stock market', 'sensex', 'nifty', 'share price', 'ipo',
    'bollywood', 'box office', 'film review',
    'cricket score', 'ipl', 'world cup cricket',
    'election result', 'exit poll', 'political party',
    'murder', 'rape case', 'arrested', 'court verdict',
    'startup funding', 'quarterly results', 'revenue growth',
    'scholarship exam', 'admission process',
    'recipe', 'fashion week', 'beauty tips',
    'horoscope', 'zodiac sign',
    'road accident', 'train derailment', 'plane crash'

]

def is_weather_relevant(text: str) -> bool:
    text_lower = text.lower()

    if any(kw in text_lower for kw in DEFINITE_WEATHER):
        return True

    if any(kw in text_lower for kw in DEFINITE_NOT_WEATHER):
        return False

    return _groq_classify(text)

def _groq_classify(text: str) -> bool:
    if not GROQ_KEYS:
        return True

    for attempt in range(len(GROQ_KEYS)):
        try:
            client = get_groq_client()
            response = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": """You are a strict filter for a weather and natural disaster monitoring system in India.
Answer YES only if the text is DIRECTLY about:
- Weather events (rain, flood, drought, storm, heatwave, fog, cyclone, cold wave, etc.)
- Natural disasters (earthquake, landslide, wildfire, tsunami)
- Direct impact of weather on people (school closed due to flood, crops damaged by hail, etc.)

Answer NO if the text is about:
- Politics, elections, government policies (even if weather is mentioned as context)
- Crime, accidents, legal cases
- Business, economy, stocks
- Sports, entertainment, celebrity news
- General news where weather is not the MAIN topic

Be STRICT. When in doubt, answer NO."""
                    },
                    {
                        "role": "user",
                        "content": f"Is this DIRECTLY about weather or natural disaster?\n\n{text[:300]}\n\nYES or NO:"
                    }
                ],
                max_tokens=3,
                temperature=0
            )
            answer = response.choices[0].message.content.strip().upper()
            return answer.startswith("YES")
        except Exception as e:
            error_str = str(e)
            if "rate_limit" in error_str or "429" in error_str:
                rotate_key()
                continue
            return True

    return True