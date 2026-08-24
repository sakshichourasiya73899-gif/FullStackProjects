import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Load dataset
with open("data/training_data.json", "r") as f:
    dataset = json.load(f)

texts = [item["text"] for item in dataset]
labels = [item["label"] for item in dataset]

# Train/test split — 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(
    texts, labels,
    test_size=0.2,
    random_state=42,
    stratify=labels  # ensures equal distribution of all 7 classes
)

# TF-IDF: converts text to numbers (unigrams + bigrams, max 5000 features)
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Train classifier
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# Evaluate
predictions = model.predict(X_test_vec)
print("\n--- Classification Report ---")
print(classification_report(y_test, predictions))

# Save both files — need both to predict later
joblib.dump(vectorizer, "models/vectorizer.pkl")
joblib.dump(model, "models/classifier.pkl")
print("Saved -> models/vectorizer.pkl")
print("Saved -> models/classifier.pkl")