import Link from "next/link";


export default function NotFound(){
    return(
        <div>
            Not Found Page
            <h4>Could not find the requested Resource</h4>
            <Link href="/">Go back to Home Page</Link>

        </div>
    )
}