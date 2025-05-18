import { useParams } from 'react-router-dom';

const BookInfo = () => {
  const { id } = useParams<{ id : string }>(); // Get the 'id' parameter

  return (
    <div>
      <h1>Book</h1>
      <p>Displaying book with ID: {id}</p>
      {/* Fetch and display book data based on the id */}
    </div>
  );
};

export default BookInfo;
