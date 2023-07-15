import './index.css';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer>
         <div className="footer-container">
                <div className="footer-left">
                    <div style={{fontWeight: 450}}>
                    © 2023 CasaCloud, Inc.
                </div>
                <div>
                        Terms
                    </div>
                    <div>
                        Sitemap
                    </div>
                    <div>
                       Privacy
                    </div>

                    <div>
                        Your Privacy Choices
                    </div>
                </div>
                <div></div>
                <div className="footer-right">
                    <div>
                        English (US)
                    </div>
                    <div>
                        $ USD
                    </div>
                    <div>
                        Support & resources
                    </div>
                </div>
            </div>
        </footer>
    )
}
