""" return indicator data frame given data """

from pandas import DataFrame
from finta import TA
from .indicator import get_ohlc

def get_indicator(data: list, parameter: dict = None) -> DataFrame:
    """
    Computes indicator from data
    Args:
        data (list): Data crawled from API provider
        parameter (dict): Stores the parameters for the indicator.
    Returns:
        list: requested indicator in pd.DataFrame format.
    """
    df = get_ohlc(data, volume = False)
    indicator = TA.RSI(df) # RSI / SMA
    return indicator
