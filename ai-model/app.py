from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

model = joblib.load("model.pkl")

class InputData(BaseModel):
    rainfall: float
    humidity: float
    temperature: float
    river_level: float

@app.post("/predict")
def predict(data: InputData):
    values = [[
        data.rainfall,
        data.humidity,
        data.temperature,
        data.river_level
    ]]

    pred = model.predict(values)[0]
    prob = model.predict_proba(values)[0][1]

    return {
        "prediction": int(pred),
        "risk": round(prob * 100, 2)
    }
