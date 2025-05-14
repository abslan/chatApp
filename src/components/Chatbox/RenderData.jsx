import styles from './Chatbox.module.css';

export default function RenderData({ item }) {
  switch (item.type) {
    case 'image':
      return <img className={styles.data_img} src={item.value} alt="attachment" />;
    case 'link':
      return (
        <a className={styles.data_link} href={item.value} target="_blank" rel="noopener noreferrer">
          {item.label || 'Visit Link'}
        </a>
      );
    case 'text':
      return <p className={styles.data_text}>{item.value}</p>;
    case 'user':
      return <p className={styles.data_user}>{item.value}</p>;
    case 'group':
      return <p className={styles.data_group}>{item.value}</p>;
    default:
      return null;
  }
}
