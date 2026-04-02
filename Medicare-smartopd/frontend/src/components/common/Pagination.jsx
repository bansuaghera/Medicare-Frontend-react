export default function Pagination({ totalResults }) {
    return (
        <div className="pagination">
            <span>Showing {totalResults} results</span>
            <div className="pagination-btns">
                <button className="page-btn">Previous</button>
                <button className="page-btn">Next</button>
            </div>
        </div>
    );
}
