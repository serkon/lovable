import dayjs from 'dayjs';


export const useDate = (date: Date | string = new Date()) => {
    return dayjs(date).format('DD/MM/YYYY');
}