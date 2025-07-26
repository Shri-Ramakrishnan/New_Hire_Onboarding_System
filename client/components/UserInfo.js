const UserInfo = ({ user }) => {
  if (!user) return null;

  return (
    <div className="user-info">
      <div className="user-avatar">
        {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
      </div>
      <div>
        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
          {user.name || user.username}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#718096', textTransform: 'capitalize' }}>
          {user.role}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
