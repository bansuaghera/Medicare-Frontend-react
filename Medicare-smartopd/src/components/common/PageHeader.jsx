import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageHeader({ title, subtitle, buttonText, buttonLink }) {
    return (
        <div className="page-header">
            <div className="page-title">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
            {buttonText && buttonLink && (
                <Link to={buttonLink} className="add-btn">
                    <Plus size={20} />
                    <span>{buttonText}</span>
                </Link>
            )}
        </div>
    );
}
