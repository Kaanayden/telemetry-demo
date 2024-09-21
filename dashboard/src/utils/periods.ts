export const validPeriods = ['1m', '5m', '15m', '1h'];

export const periodToQuery: { [key: string]: string } = {
    '1m': 'toStartOfMinute',
    '5m': 'toStartOfFiveMinutes',
    '15m': 'toStartOfFifteenMinutes',
    '1h': 'toStartOfHour'
};