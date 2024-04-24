import { Area, AreaChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const Chart = ({ data }) => {
    const isDarkMode = localStorage.getItem('darkmode') === 'true';
    const settings = isDarkMode ? {
        backgroundColor: '#1937468f',
        axisStroke: '#a9dbcd',
        lineStroke: '#00ffcb',
    } : {
        backgroundColor: '#dcefff70',
        axisStroke: '#10427b',
        lineStroke: '#007deb',
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                style={{ backgroundColor: settings.backgroundColor, borderRadius: '10px' }}
            >
                <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ffcb" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#007deb" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ffcb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#007deb" stopOpacity={0.3} />
                    </linearGradient>
                </defs>
                <XAxis tick={{ fontSize: '12px' }} dataKey="date" stroke={settings.axisStroke} />
                <YAxis tick={{ fontSize: '12px' }} domain={['auto', 'auto']} stroke={settings.axisStroke} />
                <Line type="monotone" dataKey="price" stroke="url(#priceGradient)" strokeWidth={2} activeDot={{ r: 8 }} />
                <Area type="monotone" dataKey="price" stroke="none" fill="url(#areaGradient)" />
                <Tooltip />
                <Legend />
            </AreaChart>
        </ResponsiveContainer>
    );
};
