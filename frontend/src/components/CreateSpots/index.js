import { Link } from 'react-router-dom';

function Host() {
    return (
        <Link to='/spots/new' className='host-link'><h4 style={{fontFamily:'monospace', fontSize:15}}>Create a New Spot</h4></Link>
    )
}

export default Host;
