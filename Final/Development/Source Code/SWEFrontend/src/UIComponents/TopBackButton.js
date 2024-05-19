import { Link } from "react-router-dom";

// TopBackButton component is used to display a back button with a header
function TopBackButton({header}){
    return(
        <div className="flex gap-5 my-2 px-6 pt-2 text-xl font-bold text-black whitespace-nowrap ">
            <Link to='/'>
                <img
                    loading="lazy"
                    src="https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/back-alt-64.png"
                    className="shrink-0 w-6 aspect-square stroke-black"
                    alt="Back"
                />
            </Link>
            <div className="text-center justify-centre">
                {header}
            </div>
        </div>
    )
}

export default TopBackButton;