import json
import random

templates = {
    "flood": [
        "Water entered our house in {city}, everything is ruined",
        "My children could not go to school today, waist deep water on roads in {city}",
        "No electricity for 3 days in {city} ward, floodwater inside homes",
        "Ambulance cannot reach {locality} in {city}, road blocked by water",
        "200 families spent night on rooftop in {city}, river overflowed",
        "My shop in {city} market completely submerged, 10 years of savings gone",
        "Government school in {city} converted to relief camp, 500 people sheltered",
        "Bridge collapsed near {city}, village completely cut off",
        "Hospital ground floor flooded in {city}, patients being shifted upstairs",
        "Entire crop destroyed outside {city} in floods, farmer has nothing left",
        "{city} railway station platform submerged, trains stopped",
        "Electric pole fell in {city} due to flood, no one coming to fix it",
        "Drainage water entering homes in {city} slum area",
        "Ration shop closed in {city}, people in relief camp going hungry",
        "River embankment breached near {city}, half the village had to evacuate",
        "I was rescued by boat from {city}, house has 4 feet of water",
        "Children missing school in {city} for 2 weeks, school shut due to flooding",
        "Everyone in {city} is on their rooftop, everything below is underwater",
        "We are stranded in {city} for 3 days, proper food not available",
        "Bridge washed away connecting {city} to main road, village cut off",
        "Flash flood in {city} after cloudburst, people caught off guard",
        "Rescue teams deployed in {city} but not enough boats for everyone",
        "River breach near {city} displaced thousands overnight",
        "Relief camps overcrowded in {city}, people sleeping on floors",
        "Roads in {city} completely under water, no vehicles moving"
    ],
    "rainfall": [
        "Raining since morning in {city}, roads are slippery",
        "School opened late today in {city} because of heavy rain",
        "My roof is leaking badly in {city}, too much rain",
        "Cannot find an auto in {city} in this rain, everyone stuck at home",
        "Raining since last night in {city}, could not sleep because of noise",
        "Good rain for crops in {city} today, farmers happy",
        "Power gone in rain in {city}, inverter also finished",
        "Road waterlogged in {city} due to rain, car stuck for an hour",
        "After 3 days of rain {city} has cooled down significantly",
        "Unseasonal rain damaged ripe crops near {city}, farmers in distress",
        "Roads slippery in {city} after overnight rain, two-wheeler riders falling",
        "Market closed early in {city} as heavy rain started suddenly",
        "Crops soaked in {city} fields, farmers worried about quality loss",
        "Power supply disrupted in {city} due to continuous rain since morning",
        "Rain conditions in {city}: light rain, temperature {temp}C",
        "Rain conditions in {city}: moderate rain, temperature {temp}C",
        "IMD predicts heavy rainfall in {city} for next 48 hours",
        "Continuous rain for 3 days in {city}, low lying areas waterlogged",
        "Overnight rainfall in {city} brings relief from heat",
        "Light drizzle continuing since morning in {city}"
    ],
    "thunderstorm": [
        "Very strong lightning struck near {city}, one person injured",
        "Tree fell due to lightning in {city}, road blocked",
        "Children scared in {city} due to lightning flashes, crying",
        "Mobile tower collapsed in {city} in storm, no network",
        "Generator also broke down in {city} due to lightning, hospital in trouble",
        "Farmer was working in field outside {city}, lightning struck, critical in hospital",
        "My roof tin sheet flew away in {city} in the storm",
        "Tractor overturned outside {city} in storm, driver injured",
        "Hailstorm destroyed greenhouse near {city}, farmer lost everything",
        "Lightning struck transformer in {city}, entire area without power",
        "School children stuck in {city} as sudden thunderstorm started",
        "Wedding ceremony disrupted in {city} as storm hit without warning",
        "Five cattle killed by lightning strike near {city} village",
        "Severe thunderstorm warning issued for {city}",
        "Thunder and lightning strikes reported in {city} since evening",
        "Power outage in {city} due to thunderstorm, hospital on backup",
        "Hailstorm accompanies thunderstorm in {city}, cars damaged",
        "Schools closed in {city} due to thunderstorm alert from IMD"
    ],
    "heatwave": [
        "Unbearable heat in {city}, cannot step outside at all",
        "2 people hospitalized in {city} with heat stroke today",
        "School changed timing in {city}, now 7am to 11am only",
        "Cooler and AC both not working in {city}, power also not coming",
        "My brother collapsed in {city} due to heat, in hospital now",
        "Water tank in our neighborhood in {city} empty for 2 days",
        "Cows and buffaloes dying outside {city}, no water available",
        "My grandmother fell sick in {city} due to heat",
        "Impossible to work in fields in {city}, temperature is {temp} degrees",
        "Beggars and homeless people collapsing in {city} due to extreme heat",
        "Ice shortage in {city} markets, people queuing for hours",
        "Construction workers refusing to work after noon in {city}, too hot",
        "Children playing outside in {city} hospitalized with heat exhaustion",
        "Elderly woman died in {city} after prolonged exposure to heat",
        "Water bottles selling at 5x price in {city} due to extreme demand",
        "Temperature soars to {temp} degrees in {city}, heatwave alert issued",
        "Heat stroke cases rising in {city} hospitals, doctors overwhelmed",
        "Schools advised to give water breaks every 30 minutes in {city}",
        "Heatwave conditions persist in {city} for 5th consecutive day",
        "Animals dying of thirst in {city} due to extreme heat and water shortage"
    ],
    "fog": [
        "Could not go to office in {city} this morning, fog so thick could not see anything",
        "Bus service delayed in {city} due to fog, waiting for an hour",
        "School announced in {city}, closed tomorrow due to fog",
        "Truck accident on {city} highway in fog, 2 people dead",
        "Missed my flight from {city} due to fog, ticket wasted",
        "Train 3 hours late in {city} because of fog",
        "Elderly father could not find way home in {city} in fog, got lost",
        "Was cycling in {city}, could not see anything in fog, fell down",
        "Cold wave and fog together making life miserable in {city}",
        "Visibility near zero on {city} expressway, multiple accidents reported",
        "Farmers cannot reach markets in {city} as buses not running due to fog",
        "Children shivering at bus stop in {city}, school not yet closed despite fog",
        "Dense fog warning issued for {city} region by IMD",
        "Thick fog covers {city} this morning, flights delayed at airport",
        "Train delayed due to low visibility caused by fog near {city}"
    ],
    "dust_storm": [
        "Dust storm hit {city}, entire city covered in sand",
        "Eyes shut in dust storm in {city}, cannot go outside",
        "Electric poles fell in {city} in dust storm, complete darkness",
        "My shop goods in {city} market ruined by dust",
        "Roof blown off in {city} slum area in storm, sleeping outside now",
        "Trees and vehicles damaged in {city} in dust storm",
        "Cannot open eyes in {city}, so much dust everywhere",
        "Crops ruined in {city} fields in dust storm",
        "Dust storm hit {city} without warning, people caught in open fields",
        "Respiratory patients in {city} hospital struggling after dust storm",
        "Children returning from school caught in dust storm in {city}",
        "Stalls and temporary structures collapsed in {city} market due to storm",
        "Sandstorm hits {city}, residents asked to shut windows and stay inside",
        "Visibility drops to near zero in {city} due to dust storm",
        "Pre monsoon dust storm hits {city}, sky turned completely orange"
    ],
    "strong_wind": [
        "Tree fell in {city} in strong wind, road is blocked",
        "My roof tin flew away in {city}, what do I do now",
        "Electric wire snapped in {city} in wind, entire neighborhood dark",
        "Auto overturned in {city} in strong wind, driver slightly injured",
        "Window glass broke in {city} due to wind",
        "Market closed in {city}, wind too strong blowing everything away",
        "Standing crops broken in fields outside {city} due to wind",
        "Relief camp tent flew away in {city}, people are in the open",
        "School building roof damaged in {city} due to strong winds",
        "Motorcyclist blown off road in {city} in gusty winds",
        "Construction scaffolding collapsed in {city} injuring 3 workers",
        "Farmer makeshift shelter blown away in {city} fields overnight",
        "High speed winds reported in {city}, power lines damaged",
        "Gusty winds disrupted normal life in {city} all day",
        "Strong wind advisory for {city}, wind speed {temp} km per hour"
    ],
    "wildfire": [
        "Forest fire broke out near {city}, village is being evacuated",
        "Smoke coming into {city} from jungle, eyes burning badly",
        "Our animals ran away from near {city} jungle due to fire fear",
        "Fire brigade has not reached near {city}, 3 hours since fire started",
        "Tribal village near {city} evacuated, fire approaching",
        "Agricultural land also starting to burn near {city} from jungle fire",
        "Cannot control fire near {city} due to water shortage",
        "Pilgrims evacuated from forest route near {city} due to wildfire",
        "Smoke from forest fire near {city} causing breathing problems in town",
        "Wildlife running towards {city} as forest fire spreads rapidly",
        "Fruit orchards near {city} destroyed as fire spreads from jungle",
        "School closed in {city} as smoke from nearby wildfire fills classrooms",
        "Forest fire near {city} spreading fast due to dry conditions and wind",
        "Villagers evacuated near {city} due to approaching wildfire",
        "Fire breaks out in {city} forest, animals fleeing towards roads"
    ],
    "drought": [
        "Well dried up in {city} village, fetching water from 5km away",
        "No rain for a month in {city}, crops are dying",
        "Water tanker came last night in {city}, people fought to get water, shortage is severe",
        "Sold cattle in {city} because there was no water for them",
        "Children not going to school in {city} because they have to fetch water in the morning",
        "Fields have cracked open outside {city}, everything is dried up",
        "River dried up near {city}, fishermen have no livelihood",
        "Government tanker also not coming in {city}, people are thirsty",
        "More than a year without proper rain in {city} district",
        "Farmer selling his land in {city}, drowning in debt due to drought",
        "Children walking 4km daily to fetch water in drought hit {city} village",
        "Hospital reporting rise in malnutrition cases in {city} due to crop failure",
        "Farmers protesting in {city} demanding drought relief from government",
        "Women in {city} spending 6 hours daily fetching water from distant source",
        "Entire hamlet near {city} abandoned as water sources dried up",
        "Wells drying up in {city} villages, situation becoming desperate",
        "Reservoir levels critically low near {city}, water rationing started",
        "IMD declares drought in {city} district after rain deficit exceeds 60 percent",
        "Groundwater level falling rapidly in {city} due to prolonged drought",
        "Drought forces migration from villages near {city}, schools emptying"
    ],
    "cyclone": [
        "Sea water coming towards {city} coast, people running away, NDRF arrived",
        "Fishermen returned to {city}, storm danger high",
        "Power and water both cut in {city} before cyclone hits",
        "My house collapsed in {city} in cyclone, everything finished",
        "Coast guard stopped fishermen from going out from {city}, cyclone on track",
        "School converted to cyclone shelter in {city}, hundreds taking refuge",
        "Trees blocking every road in {city} after cyclone passed",
        "Entire fishing community in {city} lost boats in cyclone",
        "Mobile networks down in {city} after cyclone, no contact with relatives",
        "Tidal surge flooded {city} coastal areas, people on rooftops waiting for rescue",
        "Red alert issued in {city} as cyclone intensifies and moves closer",
        "Coastal villages near {city} completely evacuated before cyclone landfall",
        "Storm surge expected in {city} coastal areas, low lying areas cleared",
        "Cyclone leaves trail of destruction in {city}, damage assessment underway"
    ],
    "cold_wave": [
        "Extremely cold in {city}, hands and feet have gone numb",
        "People in {city} cannot sleep at night, so cold",
        "My children did not go to school today in {city}, no warm clothes",
        "Elderly person died in {city} from cold last night",
        "Homeless people living on footpath in {city} are suffering terribly",
        "Water pipe burst in {city} due to cold, no water supply",
        "Crops died in {city} fields overnight due to frost",
        "School closed in {city}, temperature dropped to {temp} degrees",
        "Old age home in {city} running out of blankets, residents shivering",
        "Homeless man found dead in {city} from cold exposure this morning",
        "Farmers crops destroyed overnight by frost in {city}",
        "Children missing school in {city} as parents fear cold exposure",
        "Cold wave hits {city} for 5th consecutive day, no relief in sight",
        "Night temperature drops below {temp} degrees in {city}, record cold",
        "IMD issues cold wave warning for {city}, residents advised to stay indoors"
    ],
    "other": [
        "Weather is fine in {city} today, nothing unusual",
        "Normal weather in {city} today, nothing to report",
        "Clear sky over {city}, pleasant morning",
        "No weather event today in {city}, all normal",
        "Weather is good in {city} today, no complaints",
        "Partly cloudy but no rain in {city} today",
        "Sunny day in {city}, comfortable temperature of {temp} degrees",
        "Pleasant weather in {city} today, good for outdoor activities",
        "Clear conditions in {city}: clear sky, temperature {temp}C, wind light"
    ]
}

localities = [
    "ward 5", "sector 3", "old city area", "railway colony",
    "civil lines", "slum area", "market area", "residential colony",
    "tribal area", "coastal village", "farming district",
    "low lying area", "riverside colony", "industrial area"
]

cities = [
    "Durg", "Raipur", "Bilaspur", "Bhilai", "Nagpur",
    "Korba", "Jagdalpur", "Rajnandgaon", "Ambikapur",
    "Delhi", "Mumbai", "Chennai", "Kolkata", "Hyderabad",
    "Bhopal", "Patna", "Ranchi", "Jaipur", "Lucknow",
    "Dehradun", "Chandigarh", "Srinagar", "Kochi", "Surat",
    "Pune", "Ahmedabad", "Bengaluru", "Visakhapatnam",
    "Bhubaneswar", "Guwahati", "Imphal", "Agartala",
    "Shimla", "Amritsar", "Varanasi", "Allahabad",
    "Jodhpur", "Bikaner", "Udaipur", "Jaisalmer"
]

temps = [2, 5, 8, 10, 15, 22, 25, 28, 30, 32, 35, 38, 42, 44, 45, 46, 47, 48]

def generate_dataset(rows_per_category=100):
    data = []
    for label, sentence_templates in templates.items():
        for _ in range(rows_per_category):
            template = random.choice(sentence_templates)
            text = (
                template
                .replace("{city}", random.choice(cities))
                .replace("{temp}", str(random.choice(temps)))
                .replace("{locality}", random.choice(localities))
            )
            data.append({"text": text, "label": label})

    random.shuffle(data)
    return data

if __name__ == "__main__":
    dataset = generate_dataset(rows_per_category=100)
    with open("data/training_data.json", "w") as f:
        json.dump(dataset, f, indent=2)
    print(f"Generated {len(dataset)} rows -> data/training_data.json")
    print(f"Categories: {list(templates.keys())}")
    print(f"Total categories: {len(templates)}")