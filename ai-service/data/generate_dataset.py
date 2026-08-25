import json
import random

templates = {
    "flood": [
        "Heavy waterlogging near {city} railway station, roads submerged",
        "{city} area flooded after continuous rain, water entered homes",
        "Streets in {city} underwater, vehicles stranded",
        "Flood situation worsens in {city}, rescue teams deployed",
        "Low lying areas in {city} inundated after heavy downpour",
        "River overflowing near {city}, villages evacuated",
        "Several colonies in {city} flooded, people shifted to relief camps",
        "Rain conditions in {city}: heavy intensity rain, temperature {temp}°C",
        "Flood alert issued for {city}, water level rising rapidly",
        "Rain conditions in {city}: very heavy rain, roads flooded"
    ],
    "rainfall": [
        "Light drizzle continuing since morning in {city}",
        "Moderate rainfall reported across {city} today",
        "Steady rain falling in {city} since last night",
        "Rainfall recorded in {city} district today",
        "Intermittent showers reported in {city}",
        "Light to moderate rain expected in {city} today",
        "Rain conditions in {city}: light rain, temperature {temp}°C",
        "Rain conditions in {city}: moderate rain, temperature {temp}°C",
        "Rain conditions in {city}: drizzle, temperature {temp}°C, wind 2.5 m/s",
        "Rain conditions in {city}: light intensity rain, temperature {temp}°C"
    ],
    "thunderstorm": [
        "Loud thunder and lightning strikes reported in {city}",
        "Severe thunderstorm warning issued for {city}",
        "Lightning strike damaged property in {city}",
        "Heavy thunderstorm accompanied by strong winds in {city}",
        "Thunderstorm disrupts power supply in {city}",
        "Lightning kills cattle near {city} village",
        "Thunderstorm conditions in {city}: thunder and lightning, temperature {temp}°C",
        "Rain conditions in {city}: thunderstorm, wind {temp} m/s"
    ],
    "heatwave": [
        "Unbearable heat, {temp} degrees in {city} today",
        "Heatwave conditions persist in {city}, schools advised caution",
        "Scorching heat in {city}, residents advised to stay indoors",
        "Temperature soars to {temp} degrees in {city}",
        "Heatwave alert issued for {city} district",
        "Heat stroke cases reported in {city} hospitals",
        "People suffering due to extreme heat in {city}",
        "Clear conditions in {city}: clear sky, temperature {temp}°C, wind 1.2 m/s",
        "Clear sky in {city}, temperature {temp}°C, extremely hot conditions",
        "Clouds conditions in {city}: few clouds, temperature {temp}°C, heatwave warning"
    ],
    "fog": [
        "Visibility near zero due to dense fog on {city} highway",
        "Thick fog covers {city} this morning, flights delayed",
        "Fog reduces visibility in {city}, traffic moving slowly",
        "Dense fog warning issued for {city} region",
        "Train delayed due to low visibility caused by fog near {city}",
        "Schools closed in {city} due to dense fog conditions",
        "Clouds conditions in {city}: overcast clouds, temperature {temp}°C, wind 3.1 m/s",
        "Clouds conditions in {city}: broken clouds, temperature {temp}°C, wind 2.8 m/s",
        "Clouds conditions in {city}: scattered clouds, temperature {temp}°C",
        "Mist conditions in {city}: mist and fog, temperature {temp}°C"
    ],
    "dust_storm": [
        "Dust storm hit {city}, sky turned orange",
        "Strong dust storm reported in {city}, visibility reduced",
        "{city} residents advised to stay indoors due to dust storm",
        "Dust storm uproots trees in {city}",
        "Power outage in {city} due to dust storm",
        "Yellow sky over {city} as massive dust storm hits",
        "Dust conditions in {city}: sand and dust, temperature {temp}°C",
        "Haze conditions in {city}: dust haze, temperature {temp}°C, wind {temp} m/s"
    ],
    "strong_wind": [
        "Strong winds uprooted trees near {city} market area",
        "High speed winds reported in {city}, power lines damaged",
        "Gusty winds disrupt normal life in {city}",
        "Strong winds damage houses in {city}",
        "Wind storm causes destruction in {city} district",
        "Roof blown off school building in {city} due to strong winds",
        "Clouds conditions in {city}: overcast clouds, temperature {temp}°C, wind 12.5 m/s",
        "Clear conditions in {city}: clear sky, temperature {temp}°C, wind 15.3 m/s",
        "Strong wind advisory for {city}, wind speed {temp} km/h"
    ],
    "other": [
        "Clear conditions in {city}: clear sky, temperature {temp}°C, wind 1.5 m/s",
        "Clear sky over {city}, pleasant weather today",
        "Clouds conditions in {city}: few clouds, temperature {temp}°C, wind 2.1 m/s",
        "Normal weather conditions in {city} today",
        "Partly cloudy skies in {city}, no major weather event",
        "Weather update for {city}: mild conditions expected today"
    ],
    "wildfire": [
    "Forest fire breaks out near {city}",
    "Wildfire reported in {city} forest area, fire brigades deployed",
    "Fire conditions in {city}: wildfire spreading, residents evacuated",
    "Massive forest fire near {city}, smoke visible from miles",
    "Wildfire destroys farmland near {city} village",
    "Forest department fights blaze near {city} reserve",
     "Wildfire reported near {city} forest area",
    "Forest fire breaks out near {city}",
    "Fire conditions in {city}: wildfire, strong winds",
],
}

cities = [
    "Durg", "Raipur", "Bilaspur", "Bhilai", "Nagpur",
    "Korba", "Jagdalpur", "Rajnandgaon", "Ambikapur",
    "Delhi", "Mumbai", "Chennai", "Kolkata", "Hyderabad",
    "Bhopal", "Patna", "Ranchi", "Jaipur", "Lucknow",
    "Dehradun", "Chandigarh", "Srinagar", "Kochi", "Surat"
]
temps = [22, 25, 28, 30, 32, 35, 38, 42, 44, 45, 46, 47, 48]

def generate_dataset(rows_per_category=80):
    data = []
    for label, sentence_templates in templates.items():
        for _ in range(rows_per_category):
            template = random.choice(sentence_templates)
            text = (
                template
                .replace("{city}", random.choice(cities))
                .replace("{temp}", str(random.choice(temps)))
            )
            data.append({"text": text, "label": label})

    random.shuffle(data)
    return data

if __name__ == "__main__":
    dataset = generate_dataset(rows_per_category=80)
    with open("data/training_data.json", "w") as f:
        json.dump(dataset, f, indent=2)
    print(f"Generated {len(dataset)} rows -> data/training_data.json")