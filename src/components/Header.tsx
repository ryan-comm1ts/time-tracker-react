import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
            <div className="mx-auto py-4">
                <Link to="/"><img
                    src="/ht-logo..svg"
                    alt="Hustle Tracker"
                    className="-ml-8 w-52 h-full"
                /></Link>
            </div>
        </header>
    )
}

export default Header;