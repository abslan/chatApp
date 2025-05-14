
import styles from './Conversations.module.css';
import { truncate } from '../../redux/reducers/dataReducer';


function LastMessage({item}){
    switch (item.type) {
        case 'image':
        //   return <img className={styles.last_message_img} src={item.value} alt=""/>;
            // return <p className={styles.last_message_img}>{item.value}</p>
            return <p></p>
  
        case 'link':
          return (
            <a className={styles.last_message_link}
                href={item.value}
                target="_blank" 
                rel="noopener noreferrer">
                {item.label || 'Visit Link'}
            </a>
          );
  
        case 'text':
          return <p className={styles.data_text} >{truncate(item.value, 20)}</p>;

        case 'user':
            return <p className={styles.data_user} >{item.value}</p>;

        case 'group':
            return <p className={styles.data_group} >{item.value}</p>;
  
        default:
          return null;
      }

}


export default LastMessage;