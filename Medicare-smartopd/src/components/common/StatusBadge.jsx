export default function StatusBadge({ status, onClick }) {
    return (
        <span
            className={`status-badge ${status === 'Active' ? 'active' : ''}`}
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                ...(status === 'On Leave' ? { background: '#fff7ed', color: '#ea580c' } : {})
            }}
        >
            {status}
        </span>
    );
}
