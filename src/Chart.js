import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export const Chart = ({ data }) => { 
    const isDarkMode = localStorage.getItem('darkmode') === 'true';
    console.log(isDarkMode)
    const darkmodeSettings = {
        backgroundColor: '#1937468f',
        axisStroke: '#a9dbcd',
        lineStroke: '#00ffcb',
    }


    const lightmodeSettings = {
        backgroundColor: '#93bee370',
        axisStroke: '#10427b',
        lineStroke: '#10427b',
    }


    const settings = isDarkMode ? darkmodeSettings : lightmodeSettings


    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                style={{ backgroundColor: settings.backgroundColor, borderRadius: '10px' }}
            >
                <XAxis dataKey="date" stroke={settings.axisStroke} />
                <YAxis domain={['auto', 'auto']} stroke={settings.axisStroke} />
                <Line type="monotone" dataKey="price" stroke={settings.lineStroke} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};
