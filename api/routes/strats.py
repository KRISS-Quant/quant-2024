from fastapi import APIRouter, HTTPException
from ..strats.RSI_basic import wrapper as rsi_wrapper
from ..strats.SMA_basic import wrapper as sma_wrapper
import json
from pathlib import Path

# Get the project root directory
ROOT_DIR = Path(__file__).parent.parent.parent  # This will go up from routes/strats.py to the root
KLINES_PATH = ROOT_DIR / "klines.json"


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
def sma_basic():
    data = {"primary": load_klines()}

    signal, indicator_export = sma_wrapper(data, {"long": 20, "short": 10})

    return {
        "algorithm": "RSI_basic",
        "ohlc_data": {"primary": data},
        "indicators": indicator_export,
        "signal": signal
    }


@router.get("/rsi/basic")
def rsi_basic():
    data = {"primary": load_klines()}

    signal, indicator_export = rsi_wrapper(data, {"low": 30, "high": 70})

    return {
        "algorithm": "RSI_basic",
        "ohlc_data": {"primary": data},
        "indicator": indicator_export,
        "signal": signal
    }
