""" return indicator data frame given data """

from pandas import DataFrame
from .indicators import SMA

def into_signal(df: DataFrame, long: int = 20) -> list:
    """
    Computes signal from data: uppermost layer
    Args:
        df (DataFrame): indicator, in pd.DataFrame format
    Returns:
        signal in pd.DataFrame format.
        0 denotes sell, 1 denotes buy
    """
    signal = []
    for i in range(long, len(df)):
        prev_value = df.iloc[i - 1]
        curr_value = df.iloc[i]
        if prev_value < 0 < curr_value:
            signal.append({"time": int(df.index[i]), "signal": 1})
        elif prev_value > 0 > curr_value:
            signal.append({"time": int(df.index[i]), "signal": 0})
    return signal

def wrapper(data: dict, parameter: dict = None) -> list:
    """
    Computes signal from data: uppermost layer
    Args:
        data (dict): Data crawled from API provider, potentially including multiple tickers
        parameter (dict): Stores the parameters for the indicator.
    Returns:
        signal in list format.
    """
    required_tickers = ["primary"]
    for required_ticker in required_tickers:
        assert required_ticker in data
    required_keys = ["long", "short"]
    for required_key in required_keys:
        assert required_key in parameter
    indicator_1 = SMA.get_indicator(data["primary"], {"period": parameter["long"]})
    indicator_2 = SMA.get_indicator(data["primary"], {"period": parameter["short"]})
    indicator = indicator_2 - indicator_1
    signal = into_signal(indicator, parameter["long"])
    return signal
