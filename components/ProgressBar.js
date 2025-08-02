export default function ProgressBar({ percentage }) {
  return (
    <div style={{ background: '#e0e0e0', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
      <div
        style={{
          width: `${percentage}%`,
          background: '#4caf50',
          height: '100%',
          transition: 'width 0.3s ease-in-out',
        }}
      ></div>
    </div>
  );
}
