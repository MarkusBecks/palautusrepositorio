const Notification = ({ message }: { message: string }) => {
  const styles = {
    color: 'red',
    fontSize: 24,
    margin: 30,
  };
  return <div style={styles}>{message}</div>;
};

export default Notification;
