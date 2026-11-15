import { useState } from "react";

function SearchBox({ onSearch }) {
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = () => {
    onSearch({
      location,
      bedrooms,
      propertyType,
    });
  };

  return (
    <div className="search-box">

      {/* Property Type */}
      <div className="search-field">

        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">
            Property type
          </option>

          <option value="House">
            House
          </option>

          <option value="Apartment">
            Apartment
          </option>

          <option value="Room">
            Room
          </option>

        </select>

        <i className="bi bi-chevron-down"></i>

      </div>


      {/* Bedrooms */}
      <div className="search-field">

        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        >
          <option value="">
            No rooms
          </option>

          <option value="1">
            1 Room
          </option>

          <option value="2">
            2 Rooms
          </option>

          <option value="3">
            3 Rooms
          </option>

          <option value="4">
            4 Rooms
          </option>

        </select>

        <i className="bi bi-chevron-down"></i>

      </div>


      {/* Location */}
      <div className="search-field">

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

      </div>


      {/* Search Button */}
      <button
        className="search-btn"
        onClick={handleSearch}
      >
        SEARCH PROPERTY
      </button>

    </div>
  );
}

export default SearchBox;