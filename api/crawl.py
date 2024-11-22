""" Crawling data from API sources """

import requests

TIMEOUT = 10
INTERVAL_MAP = {
    "1m": 60,
    "3m": 180,
    "5m": 300,
    "15m": 900,
    "30m": 1800,
    "1h": 3600,
    "2h": 7200,
    "4h": 14400,
    "6h": 21600,
    "8h": 28800,
    "12h": 43200,
    "1d": 86400,
    "3d": 259200,
    "1w": 604800,
    "1M": 2592000
}
URL_BINANCE = \
    "https://api.binance.com/api/v3/klines?symbol={}&interval={}&startTime={}000&endTime={}000"

def request_data(ticker: str = "BTCUSDT", interval: str = "15m", start: int = 0, end: int = 0):
    """
    Fetches historical candlestick data for a given cryptocurrency ticker from the Binance API.
    Args:
        start (int): The start time in seconds since epoch (UNIX time).
        end (int): The end time in seconds since epoch (UNIX time).
        ticker (str, optional): The cryptocurrency ticker symbol 
            to fetch data for. Defaults to "BTCUSDT".
    Returns:
        list: A list of candlestick data in JSON format.
    """
    response = requests.get(URL_BINANCE.format(ticker, interval, start, end),
                            timeout = TIMEOUT)
    return response.json()

def request_period(ticker: str = "BTCUSDT", interval: str = "15m", start: int = 0, end: int = 0):
    """
    Fetches historical candlestick data for a given cryptocurrency ticker from the Binance API.
    Args:
        start (int): The start time in seconds since epoch (UNIX time).
        end (int): The end time in seconds since epoch (UNIX time).
        ticker (str, optional): The cryptocurrency ticker symbol 
            to fetch data for. Defaults to "BTCUSDT".
    Returns:
        list: A list of candlestick data in JSON format.
    """
    response_concat = []
    while (end - start) / INTERVAL_MAP[interval] > 1000:
        response_concat += request_data(ticker, interval, start,
                                        start + 1000 * INTERVAL_MAP[interval])
        start += 1000 * INTERVAL_MAP[interval]
    response_concat += request_data(ticker, interval, start, end)
    # extra processing is not needed for Binance
    return response_concat
