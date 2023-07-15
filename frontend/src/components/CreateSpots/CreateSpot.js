import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as spotsAction from '../../store/spots';
import './CreateSpot.css';
import { useHistory } from 'react-router-dom';
import  vidads from '../CreateSpots/vid-ads.mp4';
// import { Map, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import { useEffect } from 'react';


export function CreateSpots() {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const lat = 47.823;
    const lng = 123;
    const [url, setUrl] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const preview = true;
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);


    // useEffect(() => {
    //     const loadGoogleMapsScript = () => {
    //       const googleMapsScript = document.createElement('script');
    //       googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    //       window.document.body.appendChild(googleMapsScript);
    //     };

    //     loadGoogleMapsScript();
    //   }, []);

    if (!sessionUser) return (
        <div className='managespot-welcome'>
            <h2>Please login to see this page!</h2>
        </div>

    )


    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors([]);

        let createdSpot = await dispatch(spotsAction.createSpot({ name, description, price, address, country, city, state, lat, lng, url, preview }))
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
            <h4 style={{color:'lightcoral', fontSize:20}}>Create a New Spot</h4>
            <h4>Where's your place located?</h4>
            <p className='small-detail'>Guests will only get your exact address once they book a reservation.</p>
          </div>
          <form onSubmit={handleSubmit} className='createspot-form'>
          {validationErrors.length > 0 &&
                        <ul>
                            {validationErrors.map(error =>
                                <li key={error}>{error}</li>)}
                        </ul>
                    }

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
                            value={address}
                            placeholder='Street Address'
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

                    <div className='des-text'>
                        <h4 >Describe your place to guests</h4>
                        <p className='small-detail'>
                            Mention the best features of your space, any special amenities like fast WiFi or parking, and what you
                            love about the neighborhood.
                        </p>
                        </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={description}
                            placeholder='Please write at least 30 characters...'
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className='input-field describe'
                             />
                        </label>
                        <label className='error-description'>{validationErrors?.description}</label>
                    </div>
                            <div className='createspot-detail'>
                            <h4 >Create a title for your spot</h4>
                            <p className='small-detail'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                            </div>
                    <div className='createspot-detail'>
                            <label>
                                <input
                                type='text'
                                value={name}
                                placeholder='Name of your spot'
                                onChange={(e) => setName(e.target.value)}
                                required
                                className='input-field'
                                />
                            </label>
                            </div>
                            <div className='createspot-detail'>
                                <h4>Set a base price for your spot</h4>
                                <p className='small-detail'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                                </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='text'
                            value={price}
                            placeholder='Price per night (USD)'
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    <div className='createspot-detail'>
                        <h4 >Liven up your spot with photos</h4>
                        <p className='small-detail'>Submit a link to at least one photo to publish your spot.</p>
                        </div>
                    <div className='createspot-detail'>
                        <label>
                            <input
                            type='url'
                            value={url}
                            placeholder='Preview Image URL'
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className='input-field'
                             />
                        </label>
                    </div>
                    {[0, 1, 2, 3].map((index) => (
                        <div className='createspot-detail' key={index}>
                        <label>
                            <input
                                type='text'
                                // value={url[index]}
                                placeholder='Image URL'
                                onChange={(e) => {
                                const updatedImageUrls = [...url];
                                updatedImageUrls[index] = e.target.value;
                                setUrl(updatedImageUrls);
                                }}
                                className='input-field'
                            />
                            </label>
                        </div>
                        ))}

                    <button type='submit'>
                        Create Spot
                    </button>

                </form>

            </div>

        </div>
        {/* <div className='map-container'>
        <Map
          google={window.google}
          zoom={10}
          // Set the initial map center using lat and lng values
          initialCenter={{ lat: 47.823, lng: 123 }}
        />
      </div> */}
    </>
  );
}


// export default GoogleApiWrapper({
//     apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
//   })(CreateSpots);
