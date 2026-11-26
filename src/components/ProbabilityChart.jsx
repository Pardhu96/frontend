import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts';
import { EMOTION_COLORS } from '../services/api';

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) return null;

  const data = Object.entries(probabilities).map(([emotion, prob]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    rawEmotion: emotion,
    percentage: Number((prob * 100).toFixed(1)),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="emotion"
            stroke="#94a3b8"
            fontSize={12}
            width={85}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Confidence']}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '0.75rem',
              color: '#f8fafc',
            }}
          />
          <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry) => (
              <Cell
                key={entry.rawEmotion}
                fill={EMOTION_COLORS[entry.rawEmotion] || '#6366f1'}
              />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              formatter={(v) => `${v}%`}
              fill="#cbd5e1"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
