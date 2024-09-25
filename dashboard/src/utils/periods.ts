
export const sinceToPeriod: { [key: string]: string } = {
    '1': 'toStartOfFiveMinutes',
    '3': 'toStartOfTenMinutes',
    '6': 'toStartOfFifteenMinutes',
    '12': 'toStartOfFifteenMinutes',
    '24': 'toStartOfHour',
    '72': 'toStartOfDay',
    '168': 'toStartOfDay',
    '336': 'toStartOfDay',
    '672': 'toStartOfDay',
};

export const sinceOptions = [
    { value: '1', label: 'Last Hour' },
    { value: '3', label: 'Last 3 Hours' },
    { value: '6', label: 'Last 6 Hours' },
    { value: '12', label: 'Last 12 Hours' },
    { value: '24', label: 'Last Day' },
    { value: '72', label: 'Last 3 Days' },
    { value: '168', label: 'Last Week' },
    { value: '336', label: 'Last 2 Weeks' },
    { value: '672', label: 'Last Month' },
]