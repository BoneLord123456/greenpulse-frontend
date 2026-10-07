# GreenPulse Risk Engine

## Overview

The GreenPulse Risk Engine converts environmental conditions into a **Risk Factor score from 0 to 100**.

- **0** = very low environmental risk
- **100** = critical environmental risk
- Higher score = worse environmental conditions

The final score combines:

1. **Current environmental conditions: 80%**
2. **ML pollution forecast: 20%**

The ML forecast currently uses **Station 1**, and the same Station 1 prediction is applied to all locations.

---

## Final Formula

```text
Overall Risk =
    Current Conditions × 0.80
    + ML Forecast × 0.20
```

If the ML backend is unavailable, `MLService` uses the configured demo ML prediction so the dashboard continues working.

---

# 1. Current Conditions

Current conditions make up **80%** of the final score.

| Component | Weight |
|---|---:|
| Air Quality | 40% |
| Weather | 25% |
| Soil | 20% |
| Noise | 15% |
| **Total** | **100%** |

```text
Current Risk =
    Air Risk × 0.40
    + Weather Risk × 0.25
    + Soil Risk × 0.20
    + Noise Risk × 0.15
```

Missing components are excluded and the remaining weights are normalized.

---

# 2. Air Quality Risk

Uses:

- PM2.5
- PM10

Weights:

| Parameter | Weight |
|---|---:|
| PM2.5 | 70% |
| PM10 | 30% |

Current scaling:

```text
PM2.5 Risk = clamp((PM2.5 / 75) × 100)
PM10 Risk  = clamp((PM10 / 150) × 100)
```

The values are clamped to 0–100.

```text
Air Risk =
    PM2.5 Risk × 0.70
    + PM10 Risk × 0.30
```

PM2.5 has the higher weight because fine particulate pollution is given greater importance in the air-risk calculation.

---

# 3. Weather Risk

Uses:

- Temperature
- Humidity

Weights:

| Parameter | Weight |
|---|---:|
| Temperature | 40% |
| Humidity | 60% |

## Temperature

Preferred range:

```text
18°C to 28°C
```

Inside this range:

```text
Temperature Risk = 0
```

Outside it:

```text
Below 18°C:
Temperature Risk = (18 - temperature) × 5

Above 28°C:
Temperature Risk = (temperature - 28) × 5
```

The result is clamped to 0–100.

## Humidity

Risk starts above 60%:

```text
Humidity Risk =
    ((humidity - 60) / 40) × 100
```

Clamped to 0–100.

Therefore:

```text
Humidity ≤ 60% → 0 risk
Humidity = 100% → 100 risk
```

Combined:

```text
Weather Risk =
    Temperature Risk × 0.40
    + Humidity Risk × 0.60
```

---

# 4. Soil Risk

Uses the existing **soil moisture score**, represented on a 0–100 scale.

Because a higher soil score represents better conditions, it is inverted:

```text
Soil Risk = 100 - Soil Score
```

Examples:

```text
Soil Score 90 → Risk 10
Soil Score 50 → Risk 50
Soil Score 10 → Risk 90
```

Missing soil data is ignored.

---

# 5. Noise Risk

Uses the existing **sound score**, represented on a 0–100 scale.

```text
Noise Risk = 100 - Sound Score
```

Examples:

```text
Sound Score 90 → Risk 10
Sound Score 50 → Risk 50
Sound Score 10 → Risk 90
```

Missing noise data is ignored.

---

# 6. ML Pollution Forecast

The ML forecast contributes **20%** of the final Risk Factor.

The real trained model is accessed through the GreenPulse ML backend when available.

## Station

```text
Station 1
```

The same Station 1 prediction is used for every GreenPulse location. Separate ML inference per location is not currently implemented.

## Predicted parameters

### PM2.5

```text
PM2.5_target_1h
PM2.5_target_2h
PM2.5_target_3h
PM2.5_target_4h
```

### PM10

```text
PM10_target_1h
PM10_target_2h
PM10_target_3h
PM10_target_4h
PM10_target_5h
```

The available predictions for each pollutant are averaged.

## ML weights

| Parameter | Weight |
|---|---:|
| Predicted PM2.5 | 70% |
| Predicted PM10 | 30% |

Scaling:

```text
Predicted PM2.5 Risk =
    clamp((average predicted PM2.5 / 75) × 100)

Predicted PM10 Risk =
    clamp((average predicted PM10 / 150) × 100)
```

Then:

```text
ML Risk =
    Predicted PM2.5 Risk × 0.70
    + Predicted PM10 Risk × 0.30
```

---

# 7. Risk Levels

| Score | Risk Level |
|---:|---|
| 0–19.9 | Very Low |
| 20–39.9 | Low |
| 40–59.9 | Moderate |
| 60–79.9 | High |
| 80–100 | Critical |

---

# 8. What Is NOT Included

These are intentionally **not part of the Risk Factor calculation**:

- Crowd footprint
- Crowd index
- Map footprint/visualization data
- EMS score

The crowd footprint remains a separate dashboard feature.

---

# 9. Demo / Backend Fallback

Normal operation:

```text
GreenPulse
    ↓
ML Service
    ↓
/api/ml-predictions
    ↓
ML Backend
    ↓
Station 1 trained model
    ↓
Real predictions
```

If the ML backend is unavailable:

```text
GreenPulse
    ↓
ML Service
    ↓
Backend unavailable
    ↓
Demo ML prediction
```

The dashboard therefore remains functional.

ML status becomes either:

```text
Real ML Backend Connected
```

or:

```text
Demo ML Data
```

---

# 10. Data Flow

```text
                 CURRENT CONDITIONS
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     Air Quality       Weather       Soil / Noise
     PM2.5 + PM10    Temp + Humidity
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                  Current Risk
                       80%
                         │
                         +
                         │
                    ML Risk
                    Station 1
                       20%
                         ↓
                  Overall Risk
                     0–100
                         ↓
              Risk Level / Dashboard
```

---

# 11. Important Implementation Notes

### Score direction

```text
Higher Risk Factor = Worse
Lower Risk Factor  = Better
```

### Missing data

Missing current-condition parameters are not automatically treated as extreme risk. Available components are weighted and normalized.

### ML fallback

Demo ML values are used only when the real ML backend cannot be reached or returns an invalid response.

### Current location

`Current` is intended to use live environmental data from the GreenPulse backend. Its current-condition values are processed by the same Risk Engine as the other locations.

---

# 12. Main Risk Engine Functions

```javascript
RiskEngine.calculateOverallRisk()
RiskEngine.calculateAirRisk()
RiskEngine.calculateWeatherRisk()
RiskEngine.calculateSoilRisk()
RiskEngine.calculateNoiseRisk()
RiskEngine.calculateMLRisk()
```

Main entry point:

```javascript
RiskEngine.calculateOverallRisk(data, mlPredictions)
```

Returns:

```javascript
{
    score: Number,
    level: String,
    components: {
        air: Number | null,
        weather: Number | null,
        soil: Number | null,
        noise: Number | null,
        ml: Number | null
    }
}
```

---

## Summary

GreenPulse combines **current environmental conditions** with a **future pollution forecast**:

```text
                80%
       Current Conditions
       ┌─────────────────┐
       │ Air       40%   │
       │ Weather   25%   │
       │ Soil      20%   │
       │ Noise     15%   │
       └─────────────────┘
                +
                20%
          ML Forecast
       ┌─────────────────┐
       │ PM2.5     70%   │
       │ PM10      30%   │
       └─────────────────┘
                ↓
         RISK FACTOR
            0–100
                ↓
   Very Low → Low → Moderate
             → High → Critical
```
