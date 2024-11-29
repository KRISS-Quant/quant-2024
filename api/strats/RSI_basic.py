""" return indicator data frame given data """

from pandas import DataFrame
from .indicators import RSI

def into_signal(df: DataFrame, low: float = 30, high: float = 70) -> list:
    """
    Computes signal from data: uppermost layer
    Args:
        df (DataFrame): indicator, in pd.DataFrame format
    Returns:
        signal in pd.DataFrame format.
        0 denotes sell, 1 denotes buy
        // Trade Signal
        [
            {
                'time': int,
                'signal': int
            }
        ]
    """
    signal = []
    for i in range(1, len(df)):
        prev_value = df.iloc[i - 1]
        curr_value = df.iloc[i]
        if prev_value > low > curr_value:
            signal.append({"time": int(df.index[i]), "signal": 1})
        elif prev_value < high < curr_value:
            signal.append({"time": int(df.index[i]), "signal": 0})
    return signal

def wrapper(data: dict, parameter: dict = None) -> tuple:
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
    required_keys = ["high", "low"]
    for required_key in required_keys:
        assert required_key in parameter
    indicator = RSI.get_indicator(data["primary"], parameter)
    signal = into_signal(indicator, parameter["low"], parameter["high"])
    timestamp_list = indicator.index.tolist()
    indicator_list = list(map(list, zip(timestamp_list, indicator.tolist())))
    indicator_export = {
        "RSI": indicator_list
    }
    return (signal, indicator_export)