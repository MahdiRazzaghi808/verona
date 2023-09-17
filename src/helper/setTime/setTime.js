export const setTime = () => {
    const d = new Date();
    let time = d.getTime();

    return time

}
export const mDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;

    const configs = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }

    const toDay = date.toLocaleDateString('fa-IR', configs)

    const [year, month, day] = toDay.split('/');
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');



    const islamicDate = new Intl.DateTimeFormat('fa-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }).format(date);

    return { en: formattedDate, fa: `${year}/${formattedMonth}/${formattedDay}`, it: formattedDate, ar: islamicDate, zh: formattedDate }

}