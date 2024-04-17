import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export const Chart = ({ data }) => { 
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                style={{ backgroundColor: '#1937468f', borderRadius: '10px' }}
            >
                <XAxis dataKey="date" stroke="#a9dbcd" />
                <YAxis domain={['auto', 'auto']} stroke="#a9dbcd" />
                <Line type="monotone" dataKey="price" stroke="#00ffcb" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};
