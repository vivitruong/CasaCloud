import { useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { useHistory } from "react-router-dom/";
import './index.css';
import * as bookingAction from '../../../store/bookings';


const BookingCalendar = ({ avgRating, reviews, price, id, spotBooking, user }) => {

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [err, setErr] = useState("");
    const [durr, setDurr] = useState(0);
    const moment = extendMoment(Moment);
    const history = useHistory();
    const dispatch = useDispatch();
    const onReserve = () => {
        if (start && end) {
            const startDate = start._d.toISOString().slice(0, 10);
            const endDate = end._d.toISOString().slice(0, 10);

            const bookingInfo = { startDate, endDate, spotId: id };
            dispatch(bookingAction.makeBooking(bookingInfo))
                .then(() => {
                    history.push('/bookings');
                })
                .catch(async (error) => {
                    const data = await error.json();
                    setErr(data.message)
                });
        }

    }

    const blockDays = (date) => {
        let blocked = [];
        let bookedRanges = [];
        spotBooking.forEach((booking) => {
            bookedRanges = [
                ...bookedRanges,
                moment.range(booking.startDate, booking.endDate),
              ];
            });

            blocked = bookedRanges.find((range) => {
              return range.contains(date);
            });
            return blocked;
    }
    const duration = (startDate, endDate) => {
        if (startDate && endDate) {
            const moment1 = moment(startDate._d);
            const moment2 = moment(endDate._d);
            const diff = moment2.diff(moment1);
            const diffInDays = moment.duration(diff).asDays();
            setDurr(diffInDays.toFixed(0));
        }
    }
    return (
        <div className="booking-container">
            <div className="booking-title">
                <div className="booking-title-left">
                    <span>$ </span>
                    <span style={{fontSize:"1.2rem", fontWeight:"700"}}> {price} </span>
                    <span> night</span>
                </div>
                <div className="booking-title-right">
                        {reviews === 0 ? (
                            <div>
                            <i className="fa-solid fa-star"></i>
                            <span>New</span>
                            </div>
                        ) : (
                            <div>
                            <i className="fa-solid fa-star"></i>
                            <span>{avgRating} •</span>
                            <span style={{ paddingLeft: "0.3rem" }}>
                                {reviews} {reviews === 1 ? 'review' : 'reviews'}
                            </span>
                            </div>
                        )}
                        </div>
            </div>
            {
                !user &&
                <div className="booking-condition-user">
                        Please login to reserve this place!
                </div>
            }
            <div className="booking-err">
                {
                    err &&
                            <span>{err}</span>

                }
            </div>
            <div className="booking-content">
                <div className="booking-info">
                    <div className="booking-info-box">

                        <DateRangePicker
                            startDate={start}
                            startDateId="startDate"
                            endDate={end}
                            endDateId="endDate"
                            onDatesChange={({ startDate, endDate }) => {
                                setStart(startDate);
                                setEnd(endDate);
                                duration(startDate, endDate);
                            }}
                            focusedInput={focusedInput}
                            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                            isDayBlocked={blockDays}
                            minimumNights={1}
                        />

                    </div>
                    <div className="CreateBookingGuest">
                    <div className="CreateBookingGuestOne">GUESTS</div>
                    <div className="CreateBookingGuestTwo">2 guests</div>
                </div>
                    {
                        (!user || start === null || end === null) &&
                        <div className="booking-info-cfbtn" >
                        <button className="booking-info-disabledbtn">Reserve</button>
                    </div>
                    }
                    {
                       user && start && end &&
                        <div className="booking-info-cfbtn" onClick={onReserve}>
                        <button className="booking-info-disabledbtn"> Reserve</button>
                    </div>
                    }

                    <div className="booking-info-cfstm">
                        <span>You won't be charge yet</span>
                    </div>
                    <div className="booking-price">
                        {
                            user && start && end &&
                            <>
                                <div className="booking-price-detail">
                                    <div className="booking-price-detail-title">
                                        <span>${price} x {durr} nights</span>
                                        <span>Cleaning Fee</span>
                                        <span>Service Fee</span>
                                        <span>Tax</span>
                                    </div>
                                    <div className="booking-price-detail-title">
                                        <span>$ {price * durr}</span>
                                        <span>$ 50</span>
                                        <span>$ 33</span>
                                        <span>$ 66</span>
                                    </div>
                                </div>
                            <div className="booking-price-total">
                                <span>
                                    Total
                                </span>
                                <span>
                                    $ {price * durr + 33 + 66}
                                </span>
                            </div>
                        </>
                        }
                        {
                            user && !start && !end &&
                            <>
                                <div className="booking-price-detail">
                                    <div className="booking-price-detail-title">
                                        <span>${price} x 1 nights</span>
                                        <span>Cleaning Fee</span>
                                        <span>Service Fee</span>
                                        <span>Tax</span>
                                    </div>
                                    <div className="booking-price-detail-title">
                                        <span>${price * 1}</span>
                                        <span>$50</span>
                                        <span>$33</span>
                                        <span>$66</span>
                                    </div>
                                </div>
                            <div className="booking-price-total">
                                <span>
                                    Total after taxes:
                                </span>
                                <span>
                                    ${+price + 50 + 66 + 33}
                                </span>
                            </div>
                        </>
                        }

                    </div>
                </div>
            </div>



        </div>
    )
}

export default BookingCalendar;
