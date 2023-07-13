import { Link } from 'react-router-dom';

function Host() {
    return (
        <Link to='/spots/new' className='host-link'><h4 style={{fontFamily:'unset', fontSize:14, marginLeft:16, color: 'red'}}>Create a New Spot</h4></Link>
    )
}

export default Host;
