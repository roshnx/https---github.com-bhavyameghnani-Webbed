import './SocialCard.css';
import Location from './Location';
import Phone from './Phone';

const SocialCard = ({ userData }) => {
    return (
        <div className="card">
            <div className="card__title">{articles.title}</div>
            <div className="card__body">
                <div className="card__image"><img src={articles.image}/></div>
                <Location location={articles.description}/>
                {/* <Phone number={articles.phone} type="Home"/>
                <Phone number={userData.cell} type="Cell"/> */}
                <Location location={articles.url}/>
                
            </div>

        </div>
    )
};

export default SocialCard;
