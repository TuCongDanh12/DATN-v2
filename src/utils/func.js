export const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

export const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}



export function selectTime(timeFilter) {
    const now = new Date();
    let startDate, endDate;

    switch (timeFilter) {
        case 'thisWeek':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'lastWeek':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay() - 7);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'thisMonth':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'lastMonth':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'thisQuarter':
            const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
            startDate = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), currentQuarter * 3, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'lastQuarter':
            const lastQuarter = Math.floor((now.getMonth() + 3) / 3) - 1;
            startDate = new Date(now.getFullYear(), (lastQuarter - 1) * 3, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), lastQuarter * 3, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Q1':
            startDate = new Date(now.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), 3, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Q2':
            startDate = new Date(now.getFullYear(), 3, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), 6, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Q3':
            startDate = new Date(now.getFullYear(), 6, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), 9, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'Q4':
            startDate = new Date(now.getFullYear(), 9, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), 12, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'thisYear':
            startDate = new Date(now.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), 11, 31);
            endDate.setHours(23, 59, 59, 999);
            break;
        case 'lastYear':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear() - 1, 11, 31);
            endDate.setHours(23, 59, 59, 999);
            break;
        default:
            throw new Error('Invalid time filter');
    }

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => {
        const d = new Date(date);
        const month = '' + (d.getMonth() + 1);
        const day = '' + d.getDate();
        const year = d.getFullYear();

        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    }

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    };
}
