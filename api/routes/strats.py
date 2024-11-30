from fastapi import APIRouter, HTTPException
from ..strats.RSI_basic import wrapper as rsi_wrapper
from ..strats.SMA_basic import wrapper as sma_wrapper
from ..crawl import request_period
import json
from pathlib import Path
from pydantic import BaseModel

# Get the project root directory
ROOT_DIR = Path(__file__).parent.parent.parent  # This will go up from routes/strats.py to the root
KLINES_PATH = ROOT_DIR / "klines.json"

class AlgorithmInput(BaseModel):
    algorithm: str
    ticker: dict
    start_time: int
    end_time: int
    interval: str
    parameter: dict

def load_klines():
    try:
        with open(KLINES_PATH, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="klines.json not found"
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Invalid JSON format in klines.json"
        )


router = APIRouter(
    prefix="/api/strats",
    tags=["strategies"]
)


@router.get("/sma/basic")
async def sma_basic(): #data: AlgorithmInput):
    # ticker = data["ticker"]["primary"]
    # time_start = data["start_time"]
    # time_end = data["end_time"]
    # interval = data["interval"]
    # ohlc_data = request_period(ticker, interval, time_start, time_end)
    data = {
        "algorithm": "SMA Golden Cross Strategy",
        "parameter": {
            "long": 20,
            "short": 10
        }
    }
    ohlc_data = load_klines()
    ticker_data = {
        "primary": ohlc_data
    }
    parameter = data["parameter"]
    signal, indicators = sma_wrapper(ticker_data, parameter)
    return {
        "algorithm": data["algorithm"],
        "ohlc_data": ticker_data,
        "indicators": indicators,
        "signal": signal
    }

@router.get("/rsi/basic")
async def rsi_basic(): #data: AlgorithmInput):
    # ticker = data["ticker"]["primary"]
    # time_start = data["start_time"]
    # time_end = data["end_time"]
    # interval = data["interval"]
    # ohlc_data = request_period(ticker, interval, time_start, time_end)
    data = {
        "algorithm": "RSI Strategy",
        "parameter": {
            "high": 70,
            "low": 30
        }
    }
    ohlc_data = load_klines()
    ticker_data = {
        "primary": ohlc_data
    }
    parameter = data["parameter"]
    signal, indicators = rsi_wrapper(ticker_data, parameter)
    return {
        "algorithm": data["algorithm"],
        "ohlc_data": ticker_data,
        "indicators": indicators,
        "signal": signal
        }
