import { useDispatch } from 'react-redux';
import { useState } from 'react';
import * as spotsAction from '../../store/spots';
import './EditSpot.css';
import { useHistory } from 'react-router-dom';

export function EditSpotForm(props) {

    const spot = props.spot;
    const modal = props.onClose;
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    // const [lat, setLat] = useState(spot.lat);
    // const [lng, setLng] = useState(spot.lng);
    const lat = 47.823;
    const lng = 123;
    const [url, setUrl] = useState('');
    const preview = true;
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
    const [validationErrors, setValidationErrors] = useState([]);
    const dispatch = useDispatch();
    const id = spot.id
    const history = useHistory();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors([]);

        dispatch(spotsAction.getEditSpot({id, name, description, price, address, country, city, state, lat, lng, url }))
            .then(() => {
                modal();
                history.push(`/spots/${id}`)

    })
        .catch(async res => {
            console.log(res)
            const data = await res.json();

            if (data && data.errors) {
                let error = Object.values(data.errors)
                setValidationErrors(error);
            }
        })
    }
    const handleCancelButton = (e) => {
        e.preventDefault();
        modal();
    }


    return (
        <div className='createspot-whole-1'>
            <div className='createspot-welcome'>
                <h2>Update your place</h2>
            </div>
            <form onSubmit={handleSubmit} className='createspot-form-but'>
                {validationErrors.length > 0 &&
                    <ul>
                        {validationErrors.map(error =>
                            <li key={error}>{error}</li>)}
                    </ul>
                }
                <div className='createspot-headline'>
            <h4>Where's your place located?</h4>
            <p className='small-detail'>Guests will only get your exact address once they book a reservation.</p>
          </div>
                <div className="creatspot-fields">
                    <label>
                        <input
                            type='text'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            placeholder='Country'
                            className="field"
                        />
                    </label>
                </div>
                <div className="creatspot-fields">
                    <label>
                        <input
                            type='text'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            placeholder='Street Address'
                            className="field"
                        />
                    </label>
                </div>
                <div className="creatspot-fields">
                    <label>
                        <input
                            type='text'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            placeholder='City'
                            className="field"
                        />
                    </label>
                </div>
                <div className="creatspot-fields">
                    <label>
                        <input
                            type='text'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            required
                            placeholder='State'
                            className="field"
                        />
                    </label>
                </div>

                <div className='des-text'>
                        <h4 >Describe your place to guests</h4>
                        <p className='small-detail'>
                            Mention the best features of your space, any special amenities like fast WiFi or parking, and what you
                            love about the neighborhood.
                        </p>
                        </div>
                <div className="creatspot-fields">
                    <label>
                        <input
                            type='text'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder='Please describe your place...'
                            className="field"
                        />
                    </label>
                </div>
                <div className='createspot-detail'>
                            <h4 >Create a title for your spot</h4>
                            <p className='small-detail'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                            </div>
                <div className="creatspot-fields">
                    <label>
                        <textarea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder='Name of your spot'
                            className="field"
                        />
                    </label>
                </div>
                <div className='createspot-detail'>
                                <h4>Set a base price for your spot</h4>
                                <p className='small-detail'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                                </div>
                <div className="creatspot-fields">
                    <label>
                        <input
                            type='number'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            placeholder='$Price'
                            className="field"
                            min='1'
                        />
                    </label>
                </div>
                <button type='submit'>Agree & Submit</button>
                <button className="cancel-edit" onClick={handleCancelButton}>Cancel</button>
            </form>
        </div>
    )

}
