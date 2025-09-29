const timeAgo = (isoDate?: string) => {
  if (!isoDate) return 'Last seen recently';
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day${
    Math.floor(diff / 86400) > 1 ? 's' : ''
  } ago`;
};

export default timeAgo;
