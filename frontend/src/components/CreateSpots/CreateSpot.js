import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as spotsAction from '../../store/spots';
import './CreateSpot.css';
import { useHistory } from 'react-router-dom';
import  vidads from '../CreateSpots/vid-ads.mp4';

export function CreateSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user)
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [url, setUrl] = useState('');
    const [lat, setLat] = useState(100);
    const [lng, setLng] = useState(100);

    const [validationErrors, setValidationErrors] = useState([]);
    const preview = true;

    if(!sessionUser) {
        return (
            <div className='login-before-add'>
                <h2>Please log in!</h2>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors([]);
        if(url.length > 300) setValidationErrors(['The URL image is invalid! Must less than 300 characters'])
        let createdSpot = await dispatch(spotsAction.createSpot({ name, description, price, address, country, city, state,lat, lng, url, preview }))
        .catch(async res => {
            const data = await res.json();
            if (data && data.message) {
                if (data.errors) {
                  const errors = Object.values(data.errors);
                  setValidationErrors(errors);
                } else {
                  setValidationErrors(data.message);
                }
              }

    })

    if (createdSpot) {
        const id = createdSpot.id
        history.push(`/spots/${id}`)
    }
    }

    return (
        <>
        <div className='createspot-whole'>
            <div className='createspot-video'>
                <div className='createspot-welcome'>
                    <h2>CasaCloud: Your Passport to Hosting Success!</h2>
                </div>
                <div className='createspot-youtube'>
                    <iframe width="500" height="280" src={vidads} title="Vid-ads" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                </div>
            </div>
            <div className='createspot-contain'>
                <div className='createspot-headline'>
                    <h3>Transform Your Place into a <i className='italic-red'>Destination!</i></h3>
                </div>
                <form onSubmit={handleSubmit} className='createspot-form'>
                    {validationErrors.length > 0 &&
                    <ul>
                        {validationErrors.map((error, i) =>
                            <li key={i} >{error}</li>)}
                    </ul>
                    }
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={name}
                            placeholder='Name'
                            onChange={(e) => setName(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={address}
                            placeholder='Address'
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={city}
                            placeholder='City'
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={state}
                            placeholder='State'
                            onChange={(e) => setState(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={country}
                            placeholder='Country'
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={description}
                            placeholder='Describe the unique features of your place! '
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className='input-field describe'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={price}
                            placeholder='Price per night'
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    {/* <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={lat}
                            placeholder='Latitude'
                            onChange={(e) => setLat(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={lng}
                            placeholder='Longitude'
                            onChange={(e) => setLng(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div> */}
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='url'
                            value={url}
                            placeholder='Your Image Link'
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <button type='submit'>
                        Agree & Submit
                    </button>

                </form>

            </div>

        </div>

        </>
    )
}
