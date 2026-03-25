import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("flood_data.csv")

X = data[["rainfall", "humidity", "temperature", "river_level"]]
y = data["flood"]

model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained")
