""" Returns trading signal from indicator data """

import pandas as pd

def ohlc_ticker(data: list, volume = True) -> dict:
    """ converts data (standard for chart) to ohlc format """
    ohlc = {
        "timestamp": data[0] // 1000, # into UNIX time
        "open": float(data[1]),
        "high": float(data[2]),
        "low": float(data[3]),
        "close": float(data[4])
    }
    if volume:
        ohlc["volume"] = float(data[5])
    return ohlc

def get_ohlc(data: list, volume = True) -> pd.DataFrame:
    """ converts data (standard for chart) to DataFrame """
    data_formatted = map(ohlc_ticker, data, [volume for _ in range(len(data))])
    df = pd.DataFrame(data_formatted)
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit = "s")
    df.set_index("timestamp", inplace = True)
    return df
