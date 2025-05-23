import styles from './Chatbox.module.css';
import { memo } from 'react';
import { truncate, formatImageSource } from '../../redux/reducers/dataReducer';

export const RenderData = memo(({ item, type })  =>{
  switch (item.type) {
    case 'image':
      if(type === "last"){
        return <p></p>
      }
      return <img className={styles.data_img} 
      src={formatImageSource(item.value)} //{`data:image/jpeg;base64,${item.value}`}
      alt="attachment" />;
    case 'link':
      if (type === 'last'){
        return (
                    <a className={styles.last_message_link}
                        href={item.value}
                        target="_blank" 
                        rel="noopener noreferrer">
                        {item.label || 'Visit Link'}
                    </a>
                  );
      }
      return (
        <a className={styles.data_link} href={item.value} target="_blank" rel="noopener noreferrer">
          {item.label || 'Visit Link'}
        </a>
      );
    case 'text':
      if (type === 'last'){
        return <p className={styles.data_text} >{truncate(item.value, 20)}</p>;
      }
      return <p className={styles.data_text}>{item.value}</p>;
    case 'user':
      return <p className={styles.data_user}>{item.value}</p>;
    case 'group':
      return <p className={styles.data_group}>{item.value}</p>;
    default:
      return null;
  }
});
